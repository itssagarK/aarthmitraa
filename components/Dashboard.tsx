import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';
import { getTranslation } from '../translations';
import { IndianRupee, Heart, Smile, TrendingDown, TrendingUp } from 'lucide-react';

interface DashboardProps {
  state: GameState;
}

const AnimatedCounter = ({ value, formatter }: { value: number, formatter?: (v: number) => string | number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startTime = useRef<number>(0);
  const startValue = useRef<number>(value);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      const duration = 1500;
      
      if (progress < duration) {
        const ease = 1 - Math.pow(2, -10 * (progress / duration));
        const nextValue = startValue.current + (value - startValue.current) * ease;
        setDisplayValue(nextValue);
        rafId.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    rafId.current = requestAnimationFrame(animate);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [value]);

  return <>{formatter ? formatter(displayValue) : Math.round(displayValue)}</>;
};

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const t = (key: any) => getTranslation(state.language, key);

  const savingsFormatter = (val: number) => {
    if (val > -1000 && val < 1000) return Math.round(val);
    return `${(val / 1000).toFixed(1)}k`;
  };

  const debtFormatter = (val: number) => {
    if (Math.round(val) <= 0) return '-';
    return `${(val / 1000).toFixed(1)}k`;
  };

  const percentageFormatter = (val: number) => {
    return `${Math.round(val)}%`;
  };

  // Master UI Stat Chip Styles
  const statChipClass = "flex flex-col items-center justify-center p-3 rounded-chip min-w-[90px] min-h-[70px] bg-neutral-glass backdrop-blur-md border border-white/40 shadow-sm transition-transform hover:-translate-y-1";

  // Sticky positioning: Assumes header is approx 68px tall.
  return (
    <div className="sticky top-[68px] z-40 -mx-4 px-4 pt-2 pb-2 overflow-x-auto scrollbar-hide bg-gradient-to-b from-[#f0fdf9]/80 to-transparent backdrop-blur-sm">
      <div className="flex gap-3 w-max mx-auto sm:w-full sm:mx-0">
        
        {/* Savings Bubble */}
        <div className={`${statChipClass} group`}>
          <div className="flex items-center gap-1 mb-1 text-accent-green">
             <IndianRupee className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('savings')}</span>
          <span className="text-h3 text-neutral-dark mt-0.5">
             <AnimatedCounter value={state.savings} formatter={savingsFormatter} />
          </span>
        </div>

        {/* Debt Bubble */}
        <div className={`${statChipClass} group`}>
           <div className={`flex items-center gap-1 mb-1 ${state.debt > 0 ? 'text-accent-red' : 'text-neutral-soft'}`}>
             {state.debt > 0 ? <TrendingDown className="w-4 h-4" strokeWidth={2.5} /> : <TrendingUp className="w-4 h-4" strokeWidth={2.5} />}
           </div>
           <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('debt')}</span>
           <span className="text-h3 text-neutral-dark mt-0.5">
              <AnimatedCounter value={state.debt} formatter={debtFormatter} />
           </span>
        </div>

        {/* Joy Bubble */}
        <div className={`${statChipClass} group`}>
           <div className="flex items-center gap-1 mb-1 text-accent-yellow">
              <Smile className="w-4 h-4" strokeWidth={2.5} />
           </div>
           <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('happiness')}</span>
           <span className="text-h3 text-neutral-dark mt-0.5">
             <AnimatedCounter value={state.happiness} formatter={percentageFormatter} />
           </span>
        </div>

        {/* Health Bubble */}
        <div className={`${statChipClass} group`}>
           <div className="flex items-center gap-1 mb-1 text-accent-pink">
              <Heart className="w-4 h-4 fill-current" />
           </div>
           <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('health')}</span>
           <span className="text-h3 text-neutral-dark mt-0.5">
             <AnimatedCounter value={state.health} formatter={percentageFormatter} />
           </span>
        </div>

      </div>
    </div>
  );
};