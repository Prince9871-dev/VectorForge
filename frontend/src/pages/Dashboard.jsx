import React, { useState, useRef } from 'react';
import { VectorDBProvider, useVectorDB } from '../context/VectorDBContext';

import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/layout/HeroSection';
import FeatureSection from '../components/layout/FeatureSection';
import ArchitectureSection from '../components/layout/ArchitectureSection';
import Footer from '../components/layout/Footer';

// Reusing existing components from their original paths for safety, 
// or updating imports if moved. The task specified components/dashboard 
// but we didn't move them yet. I will import from components/ for now.
import SearchPanel from '../components/SearchPanel';
import AlgorithmSelector from '../components/AlgorithmSelector';
import DistanceMetric from '../components/DistanceMetric';
import TopKSlider from '../components/TopKSlider';
import VectorInsert from '../components/VectorInsert';
import BenchmarkPanel from '../components/BenchmarkPanel';
import VectorCanvas from '../components/VectorCanvas';
import DocumentPanel from '../components/DocumentPanel';
import AskAI from '../components/AskAI';
import OllamaStatus from '../components/OllamaStatus';

import BenchmarkGraph from '../components/dashboard/BenchmarkGraph';

const COL = { cs:'#8a8a8a', math:'#aaaaaa', food:'#d4d4d4', sports:'#e5e5e5', doc:'#ffffff', default:'#555555' };

