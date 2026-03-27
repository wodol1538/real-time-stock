import React from 'react';
import { Trade } from '../types';
import { format } from 'date-fns';

export const TradeHistory: React.FC<{ trades: Trade[] }> = ({ trades }) => {
  return (
    <div className="bg-[#151619] border border-[#2A2D35] rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-[#8E9299] font-mono text-xs uppercase tracking-wider mb-4">Recent Trades</h3>
      
      <div className="grid grid-cols-3 text-[10px] text-[#4A4D55] uppercase font-mono mb-2">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        {trades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-3 text-[11px] font-mono py-0.5">
            <span className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
              {trade.price.toFixed(2)}
            </span>
            <span className="text-right text-white">{trade.amount.toFixed(4)}</span>
            <span className="text-right text-[#4A4D55]">{format(trade.timestamp, 'HH:mm:ss')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
