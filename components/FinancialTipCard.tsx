import React, { useEffect, useState } from 'react';
import { Lightbulb, Sparkles, TrendingUp } from 'lucide-react';
import { Language } from '../types';

interface FinancialTipCardProps {
  tip: string;
  language: Language;
}

export const FinancialTipCard: React.FC<FinancialTipCardProps> = ({ tip, language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset visibility to ensure animation triggers on change
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [tip]);

  return (
    <div 
      className={`
        transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}
        mx-1 mt-6 mb-8 relative group perspective-1000
      `}
    >
      {/* 1. Outer Glow/Shadow Layer */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-light/20 via-accent-yellow/30 to-brand/20 rounded-[26px] blur-md opacity-40 group-hover:opacity-80 transition duration-700 group-hover:blur-lg"></div>
      
      {/* 2. Main Glass Card */}
      <div className="relative bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-[24px] shadow-glass flex gap-5 items-start overflow-hidden hover:bg-white/75 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
        
        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-0"></div>

        {/* Icon Container - Floating Badge Style */}
        <div className="relative shrink-0 z-10">
           {/* Ring animation */}
           <div className="absolute inset-0 bg-accent-yellow rounded-full animate-ping opacity-20 duration-1000"></div>
           
           <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFFDE7] to-[#FFF3CD] flex items-center justify-center shadow-lg border-2 border-white transform group-hover:rotate-6 transition-transform duration-500">
             <Lightbulb size={24} className="text-brand-dark drop-shadow-sm" strokeWidth={2.5} />
           </div>

           {/* Badge */}
           <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border border-brand/10 scale-0 group-hover:scale-100 transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) delay-75">
             <Sparkles size={14} className="text-accent-yellow fill-current" />
           </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 z-10 flex flex-col justify-center">
           <div className="flex items-center gap-2 mb-2">
             <span className="text-[10px] font-extrabold text-brand/70 uppercase tracking-[0.25em] bg-white/50 px-2.5 py-1 rounded-full border border-brand/5 shadow-sm backdrop-blur-md">
                {language === 'en' ? 'Smart Money Tip' : 'स्मार्ट मनी टिप्स'}
             </span>
           </div>
           
           <p className="text-[15px] sm:text-body font-medium text-neutral-dark/90 leading-relaxed italic animate-fade-in">
            "{tip}"
           </p>
        </div>
        
        {/* Decorative Background Icon (Watermark) */}
        <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rotate-12 group-hover:rotate-0 transform transition-transform">
           <TrendingUp size={120} />
        </div>
      </div>
    </div>
  );
};