import React from 'react';
import { UserPortfolio } from '../types';
import { cn } from '../lib/utils';

interface PortfolioBarProps {
  portfolio: UserPortfolio;
  prices: Record<string, number>;
}

export const PortfolioBar: React.FC<PortfolioBarProps> = ({ portfolio, prices }) => {
  const posValue = portfolio.positions.reduce((acc, pos) => acc + (prices[pos.symbol] || pos.avgPrice) * pos.amount, 0);
  const total = portfolio.balance + posValue;
  const totalPnl = portfolio.positions.reduce((acc, pos) => acc + ((prices[pos.symbol] || pos.avgPrice) - pos.avgPrice) * pos.amount, 0);
  const isPos = totalPnl >= 0;

  return (
    <div className="p-3.5 border-t border-border bg-surface">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-muted uppercase tracking-wider">PORTFOLIO VALUE</span>
        <span className="text-[13px] font-bold font-mono">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-muted uppercase tracking-wider">CASH AVAILABLE</span>
        <span className="text-[13px] font-bold font-mono">${portfolio.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-muted uppercase tracking-wider">TOTAL P&L</span>
        <span className={cn(
          "text-[11px] font-bold font-mono",
          isPos ? "text-green" : "text-red"
        )}>
          {isPos ? '+' : ''}${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
