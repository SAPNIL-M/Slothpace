import React, { useState } from 'react';
import { 
  Play, CheckCircle2, Circle, Clock, Zap, Coffee, Shield, Sparkles, 
  Share2, ChevronDown, ChevronUp, Plus, ArrowUpRight, Flame, Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayPlan, ScheduledTask, TaskType } from '../types';
import { soundEffects } from '../services/soundEffects';

interface ScheduleDashboardProps {
  plan: DayPlan;
  onUpdatePlan: (updatedPlan: DayPlan) => void;
  onStartFocus: (task: ScheduledTask) => void;
  onOpenExport: () => void;
}

export const ScheduleDashboard: React.FC<ScheduleDashboardProps> = ({
  plan,
  onUpdatePlan,
  onStartFocus,
  onOpenExport,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'DEEP' | 'EASY' | 'BREAK'>('ALL');
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(() => {
    // Expand the first two tasks by default
    const init: Record<string, boolean> = {};
    plan.tasks.slice(0, 3).forEach(t => { init[t.id] = true; });
    return init;
  });

  // Calculate completion statistics
  const totalSubtasks = plan.tasks.reduce((acc, t) => acc + t.subtasks.length, 0);
  const completedSubtasks = plan.tasks.reduce(
    (acc, t) => acc + t.subtasks.filter(s => s.completed).length,
    0
  );
  const completedTasks = plan.tasks.filter(t => t.status === 'completed').length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Toggle subtask completion
  const handleToggleSubtask = (taskId: string, subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playChime('mid');

    const updatedTasks = plan.tasks.map(t => {
      if (t.id !== taskId) return t;
      const updatedSub = t.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
      const allDone = updatedSub.every(s => s.completed);
      return {
        ...t,
        subtasks: updatedSub,
        status: allDone ? ('completed' as const) : t.status === 'completed' ? ('in_progress' as const) : t.status,
      };
    });

    onUpdatePlan({ ...plan, tasks: updatedTasks });
  };

  // Mark full task as completed
  const handleToggleTaskComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playBowl();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    const updatedTasks = plan.tasks.map(t => {
      if (t.id !== taskId) return t;
      const willBeCompleted = t.status !== 'completed';
      return {
        ...t,
        status: willBeCompleted ? ('completed' as const) : ('pending' as const),
        subtasks: t.subtasks.map(s => ({ ...s, completed: willBeCompleted })),
      };
    });

    onUpdatePlan({ ...plan, tasks: updatedTasks });
  };

  // Add 10-minute buffer and shift remaining tasks
  const handleAddBuffer = (fromIndex: number) => {
    soundEffects.playChime('low');
    const updated = [...plan.tasks];

    // Helper to add minutes to 12h time string
    const addMinutesToTimeStr = (timeStr: string, minutesToAdd: number) => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return timeStr;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;

      const d = new Date();
      d.setHours(h, m + minutesToAdd, 0, 0);

      let newH = d.getHours();
      const newM = d.getMinutes();
      const newAmpm = newH >= 12 ? 'PM' : 'AM';
      newH = newH % 12;
      newH = newH ? newH : 12;
      const minsStr = newM < 10 ? `0${newM}` : `${newM}`;
      return `${newH}:${minsStr} ${newAmpm}`;
    };

    for (let i = fromIndex; i < updated.length; i++) {
      const t = updated[i];
      if (i === fromIndex) {
        updated[i] = {
          ...t,
          durationMinutes: t.durationMinutes + 10,
          endTime: addMinutesToTimeStr(t.endTime, 10),
        };
      } else {
        updated[i] = {
          ...t,
          startTime: addMinutesToTimeStr(t.startTime, 10),
          endTime: addMinutesToTimeStr(t.endTime, 10),
        };
      }
    }

    onUpdatePlan({ ...plan, tasks: updated });
  };

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const filteredTasks = plan.tasks.filter(t => {
    if (filter === 'ALL') return true;
    return t.category === filter;
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Top Banner & Sloth Climbing Tracker */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-md">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {plan.date}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Paced from {plan.startTime}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Today's Gentle Sprint Flow
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExport}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm border border-stone-700"
            >
              <Share2 className="w-3.5 h-3.5" /> Export Schedule
            </button>
          </div>
        </div>

        {/* Sloth Branch Progress Meter */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <span>🌿 Branch Progress</span>
              <span className="text-emerald-400">({progressPercent}% Finished)</span>
            </span>
            <span className="text-stone-400">
              {completedSubtasks} of {totalSubtasks} micro-steps climbed
            </span>
          </div>

          {/* Animated Branch Track */}
          <div className="relative h-8 bg-stone-950/80 rounded-2xl border border-stone-800 p-1 overflow-hidden flex items-center">
            {/* Tree branch wood texture simulation */}
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 rounded-xl transition-all duration-700 ease-out relative"
              style={{ width: `${Math.max(6, progressPercent)}%` }}
            >
              {/* Sloth marker */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 text-lg select-none filter drop-shadow">
                🦥
              </div>
            </div>
            {/* Golden leaf prize at 100% */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-80">
              🍃
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-800/80">
          <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/60 text-center">
            <div className="text-[11px] text-stone-400 font-medium">⚡ Deep Focus</div>
            <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
              {plan.deepWorkMinutes} <span className="text-xs font-normal text-stone-500">mins</span>
            </div>
          </div>
          <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/60 text-center">
            <div className="text-[11px] text-stone-400 font-medium">🌿 Easy Chores</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {plan.easyWorkMinutes} <span className="text-xs font-normal text-stone-500">mins</span>
            </div>
          </div>
          <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/60 text-center">
            <div className="text-[11px] text-stone-400 font-medium">🦥 Sloth Breaks</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
              {plan.totalBreakMinutes} <span className="text-xs font-normal text-stone-500">mins</span>
            </div>
          </div>
          <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/60 text-center">
            <div className="text-[11px] text-stone-400 font-medium">🍃 Tasks Done</div>
            <div className="text-lg font-bold text-stone-200 font-mono mt-0.5">
              {completedTasks} / {plan.tasks.length}
            </div>
          </div>
        </div>

      </div>

      {/* Filter Tabs & Timeline Controls */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'ALL' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All ({plan.tasks.length})
          </button>
          <button
            onClick={() => setFilter('DEEP')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'DEEP' ? 'bg-indigo-600/30 text-indigo-300 font-medium' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ⚡ Deep
          </button>
          <button
            onClick={() => setFilter('EASY')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'EASY' ? 'bg-emerald-600/30 text-emerald-300 font-medium' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🌿 Easy
          </button>
          <button
            onClick={() => setFilter('BREAK')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'BREAK' ? 'bg-amber-600/30 text-amber-300 font-medium' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🦥 Breaks
          </button>
        </div>

        <span className="text-xs text-stone-400 hidden sm:inline">
          Click <strong className="text-stone-200">Focus Mode</strong> on any task to start its timer!
        </span>
      </div>

      {/* Task Cards Stack */}
      <div className="space-y-3.5">
        {filteredTasks.map((task, idx) => {
          const isExpanded = !!expandedTasks[task.id];
          const isCompleted = task.status === 'completed';
          const isBreak = task.category === 'BREAK';

          return (
            <div
              key={task.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isCompleted 
                  ? 'bg-stone-900/40 border-stone-800/50 opacity-70' 
                  : isBreak 
                  ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-700/60' 
                  : task.category === 'DEEP' 
                  ? 'bg-stone-900/90 border-indigo-900/40 hover:border-indigo-600/50' 
                  : 'bg-stone-900/90 border-stone-800 hover:border-emerald-600/40'
              }`}
            >
              {/* Card Header Row */}
              <div 
                onClick={() => toggleTaskExpand(task.id)}
                className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  
                  {/* Task Completion Checkbox */}
                  <button
                    onClick={(e) => handleToggleTaskComplete(task.id, e)}
                    className="mt-0.5 sm:mt-0 p-1 text-stone-400 hover:text-emerald-400 transition-colors"
                    title={isCompleted ? "Mark incomplete" : "Mark completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-500 hover:text-stone-300" />
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Category Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isBreak 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : task.category === 'DEEP' 
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isBreak ? '🦥 Sloth Pause' : task.category === 'DEEP' ? '⚡ Deep Focus' : '🌿 Easy Sprint'}
                      </span>

                      {/* Time Range Badge */}
                      <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        {task.startTime} – {task.endTime} ({task.durationMinutes}m)
                      </span>

                      {/* Energy Rating Leaves */}
                      {!isBreak && (
                        <span className="text-xs text-emerald-500/80 flex items-center gap-0.5" title={`Cognitive Energy: ${task.cognitiveEnergy}/5`}>
                          {'🍃'.repeat(task.cognitiveEnergy)}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-semibold tracking-tight truncate ${
                      isCompleted ? 'text-stone-500 line-through' : 'text-stone-100'
                    }`}>
                      {task.title}
                    </h3>
                  </div>

                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  {!isBreak && !isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartFocus(task);
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Focus Mode
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskExpand(task.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Card Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-stone-800/60 bg-stone-950/40">
                  
                  {/* Sloth Tip */}
                  <div className="my-2.5 p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-300 flex items-start gap-2">
                    <span className="text-sm">🦥</span>
                    <span className="leading-relaxed">{task.slothTip}</span>
                  </div>

                  {/* Micro-steps Checklist */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                      Decomposed Micro-Steps:
                    </div>
                    <div className="space-y-1.5">
                      {task.subtasks.map((st) => (
                        <div
                          key={st.id}
                          onClick={(e) => handleToggleSubtask(task.id, st.id, e)}
                          className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer border transition-all ${
                            st.completed 
                              ? 'bg-stone-900/30 border-stone-800/40 text-stone-500 line-through' 
                              : 'bg-stone-900/80 border-stone-800/80 text-stone-200 hover:border-emerald-500/40 hover:bg-stone-900'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            st.completed 
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                              : 'border-stone-600'
                          }`}>
                            {st.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className="flex-1">{st.title}</span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            ~{st.estimatedMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Toolbar for this card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-800/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddBuffer(idx);
                      }}
                      className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-stone-900"
                      title="Need more time? Adds 10 mins and shifts the rest of the day without panic"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" /> +10m Sloth Buffer
                    </button>

                    <div className="flex items-center gap-2">
                      {!isCompleted && !isBreak && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartFocus(task);
                          }}
                          className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Focus Mode
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
