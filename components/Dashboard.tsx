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

interface StatChipProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  onClick: () => void;
  formatter?: (v: number) => string | number;
  isHighGood?: boolean; // Defaults to true
  baseIconColor?: string;
}

const StatChip: React.FC<StatChipProps> = ({ 
  label, 
  value, 
  icon, 
  onClick, 
  formatter, 
  isHighGood = true,
  baseIconColor = "text-brand"
}) => {
  const [flashState, setFlashState] = useState<'idle' | 'good' | 'bad'>('idle');
  const [isPulsing, setIsPulsing] = useState(false);
  const prevValue = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip flash on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevValue.current = value;
      return;
    }

    if (value !== prevValue.current) {
      const diff = value - prevValue.current;
      // If no change, do nothing
      if (diff === 0) return;

      const isIncrease = diff > 0;
      const isGoodOutcome = isHighGood ? isIncrease : !isIncrease;

      setFlashState(isGoodOutcome ? 'good' : 'bad');
      setIsPulsing(true);

      const timer = setTimeout(() => {
        setFlashState('idle');
        setIsPulsing(false);
      }, 600); // Flash duration

      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value, isHighGood]);

  // Dynamic classes
  const baseClasses = "flex flex-col items-center justify-center p-3 rounded-chip min-w-[90px] min-h-[70px] backdrop-blur-md shadow-sm transition-all duration-300 active:scale-95 cursor-pointer hover:bg-white border flex-1 group relative overflow-hidden";
  
  let stateClasses = "bg-white/80 border-white/60";
  let iconColor = baseIconColor;

  if (flashState === 'good') {
    stateClasses = "bg-accent-green/10 border-accent-green/60 shadow-md ring-1 ring-accent-green/30";
    iconColor = "text-accent-green";
  } else if (flashState === 'bad') {
    stateClasses = "bg-accent-red/10 border-accent-red/60 shadow-md ring-1 ring-accent-red/30";
    iconColor = "text-accent-red";
  }

  // Add scale pulse effect
  const transformClass = isPulsing ? "scale-105" : "scale-100";

  return (
    <button onClick={onClick} className={`${baseClasses} ${stateClasses} ${transformClass}`}>
      {/* Flash overlay */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${flashState === 'good' ? 'bg-accent-green/10 opacity-100' : 'opacity-0'} ${flashState === 'bad' ? 'bg-accent-red/10 opacity-100' : ''}`} />
      
      <div className={`relative z-10 flex items-center gap-1 mb-1 transition-colors duration-300 ${iconColor}`}>
         {icon}
      </div>
      <span className="relative z-10 text-[10px] font-bold uppercase text-neutral-soft tracking-wider">{label}</span>
      <span className="relative z-10 text-h3 text-neutral-dark mt-0.5">
         <AnimatedCounter value={value} formatter={formatter} />
      </span>
    </button>
  );
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
          
          <StatChip 
            label={t('savings')} 
            value={state.savings} 
            formatter={savingsFormatter}
            onClick={() => handleStatClick('savings')}
            icon={<IndianRupee className="w-4 h-4" strokeWidth={2.5} />}
            baseIconColor="text-accent-green"
            isHighGood={true}
          />

          <StatChip 
            label={t('debt')} 
            value={state.debt} 
            formatter={debtFormatter}
            onClick={() => handleStatClick('debt')}
            icon={state.debt > 0 ? <TrendingDown className="w-4 h-4" strokeWidth={2.5} /> : <TrendingUp className="w-4 h-4" strokeWidth={2.5} />}
            baseIconColor={state.debt > 0 ? 'text-accent-red' : 'text-neutral-soft'}
            isHighGood={false}
          />

          <StatChip 
            label={t('happiness')} 
            value={state.happiness} 
            formatter={percentageFormatter}
            onClick={() => handleStatClick('happiness')}
            icon={<Smile className="w-4 h-4" strokeWidth={2.5} />}
            baseIconColor="text-accent-yellow"
            isHighGood={true}
          />

          <StatChip 
            label={t('health')} 
            value={state.health} 
            formatter={percentageFormatter}
            onClick={() => handleStatClick('health')}
            icon={<Heart className="w-4 h-4 fill-current" />}
            baseIconColor="text-accent-pink"
            isHighGood={true}
          />

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