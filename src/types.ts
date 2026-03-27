export interface Asset {
  sym: string;
  name: string;
  price: number;
  vol: number;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface Position {
  symbol: string;
  amount: number;
  avgPrice: number;
}

export interface UserPortfolio {
  balance: number;
  positions: Position[];
}