function DashboardApp() {
  const { allItems, searchResults, searchLatency, algo, metric, topK, benchResults, hnswInfo } = useVectorDB();
  const [tab, setTab] = useState('search');
  const dashboardRef = useRef(null);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderSearchResults = () => {
    if (!searchResults || !searchResults.length) {
      return <div className="text-[11px] text-textMuted italic">Run a search to see results...</div>;
    }
    return searchResults.map((r, i) => {
      return (
        <div key={i} className="rcard group">
          <div className="rrank">#{i+1} NEAREST</div>
          <div className="rmeta">{r.metadata}</div>
          <div className="rfoot">
            <span className="rcat group-hover:bg-[#222] transition-colors">
              {r.category.toUpperCase()}
            </span>
            <span className="rdist">{r.distance.toFixed(5)}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-bg text-textMain selection:bg-primary selection:text-black font-sans">
      <Navbar />
      
      <main>
        <HeroSection onLaunch={scrollToDashboard} />
        
        {/* PREMIUM DASHBOARD CONTAINER (Moved immediately after Hero) */}
        <section id="dashboard" ref={dashboardRef} className="py-32 px-6 bg-[#000000] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-white opacity-[0.04] blur-[200px] rounded-full pointer-events-none" />
          <div className="max-w-[1500px] mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold tracking-tight mb-3">Production Vector Runtime</h2>
              <p className="text-sm text-textMuted max-w-xl mx-auto font-light tracking-wide">Interface directly with the active C++ core and local neural pipeline. Real-time inference, real-time intelligence—zero abstraction.</p>
            </div>

            {/* Dashboard Application Shell */}
            <div className="bg-[#050505]/80 backdrop-blur-2xl rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden h-[850px] flex flex-col ring-1 ring-white/14 relative z-20">
              
              <div className="vdb-layout relative z-10">
                {/* LEFT PANEL */}
                <div className="vdb-left-panel relative z-20 shadow-[8px_0_24px_rgba(0,0,0,0.4)]">
                  <SearchPanel />
                  <AlgorithmSelector />
                  <DistanceMetric />
                  <TopKSlider />
                  
                  <div className="bg-[#0f0f0f] border border-white/12 p-4 rounded-xl">
                    <div className="vdb-sec">Category Space</div>
                    <div className="flex flex-col gap-2.5 mt-3">
                      <div className="flex items-center gap-3 text-xs text-textMuted"><div className="w-2 h-2 rounded-full bg-[#8a8a8a]"></div>Algorithms</div>
                      <div className="flex items-center gap-3 text-xs text-textMuted"><div className="w-2 h-2 rounded-full bg-[#aaaaaa]"></div>Math</div>
                      <div className="flex items-center gap-3 text-xs text-textMuted"><div className="w-2 h-2 rounded-full bg-[#d4d4d4]"></div>Food</div>
                      <div className="flex items-center gap-3 text-xs text-textMuted"><div className="w-2 h-2 rounded-full bg-[#e5e5e5]"></div>Sports</div>
                      <div className="flex items-center gap-3 text-xs text-textMuted"><div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>Documents (RAG)</div>
                    </div>
                  </div>

                  <VectorInsert />
                  <BenchmarkPanel />
                </div>

                {/* CENTER PANEL */}
                <div className="vdb-center-panel relative z-10 bg-[#050505]">
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] z-20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.015] blur-[100px] rounded-full pointer-events-none z-10" />
                  <VectorCanvas />
                </div>

                {/* RIGHT PANEL */}
                <div className="vdb-right-panel relative z-20 shadow-[-12px_0_30px_rgba(0,0,0,0.6)]">
                  <div className="vdb-tabs bg-[#080808] border-b border-white/12">
                    <div className={`vdb-tab ${tab === 'search' ? 'on' : ''}`} onClick={() => setTab('search')}>Search</div>
                    <div className={`vdb-tab ${tab === 'docs' ? 'on' : ''}`} onClick={() => setTab('docs')}>Documents</div>
                    <div className={`vdb-tab ${tab === 'rag' ? 'on' : ''}`} onClick={() => setTab('rag')}>Ask AI</div>
                  </div>

                  {/* TAB: SEARCH */}
                  <div className="vdb-tab-content" style={{ display: tab === 'search' ? 'flex' : 'none' }}>
                    <div className="mb-8">
                      <div className="vdb-sec text-[10px] tracking-widest text-[#666] mb-2">SEARCH LATENCY</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-light text-white tracking-tight">{searchLatency}</span>
                        <span className="text-lg text-[#666] font-light">µs</span>
                      </div>
                      <div className="text-[10px] text-[#555] font-mono mt-1 tracking-wider uppercase">
                        {algo} • {metric} • K={topK}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="vdb-sec text-[10px] tracking-widest text-[#666] mb-3">TOP MATCHES</div>
                      <div className="results">
                        {renderSearchResults()}
                      </div>
                    </div>

                    {benchResults && (
                      <div className="mt-auto">
                        <div className="vdb-sec flex items-center justify-between">
                          Algorithm Comparison
                          <span className="text-[9px] border border-white/12 px-1.5 py-0.5 rounded text-textMuted">RECHARTS</span>
                        </div>
                        {/* Premium Graph Component replaces the old bars! */}
                        <BenchmarkGraph />
                      </div>
                    )}
                    
                    {!benchResults && (
                      <div className="mt-auto">
                        <div className="vdb-sec">HNSW Graph Layers</div>
                        <div className="layers">
                          {hnswInfo && hnswInfo.nodesPerLayer ? hnswInfo.nodesPerLayer.map((cnt, lyr) => {
                            const maxN = hnswInfo.nodesPerLayer[0] || 1;
                            const pct = Math.max((cnt / maxN) * 100, 2);
                            const edg = hnswInfo.edgesPerLayer[lyr] || 0;
                            return (
                              <div key={lyr} className="lrow">
                                <div className="lnum">L{lyr}</div>
                                <div className="ltrack"><div className="lfill" style={{ width: `${pct}%` }}></div></div>
                                <div className="lcount">{cnt}n • {edg}e</div>
                              </div>
                            );
                          }) : <div className="text-[11px] text-textMuted">Not available</div>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TAB: DOCUMENTS */}
                  <div className="vdb-tab-content" style={{ display: tab === 'docs' ? 'flex' : 'none' }}>
                    <DocumentPanel />
                  </div>

                  {/* TAB: ASK AI */}
                  <div className="vdb-tab-content" style={{ display: tab === 'rag' ? 'flex' : 'none', paddingBottom: 0 }}>
                    <AskAI />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeatureSection />
        <ArchitectureSection />
      </main>

      <Footer />
    </div>
  );
}

export default function Dashboard() {
  return (
    <VectorDBProvider>
      <DashboardApp />
    </VectorDBProvider>
  );
}
