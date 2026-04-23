import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { Search, BrainCircuit, Cpu, ArrowDownUp, MessagesSquare, FileText, BarChart } from 'lucide-react';

export default function ArchitectureSection() {
  const workflow = [
    { id: 1, title: "Query Input", desc: "User submits a natural language search query.", icon: <Search size={20} /> },
    { id: 2, title: "Embedding Generation", desc: "Ollama locally converts the text into a dense vector representation.", icon: <BrainCircuit size={20} /> },
    { id: 3, title: "Vector Search", desc: "C++ engine executes HNSW graph traversal or KD-Tree nearest neighbor search.", icon: <Cpu size={20} /> },
    { id: 4, title: "Similarity Ranking", desc: "Vectors are scored and ranked via Euclidean or Cosine distance metrics.", icon: <ArrowDownUp size={20} /> },
    { id: 5, title: "Context Retrieval (RAG)", desc: "Top-K matching documents are dynamically retrieved into memory.", icon: <FileText size={20} /> },
    { id: 6, title: "LLM Synthesis", desc: "Ollama reads the retrieved context and generates an intelligent, factual response.", icon: <MessagesSquare size={20} /> },
    { id: 7, title: "Visual Output", desc: "Results, latency benchmarks, and PCA graphs render instantly to the dashboard.", icon: <BarChart size={20} /> }
  ];

  return (
    <section id="workflow" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
      {/* Subtle lighting at the top to separate from the previous section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white opacity-[0.015] blur-[120px] rounded-[100%] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeading 
          title="How VectorForge Works" 
          subtitle="From semantic intent to intelligent response in milliseconds. An end-to-end local AI pipeline." 
        />
        
        <div className="mt-20 flex flex-col gap-4">
          {workflow.map((step, i) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start group"
            >
              {/* Timeline Connector */}
              <div className="flex flex-col items-center mr-6 mt-1">
                <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-textMuted group-hover:text-primary group-hover:border-[#444] transition-colors shadow-sm">
                  {step.icon}
                </div>
                {i < workflow.length - 1 && (
                  <div className="w-px h-16 bg-gradient-to-b from-border to-transparent my-2 opacity-50" />
                )}
              </div>
              
              {/* Content Card */}
              <div className="flex-1 bg-surface/40 backdrop-blur-md border border-border/50 rounded-xl p-5 hover:bg-surface/80 hover:border-[#333] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-mono text-textMuted bg-[#111] px-2 py-0.5 rounded border border-[#222]">STEP 0{step.id}</span>
                  <h3 className="text-sm font-semibold text-textMain tracking-wide">{step.title}</h3>
                </div>
                <p className="text-sm text-textMuted leading-relaxed mt-2">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
