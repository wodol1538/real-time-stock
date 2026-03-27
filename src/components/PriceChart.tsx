import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface PricePoint {
  time: number;
  price: number;
}

export const PriceChart: React.FC<{ symbol: string; currentPrice: number }> = ({ symbol, currentPrice }) => {
  const [data, setData] = useState<PricePoint[]>([]);

  useEffect(() => {
    setData(prev => {
      const newData = [...prev, { time: Date.now(), price: currentPrice }];
      if (newData.length > 50) return newData.slice(1);
      return newData;
    });
  }, [currentPrice]);

  return (
    <div className="h-[400px] w-full bg-[#151619] border border-[#2A2D35] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#8E9299] font-mono text-xs uppercase tracking-wider">{symbol} / USDT</h3>
        <span className="text-white font-mono text-lg">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2D35" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right"
            stroke="#4A4D55"
            fontSize={10}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1B1E', border: '1px solid #2A2D35', fontSize: '12px' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#00FF00" 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
