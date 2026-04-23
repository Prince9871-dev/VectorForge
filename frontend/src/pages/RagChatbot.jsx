import React, { useState } from 'react';
import { askRAG } from '../services/api';
import { MessageSquare, Send, User, Bot, FileText } from 'lucide-react';

export default function RagChatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am VectorForge AI. Ask me questions about the documents you have uploaded in the library.', contexts: null }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await askRAG(userMsg, 3);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: res.answer, 
        contexts: res.contexts 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to the RAG backend.' }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-primary" /> RAG Chatbot
        </h1>
        <p className="text-textMuted mt-1">Interact with your local LLM grounded by your vector data.</p>
      </div>

      <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary ml-4' : 'bg-secondary/20 text-secondary mr-4'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-background border border-border text-textMain rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                  
                  {msg.contexts && msg.contexts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Retrieved Context</p>
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {msg.contexts.map((ctx, i) => (
                          <div key={i} className="flex-shrink-0 w-48 bg-background border border-border rounded-lg p-3 group relative cursor-help">
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-white font-medium truncate">{ctx.title}</p>
                            </div>
                            <div className="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-64 p-3 bg-surface border border-border rounded-lg shadow-xl text-xs text-textMuted whitespace-normal break-words">
                              {ctx.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                  <Bot className="w-5 h-5 text-secondary animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-background border border-border rounded-tl-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..." 
              className="w-full bg-surface border border-border rounded-full pl-6 pr-14 py-3.5 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 p-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
