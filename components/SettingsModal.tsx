import React, { useState } from 'react';
import { X, Music, Volume2 } from 'lucide-react';
import { getTranslation } from '../translations';
import { Language } from '../types';
import { 
  getMusicVolume, 
  setMusicVolume, 
  getSfxVolume, 
  setSfxVolume,
  playSound 
} from '../services/audioService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, language }) => {
  const [musicVol, setMusicVolState] = useState(getMusicVolume());
  const [sfxVol, setSfxVolState] = useState(getSfxVolume());

  if (!isOpen) return null;

  const t = (key: any) => getTranslation(language, key);

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    setMusicVolState(newVal);
    setMusicVolume(newVal);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    setSfxVolState(newVal);
    setSfxVolume(newVal);
  };

  const handleSfxRelease = () => {
    // Play a test sound when user finishes dragging sfx slider
    if (sfxVol > 0) playSound('click');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-dark/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-md border border-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-fade-in transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-h2 font-bold text-brand">{t('settings_title')}</h2>
          <button 
            onClick={() => { playSound('click'); onClose(); }}
            className="w-10 h-10 rounded-full bg-neutral-glass border border-white/50 flex items-center justify-center text-neutral-soft hover:bg-white hover:text-brand transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-8">
          
          {/* Music Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-brand">
                 <Music size={20} />
                 <span className="text-body font-bold">{t('music_volume')}</span>
               </div>
               <span className="text-caption font-mono text-neutral-soft bg-white/50 px-2 py-1 rounded-lg">
                 {Math.round(musicVol * 100)}%
               </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVol}
              onChange={handleMusicChange}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand"
            />
          </div>

          {/* SFX Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-brand">
                 <Volume2 size={20} />
                 <span className="text-body font-bold">{t('sfx_volume')}</span>
               </div>
               <span className="text-caption font-mono text-neutral-soft bg-white/50 px-2 py-1 rounded-lg">
                 {Math.round(sfxVol * 100)}%
               </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVol}
              onChange={handleSfxChange}
              onMouseUp={handleSfxRelease}
              onTouchEnd={handleSfxRelease}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-green"
            />
          </div>

        </div>

        {/* Footer */}
        <button 
          onClick={() => { playSound('click'); onClose(); }}
          className="w-full mt-8 py-3 bg-brand text-white rounded-btn font-bold text-body shadow-btn hover:shadow-btn-hover hover:-translate-y-0.5 transition-all"
        >
          {t('close')}
        </button>

      </div>
    </div>
  );
};
