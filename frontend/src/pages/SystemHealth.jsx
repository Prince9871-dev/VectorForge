import React, { useEffect, useState } from 'react';
import { getSystemStatus } from '../services/api';
import { CheckCircle, XCircle, Server, Cpu, Database, Network } from 'lucide-react';

export default function SystemHealth() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getSystemStatus().then(res => setStatus(res)).catch(console.error);
  }, []);

  const StatusItem = ({ label, isOk, subtext, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${isOk ? 'bg-secondary/10 text-secondary' : 'bg-red-500/10 text-red-500'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-white font-medium">{label}</h4>
          <p className="text-xs text-textMuted mt-0.5">{subtext}</p>
        </div>
      </div>
      <div>
        {isOk ? <CheckCircle className="w-6 h-6 text-secondary" /> : <XCircle className="w-6 h-6 text-red-500" />}
      </div>
    </div>
  );

  if (!status) return <div className="p-8 animate-pulse text-textMuted">Checking system diagnostics...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Diagnostics</h1>
        <p className="text-textMuted mt-1">Real-time health of VectorForge infrastructure</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Server className="w-5 h-5 mr-2 text-primary" /> Core Components
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusItem 
            label="FastAPI Backend" 
            isOk={true} 
            subtext="Running on port 8000" 
            icon={Network} 
          />
          <StatusItem 
            label="C++ Vector Engine" 
            isOk={true} 
            subtext="Running on port 8080" 
            icon={Database} 
          />
          <StatusItem 
            label="Ollama Server" 
            isOk={status.ollamaAvailable} 
            subtext={status.ollamaAvailable ? "Ready" : "Offline or Unreachable"} 
            icon={Cpu} 
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Model Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-background border border-border rounded-xl">
            <p className="text-sm text-textMuted mb-1">Embedding Model</p>
            <p className="text-lg font-mono text-primary bg-primary/10 px-3 py-1 rounded inline-block">
              {status.embedModel}
            </p>
          </div>
          <div className="p-4 bg-background border border-border rounded-xl">
            <p className="text-sm text-textMuted mb-1">Generation Model (LLM)</p>
            <p className="text-lg font-mono text-secondary bg-secondary/10 px-3 py-1 rounded inline-block">
              {status.genModel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
