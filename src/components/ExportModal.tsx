import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { DayPlan } from '../types';

interface ExportModalProps {
  plan: DayPlan;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ plan, onClose }) => {
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    let md = `# 🦥 SlothPace Daily Schedule — ${plan.date}\n\n`;
    md += `> *"Slow and steady isn't lazy. It's the art of doing things once, properly."*\n\n`;
    md += `### 📊 Day Overview\n`;
    md += `- **Start Time:** ${plan.startTime}\n`;
    md += `- **Pace Style:** ${plan.paceStyle.toUpperCase()}\n`;
    md += `- **Deep Work:** ${plan.deepWorkMinutes} mins\n`;
    md += `- **Easy Chores:** ${plan.easyWorkMinutes} mins\n`;
    md += `- **Rest & Sloth Breaks:** ${plan.totalBreakMinutes} mins\n\n`;
    md += `---\n\n### 🧗 Tasks & Paced Flow\n\n`;

    plan.tasks.forEach((t) => {
      const typeBadge = t.category === 'DEEP' ? '⚡ [DEEP WORK]' : t.category === 'BREAK' ? '🦥 [RECHARGE]' : '🌿 [EASY CHORE]';
      md += `#### ${t.startTime} – ${t.endTime} | ${typeBadge} ${t.title}\n`;
      md += `*Tip:* ${t.slothTip}\n\n`;
      t.subtasks.forEach((st) => {
        md += `- [${st.completed ? 'x' : ' '}] ${st.title} (~${st.estimatedMinutes}m)\n`;
      });
      md += `\n`;
    });

    md += `---\n*Generated 100% offline via SlothPace for Hacktoberfest 2026*\n`;
    return md;
  };

  const markdownText = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `slothpace-schedule-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Export Paced Schedule</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 flex-1 overflow-hidden flex flex-col">
          <p className="text-xs text-stone-400 mb-2">
            Copy-paste into Obsidian, Notion, Logseq, or your daily standup notes.
          </p>
          <pre className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs font-mono text-stone-300 overflow-y-auto flex-1 select-all">
            {markdownText}
          </pre>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Download .md
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Markdown
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
