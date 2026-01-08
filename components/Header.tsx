import React from 'react';
import { Wallet, Globe } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <header className="bg-earth-900 text-sand-50 py-3 px-4 shadow-xl sticky top-0 z-50 border-b border-earth-800/50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-earth-700 to-earth-800 p-2 rounded-xl border border-earth-600/50 shadow-inner">
            <Wallet className="w-5 h-5 text-peach-300" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              {getTranslation(language, 'header_title')}
            </h1>
            <p className="text-[10px] text-earth-300 font-medium tracking-wide uppercase opacity-80">
              {getTranslation(language, 'header_subtitle')}
            </p>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-earth-800/50 rounded-lg p-1 border border-earth-700">
          <Globe className="w-3 h-3 text-earth-400 ml-2 mr-1" />
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-transparent text-xs font-semibold text-earth-200 outline-none p-1 cursor-pointer hover:text-white transition-colors"
          >
            <option value="en" className="bg-earth-900">English</option>
            <option value="hi" className="bg-earth-900">हिंदी</option>
            <option value="hinglish" className="bg-earth-900">Hinglish</option>
          </select>
        </div>
      </div>
    </header>
  );
};
