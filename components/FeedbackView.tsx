import React, { useEffect, useState, useRef } from 'react';
import { GameEvent, Language } from '../types';
import { getTranslation } from '../translations';
import { TrendingUp, TrendingDown, Heart, Smile, ArrowRight, IndianRupee, Info, ChevronDown, Users, Share2, Check } from 'lucide-react';
import { playSound } from '../services/audioService';

interface FeedbackViewProps {
  lastEvent: GameEvent;
  language: Language;
  onNext: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ lastEvent, language, onNext }) => {
  const impacts = lastEvent.impact_on_stats;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!impacts) return;
    
    // Play sound based on result
    const isBadOutcome = (impacts.debt > 500) || (impacts.happiness < -5) || (impacts.health < -5) || (impacts.relationships < -5);
    const isGoodOutcome = (impacts.savings > 0) || (impacts.happiness > 5) || (impacts.relationships > 5);

    if (isBadOutcome) {
      playSound('error');
    } else if (isGoodOutcome) {
      playSound('success');
    } else {
      playSound('click'); // Neutral
    }
  }, [lastEvent]); 

  // Reset expansion state when event changes
  useEffect(() => {
    setIsExpanded(false);
    setShowCopied(false);
  }, [lastEvent]);

  if (!impacts) return null;

  const t = (key: any) => getTranslation(language, key);

  const handleNextClick = () => {
    playSound('click');
    onNext();
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleShare = async () => {
    playSound('click');
    
    const impactParts: string[] = [];
    if (impacts.savings !== 0) impactParts.push(`💰 ${impacts.savings > 0 ? '+' : ''}₹${impacts.savings}`);
    if (impacts.debt !== 0) impactParts.push(`📉 Debt ${impacts.debt > 0 ? '+' : ''}₹${impacts.debt}`);
    if (impacts.happiness !== 0) impactParts.push(`🙂 ${impacts.happiness > 0 ? '+' : ''}${impacts.happiness}%`);
    if (impacts.health !== 0) impactParts.push(`❤️ ${impacts.health > 0 ? '+' : ''}${impacts.health}%`);
    if ((impacts.relationships || 0) !== 0) impactParts.push(`🤝 ${impacts.relationships > 0 ? '+' : ''}${impacts.relationships}%`);

    const shareText = `🇮🇳 Arth Mitra Update\n\n"${lastEvent.previous_outcome_title}"\n${lastEvent.previous_outcome_desc}\n\n${impactParts.join('  |  ')}\n\nCan you balance money and life?`;

    // Try Native Share
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Arth Mitra - My Financial Journey',
          text: shareText,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      // Fallback to Clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  // Safe check for relationships since it might not exist in old events if not migrated
  const relImpact = impacts.relationships || 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in justify-center w-full min-h-full">
      
      {/* Result Story Card */}
      <div className="glass-card p-8 rounded-card text-center shadow-xl border-white/60 relative z-10">
        
        {/* Share Button (Top Right) */}
        <button 
           onClick={handleShare}
           className="absolute top-4 right-4 p-2.5 rounded-full bg-white/50 hover:bg-white text-brand/60 hover:text-brand transition-all shadow-sm active:scale-95 group"
           title={t('share_button')}
        >
           {showCopied ? (
             <div className="flex items-center gap-1.5">
               <Check size={16} className="text-accent-green" strokeWidth={3} />
               <span className="text-[10px] font-bold text-accent-green uppercase tracking-wide animate-fade-in">{t('copied')}</span>
             </div>
           ) : (
             <Share2 size={18} />
           )}
        </button>

        <div className="inline-block px-4 py-1.5 rounded-full bg-accent-yellow/20 text-brand text-caption font-bold tracking-wide uppercase mb-6">
          Result
        </div>
        <h2 className="text-h1 text-brand mb-4 leading-tight">
          {lastEvent.previous_outcome_title || "Done!"}
        </h2>
        <p className="text-body text-neutral-soft leading-relaxed mb-6">
          {lastEvent.previous_outcome_desc}
        </p>

        {/* Financial Flow Explanation */}
        {lastEvent.financial_explanation && (
           <button 
             onClick={handleToggleExpand}
             className="w-full bg-white/60 border border-white/80 rounded-2xl p-4 text-caption text-neutral-dark flex items-start gap-3 text-left shadow-sm hover:bg-white/80 transition-all duration-200 active:scale-[0.98] group cursor-pointer overflow-hidden"
             aria-expanded={isExpanded}
           >
              <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                 <div 
                   className="transition-[max-height] duration-500 ease-in-out overflow-hidden"
                   style={{ maxHeight: isExpanded ? '500px' : '44px' }} // 44px approx 2 lines
                 >
                   <span className={`leading-snug block ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {lastEvent.financial_explanation}
                   </span>
                 </div>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-neutral-soft/70 shrink-0 mt-1 transition-transform duration-500 ease-in-out ${isExpanded ? 'rotate-180' : ''}`} 
              />
           </button>
        )}
      </div>

      {/* Stat Changes Grid - Naturally flows */}
      <div className="grid grid-cols-2 gap-4 w-full">
        
        {/* Savings Impact */}
        {impacts.savings !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.savings > 0 ? 'border-accent-green/50' : 'border-accent-red/50'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('savings')}</span>
            <div className={`text-h3 font-bold flex items-center ${impacts.savings > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              <IndianRupee className="w-4 h-4 mr-1" />
              {impacts.savings > 0 ? '+' : ''}{impacts.savings}
            </div>
          </div>
        )}

        {/* Happiness Impact */}
        {impacts.happiness !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.happiness > 0 ? 'border-accent-yellow/50' : 'border-neutral-soft/30'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('happiness')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.happiness > 0 ? 'text-accent-yellow' : 'text-neutral-soft'}`}>
              <Smile className="w-5 h-5 mr-1" />
              {impacts.happiness > 0 ? '+' : ''}{impacts.happiness}%
            </div>
          </div>
        )}

         {/* Health Impact */}
         {impacts.health !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.health > 0 ? 'border-accent-pink/50' : 'border-accent-red/50'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('health')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.health > 0 ? 'text-accent-pink' : 'text-accent-red'}`}>
              <Heart className="w-5 h-5 mr-1" />
              {impacts.health > 0 ? '+' : ''}{impacts.health}%
            </div>
          </div>
        )}
        
        {/* Relationships Impact */}
        {relImpact !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${relImpact > 0 ? 'border-accent-purple/50' : 'border-accent-red/50'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('relationships')}</span>
             <div className={`text-h3 font-bold flex items-center ${relImpact > 0 ? 'text-accent-purple' : 'text-accent-red'}`}>
              <Users className="w-5 h-5 mr-1" />
              {relImpact > 0 ? '+' : ''}{relImpact}%
            </div>
          </div>
        )}

         {/* Debt Impact */}
         {impacts.debt !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.debt < 0 ? 'border-accent-green/50' : 'border-accent-red/50'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('debt')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.debt < 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {impacts.debt > 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
              {impacts.debt > 0 ? '+' : ''}{impacts.debt}
            </div>
          </div>
        )}
      </div>

      {/* Primary CTA Button - Sticky at bottom to ensure visibility */}
      <div className="sticky bottom-0 pb-4 pt-4 -mb-4 bg-gradient-to-t from-[#f0fdf9] via-[#f0fdf9]/95 to-transparent z-20 mt-auto">
        <button
          onClick={handleNextClick}
          className="w-full bg-brand text-white py-5 rounded-btn font-bold text-h3 shadow-btn hover:shadow-btn-hover hover:-translate-y-0.5 transition-all flex items-center justify-center group"
        >
          {t('next_turn')} <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="h-2" />
    </div>
  );
};