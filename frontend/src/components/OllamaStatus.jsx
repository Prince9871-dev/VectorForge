import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OllamaStatus({ setOllamaReady }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/system/status')
      .then(res => {
        setStatus(res.data);
        if (setOllamaReady) setOllamaReady(res.data.ollamaAvailable);
      })
      .catch(console.error);
  }, []);

  if (!status) return <div className="ollama-status">Checking...</div>;

  if (status.ollamaAvailable) {
    return (
      <div>
        <div className="vdb-sec">Ollama Status</div>
        <div className="ollama-status ok">
          <span style={{ color: 'var(--green)' }}>● Online</span><br/>
          Embed: <span style={{ color: 'var(--accent)' }}>{status.embedModel}</span><br/>
          Generate: <span style={{ color: 'var(--accent)' }}>{status.genModel}</span><br/>
          Dims: <span style={{ color: 'var(--muted)' }}>{status.docDims || '(first insert sets this)'}</span><br/>
          Documents: <span style={{ color: 'var(--text)' }}>{status.docCount}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="vdb-sec">Ollama Status</div>
        <div className="ollama-status err">
          <span style={{ color: 'var(--red)' }}>● Offline</span><br/><br/>
          To enable RAG features:<br/>
          <span style={{ color: 'var(--muted)' }}>
            1. Install from ollama.com<br/>
            2. ollama pull nomic-embed-text<br/>
            3. ollama pull llama3.2
          </span>
        </div>
      </div>
    );
  }
}
