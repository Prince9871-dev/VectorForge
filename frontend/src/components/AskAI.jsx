import React, { useState, useRef, useEffect } from 'react';
import { useVectorDB } from '../context/VectorDBContext';
import { textToEmbedding } from '../utils/pca';

export default function AskAI() {
  const { api, pcaPoints, setHitIds, setQueryPt } = useVectorDB();
  const [question, setQuestion] = useState('');
  const [k, setK] = useState(3);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const chatRef = useRef(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion('');
    setLoading(true);

    const newHistory = [...history, { role: 'user', content: q }];
    setHistory(newHistory);

    try {
      const { data } = await api.post('/api/v1/rag/ask', { question: q, top_k: k });
      
      if (data.contexts && data.contexts.length > 0) {
        const newHits = new Set();
        let sx = 0, sy = 0, sw = 0;
        data.contexts.forEach((ctx, i) => {
          const pt = pcaPoints.find(p => p.item.category === 'doc' && ctx.title.startsWith(p.item.metadata));
          if (pt) {
            newHits.add(pt.item.id);
            const w = 1 / (i + 1);
            sx += pt.x * w;
            sy += pt.y * w;
            sw += w;
          }
        });
        setHitIds(newHits);
        if (sw > 0) {
          setQueryPt({ x: sx / sw + (Math.random() - 0.5) * 0.015, y: sy / sw + (Math.random() - 0.5) * 0.015 });
        }
      } else {
        // Fallback hit
        const emb16 = textToEmbedding(q);
        const sr = await api.post('/api/v1/search/query', { vector: emb16, k: 3, metric: 'cosine', algo: 'hnsw' });
        if (sr.data.results && sr.data.results.length > 0) {
          const fbHits = new Set(sr.data.results.map(r => r.id));
          setHitIds(fbHits);
          let sx=0, sy=0, sw=0;
          sr.data.results.forEach((r, i) => {
            const pt = pcaPoints.find(p => p.item.id === r.id);
            if (pt) { const w = 1/(i+1); sx+=pt.x*w; sy+=pt.y*w; sw+=w; }
          });
          if (sw>0) setQueryPt({ x: sx/sw + (Math.random()-.5)*.015, y: sy/sw + (Math.random()-.5)*.015 });
        }
      }

      setHistory([...newHistory, { role: 'assistant', data }]);
    } catch (err) {
      setHistory([...newHistory, { role: 'error', content: 'Server error - backend running?' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history, loading]);

  const toggleCtx = (e) => {
    const el = e.target.nextElementSibling;
    if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      <div>
        <div className="vdb-sec text-[10px] tracking-widest text-[#666] mb-3 uppercase font-semibold">NEURAL QUERY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea 
            className="vdb-textarea" 
            rows="3" 
            placeholder="Ask a semantic question..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleAsk()}
          ></textarea>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select className="vdb-select" style={{ width: '100px', flexShrink: 0 }} value={k} onChange={e => setK(parseInt(e.target.value))}>
              <option value="2">K=2</option>
              <option value="3">K=3</option>
              <option value="5">K=5</option>
            </select>
            <button className="vdb-btn vdb-btn-g shadow-lg" style={{ flex: 1 }} onClick={handleAsk} disabled={loading}>
              🤖 INITIATE RAG
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="vdb-sec text-[10px] tracking-widest text-[#666] mb-3 uppercase font-semibold">INTELLIGENCE FEED</div>
        <div className="chat-history pr-1" ref={chatRef} style={{ flex: 1, overflowY: 'auto' }}>
          {history.length === 0 && (
            <div className="text-[11px] text-[#444] italic px-4 py-12 border border-dashed border-[#222] rounded-xl text-center">Awaiting neural input...</div>
          )}
          {history.map((msg, i) => (
            <div key={i} className="mb-6 last:mb-0">
              {msg.role === 'user' && (
                <div className="chat-q bg-[#111] p-4 rounded-2xl border border-[#222] text-[#fff] text-[13px] mb-4 inline-block max-w-[90%] float-right clear-both shadow-xl">
                  {msg.content}
                </div>
              )}
              {msg.role === 'error' && (
                <div className="chat-a clear-both mb-6 p-4 bg-[#1a0000]/30 border border-[#400] rounded-xl">
                  <div className="chat-a-label text-[10px] tracking-widest text-[#ff4444] mb-1 uppercase font-bold">SYSTEM ERROR</div>
                  <div className="chat-a-text text-[13px] text-[#ff8888]">{msg.content}</div>
                </div>
              )}
              {msg.role === 'assistant' && (
                <div className="chat-a clear-both mb-8">
                  <div className="chat-a-label text-[10px] tracking-widest text-[#666] mb-2 uppercase font-semibold">🤖 {msg.data.model?.toUpperCase() || 'LLM CORE'}</div>
                  <div className="chat-a-text text-[14px] text-[#eee] leading-[1.7] font-light">{msg.data.answer}</div>
                  {msg.data.contexts && msg.data.contexts.length > 0 && (
                    <div className="chat-ctx mt-6 pl-4 border-l border-[#222]">
                      <div className="chat-ctx-label text-[9px] tracking-widest text-[#444] mb-3 uppercase font-bold">SOURCE ATTRIBUTION</div>
                      <div className="flex flex-col gap-3">
                        {msg.data.contexts.map((c, j) => (
                          <div key={j} className="rcard group cursor-pointer transition-all hover:bg-[#0f0f0f]" onClick={toggleCtx}>
                            <div className="rrank text-[10px] text-white/80">REFERENCE #{j+1} • {c.title}</div>
                            <div className="rfoot border-none pt-0 mt-0">
                              <span className="text-[9px] text-[#555] font-mono">SIMILARITY SCORE</span>
                              <span className="rdist text-[#888] font-mono text-[10px]">{(1 - c.distance).toFixed(4)}</span>
                            </div>
                            <div className="ctx-expand text-[12px] text-[#888] mt-3 hidden leading-relaxed border-t border-[#1a1a1a] pt-3">{c.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="clear-both"></div>
          {loading && (
            <div className="thinking text-[#666] text-[11px] italic mb-6 animate-pulse">
              <div className="spinner inline-block mr-3"></div> SYNTHESIZING RESPONSE...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
