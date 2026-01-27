import React, { useState } from 'react';
import { Wallet, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { toggleMute, isMuted, playSound } from '../services/audioService';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const [muted, setMuted] = useState(isMuted());

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'En' },
    { code: 'hi', label: 'Hi' },
    { code: 'hinglish', label: 'Hng' },
  ];

  const handleMuteToggle = () => {
    const newState = toggleMute();
    setMuted(newState);
    if (!newState) {
        playSound('click');
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
          <h1 className="text-h3 text-brand font-extrabold tracking-tight truncate">
            {getTranslation(language, 'header_title')}
          </h1>
        </div>

        {/* Actions Group */}
        <div className="flex items-center gap-3">
            {/* Mute Toggle */}
            <button
                onClick={handleMuteToggle}
                className="w-9 h-9 rounded-full bg-neutral-glass border border-white/40 flex items-center justify-center text-neutral-soft hover:bg-brand hover:text-white transition-all shadow-sm active:scale-95"
                aria-label={muted ? "Unmute" : "Mute"}
            >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Language Switcher */}
            <div className="flex p-1 rounded-full bg-neutral-glass border border-white/40 shrink-0">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`
                    px-3 py-1.5 rounded-full text-caption font-bold transition-all duration-200
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