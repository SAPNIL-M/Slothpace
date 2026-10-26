import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BrainDumpInput } from './components/BrainDumpInput';
import { ScheduleDashboard } from './components/ScheduleDashboard';
import { FocusTimer } from './components/FocusTimer';
import { ExportModal } from './components/ExportModal';
import { DayPlan, ScheduledTask } from './types';
import { generateDayPlan } from './services/aiEngine';

const STORAGE_KEY = 'slothpace_active_plan_v1';

export function App() {
  const [plan, setPlan] = useState<DayPlan | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<ScheduledTask | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync plan to localStorage
  useEffect(() => {
    if (plan) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [plan]);

  const handleGeneratePlan = async (
    rawText: string,
    startTime: string,
    paceStyle: 'gentle' | 'steady' | 'sprint'
  ) => {
    setIsLoading(true);
    try {
      // Simulate pleasant mindful processing pause for the AI decomposition
      await new Promise(r => setTimeout(r, 600));
      const newPlan = await generateDayPlan(rawText, startTime, paceStyle);
      setPlan(newPlan);
    } catch (err) {
      alert((err as Error).message || "Could not pace schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPlan = () => {
    if (window.confirm("Start a new day with a fresh brain dump?")) {
      setPlan(null);
      setActiveFocusTask(null);
    }
  };

  const handleToggleSubtaskInFocus = (taskId: string, subtaskId: string) => {
    if (!plan) return;
    const updatedTasks = plan.tasks.map(t => {
      if (t.id !== taskId) return t;
      const updatedSubs = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
      return { ...t, subtasks: updatedSubs };
    });
    const updatedPlan = { ...plan, tasks: updatedTasks };
    setPlan(updatedPlan);

    // Keep activeFocusTask in sync
    const refreshed = updatedTasks.find(t => t.id === taskId);
    if (refreshed) setActiveFocusTask(refreshed);
  };

  const handleCompleteTaskInFocus = (taskId: string) => {
    if (!plan) return;
    const updatedTasks = plan.tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        status: 'completed' as const,
        subtasks: t.subtasks.map(s => ({ ...s, completed: true })),
      };
    });
    setPlan({ ...plan, tasks: updatedTasks });
  };

  const handleAddBufferInFocus = (taskId: string, minutes: number) => {
    if (!plan) return;
    const taskIndex = plan.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    // Shift all tasks from this point forward
    const updated = [...plan.tasks];
    updated[taskIndex] = {
      ...updated[taskIndex],
      durationMinutes: updated[taskIndex].durationMinutes + minutes,
    };
    setPlan({ ...plan, tasks: updated });

    const refreshed = updated[taskIndex];
    if (refreshed) setActiveFocusTask(refreshed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 selection:bg-emerald-500 selection:text-stone-950">
      
      {/* App Header */}
      <Header onReset={handleResetPlan} hasActivePlan={!!plan} />

      {/* Main Body */}
      <main className="flex-1">
        {!plan ? (
          <BrainDumpInput onGenerate={handleGeneratePlan} isLoading={isLoading} />
        ) : (
          <ScheduleDashboard
            plan={plan}
            onUpdatePlan={setPlan}
            onStartFocus={setActiveFocusTask}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Focus Timer Modal ("Gentle Deadline") */}
      {activeFocusTask && (
        <FocusTimer
          task={activeFocusTask}
          onClose={() => setActiveFocusTask(null)}
          onCompleteTask={handleCompleteTaskInFocus}
          onToggleSubtask={handleToggleSubtaskInFocus}
          onAddBuffer={handleAddBufferInFocus}
        />
      )}

      {/* Export Markdown Modal */}
      {isExportOpen && plan && (
        <ExportModal
          plan={plan}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Zen Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-900/40 py-6 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Built for <strong>Hacktoberfest 2026</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Theme: Slow and Steady 🦥</span>
          </div>
          <div className="text-stone-400">
            100% Client-Side Open-Source AI • Zero Data Tracking • MIT Licensed
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
