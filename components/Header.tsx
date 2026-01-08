import React from 'react';
import { Wallet } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'En' },
    { code: 'hi', label: 'Hi' },
    { code: 'hinglish', label: 'Hng' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="max-w-[500px] mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-xl shadow-btn">
            <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-h3 text-brand font-extrabold tracking-tight">
            {getTranslation(language, 'header_title')}
          </h1>
        </div>

        {/* Master UI Segmented Pill Language Switcher */}
        <div className="flex p-1 rounded-full bg-neutral-glass border border-white/40">
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
    </header>
  );
};