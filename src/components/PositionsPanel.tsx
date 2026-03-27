import React from 'react';
import { Position } from '../types';
import { cn } from '../lib/utils';

interface PositionsPanelProps {
  positions: Position[];
  prices: Record<string, number>;
}

export const PositionsPanel: React.FC<PositionsPanelProps> = ({ positions, prices }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-3 pb-2 border-b border-border text-[10px] tracking-[2px] text-muted font-semibold uppercase">
        POSITIONS
      </div>
      {positions.length === 0 ? (
        <div className="p-5 text-muted text-[11px] text-center font-mono">No open positions</div>
      ) : (
        positions.map((pos, i) => {
          const curr = prices[pos.symbol] || pos.avgPrice;
          const pnl = (curr - pos.avgPrice) * pos.amount;
          const pnlPct = ((pnl / (pos.avgPrice * pos.amount)) * 100).toFixed(2);
          const isPos = pnl >= 0;

          return (
            <div key={i} className="p-2.5 px-3.5 border-b border-border hover:bg-surface2 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold tracking-[1px] font-mono">{pos.symbol}</span>
                <span className="text-[9px] tracking-[1px] px-1.5 py-0.5 rounded bg-green-dim text-green uppercase font-mono">LONG</span>
              </div>
              <div className="flex justify-between text-muted text-[10px] font-mono">
                <span>{pos.amount.toFixed(2)} shares @ ${pos.avgPrice.toFixed(2)}</span>
                <span>Curr: ${curr.toFixed(2)}</span>
              </div>
              <div className={cn(
                "text-xs font-semibold mt-1 text-right font-mono",
                isPos ? "text-green" : "text-red"
              )}>
                {isPos ? '+' : ''}${pnl.toFixed(2)} ({isPos ? '+' : ''}{pnlPct}%)
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
