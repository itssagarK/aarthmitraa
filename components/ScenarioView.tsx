import React, { useEffect, useRef } from 'react';
import { GameState, Choice, GameEvent } from '../types';
import { getTranslation } from '../translations';
import { ArrowRight } from 'lucide-react';
import { playSound } from '../services/audioService';

interface ScenarioViewProps {
  event: GameEvent;
  onMakeChoice: (choice: Choice) => void;
  isLoading: boolean;
  state: GameState;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({ event, onMakeChoice, isLoading, state }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = (key: any) => getTranslation(state.language, key);

  useEffect(() => {
    // Only scroll if content pushes significantly off screen
    if (bottomRef.current) {
        // setTimeout ensures layout is fully recalculated
        setTimeout(() => {
             bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
  }, [event]);

  const handleChoiceClick = (choice: Choice) => {
    playSound('click');
    onMakeChoice(choice);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. Story Card */}
      <div className="glass-card p-6 rounded-card text-center sm:text-left w-full shadow-lg border-white/60">
        <p className="text-h2 text-brand leading-snug">
          {event.narrative_hook}
        </p>
      </div>

      {/* 2. Choices */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between px-1">
           <span className="text-caption font-bold uppercase text-neutral-soft tracking-widest">
             {t('select_role') === 'Select your role' ? 'Your Choice' : 'आपका फैसला'}
           </span>
           <span className="text-[10px] text-neutral-soft/60 sm:hidden">Swipe for options →</span>
        </div>

        {/* 
            Choice Container:
            - Mobile: Horizontal scroll (carousel)
            - Desktop: Vertical Grid
            - Added pb-4 for safe shadow rendering
            - Added min-h to prevent collapse
        */}
        <div className="flex overflow-x-auto gap-4 px-1 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-1 sm:gap-4 sm:overflow-visible sm:px-0 sm:mx-0 sm:pb-0">
          {event.choices.map((choice) => {
            
            let accentColorClass = "text-brand";
            if (choice.type === 'expensive') accentColorClass = "text-accent-red";
            else if (choice.type === 'cheap') accentColorClass = "text-accent-green";
            else accentColorClass = "text-brand";

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice)}
                disabled={isLoading}
                className={`
                  glass-choice flex-shrink-0 w-[85%] sm:w-full snap-center
                  rounded-choice p-5 flex flex-row justify-between items-center gap-4
                  transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-btn-hover shadow-sm group
                  min-h-[120px] h-auto border border-white/40 bg-white/70
                `}
              >
                {/* Left Side: Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                   {/* Header: Cost + Emoji */}
                   <div className="flex items-center gap-2">
                      <span className={`text-caption font-bold px-2 py-1 rounded-lg bg-white/60 shadow-sm ${accentColorClass}`}>
                         {choice.cost_label}
                      </span>
                      {choice.emoji && <span className="text-xl">{choice.emoji}</span>}
                   </div>

                   {/* Main Text */}
                   <div className="text-h3 text-neutral-dark leading-tight whitespace-normal break-words font-semibold">
                      {choice.text}
                   </div>

                   {/* Tag / Subtext */}
                   {choice.tag && (
                    <div className="text-caption text-neutral-soft font-medium opacity-80">
                      {choice.tag}
                    </div>
                   )}
                </div>
                
                {/* Right Side: CTA Button Icon */}
                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-6 h-6" />
                </div>
              </button>
            );
          })}
          
           {/* Spacer for horizontal scroll padding on mobile */}
           <div className="w-2 flex-shrink-0 sm:hidden"></div>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-4">
           <div className="glass-card px-6 py-3 rounded-full shadow-sm flex items-center gap-2 animate-pulse bg-white/60">
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-150"></div>
              <span className="text-caption font-bold uppercase tracking-widest text-neutral-soft">{t('loading')}</span>
           </div>
        </div>
      )}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
};