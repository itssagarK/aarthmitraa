import React from 'react';
import { GameState } from '../types';
import { getTranslation } from '../translations';
import { IndianRupee, Heart, Smile, TrendingDown, TrendingUp } from 'lucide-react';

interface DashboardProps {
  state: GameState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const t = (key: any) => getTranslation(state.language, key);

  return (
    <div className="sticky top-[70px] z-40 my-4 px-4 sm:px-0">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Savings Chip */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-white/50 shadow-glass flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 left-0 w-full h-1 bg-growth-500"></div>
          <span className="text-[10px] font-bold uppercase text-growth-700 tracking-widest mb-1">{t('savings')}</span>
          <div className="flex items-center space-x-1">
             <IndianRupee className="w-4 h-4 text-growth-600" />
             <span className="text-xl font-extrabold text-earth-900 tracking-tight">
               {state.savings < 1000 && state.savings > -1000 ? state.savings : `${(state.savings/1000).toFixed(1)}k`}
             </span>
          </div>
        </div>

        {/* Debt Chip */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-white/50 shadow-glass flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className={`absolute top-0 left-0 w-full h-1 ${state.debt > 0 ? 'bg-debt-500' : 'bg-gray-300'}`}></div>
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${state.debt > 0 ? 'text-debt-600' : 'text-gray-500'}`}>{t('debt')}</span>
           <div className="flex items-center space-x-1">
             {state.debt > 0 && <TrendingDown className="w-4 h-4 text-debt-500" />}
             <span className={`text-xl font-extrabold tracking-tight ${state.debt > 0 ? 'text-debt-800' : 'text-gray-400'}`}>
               {state.debt === 0 ? '-' : `${(state.debt/1000).toFixed(1)}k`}
             </span>
          </div>
        </div>

        {/* Happiness Chip */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-white/50 shadow-glass flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform">
           <div className="absolute top-0 left-0 w-full h-1 bg-peach-500"></div>
           <span className="text-[10px] font-bold uppercase text-peach-600 tracking-widest mb-1">{t('happiness')}</span>
           <div className="flex items-center space-x-2">
             <Smile className="w-5 h-5 text-peach-500" />
             <span className="text-xl font-extrabold text-earth-900">{state.happiness}</span>
           </div>
        </div>

        {/* Health Chip */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-white/50 shadow-glass flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform">
           <div className="absolute top-0 left-0 w-full h-1 bg-warmTeal-500"></div>
           <span className="text-[10px] font-bold uppercase text-warmTeal-600 tracking-widest mb-1">{t('health')}</span>
           <div className="flex items-center space-x-2">
             <Heart className="w-5 h-5 text-warmTeal-500 fill-warmTeal-500" />
             <span className="text-xl font-extrabold text-earth-900">{state.health}</span>
           </div>
        </div>

      </div>
    </div>
  );
};
