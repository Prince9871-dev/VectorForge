import React, { useState } from 'react';
import { runBenchmark } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { BarChart3, Zap } from 'lucide-react';

export default function Benchmark() {
  const [vectorInput, setVectorInput] = useState('0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleBenchmark = async () => {
    try {
      setLoading(true);
      const vec = vectorInput.split(',').map(v => parseFloat(v.trim()));
      const res = await runBenchmark(vec, 5, 'cosine');
      
      setData([
        { name: 'Brute Force', latencyUs: res.bruteforceUs, fill: '#EF4444' },
        { name: 'KD-Tree', latencyUs: res.kdtreeUs, fill: '#F59E0B' },
        { name: 'HNSW Graph', latencyUs: res.hnswUs, fill: '#10B981' }
      ]);
    } catch (err) {
      alert('Benchmark failed. Ensure vector has exactly 16 dimensions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-primary" /> Algorithm Benchmark
        </h1>
        <p className="text-textMuted mt-1">Compare latencies across Brute Force, KD-Tree, and HNSW indexes.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-textMuted mb-2">Query Vector (16D CSV)</label>
            <input 
              type="text" 
              value={vectorInput}
              onChange={(e) => setVectorInput(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleBenchmark}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center h-[42px]"
            >
              {loading ? 'Running...' : <><Zap className="w-4 h-4 mr-2" /> Run Test</>}
            </button>
          </div>
        </div>

        {data && (
          <div className="h-96 w-full mt-8 p-4 bg-background border border-border rounded-xl">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#666" 
                  tickLine={false} 
                  axisLine={false} 
                  label={{ value: 'Latency (microseconds)', angle: -90, position: 'insideLeft', fill: '#666' }}
                />
                <Tooltip 
                  cursor={{ fill: '#111' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Bar dataKey="latencyUs" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
