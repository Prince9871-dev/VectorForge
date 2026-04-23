import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { pca2D } from '../utils/pca';

const API = 'https://vectorforge-backend.onrender.com';
const api = axios.create({ baseURL: API });

const VectorDBContext = createContext();

export function VectorDBProvider({ children }) {
  const [allItems, setAllItems] = useState([]);
  const [pcaPoints, setPcaPoints] = useState([]);
  const [bounds, setBounds] = useState({ minX: -1, maxX: 1, minY: -1, maxY: 1 });
  const [hitIds, setHitIds] = useState(new Set());
  const [queryPt, setQueryPt] = useState(null);
  const [hoverItem, setHoverItem] = useState(null);
  
  const [algo, setAlgo] = useState('hnsw');
  const [metric, setMetric] = useState('cosine');
  const [topK, setTopK] = useState(5);
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchLatency, setSearchLatency] = useState(0);
  
  const [hnswInfo, setHnswInfo] = useState(null);
  const [benchResults, setBenchResults] = useState(null);
  
  const loadItems = async () => {
    try {
      // The FastAPI /search/items returns the items
      const { data } = await api.get('/api/v1/search/items');
      setAllItems(data);
      if (data.length >= 2) {
        const coords = pca2D(data.map(v => v.embedding));
        const pts = data.map((item, i) => ({ x: coords[i][0], y: coords[i][1], item }));
        setPcaPoints(pts);
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const p of pts) {
          x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x);
          y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
        }
        const px = (x1 - x0) * 0.18 || 0.1;
        const py = (y1 - y0) * 0.18 || 0.1;
        setBounds({ minX: x0 - px, maxX: x1 + px, minY: y0 - py, maxY: y1 + py });
      }
    } catch (err) {
      console.error('Failed to load items', err);
    }
  };

  const loadHnswInfo = async () => {
    try {
      // Actually we don't have an endpoint for hnsw-info in the FastAPI backend!
      // But we proxy to it in cpp_client if we added it, but I didn't add it in Phase 2.
      // For now, we will fetch directly from port 8080 or ignore if not proxied.
      const { data } = await axios.get('https://vectorforge-backend.onrender.com/hnsw-info');
      setHnswInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadItems();
    loadHnswInfo();
  }, []);

  const val = {
    API, api,
    allItems, pcaPoints, bounds,
    hitIds, setHitIds,
    queryPt, setQueryPt,
    hoverItem, setHoverItem,
    algo, setAlgo,
    metric, setMetric,
    topK, setTopK,
    searchResults, setSearchResults,
    searchLatency, setSearchLatency,
    hnswInfo, loadHnswInfo,
    benchResults, setBenchResults,
    loadItems
  };

  return (
    <VectorDBContext.Provider value={val}>
      {children}
    </VectorDBContext.Provider>
  );
}

export function useVectorDB() {
  return useContext(VectorDBContext);
}
