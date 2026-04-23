import React, { useState } from 'react';
import { useVectorDB } from '../context/VectorDBContext';
import { textToEmbedding } from '../utils/pca';

export default function BenchmarkPanel() {
  const { api, metric, setBenchResults } = useVectorDB();
  const [loading, setLoading] = useState(false);

  const runBenchmark = async () => {
    // Default fallback to text 'binary tree algorithm' if we don't have a specific text input box here.
    // The original UI used the query input box for the benchmark.
    const emb = textToEmbedding('binary tree algorithm');
    
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/benchmark/run', {
        vector: emb,
        k: 5,
        metric: metric
      });
      setBenchResults(data);
    } catch (err) {
      console.error('Benchmark failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="vdb-sec">Benchmark</div>
      <button 
        className="vdb-btn vdb-btn-s" 
        onClick={runBenchmark}
        disabled={loading}
      >
        {loading ? 'Running...' : '▶ COMPARE ALL ALGOS'}
      </button>
    </div>
  );
}
