import React from 'react';
import { StatTransaction } from '../types';
import { X, IndianRupee, TrendingUp, TrendingDown, Smile, Heart, Users, Plus, Minus } from 'lucide-react';
import { playSound } from '../services/audioService';

interface StatHistoryProps {
  type: 'savings' | 'debt' | 'happiness' | 'health' | 'relationships';
  history: StatTransaction[];
  onClose: () => void;
  title: string;
}

export const StatHistory: React.FC<StatHistoryProps> = ({ type, history, onClose, title }) => {
  // Filter history to only show transactions where the specific stat changed
  // Handle undefined relationships for old saves safely
  const filteredHistory = history.filter(t => (t.changes[type] || 0) !== 0).reverse();

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-dark/40 backdrop-blur-sm animate-fade-in" 
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-[32px] w-full max-w-sm max-h-[70vh] flex flex-col shadow-2xl animate-fade-in relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h3 className="text-h3 font-bold text-neutral-dark capitalize flex items-center gap-2">
            {type === 'savings' && <IndianRupee className="w-5 h-5 text-accent-green" />}
            {type === 'debt' && <TrendingUp className="w-5 h-5 text-accent-red" />}
            {type === 'happiness' && <Smile className="w-5 h-5 text-accent-yellow" />}
            {type === 'health' && <Heart className="w-5 h-5 text-accent-pink" />}
            {type === 'relationships' && <Users className="w-5 h-5 text-accent-purple" />}
            {title} History
          </h3>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-soft hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 flex flex-col gap-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-neutral-soft text-caption">
              No history yet for this stat.
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const change = item.changes[type] || 0;
              const isIncrease = change > 0;
              
              // Determine if the change is "Good" for the player
              let isGood = false;
              if (type === 'debt') {
                isGood = !isIncrease; // Debt going DOWN is Good
              } else {
                isGood = isIncrease; // Others going UP is Good
              }

              const colorClass = isGood ? "text-accent-green" : "text-accent-red";
              const bgClass = isGood ? "bg-accent-green/10" : "bg-accent-red/10";
              const borderClass = isGood ? "border-l-accent-green" : "border-l-accent-red";
              
              // Select semantic icon
              let Icon = isIncrease ? TrendingUp : TrendingDown;
              // For money, use Plus/Minus for clarity
              if (type === 'savings' || type === 'debt') {
                 Icon = isIncrease ? Plus : Minus;
              }

              return (
                <div key={index} className={`flex items-center justify-between p-3 pl-4 rounded-xl bg-white border border-neutral-100 shadow-sm border-l-4 ${borderClass}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Icon Indicator */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
                       <Icon className="w-4 h-4" strokeWidth={3} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-body font-bold text-neutral-dark leading-tight truncate pr-2">{item.description}</span>
                      <span className="text-[10px] text-neutral-soft font-bold uppercase tracking-wider mt-0.5">Turn {item.turn}</span>
                    </div>
                  </div>
                  
                  {/* Value */}
                  <div className={`text-h3 font-bold ${colorClass} whitespace-nowrap ml-2`}>
                    {change > 0 ? '+' : ''}{change}{type === 'savings' || type === 'debt' ? '' : '%'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};