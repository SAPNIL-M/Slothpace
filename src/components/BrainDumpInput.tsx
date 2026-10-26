import React, { useState } from 'react';
import { Sparkles, Clock, Zap, Coffee, Shield, Compass, ChevronRight } from 'lucide-react';
import { SLOTH_QUOTES } from '../services/aiEngine';

interface BrainDumpInputProps {
  onGenerate: (text: string, startTime: string, paceStyle: 'gentle' | 'steady' | 'sprint') => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    label: "💻 Dev Morning Chaos",
    desc: "Bugs, PR review, auth refactor, docker logs",
    text: `- Fix the JWT token refresh race condition causing 401 logouts
- Review frontend pull request #89 and check responsive styles
- Investigate high memory usage in the background worker docker container
- Reply to product manager on Slack regarding Q4 milestone delivery
- Clean up messy utility functions and update API docs
- Order fresh coffee beans and stretch`
  },
  {
    label: "🎓 Hackathon / Deadline Crunch",
    desc: "Demo video, deck, edge-case testing, submission",
    text: `- Write unit tests for edge-case payment gateway timeouts
- Polish dark mode UI colors and typography
- Record a 2-minute clean screen recording for the Hacktoberfest submission
- Draft the DEV.to submission post explaining open-source AI architecture
- Verify Git repository has proper MIT license and comprehensive README
- Drink a tall glass of water`
  },
  {
    label: "🌿 Balanced Mindful Day",
    desc: "Creative work, admin, client emails, fresh air",
    text: `- Design the new landing page hero section in Figma
- Send out overdue invoices for September freelance clients
- Draft newsletter update for community subscribers
- Go for a 20-minute slow walk outside without phone
- Clean up desktop downloads folder and archive old project folders
- Plan dinner recipe`
  }
];

export const BrainDumpInput: React.FC<BrainDumpInputProps> = ({ onGenerate, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  });
  const [paceStyle, setPaceStyle] = useState<'gentle' | 'steady' | 'sprint'>('steady');
  const [randomQuote] = useState(() => SLOTH_QUOTES[Math.floor(Math.random() * SLOTH_QUOTES.length)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onGenerate(inputText, startTime, paceStyle);
  };

  const loadPreset = (presetText: string) => {
    setInputText(presetText);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Zen Inspiration Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
          <span>🌿 Slow & Steady Wins The Day</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Morning Brain Dump
        </h2>
        <p className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto">
          Don't stress over structure or deadlines. Just dump whatever is in your head. 
          The local open-source AI will classify <strong className="text-stone-200">Deep Work</strong>, <strong className="text-stone-200">Easy Chores</strong>, and allot <strong className="text-stone-200">calm deadlines</strong>.
        </p>
      </div>

      {/* Preset Quick Starters */}
      <div className="mb-4">
        <div className="text-xs font-medium text-stone-400 mb-2 flex items-center justify-between">
          <span>Try a 1-click chaotic dump:</span>
          <span className="text-stone-500 text-[11px]">Click to auto-fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p.text)}
              className="text-left p-3 rounded-xl bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-emerald-500/30 transition-all text-xs group"
            >
              <div className="font-semibold text-stone-200 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>{p.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
              </div>
              <div className="text-stone-400 text-[11px] mt-1 line-clamp-1">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Your Raw Task Stream</span>
            <span className="text-[11px] text-stone-500 font-normal">One task per line, bullet, or comma</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={7}
            placeholder={`e.g.
- Need to fix the auth token refresh bug
- Reply to Sarah's email about roadmap
- Prepare slides for tomorrow's standup
- Buy groceries and coffee beans
- Review PR #42 and leave comments`}
            className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm leading-relaxed font-mono"
            required
          />
        </div>

        {/* Schedule Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 pb-4 border-b border-stone-800">
          
          {/* Starting Time */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Start My Day At</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Pacing Style */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Sloth Pacing Style</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-stone-950/80 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setPaceStyle('gentle')}
                className={`py-1.5 rounded-lg transition-all text-center ${
                  paceStyle === 'gentle' 
                    ? 'bg-emerald-600 text-white font-medium shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Generous breaks & buffer time"
              >
                🌿 Gentle
              </button>
              <button
                type="button"
                onClick={() => setPaceStyle('steady')}
                className={`py-1.5 rounded-lg transition-all text-center ${
                  paceStyle === 'steady' 
                    ? 'bg-emerald-600 text-white font-medium shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Balanced 10m pauses after deep work"
              >
                🧗 Steady
              </button>
              <button
                type="button"
                onClick={() => setPaceStyle('sprint')}
                className={`py-1.5 rounded-lg transition-all text-center ${
                  paceStyle === 'sprint' 
                    ? 'bg-emerald-600 text-white font-medium shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Crisp 5m pauses for crunch mode"
              >
                ⚡ Sprint
              </button>
            </div>
          </div>

        </div>

        {/* Action Button & Offline Guarantee */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero cloud API keys • 100% runs on your device</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Decomposing with Local AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Pace My Day With Open-Source AI 🦥</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Sloth Proverb Footer */}
      <div className="mt-6 text-center text-xs text-stone-500 italic flex items-center justify-center gap-2">
        <span>“{randomQuote.quote}”</span>
        <span className="not-italic text-stone-400">— {randomQuote.author}</span>
      </div>

    </div>
  );
};
