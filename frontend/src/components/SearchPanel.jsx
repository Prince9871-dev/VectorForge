import React, { useState } from 'react';
import { useVectorDB } from '../context/VectorDBContext';
import { textToEmbedding } from '../utils/pca';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const { api, algo, metric, topK, setSearchResults, setSearchLatency, pcaPoints, setQueryPt, setHitIds } = useVectorDB();

  const handleSearch = async () => {
    if (!query) return;
    const emb = textToEmbedding(query);
    try {
      const { data } = await api.post('/api/v1/search/query', {
        vector: emb,
        k: topK,
        metric: metric,
        algo: algo
      });
      
      const results = data.results || [];
      setSearchResults(results);
      setSearchLatency(data.latencyUs || 0);
      
      const newHits = new Set(results.map(r => r.id));
      setHitIds(newHits);
      
      if (results.length > 0) {
        let sx = 0, sy = 0, sw = 0;
        for (let i = 0; i < Math.min(3, results.length); i++) {
          const pt = pcaPoints.find(p => p.item.id === results[i].id);
          if (pt) {
            const w = 1 / (i + 1);
            sx += pt.x * w;
            sy += pt.y * w;
            sw += w;
          }
        }
        if (sw > 0) {
          setQueryPt({ x: sx / sw + (Math.random() - 0.5) * 0.015, y: sy / sw + (Math.random() - 0.5) * 0.015 });
        }
      } else {
        setQueryPt(null);
      }
    } catch (err) {
      alert('Cannot reach server.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="vdb-sec">Query (Demo Vectors)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <input 
          type="text" 
          className="vdb-input"
          placeholder="binary tree, sushi, basketball..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="vdb-btn vdb-btn-p" onClick={handleSearch}>⚡ SEARCH</button>
      </div>
    </div>
  );
}
