import React from 'react';
import { useVectorDB } from '../context/VectorDBContext';

export default function TopKSlider() {
  const { topK, setTopK } = useVectorDB();

  return (
    <div>
      <div className="vdb-sec">Top-K: <span>{topK}</span></div>
      <input 
        type="range" 
        className="vdb-range"
        min="1" max="10" 
        value={topK}
        onChange={e => setTopK(parseInt(e.target.value))}
      />
    </div>
  );
}
