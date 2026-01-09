import React, { useEffect, useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface FinancialTipCardProps {
  tip: string;
  language: Language;
}

export const FinancialTipCard: React.FC<FinancialTipCardProps> = ({ tip, language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation shortly after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`
        transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
        mx-1 mt-4 mb-8 relative group
      `}
    >
      {/* Glow Effect behind the card */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-light/30 to-accent-yellow/30 rounded-[22px] blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
      
      <div className="relative bg-white/70 backdrop-blur-xl border border-white/60 p-5 rounded-[20px] shadow-glass flex gap-4 items-start overflow-hidden hover:bg-white/80 transition-colors duration-300">
        
        {/* Icon Container */}
        <div className="relative shrink-0 mt-0.5">
          {/* Pulsing ring */}
          <div className="absolute inset-0 bg-accent-yellow rounded-full animate-ping opacity-20"></div>
          
          <div className="relative w-11 h-11 bg-gradient-to-br from-[#FFF8E1] to-[#FFF3CD] rounded-full flex items-center justify-center text-brand-dark border border-white shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Lightbulb size={22} strokeWidth={2.5} className="text-brand" />
          </div>
          
          {/* Small star badge */}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-brand/5 scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
             <Sparkles size={12} className="text-accent-yellow fill-current" />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="text-[10px] font-extrabold text-brand/80 uppercase tracking-[0.2em] bg-brand/5 px-2 py-0.5 rounded-full inline-block border border-brand/5">
              {language === 'en' ? 'Arth Mitra Wisdom' : 'अर्थ मित्र ज्ञान'}
            </h4>
          </div>
          <p className="text-body font-medium text-neutral-dark/90 leading-relaxed italic">
            "{tip}"
          </p>
        </div>
        
        {/* Decorative Watermark */}
        <Lightbulb className="absolute -bottom-6 -right-6 w-32 h-32 text-brand/5 rotate-12 pointer-events-none transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110" />
      </div>
    </div>
  );
};
