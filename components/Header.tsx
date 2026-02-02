import React, { useState, useEffect } from 'react';
import { Wallet, Settings, Music, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { 
  playSound, 
  getMusicVolume, 
  getSfxVolume, 
  toggleMuteMusic, 
  toggleMuteSfx 
} from '../services/audioService';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, onOpenSettings }) => {
  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);

  // Sync state on render (catches updates from SettingsModal or other sources)
  useEffect(() => {
    setMusicOn(getMusicVolume() > 0);
    setSfxOn(getSfxVolume() > 0);
  });

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'En' },
    { code: 'hi', label: 'Hi' },
    { code: 'hinglish', label: 'Hng' },
  ];

  const handleSettingsClick = () => {
    playSound('click');
    onOpenSettings();
  };

  const handleMusicToggle = () => {
    playSound('click');
    const newVol = toggleMuteMusic();
    setMusicOn(newVol > 0);
  };

  const handleSfxToggle = () => {
    if (!sfxOn) {
      // If turning on, toggle first then play sound
      const newVol = toggleMuteSfx();
      setSfxOn(newVol > 0);
      setTimeout(() => playSound('click'), 50);
    } else {
      // If turning off, play sound first
      playSound('click');
      const newVol = toggleMuteSfx();
      setSfxOn(newVol > 0);
    }
  };

  return (
    <div className="w-full px-4 py-3 transition-all">
      <div className="max-w-[500px] mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-xl shadow-btn shrink-0">
            <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-h3 text-brand font-extrabold tracking-tight truncate hidden sm:block">
            {getTranslation(language, 'header_title')}
          </h1>
        </div>

        {/* Actions Group */}
        <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Music Toggle */}
            <button
                onClick={handleMusicToggle}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                  musicOn 
                    ? 'bg-neutral-glass border-white/40 text-brand hover:bg-brand hover:text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-400'
                }`}
                aria-label="Toggle Music"
            >
                <Music size={18} strokeWidth={musicOn ? 2.5 : 2} />
            </button>

            {/* SFX Toggle */}
            <button
                onClick={handleSfxToggle}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                  sfxOn 
                    ? 'bg-neutral-glass border-white/40 text-brand hover:bg-brand hover:text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-400'
                }`}
                aria-label="Toggle SFX"
            >
                {sfxOn ? <Volume2 size={18} strokeWidth={2.5} /> : <VolumeX size={18} strokeWidth={2} />}
            </button>

            {/* Settings Button */}
            <button
                onClick={handleSettingsClick}
                className="w-9 h-9 rounded-full bg-neutral-glass border border-white/40 flex items-center justify-center text-neutral-soft hover:bg-brand hover:text-white transition-all shadow-sm active:scale-95"
                aria-label="Settings"
            >
                <Settings size={18} />
            </button>

            {/* Language Switcher */}
            <div className="flex p-1 rounded-full bg-neutral-glass border border-white/40 shrink-0">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`
                    px-2 sm:px-3 py-1.5 rounded-full text-caption font-bold transition-all duration-200
                    ${language === lang.code 
                      ? 'bg-brand text-white shadow-sm' 
                      : 'text-neutral-soft hover:text-brand'}
                  `}
                >
                  {lang.label}
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};