import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Mock data generation
  const assets = [
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

  const generateOrderBook = (basePrice: number) => {
    const bids = [];
    const asks = [];
    for (let i = 0; i < 5; i++) {
      bids.push({
        price: basePrice - (i + 1) * (basePrice * 0.0003),
        amount: Math.floor(Math.random() * 900 + 100),
        total: 0,
      });
      asks.push({
        price: basePrice + (i + 1) * (basePrice * 0.0003),
        amount: Math.floor(Math.random() * 900 + 100),
        total: 0,
      });
    }
    // Calculate totals
    let bidTotal = 0;
    bids.forEach(b => { bidTotal += b.amount; b.total = bidTotal; });
    let askTotal = 0;
    asks.forEach(a => { askTotal += a.amount; a.total = askTotal; });
    
    return { bids, asks: asks.sort((a, b) => b.price - a.price) };
  };

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    const interval = setInterval(() => {
      assets.forEach(asset => {
        // Random price fluctuation
        const change = (Math.random() - 0.48) * (asset.price * 0.0025);
        asset.price += change;
        
        socket.emit("price_update", {
          symbol: asset.sym,
          price: asset.price,
          timestamp: Date.now()
        });

        // Occasional trade
        if (Math.random() > 0.8) {
          socket.emit("new_trade", {
            id: Math.random().toString(36).substr(2, 9),
            symbol: asset.sym,
            price: asset.price,
            amount: Math.random() * 10,
            side: Math.random() > 0.5 ? 'buy' : 'sell',
            timestamp: Date.now()
          });
        }

        // Order book update
        socket.emit("order_book", {
          symbol: asset.sym,
          ...generateOrderBook(asset.price)
        });
      });
    }, 1000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
