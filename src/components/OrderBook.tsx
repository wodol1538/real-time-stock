import React from 'react';
import { OrderBook as OrderBookType } from '../types';

export const OrderBook: React.FC<{ data: OrderBookType | null }> = ({ data }) => {
  if (!data) return <div className="animate-pulse bg-[#151619] h-full rounded-lg"></div>;

  return (
    <div className="bg-[#151619] border border-[#2A2D35] rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-[#8E9299] font-mono text-xs uppercase tracking-wider mb-4">Order Book</h3>
      
      <div className="grid grid-cols-3 text-[10px] text-[#4A4D55] uppercase font-mono mb-2">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Sells) */}
        <div className="flex flex-col-reverse mb-2">
          {data.asks.slice(-10).map((ask, i) => (
            <div key={i} className="grid grid-cols-3 text-[11px] font-mono py-0.5 relative group cursor-pointer hover:bg-red-500/5">
              <span className="text-red-500">{ask.price.toFixed(2)}</span>
              <span className="text-right text-white">{ask.amount.toFixed(4)}</span>
              <span className="text-right text-[#8E9299]">{ask.total.toFixed(2)}</span>
              <div 
                className="absolute right-0 top-0 bottom-0 bg-red-500/10 -z-10" 
                style={{ width: `${(ask.total / data.asks[0].total) * 100}%` }}
              />
            </div>
          ))}
        </div>

        <div className="py-2 border-y border-[#2A2D35] my-2 text-center">
          <span className="text-white font-mono text-sm">{data.asks[data.asks.length-1].price.toFixed(2)}</span>
        </div>

        {/* Bids (Buys) */}
        <div className="flex flex-col">
          {data.bids.slice(0, 10).map((bid, i) => (
            <div key={i} className="grid grid-cols-3 text-[11px] font-mono py-0.5 relative group cursor-pointer hover:bg-green-500/5">
              <span className="text-green-500">{bid.price.toFixed(2)}</span>
              <span className="text-right text-white">{bid.amount.toFixed(4)}</span>
              <span className="text-right text-[#8E9299]">{bid.total.toFixed(2)}</span>
              <div 
                className="absolute right-0 top-0 bottom-0 bg-green-500/10 -z-10" 
                style={{ width: `${(bid.total / data.bids[data.bids.length-1].total) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
