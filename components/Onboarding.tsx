import React, { useState } from 'react';
import { PlayerProfile, OCCUPATIONS, Language } from '../types';
import { getTranslation } from '../translations';
import { ArrowRight, Sparkles } from 'lucide-react';
import { playSound } from '../services/audioService';

interface OnboardingProps {
  onComplete: (profile: PlayerProfile) => void;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isLoading, language, setLanguage }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    playSound('click');
    setLanguage(lang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    
    if (step === 1 && name) {
      setStep(2);
    } else if (step === 2 && name && selectedOccupation) {
      const occ = OCCUPATIONS.find(o => o.id === selectedOccupation);
      if (occ) {
        playSound('success'); // Play success sound when starting game
        onComplete({
          name,
          occupation: occ.id,
          monthlyIncome: occ.baseIncome,
        });
      }
    }
  };

  const handleOccupationSelect = (id: string) => {
    playSound('click');
    setSelectedOccupation(id);
  };

  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="flex flex-col gap-6 pt-4">
      
      {/* Language Selector for Step 1 */}
      {step === 1 && (
        <div className="flex justify-center gap-3">
          {(['en', 'hi', 'hinglish'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLanguageSelect(lang)}
              className={`px-4 py-2 rounded-full text-caption font-bold uppercase tracking-wider transition-all duration-300 ${
                language === lang 
                  ? 'bg-brand text-white shadow-btn' 
                  : 'bg-white/40 text-neutral-soft hover:bg-white'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'Hinglish'}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card rounded-[32px] p-8 shadow-glass relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-green rounded-full blur-[60px] opacity-20 pointer-events-none"></div>

        {/* Welcome Text */}
        <div className="text-center space-y-4 mb-8 relative">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm">
            <Sparkles className="w-6 h-6 text-accent-yellow" />
          </div>
          <h2 className="text-h1 text-brand tracking-tight">{t('welcome_title')}</h2>
          <p className="text-body text-neutral-soft leading-relaxed max-w-xs mx-auto">
            {t('welcome_subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-6">
          
          {/* Step 1: Name Input */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-6 text-center text-h2 font-bold bg-white/50 border-2 border-white/50 rounded-card text-brand placeholder-neutral-soft/50 focus:outline-none focus:bg-white focus:border-brand/30 transition-all"
                placeholder="Your Name..."
                autoFocus
                required
              />
               
              <button
                type="submit"
                disabled={!name}
                className={`w-full py-4 rounded-btn font-bold text-body shadow-btn transition-all flex items-center justify-center transform ${
                  !name 
                    ? 'bg-neutral-soft/20 text-neutral-soft cursor-not-allowed' 
                    : 'bg-brand text-white hover:-translate-y-0.5 hover:shadow-btn-hover'
                }`}
              >
                Start Journey <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OCCUPATIONS.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => handleOccupationSelect(occ.id)}
                    disabled={isLoading}
                    className={`
                      relative flex flex-col items-start p-4 rounded-card transition-all duration-300 text-left border
                      ${selectedOccupation === occ.id 
                        ? 'bg-white border-brand shadow-md ring-1 ring-brand' 
                        : 'bg-white/40 border-white hover:bg-white/80'}
                    `}
                  >
                    <span className="text-2xl mb-2">{occ.icon}</span>
                    <div className="w-full">
                      <div className="font-bold text-brand text-h3 leading-tight">
                        {occ.label[language] || occ.label['en']}
                      </div>
                      <div className="text-caption font-semibold text-neutral-soft uppercase tracking-wider mb-1">
                        {(occ as any).desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!selectedOccupation || isLoading}
                className={`
                  w-full py-4 rounded-btn font-bold text-body shadow-btn transition-all mt-2
                  ${!selectedOccupation || isLoading
                    ? 'bg-neutral-soft/20 text-neutral-soft cursor-not-allowed' 
                    : 'bg-brand text-white hover:-translate-y-0.5 hover:shadow-btn-hover'}
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center animate-pulse">
                    <Sparkles className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    {t('loading')}
                  </span>
                ) : (
                  t('start_button')
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};