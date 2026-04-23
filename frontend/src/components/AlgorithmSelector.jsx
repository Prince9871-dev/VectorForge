import React from 'react';
import { useVectorDB } from '../context/VectorDBContext';

export default function AlgorithmSelector() {
  const { algo, setAlgo } = useVectorDB();

  return (
    <div>
      <div className="vdb-sec">Algorithm</div>
      <div className="algo-row">
        <div 
          className={`algo-btn ${algo === 'hnsw' ? 'on' : ''}`} 
          onClick={() => setAlgo('hnsw')}
        >HNSW</div>
        <div 
          className={`algo-btn ${algo === 'kdtree' ? 'on' : ''}`} 
          onClick={() => setAlgo('kdtree')}
        >KD-TREE</div>
        <div 
          className={`algo-btn ${algo === 'bruteforce' ? 'on' : ''}`} 
          onClick={() => setAlgo('bruteforce')}
        >BRUTE</div>
      </div>
    </div>
  );
}
