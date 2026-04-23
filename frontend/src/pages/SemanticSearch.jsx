import React, { useState } from 'react';
import { vectorSearch } from '../services/api';
import { Search as SearchIcon, Cpu, Zap, Hash } from 'lucide-react';

export default function SemanticSearch() {
  const [vectorInput, setVectorInput] = useState('0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1');
  const [algo, setAlgo] = useState('hnsw');
  const [metric, setMetric] = useState('cosine');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const vec = vectorInput.split(',').map(v => parseFloat(v.trim()));
      const res = await vectorSearch(vec, 5, metric, algo);
      setResults(res);
    } catch (err) {
      alert('Search failed. Ensure vector has exactly 16 dimensions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Semantic Search (Raw Vectors)</h1>
        <p className="text-textMuted mt-1">Test the raw C++ engine search capabilities</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-textMuted mb-2">Query Vector (16D CSV)</label>
            <input 
              type="text" 
              value={vectorInput}
              onChange={(e) => setVectorInput(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Algorithm</label>
            <select 
              value={algo} onChange={(e) => setAlgo(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              <option value="hnsw">HNSW (Graph)</option>
              <option value="kdtree">KD-Tree</option>
              <option value="bruteforce">Brute Force</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Metric</label>
            <select 
              value={metric} onChange={(e) => setMetric(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              <option value="cosine">Cosine</option>
              <option value="euclidean">Euclidean</option>
              <option value="manhattan">Manhattan</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center w-full md:w-auto"
        >
          {loading ? <span className="animate-pulse">Searching...</span> : <><SearchIcon className="w-4 h-4 mr-2" /> Execute Search</>}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-textMuted">
            <span>Found {results.results.length} results</span>
            <span className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full">
              <Zap className="w-3 h-3 mr-1" /> Latency: {results.latencyUs} µs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.results.map((r, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-background text-textMuted text-xs font-mono px-2 py-1 rounded border border-border flex items-center">
                    <Hash className="w-3 h-3 mr-1" /> ID: {r.id}
                  </span>
                  <span className="text-secondary text-sm font-semibold">Dist: {r.distance.toFixed(4)}</span>
                </div>
                <h4 className="text-white font-medium line-clamp-2 mb-2">{r.metadata}</h4>
                <span className="inline-block px-2 py-1 bg-background text-textMuted text-xs rounded border border-border">
                  {r.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
