import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';
import { getTranslation } from '../translations';
import { IndianRupee, Heart, Smile, TrendingDown, TrendingUp } from 'lucide-react';
import { StatHistory } from './StatHistory';
import { playSound } from '../services/audioService';

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
  const [selectedStat, setSelectedStat] = useState<'savings' | 'debt' | 'happiness' | 'health' | null>(null);
  
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
  
  const handleStatClick = (stat: 'savings' | 'debt' | 'happiness' | 'health') => {
    playSound('click');
    setSelectedStat(stat);
  };

  // Master UI Stat Chip Styles
  const statChipClass = "flex flex-col items-center justify-center p-3 rounded-chip min-w-[90px] min-h-[70px] bg-white/80 backdrop-blur-md border border-white/60 shadow-sm transition-transform active:scale-95 cursor-pointer hover:bg-white";

  return (
    <>
      {/* 
        Sticky Container 
        - top-0 relative to the scrollable main container in App.tsx 
        - -mx-4 to expand full width of container padding
        - Strong background to hide scrolling content
      */}
      <div className="sticky top-0 z-40 -mx-4 px-4 pt-4 pb-4 overflow-x-auto scrollbar-hide bg-[#f0fdf9]/95 backdrop-blur-md border-b border-white/20 shadow-sm transition-all">
        <div className="flex gap-3 w-max mx-auto sm:w-full sm:mx-0 justify-between sm:justify-center">
          
          {/* Savings Bubble */}
          <button onClick={() => handleStatClick('savings')} className={`${statChipClass} group flex-1`}>
            <div className="flex items-center gap-1 mb-1 text-accent-green">
               <IndianRupee className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('savings')}</span>
            <span className="text-h3 text-neutral-dark mt-0.5">
               <AnimatedCounter value={state.savings} formatter={savingsFormatter} />
            </span>
          </button>

          {/* Debt Bubble */}
          <button onClick={() => handleStatClick('debt')} className={`${statChipClass} group flex-1`}>
             <div className={`flex items-center gap-1 mb-1 ${state.debt > 0 ? 'text-accent-red' : 'text-neutral-soft'}`}>
               {state.debt > 0 ? <TrendingDown className="w-4 h-4" strokeWidth={2.5} /> : <TrendingUp className="w-4 h-4" strokeWidth={2.5} />}
             </div>
             <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('debt')}</span>
             <span className="text-h3 text-neutral-dark mt-0.5">
                <AnimatedCounter value={state.debt} formatter={debtFormatter} />
             </span>
          </button>

          {/* Joy Bubble */}
          <button onClick={() => handleStatClick('happiness')} className={`${statChipClass} group flex-1`}>
             <div className="flex items-center gap-1 mb-1 text-accent-yellow">
                <Smile className="w-4 h-4" strokeWidth={2.5} />
             </div>
             <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('happiness')}</span>
             <span className="text-h3 text-neutral-dark mt-0.5">
               <AnimatedCounter value={state.happiness} formatter={percentageFormatter} />
             </span>
          </button>

          {/* Health Bubble */}
          <button onClick={() => handleStatClick('health')} className={`${statChipClass} group flex-1`}>
             <div className="flex items-center gap-1 mb-1 text-accent-pink">
                <Heart className="w-4 h-4 fill-current" />
             </div>
             <span className="text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{t('health')}</span>
             <span className="text-h3 text-neutral-dark mt-0.5">
               <AnimatedCounter value={state.health} formatter={percentageFormatter} />
             </span>
          </button>

        </div>
      </div>
      
      {selectedStat && (
        <StatHistory 
          type={selectedStat} 
          history={state.statHistory} 
          onClose={() => setSelectedStat(null)}
          title={t(selectedStat)}
        />
      )}
    </>
  );
};