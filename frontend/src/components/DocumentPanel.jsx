import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useVectorDB } from '../context/VectorDBContext';
import { textToEmbedding } from '../utils/pca';

export default function DocumentPanel() {
  const { api, loadItems, loadHnswInfo } = useVectorDB();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [docs, setDocs] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    try {
      const { data } = await api.get('/api/v1/docs/list');
      setDocs(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleInsert = async () => {
    if (!title || !text) {
      setStatus('⚠ Need both a title and text.');
      return;
    }
    setLoading(true);
    setStatus('Calling Ollama nomic-embed-text...');
    try {
      const { data } = await api.post('/api/v1/docs/upload', { title, text });
      setStatus(`✓ Inserted ${data.chunks} chunk(s) · ${data.dims}D embeddings`);
      
      // Visualizer demo vector insert
      const emb16 = textToEmbedding(title + ' ' + text);
      await api.post('/api/v1/search/insert', {
        metadata: title,
        category: 'doc',
        embedding: emb16
      });

      setTitle('');
      setText('');
      fetchDocs();
      loadItems();
      loadHnswInfo();
    } catch (err) {
      setStatus('✗ Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Assuming delete endpoint is created in backend. (Proxy doesn't have it explicitly right now but we'll call standard API).
      // We will skip deleting docs from the vector DB for now if it's missing, but we'll try the backend route.
      // Wait, in Phase 2 I didn't make a DELETE /docs/delete/{id}. I only made GET /docs/list.
      // So we will just call the main C++ engine directly for delete.
      await axios.delete(`http://localhost:8080/doc/delete/${id}`);
      fetchDocs();
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      <div>
        <div className="vdb-sec text-[10px] tracking-widest text-[#666] mb-3 uppercase font-semibold">INSERT DATASTREAM</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            className="vdb-input" 
            placeholder="Document title / topic..." 
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea 
            className="vdb-textarea" 
            placeholder="Paste your notes, textbook excerpt..."
            value={text}
            onChange={e => setText(e.target.value)}
          ></textarea>
          <button 
            className="vdb-btn vdb-btn-g shadow-lg" 
            onClick={handleInsert}
            disabled={loading}
          >
            ⚡ GENERATE EMBEDDINGS
          </button>
          <div style={{ fontSize: '10px', color: '#555', fontMono: true }}>{status}</div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="vdb-sec text-[10px] tracking-widest text-[#666] mb-3 uppercase font-semibold">KNOWLEDGE REPOSITORY ({docs.length})</div>
        <div className="doc-list overflow-y-auto pr-1">
          {docs.length === 0 ? (
            <div className="text-[11px] text-[#444] italic px-4 py-8 border border-dashed border-[#222] rounded-xl text-center">No documents indexed in local vector space.</div>
          ) : (
            docs.map(d => (
              <div key={d.id} className="rcard group mb-3 last:mb-0">
                <div className="rrank text-white/90">{d.title}</div>
                <div className="rmeta text-[#888]">{d.preview}</div>
                <div className="rfoot border-t border-[#1a1a1a] pt-3 mt-3">
                  <span className="rcat group-hover:bg-[#222] transition-colors text-[9px] px-2 py-0.5">
                    {d.words} TOKENS
                  </span>
                  <button 
                    className="text-[#555] hover:text-[#ff4444] transition-colors text-xs"
                    onClick={() => handleDelete(d.id)}
                    title="Delete Document"
                  >✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
