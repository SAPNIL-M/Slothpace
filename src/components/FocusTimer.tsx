import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, CheckCircle, X, ShieldAlert, Sparkles, Wind, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScheduledTask } from '../types';
import { soundEffects } from '../services/soundEffects';

interface FocusTimerProps {
  task: ScheduledTask;
  onClose: () => void;
  onCompleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddBuffer: (taskId: string, minutes: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  task,
  onClose,
  onCompleteTask,
  onToggleSubtask,
  onAddBuffer,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(task.durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  const totalSeconds = task.durationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0 && !isBreathingMode) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            soundEffects.playBowl();
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, isBreathingMode]);

  // Guided breathing loop (4s in, 4s hold, 4s out)
  useEffect(() => {
    if (!isBreathingMode) return;
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isBreathingMode]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSubtaskClick = (subId: string) => {
    soundEffects.playChime('high');
    onToggleSubtask(task.id, subId);
  };

  const handleTaskComplete = () => {
    soundEffects.playBowl();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onCompleteTask(task.id);
    onClose();
  };

  const handleAddBuffer = (mins: number) => {
    setSecondsRemaining((prev) => prev + mins * 60);
    onAddBuffer(task.id, mins);
    soundEffects.playChime('low');
  };

  // Find active subtask
  const activeSubtask = task.subtasks.find(s => !s.completed);
  const completedCount = task.subtasks.filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-xl animate-fade-in">
      
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[92vh]">
        
        {/* Background ambient glow */}
        <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${
          task.category === 'DEEP' ? 'bg-indigo-500' : 'bg-emerald-500'
        }`} />

        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              task.category === 'DEEP'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {task.category === 'DEEP' ? '⚡ Deep Focus' : '🌿 Easy Sprint'}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {task.startTime} – {task.endTime}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breathing Mode Modal Overlay */}
        {isBreathingMode ? (
          <div className="my-auto text-center py-10 relative z-10 flex flex-col items-center">
            <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-1000 mb-6 ${
              breathPhase === 'Inhale' 
                ? 'scale-125 border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/20' 
                : breathPhase === 'Hold' 
                ? 'scale-110 border-amber-400 bg-amber-500/20' 
                : 'scale-90 border-teal-400 bg-teal-500/10'
            }`}>
              <span className="text-2xl font-bold text-stone-100 tracking-wider">
                {breathPhase}
              </span>
            </div>
            <p className="text-stone-300 text-sm max-w-sm mb-4">
              Calm your nervous system. Sloths never rush; clarity comes in stillness.
            </p>
            <button
              onClick={() => setIsBreathingMode(false)}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium"
            >
              Resume Focus
            </button>
          </div>
        ) : (
          <>
            {/* Task Title & Sloth Advice */}
            <div className="mb-6 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                {task.title}
              </h2>
              <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-3 text-xs text-stone-300 flex items-start gap-2.5">
                <span className="text-base">🦥</span>
                <span>{task.slothTip}</span>
              </div>
            </div>

            {/* Main Timer Display */}
            <div className="text-center my-4 relative z-10">
              <div className="inline-block relative">
                <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tighter text-white tabular-nums drop-shadow-md">
                  {formatTimer(secondsRemaining)}
                </div>
                {secondsRemaining === 0 && (
                  <div className="text-emerald-400 text-sm font-semibold mt-1 animate-bounce">
                    ⏰ Time's up! Wrap up and check off your micro-step!
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-800 h-2.5 rounded-full mt-4 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    task.category === 'DEEP' ? 'bg-indigo-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Active Micro-Step Focus */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 mb-5 relative z-10">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="font-semibold text-stone-300 uppercase tracking-wider">
                  Current Micro-Step
                </span>
                <span>{completedCount} / {task.subtasks.length} Done</span>
              </div>

              {activeSubtask ? (
                <div 
                  onClick={() => handleSubtaskClick(activeSubtask.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-900 border border-stone-700/80 hover:border-emerald-500/60 cursor-pointer group transition-all"
                >
                  <div className="w-6 h-6 rounded-lg border-2 border-emerald-500/60 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all">
                    <CheckCircle className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-medium text-stone-100 group-hover:text-emerald-300 transition-colors">
                    {activeSubtask.title}
                  </span>
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-emerald-400 font-medium">
                  🎉 All micro-steps completed for this task!
                </div>
              )}

              {/* Remaining micro-steps drawer */}
              <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => handleSubtaskClick(st.id)}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                      st.completed 
                        ? 'text-stone-500 line-through' 
                        : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/60'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      st.completed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-stone-700'
                    }`}>
                      {st.completed && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span>{st.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timer Controls & Panic-Free Adjustments */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 relative z-10">
              
              {/* Play / Pause */}
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Resume
                  </>
                )}
              </button>

              {/* Panic-Free Buffer (+5 mins) */}
              <button
                onClick={() => handleAddBuffer(5)}
                className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1 transition-all"
                title="No stress! Add 5 minutes gently without breaking your day"
              >
                <Plus className="w-3.5 h-3.5" /> +5m Buffer
              </button>

              {/* Mindful Breathing Break */}
              <button
                onClick={() => setIsBreathingMode(true)}
                className="py-2.5 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-medium flex items-center justify-center gap-1 transition-all"
              >
                <Wind className="w-3.5 h-3.5" /> 60s Breathe
              </button>

              {/* Complete Task */}
              <button
                onClick={handleTaskComplete}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Task Done!
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  );
};
