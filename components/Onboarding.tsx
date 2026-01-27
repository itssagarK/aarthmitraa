import React, { useState } from 'react';
import { PlayerProfile, OCCUPATIONS, Language } from '../types';
import { getTranslation } from '../translations';
import { ArrowRight, Sparkles, Globe, Check, PlayCircle, Clock } from 'lucide-react';
import { playSound } from '../services/audioService';

interface OnboardingProps {
  onComplete: (profile: PlayerProfile) => void;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  savedGameMeta?: { name: string; occupation: string; turn: number; savings: number } | null;
  onContinue?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ 
  onComplete, 
  isLoading, 
  language, 
  setLanguage, 
  savedGameMeta,
  onContinue 
}) => {
  // Steps: 0 = Language, 1 = Name, 2 = Occupation
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [name, setName] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    playSound('click');
    setLanguage(lang);
    // Short delay to let the user see their selection before transitioning
    setTimeout(() => {
       setStep(1);
    }, 250);
  };

  const handleResume = () => {
    playSound('success');
    if (onContinue) onContinue();
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
    <div className="flex flex-col gap-6 pt-4 w-full max-w-md mx-auto">
      
      {/* STEP 0: LANGUAGE SELECTION & RESUME */}
      {step === 0 && (
        <div className="glass-card rounded-[32px] p-8 shadow-glass text-center animate-fade-in min-h-[420px] flex flex-col justify-center relative overflow-hidden">
           {/* Decorative background */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand rounded-full blur-[60px] opacity-10 pointer-events-none"></div>

           {/* RESUME CARD (If save exists) */}
           {savedGameMeta && (
             <div className="mb-8 relative z-10">
               <div className="text-left text-caption font-bold text-neutral-soft mb-2 ml-1 uppercase tracking-wide">Continue Journey</div>
               <button 
                 onClick={handleResume}
                 className="w-full bg-white/80 backdrop-blur-md border border-brand/20 p-5 rounded-[24px] shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all text-left flex items-center gap-4 group"
               >
                 <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <PlayCircle className="w-6 h-6 fill-brand/20" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="text-h3 font-bold text-brand truncate">{savedGameMeta.name}</h3>
                    <div className="flex items-center gap-3 text-caption text-neutral-soft font-medium mt-0.5">
                      <span className="flex items-center gap-1"><Clock size={12}/> Turn {savedGameMeta.turn}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-soft/30"></span>
                      <span>{savedGameMeta.occupation}</span>
                    </div>
                 </div>
                 <div className="text-brand opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <ArrowRight size={20} />
                 </div>
               </button>
               <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-neutral-soft/20"></div>
                  <span className="flex-shrink-0 mx-4 text-neutral-soft/50 text-xs font-bold uppercase tracking-widest">Or New Game</span>
                  <div className="flex-grow border-t border-neutral-soft/20"></div>
               </div>
             </div>
           )}

           <div className="mb-6 space-y-2 relative">
             <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-brand transform rotate-3 mb-4">
                <Globe size={28} strokeWidth={1.5} />
             </div>
             <div>
                <h2 className="text-h2 text-brand font-bold tracking-tight">Choose Language</h2>
                <p className="text-body text-neutral-soft font-medium opacity-80">भाषा चुनें</p>
             </div>
           </div>

           <div className="flex flex-col gap-3 relative z-10">
             {(['en', 'hi', 'hinglish'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`
                    w-full p-4 rounded-xl border flex items-center justify-between group transition-all duration-200 active:scale-95
                    ${language === lang 
                      ? 'bg-brand text-white border-brand shadow-md scale-[1.02]' 
                      : 'bg-white/50 border-white/60 hover:bg-white hover:border-brand/20 text-neutral-dark'}
                  `}
                >
                   <span className="text-h3 font-bold">{lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी (Hindi)' : 'Hinglish'}</span>
                   {language === lang && <Check size={20} className="text-white" />}
                </button>
             ))}
           </div>
        </div>
      )}

      {/* STEP 1 & 2: PROFILE SETUP */}
      {step > 0 && (
        <div className="glass-card rounded-[32px] p-8 shadow-glass relative overflow-hidden animate-fade-in">
          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-green rounded-full blur-[60px] opacity-20 pointer-events-none"></div>

          {/* Welcome Text (Only show on Step 1) */}
          {step === 1 && (
            <div className="text-center space-y-4 mb-8 relative animate-fade-in">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm">
                <Sparkles className="w-6 h-6 text-accent-yellow" />
              </div>
              <h2 className="text-h1 text-brand tracking-tight">{t('welcome_title')}</h2>
              <p className="text-body text-neutral-soft leading-relaxed max-w-xs mx-auto">
                {t('welcome_subtitle')}
              </p>
            </div>
          )}
          
          {/* Step 2 Header */}
          {step === 2 && (
             <div className="text-center mb-6 animate-fade-in">
                <h2 className="text-h2 text-brand font-bold">{t('select_role')}</h2>
             </div>
          )}

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
                  placeholder={language === 'en' ? "Your Name..." : "आपका नाम..."}
                  autoFocus
                  required
                />
                 
                <button
                  type="submit"
                  disabled={!name}
                  className={`w-full py-4 rounded-btn font-bold text-body shadow-btn transition-all flex items-center justify-center transform ${
                    !name 
                      ? 'bg-neutral-soft/20 text-neutral-soft cursor-not-allowed' 
                      : 'bg-brand text-white hover:-translate-y-0.5 hover:shadow-btn-hover'}
                  `}
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
      )}
    </div>
  );
};
