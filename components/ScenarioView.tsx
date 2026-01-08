import React, { useEffect, useRef } from 'react';
import { GameState, Choice, GameEvent } from '../types';
import { getTranslation } from '../translations';
import { ChevronRight } from 'lucide-react';

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
    <div className="max-w-md mx-auto px-4 pb-24 space-y-6">
      
      {/* 1. Story Hook */}
      <div className="relative mt-2">
        <div className="absolute -left-2 -top-2 text-4xl opacity-20">❝</div>
        <p className="text-2xl font-medium text-earth-900 leading-tight pl-2">
          {event.narrative_hook}
        </p>
      </div>

      {/* 2. Choices */}
      <div className="space-y-3 pt-4">
        {event.choices.map((choice) => {
          
          // Determine Style based on type
          let bgClass = "bg-white/70 border-white";
          let accentClass = "bg-earth-100 text-earth-700";
          
          if (choice.type === 'expensive') {
             bgClass = "bg-peach-50/60 border-peach-100";
             accentClass = "bg-peach-100 text-peach-800";
          } else if (choice.type === 'cheap') {
             bgClass = "bg-growth-50/60 border-growth-100";
             accentClass = "bg-growth-100 text-growth-800";
          }

          return (
            <button
              key={choice.id}
              onClick={() => onMakeChoice(choice)}
              disabled={isLoading}
              className={`
                group w-full relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:-translate-y-1
                ${bgClass} hover:bg-white
              `}
            >
              <div className="flex justify-between items-start mb-1">
                 {/* Option ID circle */}
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${accentClass}`}>
                   {choice.id.slice(-1)}
                 </div>
                 
                 {/* Cost Badge */}
                 <div className={`text-sm font-bold px-2 py-0.5 rounded-md ${accentClass}`}>
                    {choice.cost_label}
                 </div>
              </div>

              <div className="pl-8">
                <div className="text-lg font-bold text-earth-900 leading-tight mb-1 group-hover:text-earth-700">
                  {choice.text}
                </div>
                {choice.tag && (
                  <div className="text-xs font-semibold text-earth-500 uppercase tracking-wide opacity-80">
                    {choice.tag}
                  </div>
                )}
              </div>

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-earth-400" />
              </div>
            </button>
          );
        })}
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-pulse">
           <div className="w-12 h-12 rounded-full border-4 border-earth-200 border-t-earth-800 animate-spin"></div>
           <div className="text-earth-600 text-sm font-bold tracking-widest uppercase">{t('loading')}</div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
