import React from 'react';
import { Asset } from '../types';
import { cn } from '../lib/utils';

interface WatchlistProps {
  assets: Asset[];
  prices: Record<string, number>;
  opens: Record<string, number>;
  history: Record<string, number[]>;
  selected: string;
  onSelect: (sym: string) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({ assets, prices, opens, history, selected, onSelect }) => {
  return (
    <div className="bg-surface border-r border-border flex flex-col overflow-hidden">
      <div className="p-3 pb-2 border-b border-border text-[10px] tracking-[2px] text-muted font-semibold uppercase">
        WATCHLIST
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {assets.map((asset) => {
          const price = prices[asset.sym] || asset.price;
          const open = opens[asset.sym] || asset.price;
          const chg = price - open;
          const pct = ((chg / open) * 100).toFixed(2);
          const isUp = chg >= 0;
          const hist = history[asset.sym]?.slice(-20) || [];

          return (
            <div 
              key={asset.sym}
              onClick={() => onSelect(asset.sym)}
              className={cn(
                "p-3 border-b border-border cursor-pointer transition-colors relative hover:bg-surface2",
                selected === asset.sym && "bg-surface2 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-green"
              )}
            >
              <div className="text-[13px] font-bold text-text tracking-[1px]">{asset.sym}</div>
              <div className="text-[10px] text-muted mt-0.5 truncate">{asset.name}</div>
              <div className="flex justify-between items-end mt-1.5">
                <span className="text-[13px] font-semibold text-text font-mono">${price.toFixed(2)}</span>
                <span className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono",
                  isUp ? "text-green bg-green-dim" : "text-red bg-red-dim"
                )}>
                  {isUp ? '+' : ''}{pct}%
                </span>
              </div>
              <svg className="mt-1.5 h-5 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                {hist.length > 1 && (
                  <polyline 
                    points={hist.map((p, j) => {
                      const min = Math.min(...hist);
                      const max = Math.max(...hist);
                      const x = (j / (hist.length - 1)) * 100;
                      const y = max === min ? 10 : 20 - ((p - min) / (max - min)) * 18;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none" 
                    stroke={isUp ? '#00d084' : '#ff4757'} 
                    strokeWidth="1.5" 
                    opacity="0.8"
                  />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
