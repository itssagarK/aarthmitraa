import React, { useState } from 'react';
import { PlayerProfile, OCCUPATIONS, Language } from '../types';
import { getTranslation } from '../translations';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: PlayerProfile) => void;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isLoading, language, setLanguage }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Name, 2: Role
  const [name, setName] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name) {
      setStep(2);
    } else if (step === 2 && name && selectedOccupation) {
      const occ = OCCUPATIONS.find(o => o.id === selectedOccupation);
      if (occ) {
        onComplete({
          name,
          occupation: occ.id,
          monthlyIncome: occ.baseIncome,
        });
      }
    }
  };

  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in glass-panel rounded-[2rem] shadow-glass border border-white/60 mt-4 sm:mt-8">
      
      {/* Welcome Header */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">{t('welcome_title')}</h2>
        <p className="text-earth-600 text-sm font-medium leading-relaxed px-4">
          {t('welcome_subtitle')}
        </p>
      </div>

      {/* Language Pills (Visible if on step 1) */}
      {step === 1 && (
        <div className="flex justify-center gap-2 mb-6">
          {(['en', 'hi', 'hinglish'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                language === lang 
                  ? 'bg-earth-800 text-white shadow-lg scale-105' 
                  : 'bg-white/50 text-earth-600 hover:bg-earth-100'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'Hinglish'}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <label htmlFor="name" className="block text-center text-lg font-bold text-earth-800">
              {t('enter_name')}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 text-center text-xl font-bold border-2 border-transparent bg-white/60 rounded-2xl focus:border-peach-400 focus:bg-white focus:outline-none transition-all shadow-inner text-earth-900 placeholder-earth-300"
              placeholder="Rahul..."
              autoFocus
              required
            />
             <button
              type="submit"
              disabled={!name}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center ${
                !name ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-earth-800 text-white hover:scale-[1.02] hover:bg-earth-900'
              }`}
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Role */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            <span className="block text-center text-lg font-bold text-earth-800">
              {t('select_role')}
            </span>
            <div className="grid grid-cols-1 gap-3">
              {OCCUPATIONS.map((occ) => (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setSelectedOccupation(occ.id)}
                  disabled={isLoading}
                  className={`
                    relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${selectedOccupation === occ.id 
                      ? 'border-peach-400 bg-peach-50 shadow-md transform scale-[1.01]' 
                      : 'border-transparent bg-white/50 hover:bg-white/80 hover:shadow-sm'}
                  `}
                >
                  <span className="text-3xl mr-4">{occ.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-earth-900 text-lg">
                      {occ.label[language] || occ.label['en']}
                    </div>
                    <div className="text-xs font-semibold text-earth-500">
                      ₹{occ.baseIncome.toLocaleString()}/mo
                    </div>
                  </div>
                  {selectedOccupation === occ.id && (
                    <CheckCircle2 className="w-6 h-6 text-peach-500" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!selectedOccupation || isLoading}
              className={`
                w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 mt-4
                ${!selectedOccupation || isLoading
                  ? 'bg-earth-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-earth-700 to-earth-900 hover:shadow-xl hover:-translate-y-1 active:scale-95'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center animate-pulse">
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
  );
};
