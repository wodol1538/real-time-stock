import React from 'react';
import { OrderBook as OrderBookType } from '../types';

export const OrderBookStrip: React.FC<{ data: OrderBookType | null }> = ({ data }) => {
  if (!data) return <div className="h-20 bg-surface animate-pulse" />;

  const maxSize = Math.max(
    ...data.asks.map(a => a.amount),
    ...data.bids.map(b => b.amount)
  );
  
  const spread = (data.asks[data.asks.length - 1].price - data.bids[0].price).toFixed(2);

  return (
    <div className="bg-surface border-t border-border px-5 py-2 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
      <div className="flex flex-col gap-1 text-right">
        {data.asks.slice(-3).map((ask, i) => (
          <div key={i} className="flex justify-between text-[11px] py-0.5 relative gap-3">
            <div 
              className="absolute right-0 top-0 bottom-0 bg-red-500/10 -z-10" 
              style={{ width: `${(ask.amount / maxSize) * 100}%` }}
            />
            <span className="text-red-500 font-mono">${ask.price.toFixed(2)}</span>
            <span className="text-muted font-mono">{ask.amount.toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-[9px] text-muted tracking-[1.5px] mb-1">SPREAD</div>
        <div className="text-xs text-gold font-semibold font-mono">${spread}</div>
      </div>

      <div className="flex flex-col gap-1">
        {data.bids.slice(0, 3).map((bid, i) => (
          <div key={i} className="flex justify-between text-[11px] py-0.5 relative gap-3">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-green-500/10 -z-10" 
              style={{ width: `${(bid.amount / maxSize) * 100}%` }}
            />
            <span className="text-muted font-mono">{bid.amount.toFixed(0)}</span>
            <span className="text-green-500 font-mono">${bid.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
