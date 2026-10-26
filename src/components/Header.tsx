import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldCheck, Sparkles, RefreshCw, CloudOff } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface HeaderProps {
  onReset: () => void;
  hasActivePlan: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasActivePlan }) => {
  const [ambienceState, setAmbienceState] = useState<{ isPlaying: boolean; type: 'rain' | 'brown' | 'none' }>({
    isPlaying: false,
    type: 'none',
  });

  const handleToggleAmbience = (type: 'rain' | 'brown') => {
    soundEffects.toggleAmbience(type);
    setAmbienceState(soundEffects.getAmbienceState());
  };

  return (
    <header className="border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Theme */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/40 animate-sloth-sway">
              🦥
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-stone-100 flex items-center gap-1.5">
                SlothPace
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Slow & Steady AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              Hacktoberfest 2026 • Privacy-First Offline Task Pacer
            </p>
          </div>
        </div>

        {/* Ambient Controls & Offline Security Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Ambient Sound Toggles */}
          <div className="flex items-center bg-stone-950/70 border border-stone-800 rounded-xl p-1 gap-1 text-xs">
            <button
              onClick={() => handleToggleAmbience('rain')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                ambienceState.isPlaying && ambienceState.type === 'rain'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
              title="Procedural Forest Rain for Deep Focus"
            >
              🌧️ <span className="hidden md:inline">Rain Focus</span>
            </button>
            <button
              onClick={() => handleToggleAmbience('brown')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                ambienceState.isPlaying && ambienceState.type === 'brown'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
              title="Calming Zen Brown Noise"
            >
              🍃 <span className="hidden md:inline">Zen Noise</span>
            </button>
            {ambienceState.isPlaying && (
              <button
                onClick={() => {
                  soundEffects.stopAmbience();
                  setAmbienceState(soundEffects.getAmbienceState());
                }}
                className="p-1 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800/50"
                title="Mute ambience"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Privacy & Offline Badge */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-300 text-xs"
            title="100% Local Inference: No prompts or private tasks leave your device"
          >
            <CloudOff className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Offline AI</span>
          </div>

          {/* Reset / New Brain Dump */}
          {hasActivePlan && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 hover:text-white px-3 py-1.5 rounded-xl border border-stone-700 transition-all shadow-sm"
              title="Start a new morning dump"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Day</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
