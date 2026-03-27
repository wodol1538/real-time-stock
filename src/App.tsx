import React, { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Toaster, toast } from 'sonner';
import { Header } from './components/Header';
import { Watchlist } from './components/Watchlist';
import { TradingChart } from './components/TradingChart';
import { OrderBookStrip } from './components/OrderBookStrip';
import { OrderForm } from './components/OrderForm';
import { PositionsPanel } from './components/PositionsPanel';
import { PortfolioBar } from './components/PortfolioBar';
import { Asset, Trade, OrderBook as OrderBookType, UserPortfolio } from './types';
import { cn } from './lib/utils';

const INITIAL_ASSETS: Asset[] = [
  { sym: 'AAPL', name: 'Apple Inc.', price: 184.32, vol: 52.4 },
  { sym: 'TSLA', name: 'Tesla Inc.', price: 248.17, vol: 98.1 },
  { sym: 'NVDA', name: 'NVIDIA Corp.', price: 875.43, vol: 41.2 },
  { sym: 'AMZN', name: 'Amazon.com Inc.', price: 178.92, vol: 38.7 },
  { sym: 'MSFT', name: 'Microsoft Corp.', price: 420.55, vol: 28.3 },
  { sym: 'GOOGL', name: 'Alphabet Inc.', price: 159.86, vol: 24.6 },
  { sym: 'META', name: 'Meta Platforms', price: 502.31, vol: 19.8 },
  { sym: 'AMD', name: 'Adv. Micro Devices', price: 168.44, vol: 67.5 },
  { sym: 'NFLX', name: 'Netflix Inc.', price: 631.20, vol: 12.1 },
  { sym: 'COIN', name: 'Coinbase Global', price: 224.75, vol: 31.4 },
];

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [opens, setOpens] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [orderBook, setOrderBook] = useState<Record<string, OrderBookType>>({});
  const [chartRange, setChartRange] = useState('1m');
  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    balance: 10000,
    positions: []
  });

  const priceRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('price_update', (data: { symbol: string; price: number }) => {
      setPrices(prev => {
        const newPrices = { ...prev, [data.symbol]: data.price };
        priceRef.current = newPrices;
        return newPrices;
      });
      
      setHistory(prev => {
        const currentHist = prev[data.symbol] || [];
        const newHist = [...currentHist, data.price];
        if (newHist.length > 240) return { ...prev, [data.symbol]: newHist.slice(1) };
        return { ...prev, [data.symbol]: newHist };
      });

      setOpens(prev => {
        if (!prev[data.symbol]) return { ...prev, [data.symbol]: data.price };
        return prev;
      });
    });

    newSocket.on('order_book', (data: { symbol: string } & OrderBookType) => {
      const { symbol, ...book } = data;
      setOrderBook(prev => ({ ...prev, [symbol]: book }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleTrade = useCallback((side: 'buy' | 'sell', amount: number) => {
    const price = priceRef.current[selectedSymbol] || INITIAL_ASSETS.find(a => a.sym === selectedSymbol)!.price;
    const cost = amount * price;

    if (side === 'buy') {
      if (portfolio.balance < cost) {
        toast.error('Insufficient balance');
        return;
      }
      setPortfolio(prev => {
        const existing = prev.positions.find(p => p.symbol === selectedSymbol);
        const newPositions = existing
          ? prev.positions.map(p => p.symbol === selectedSymbol 
              ? { ...p, amount: p.amount + amount, avgPrice: (p.avgPrice * p.amount + cost) / (p.amount + amount) }
              : p)
          : [...prev.positions, { symbol: selectedSymbol, amount, avgPrice: price }];
        
        toast.success(`BUY ${amount} ${selectedSymbol}`, {
          description: `@ $${price.toFixed(2)} · Total: $${cost.toFixed(2)}`,
          className: "bg-surface2 border-l-4 border-green text-text",
        });

        return {
          balance: prev.balance - cost,
          positions: newPositions
        };
      });
    } else {
      const existing = portfolio.positions.find(p => p.symbol === selectedSymbol);
      if (!existing || existing.amount < amount) {
        toast.error('Insufficient position');
        return;
      }
      setPortfolio(prev => {
        toast.success(`SELL ${amount} ${selectedSymbol}`, {
          description: `@ $${price.toFixed(2)} · Total: $${cost.toFixed(2)}`,
          className: "bg-surface2 border-l-4 border-red text-text",
        });

        return {
          balance: prev.balance + cost,
          positions: prev.positions.map(p => p.symbol === selectedSymbol 
            ? { ...p, amount: p.amount - amount }
            : p).filter(p => p.amount > 0)
        };
      });
    }
  }, [selectedSymbol, portfolio]);

  const selectedAsset = INITIAL_ASSETS.find(a => a.sym === selectedSymbol)!;
  const currentPrice = prices[selectedSymbol] || selectedAsset.price;
  const openPrice = opens[selectedSymbol] || selectedAsset.price;
  const chg = currentPrice - openPrice;
  const pct = ((chg / openPrice) * 100).toFixed(2);
  const isUp = chg >= 0;

  return (
    <div className="flex flex-col h-screen bg-bg text-text font-mono overflow-hidden">
      <Toaster position="bottom-right" theme="dark" expand={true} richColors />
      
      <Header assets={INITIAL_ASSETS} prices={prices} opens={opens} />

      <div className="flex-1 grid grid-cols-[200px_1fr_280px] overflow-hidden">
        {/* WATCHLIST */}
        <Watchlist 
          assets={INITIAL_ASSETS} 
          prices={prices} 
          opens={opens} 
          history={history} 
          selected={selectedSymbol}
          onSelect={setSelectedSymbol}
        />

        {/* CENTER */}
        <div className="flex flex-col overflow-hidden bg-bg">
          <div className="bg-surface border-b border-border p-3 px-5 flex items-center gap-6">
            <div>
              <div className="text-[22px] font-bold tracking-[2px]">{selectedSymbol}</div>
              <div className="text-[11px] text-muted mt-0.5">{selectedAsset.name}</div>
            </div>
            <div>
              <div className={cn(
                "text-[28px] font-bold font-mono transition-colors duration-300",
                isUp ? "text-green" : "text-red"
              )}>
                ${currentPrice.toFixed(2)}
              </div>
              <div className={cn(
                "text-[13px] font-semibold font-mono",
                isUp ? "text-green" : "text-red"
              )}>
                {isUp ? '+' : ''}${chg.toFixed(2)} ({isUp ? '+' : ''}{pct}%)
              </div>
            </div>
            <div className="flex gap-5 ml-auto">
              <div className="text-center">
                <div className="text-[9px] text-muted tracking-[1.5px] mb-1 uppercase">OPEN</div>
                <div className="text-xs font-semibold font-mono">${openPrice.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-muted tracking-[1.5px] mb-1 uppercase">HIGH</div>
                <div className="text-xs font-semibold font-mono">${(Math.max(...(history[selectedSymbol] || [currentPrice]))).toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-muted tracking-[1.5px] mb-1 uppercase">LOW</div>
                <div className="text-xs font-semibold font-mono">${(Math.min(...(history[selectedSymbol] || [currentPrice]))).toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-muted tracking-[1.5px] mb-1 uppercase">VOL</div>
                <div className="text-xs font-semibold font-mono">{selectedAsset.vol}M</div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative p-4 px-5 overflow-hidden flex flex-col">
            <div className="flex gap-1.5 mb-3">
              {['1m', '5m', '15m', '1h', '1d'].map(r => (
                <button 
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={cn(
                    "bg-transparent border border-border text-muted font-mono text-[10px] px-2 py-1 rounded transition-all tracking-wider hover:border-blue hover:text-blue",
                    chartRange === r && "border-green text-green bg-green-dim"
                  )}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <TradingChart data={history[selectedSymbol] || []} range={chartRange} />
            </div>
          </div>

          <OrderBookStrip data={orderBook[selectedSymbol]} />
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-surface border-l border-border flex flex-col overflow-hidden">
          <OrderForm 
            symbol={selectedSymbol} 
            price={currentPrice} 
            onTrade={handleTrade} 
          />
          
          <PositionsPanel positions={portfolio.positions} prices={prices} />
          
          <PortfolioBar portfolio={portfolio} prices={prices} />
        </div>
      </div>
    </div>
  );
}
