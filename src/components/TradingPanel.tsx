import React, { useState } from 'react';

export const TradingPanel: React.FC<{ symbol: string; price: number; onTrade: (side: 'buy' | 'sell', amount: number) => void }> = ({ symbol, price, onTrade }) => {
  const [amount, setAmount] = useState<string>('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  const total = amount ? parseFloat(amount) * price : 0;

  return (
    <div className="bg-[#151619] border border-[#2A2D35] rounded-lg p-6">
      <div className="flex gap-1 mb-6 p-1 bg-[#0A0B0D] rounded-md">
        <button 
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 rounded text-xs font-mono uppercase tracking-widest transition-all ${side === 'buy' ? 'bg-green-500 text-black font-bold' : 'text-[#8E9299] hover:text-white'}`}
        >
          Buy
        </button>
        <button 
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 rounded text-xs font-mono uppercase tracking-widest transition-all ${side === 'sell' ? 'bg-red-500 text-black font-bold' : 'text-[#8E9299] hover:text-white'}`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] text-[#4A4D55] uppercase font-mono mb-1">Price</label>
          <div className="relative">
            <input 
              type="text" 
              readOnly 
              value={price.toFixed(2)}
              className="w-full bg-[#0A0B0D] border border-[#2A2D35] rounded p-3 text-white font-mono text-sm focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4D55] text-[10px] font-mono">USDT</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-[#4A4D55] uppercase font-mono mb-1">Amount</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0A0B0D] border border-[#2A2D35] rounded p-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4D55] text-[10px] font-mono">{symbol}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#2A2D35]">
          <div className="flex justify-between text-[10px] font-mono text-[#8E9299] mb-2 uppercase">
            <span>Total</span>
            <span className="text-white">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <button 
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={() => {
              onTrade(side, parseFloat(amount));
              setAmount('');
            }}
            className={`w-full py-4 rounded font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${side === 'buy' ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-red-500 hover:bg-red-400 text-black'}`}
          >
            {side} {symbol}
          </button>
        </div>
      </div>
    </div>
  );
};
