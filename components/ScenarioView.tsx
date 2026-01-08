import React, { useEffect, useRef } from 'react';
import { GameState, Choice, GameEvent } from '../types';
import { getTranslation } from '../translations';
import { ArrowRight } from 'lucide-react';

interface ScenarioViewProps {
  event: GameEvent;
  onMakeChoice: (choice: Choice) => void;
  isLoading: boolean;
  state: GameState;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({ event, onMakeChoice, isLoading, state }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = (key: any) => getTranslation(state.language, key);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [event]);

  return (
    <div className="flex flex-col gap-6 pb-24">
      
      {/* 1. Story Card */}
      <div className="glass-card p-5 rounded-card text-center sm:text-left">
        <p className="text-h2 text-brand leading-snug">
          {event.narrative_hook}
        </p>
      </div>

      {/* 2. Choices - Horizontal Swipeable Carousel with Master UI Card Styles */}
      <div className="relative">
        
        {/* Helper text for swipe - fades out */}
        <div className="absolute -top-8 right-0 text-[10px] text-neutral-soft font-bold uppercase tracking-widest animate-pulse sm:hidden bg-white/40 px-2 py-1 rounded-full">
          Swipe →
        </div>

        <div className="flex overflow-x-auto gap-4 py-2 px-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-1 sm:gap-4 sm:overflow-visible sm:px-0 sm:mx-0">
          {event.choices.map((choice) => {
            
            // Accent Color determination based on type
            let accentColorClass = "text-brand";
            if (choice.type === 'expensive') accentColorClass = "text-accent-red";
            else if (choice.type === 'cheap') accentColorClass = "text-accent-green";
            else accentColorClass = "text-brand";

            return (
              <button
                key={choice.id}
                onClick={() => onMakeChoice(choice)}
                disabled={isLoading}
                className={`
                  glass-choice flex-shrink-0 w-[85%] sm:w-full snap-center
                  rounded-choice p-5 flex flex-row justify-between items-center gap-3
                  transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-btn-hover shadow-sm group
                `}
              >
                {/* Left Side: Content */}
                <div className="flex-1 min-w-0">
                   {/* Header: Cost + Emoji */}
                   <div className="flex items-center gap-2 mb-2">
                      <span className={`text-caption font-bold px-2 py-0.5 rounded-md bg-white/50 ${accentColorClass}`}>
                         {choice.cost_label}
                      </span>
                      {choice.emoji && <span className="text-lg">{choice.emoji}</span>}
                   </div>

                   {/* Main Text */}
                   <div className="text-h3 text-neutral-dark leading-tight mb-1 truncate whitespace-normal">
                      {choice.text}
                   </div>

                   {/* Tag / Subtext */}
                   {choice.tag && (
                    <div className="text-caption text-neutral-soft font-medium">
                      {choice.tag}
                    </div>
                   )}
                </div>
                
                {/* Right Side: CTA Button Icon */}
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            );
          })}
          
           {/* Spacer for horizontal scroll padding on mobile */}
           <div className="w-1 flex-shrink-0 sm:hidden"></div>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center mt-4">
           <div className="glass-card px-6 py-3 rounded-full shadow-sm flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-150"></div>
              <span className="text-caption font-bold uppercase tracking-widest text-neutral-soft">{t('loading')}</span>
           </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};