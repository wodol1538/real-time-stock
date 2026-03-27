import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface OrderFormProps {
  symbol: string;
  price: number;
  onTrade: (side: 'buy' | 'sell', amount: number) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ symbol, price, onTrade }) => {
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [amount, setAmount] = useState<string>('10');
  const [limitPrice, setLimitPrice] = useState<string>('');

  const qty = parseFloat(amount) || 0;
  const currentPrice = orderType === 'market' ? price : (parseFloat(limitPrice) || price);
  const total = qty * currentPrice;

  return (
    <div className="p-3.5 border-b border-border">
      <div className="grid grid-cols-2 gap-1 mb-3">
        <button 
          onClick={() => setTradeMode('buy')}
          className={cn(
            "bg-surface2 border border-border text-muted font-mono text-[11px] p-1.5 rounded transition-all tracking-widest font-semibold",
            tradeMode === 'buy' && "bg-green-500/10 border-green-500 text-green-500"
          )}
        >
          BUY
        </button>
        <button 
          onClick={() => setTradeMode('sell')}
          className={cn(
            "bg-surface2 border border-border text-muted font-mono text-[11px] p-1.5 rounded transition-all tracking-widest font-semibold",
            tradeMode === 'sell' && "bg-red-500/10 border-red-500 text-red-500"
          )}
        >
          SELL
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-2.5">
        {(['market', 'limit', 'stop'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={cn(
              "bg-surface2 border border-border text-muted font-mono text-[9px] p-1.5 rounded transition-all tracking-widest text-center uppercase",
              orderType === type && "border-blue-500 text-blue-500 bg-blue-500/10"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {orderType !== 'market' && (
        <div className="mb-2.5">
          <label className="text-[9px] text-muted tracking-[2px] mb-1 block">PRICE</label>
          <input 
            className="w-full bg-surface2 border border-border text-text font-mono text-[13px] p-2 rounded outline-none focus:border-blue-500 transition-colors"
            type="number" 
            step="0.01" 
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
      )}

      <div className="mb-2.5">
        <label className="text-[9px] text-muted tracking-[2px] mb-1 block">QUANTITY</label>
        <input 
          className="w-full bg-surface2 border border-border text-text font-mono text-[13px] p-2 rounded outline-none focus:border-blue-500 transition-colors"
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
      </div>

      <div className="bg-surface2 rounded p-2 mb-2.5 border border-border space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">EST. PRICE</span>
          <span className="text-text font-mono">${currentPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">TOTAL VALUE</span>
          <span className="text-text font-mono">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">COMMISSION</span>
          <span className="text-text font-mono">$0.00</span>
        </div>
      </div>

      <button 
        onClick={() => onTrade(tradeMode, qty)}
        className={cn(
          "w-full p-2.5 rounded font-mono text-xs font-bold tracking-[2px] transition-all uppercase",
          tradeMode === 'buy' ? "bg-green-500 text-black hover:bg-[#00f09a]" : "bg-red-500 text-white hover:bg-[#ff6b6b]"
        )}
      >
        PLACE {tradeMode} ORDER
      </button>
    </div>
  );
};
