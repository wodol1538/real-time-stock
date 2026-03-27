import React, { useEffect, useRef } from 'react';

interface TradingChartProps {
  data: number[];
  range: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({ data, range }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);

    const W = canvas.width;
    const H = canvas.height;
    const pad = { t: 10, r: 60, b: 30, l: 10 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    ctx.clearRect(0, 0, W, H);

    const min = Math.min(...data) * 0.9995;
    const max = Math.max(...data) * 1.0005;
    const firstPrice = data[0];
    const lastPrice = data[data.length - 1];
    const isUp = lastPrice >= firstPrice;
    const lineColor = isUp ? '#00d084' : '#ff4757';
    const fillColor = isUp ? 'rgba(0,208,132,0.08)' : 'rgba(255,71,87,0.08)';

    const xScale = (i: number) => pad.l + (i / (data.length - 1)) * cW;
    const yScale = (p: number) => pad.t + cH - ((p - min) / (max - min)) * cH;

    // Grid
    ctx.strokeStyle = '#1c2333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (i / 4) * cH;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + cW, y);
      ctx.stroke();
      
      const price = max - (i / 4) * (max - min);
      ctx.fillStyle = '#7d8590';
      ctx.font = '10px IBM Plex Mono';
      ctx.textAlign = 'right';
      ctx.fillText(`$${price.toFixed(2)}`, W - 4, y + 4);
    }

    // Fill
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0]));
    data.forEach((p, i) => { if (i > 0) ctx.lineTo(xScale(i), yScale(p)); });
    ctx.lineTo(xScale(data.length - 1), pad.t + cH);
    ctx.lineTo(xScale(0), pad.t + cH);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0]));
    data.forEach((p, i) => { if (i > 0) ctx.lineTo(xScale(i), yScale(p)); });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Current price dot
    const lx = xScale(data.length - 1);
    const ly = yScale(lastPrice);
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // Glow
    ctx.beginPath();
    ctx.arc(lx, ly, 6, 0, Math.PI * 2);
    ctx.fillStyle = isUp ? 'rgba(0,208,132,0.2)' : 'rgba(255,71,87,0.2)';
    ctx.fill();

    return () => window.removeEventListener('resize', resize);
  }, [data, range]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
