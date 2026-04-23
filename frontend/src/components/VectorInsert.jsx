import React, { useState } from 'react';
import { useVectorDB } from '../context/VectorDBContext';
import { textToEmbedding } from '../utils/pca';

export default function VectorInsert() {
  const { api, loadItems, loadHnswInfo } = useVectorDB();
  const [meta, setMeta] = useState('');
  const [cat, setCat] = useState('cs');

  const handleInsert = async () => {
    if (!meta.trim()) return;
    const emb = textToEmbedding(meta + ' ' + cat);
    try {
      await api.post('/api/v1/search/insert', {
        metadata: meta,
        category: cat,
        embedding: emb
      });
      setMeta('');
      await loadItems();
      await loadHnswInfo();
    } catch (err) {
      console.error('Insert failed', err);
    }
  };

  return (
    <div>
      <div className="vdb-sec">Insert Demo Vector</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <input 
          type="text" 
          className="vdb-input"
          placeholder="Description..." 
          value={meta}
          onChange={e => setMeta(e.target.value)}
        />
        <select 
          className="vdb-select"
          value={cat}
          onChange={e => setCat(e.target.value)}
        >
          <option value="cs">CS / Algorithms</option>
          <option value="math">Mathematics</option>
          <option value="food">Food &amp; Cooking</option>
          <option value="sports">Sports &amp; Games</option>
        </select>
        <button className="vdb-btn vdb-btn-s" onClick={handleInsert}>+ INSERT</button>
      </div>
    </div>
  );
}
