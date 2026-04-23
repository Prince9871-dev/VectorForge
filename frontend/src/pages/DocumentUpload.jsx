import React, { useState, useEffect } from 'react';
import { uploadDocument, listDocuments } from '../services/api';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

export default function DocumentUpload() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await listDocuments();
      setDocs(res);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !text) return;
    try {
      setLoading(true);
      const res = await uploadDocument(title, text);
      setSuccess(`Success! Embedded into ${res.chunks} chunks.`);
      setTitle('');
      setText('');
      fetchDocs();
    } catch (err) {
      alert('Upload failed.');
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 5000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Document Management</h1>
        <p className="text-textMuted mt-1">Upload knowledge for the RAG pipeline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleUpload} className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <UploadCloud className="w-5 h-5 mr-2 text-primary" /> Upload New
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">Document Title</label>
                <input 
                  type="text" required
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. Q3 Financial Report"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">Content (Text)</label>
                <textarea 
                  required rows="8"
                  value={text} onChange={e => setText(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="Paste document content here to be embedded and chunked..."
                ></textarea>
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                {loading ? 'Embedding...' : 'Process & Upload'}
              </button>
            </div>

            {success && (
              <div className="mt-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg flex items-center text-secondary text-sm">
                <CheckCircle className="w-4 h-4 mr-2" /> {success}
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-white">Indexed Library</h3>
          {docs.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center text-textMuted">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {docs.map(doc => (
                <div key={doc.id} className="bg-surface border border-border rounded-xl p-5 flex items-start hover:border-border/80 transition-colors">
                  <div className="p-3 rounded-lg bg-background border border-border mr-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-white font-medium truncate pr-4">{doc.title}</h4>
                      <span className="text-xs text-textMuted bg-background px-2 py-1 rounded border border-border whitespace-nowrap">
                        ID: {doc.id}
                      </span>
                    </div>
                    <p className="text-sm text-textMuted line-clamp-2">{doc.preview}</p>
                    <div className="mt-3 text-xs text-textMuted font-mono">
                      ~ {doc.words} words
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
