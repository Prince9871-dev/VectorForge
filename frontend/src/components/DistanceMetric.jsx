import React from 'react';
import { useVectorDB } from '../context/VectorDBContext';

export default function DistanceMetric() {
  const { metric, setMetric } = useVectorDB();

  return (
    <div>
      <div className="vdb-sec">Distance Metric</div>
      <select 
        className="vdb-select"
        value={metric} 
        onChange={e => setMetric(e.target.value)}
      >
        <option value="cosine">Cosine Similarity</option>
        <option value="euclidean">Euclidean Distance</option>
        <option value="manhattan">Manhattan Distance</option>
      </select>
    </div>
  );
}
