import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVectorDB } from '../../context/VectorDBContext';

export default function BenchmarkGraph() {
  const { benchResults } = useVectorDB();

  if (!benchResults) return null;

  const { bruteforceUs, kdtreeUs, hnswUs } = benchResults;

  // Format data for Recharts
  const data = [
    { name: 'Brute Force', latency: bruteforceUs },
    { name: 'KD-Tree', latency: kdtreeUs },
    { name: 'HNSW', latency: hnswUs }
  ];

  const fastAlgo = data.reduce((prev, curr) => (prev.latency < curr.latency ? prev : curr)).name;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-[#333] p-3 rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            <p className="text-[10px] text-textMuted uppercase tracking-widest">{payload[0].payload.name}</p>
          </div>
          <p className="text-lg text-textMain font-mono font-medium">{payload[0].value.toLocaleString()} <span className="text-xs text-textMuted font-sans">µs</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl p-4 mt-4 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] relative overflow-hidden group">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded bg-[#27c93f]"></div>
          <span className="text-[10px] uppercase tracking-widest text-textMuted">Engine Latency</span>
        </div>
        <div className="text-[10px] font-mono text-textMuted bg-[#111] px-2 py-1 rounded border border-[#222]">
          OPTIMAL: <span className="text-white">{fastAlgo}</span>
        </div>
      </div>

      <div className="w-full h-40 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1}/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#1a1a1a" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 9, textAnchor: 'middle' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) => val.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="stepAfter" 
              dataKey="latency" 
              stroke="#ffffff" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorLatency)" 
              animationDuration={1000}
              activeDot={{ r: 4, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
