import React, { useState, useEffect } from 'react';
import { Asset } from '../types';

interface HeaderProps {
  assets: Asset[];
  prices: Record<string, number>;
  opens: Record<string, number>;
}

export const Header: React.FC<HeaderProps> = ({ assets, prices, opens }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-surface border-b border-border h-11 flex items-center px-4 gap-6 relative shrink-0">
      <div className="text-sm font-bold tracking-[4px] text-text whitespace-nowrap">
        APE<span className="text-green">X</span>
      </div>
      
      <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]">
        <div className="flex gap-8 animate-ticker w-max">
          {[...assets, ...assets].map((asset, i) => {
            const price = prices[asset.sym] || asset.price;
            const open = opens[asset.sym] || asset.price;
            const chg = ((price - open) / open * 100).toFixed(2);
            const isUp = price >= open;
            
            return (
              <div key={i} className="flex gap-2 items-center whitespace-nowrap text-[11px] font-mono">
                <span className="text-muted font-semibold">{asset.sym}</span>
                <span className="text-text">${price.toFixed(2)}</span>
                <span className={isUp ? "text-green" : "text-red"}>
                  {isUp ? '▲' : '▼'}{Math.abs(parseFloat(chg))}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 items-center ml-auto shrink-0">
        <div className="w-1.5 h-1.5 bg-green rounded-full shadow-[0_0_6px_var(--green)] animate-status-pulse" />
        <div className="text-[11px] text-muted tracking-widest font-mono">
          {time.toLocaleTimeString('en-GB', { hour12: false })}
        </div>
      </div>
    </header>
  );
};
