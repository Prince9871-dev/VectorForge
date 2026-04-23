import React from 'react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { Search, Zap, MessageSquare, Cpu, Database, BarChart2 } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    { title: "HNSW Search Engine", desc: "Hierarchical Navigable Small World graphs for ultra-fast approximate nearest neighbor search.", icon: <Search size={20} /> },
    { title: "FastAPI Gateway", desc: "Production-ready async Python backend with Pydantic validation and strict typing.", icon: <Zap size={20} /> },
    { title: "Local RAG Chatbot", desc: "Ask questions against your vectors using local LLMs and retrieval-augmented generation.", icon: <MessageSquare size={20} /> },
    { title: "C++ Vector Core", desc: "Memory-optimized vector indexing written from scratch in C++ for maximum throughput.", icon: <Cpu size={20} /> },
    { title: "Ollama Integration", desc: "Seamlessly embed and generate using open-weights models locally without cloud lock-in.", icon: <Database size={20} /> },
    { title: "Benchmark Engine", desc: "Real-time latency comparisons across Brute Force, KD-Tree, and HNSW indexes.", icon: <BarChart2 size={20} /> }
  ];

  return (
    <section className="py-24 px-6 bg-bg border-b border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading 
          title="Enterprise-Grade Infrastructure" 
          subtitle="Everything you need to deploy and manage a production vector database locally." 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <GlassCard key={i} delay={i * 0.1}>
              <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center mb-6 text-textMuted">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-textMain mb-2">{f.title}</h3>
              <p className="text-sm text-textMuted leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
