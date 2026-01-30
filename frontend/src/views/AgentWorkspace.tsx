import { useState } from 'react';
import axios from 'axios';
import { AgentNetwork } from '@/components/visuals/AgentNetwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, ArrowLeft, Terminal, ShieldCheck, FileSignature, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock script structure for the UI
interface AgentLog {
  id: string;
  agent: string;
  msg: string;
  type: 'info' | 'alert' | 'success';
}

export function AgentWorkspace({ siteId, onBack }: { siteId: string, onBack: () => void }) {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);

  // --- HITL STATE: Review Mode ---
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setLogs([]); // Clear previous
    setShowPlan(false);
    setIsReviewing(false);
    setIsAuthorized(false);

    try {
      // 1. Call Backend to get the script
      const res = await axios.get(`http://localhost:8000/api/agents/run/${siteId}`);
      const script = res.data.agents; // { DataQuality: {...}, SitePerformance: {...} }

      // 2. Play out the script sequentially (The "Movie" effect)
      
      // Step A: Data Quality Agent (The Trigger)
      setActiveAgent('quality');
      addLog('quality', script.DataQuality.message, 'alert');
      await wait(2000);

      // Step B: Site Performance Agent (The Root Cause)
      setActiveAgent('site');
      addLog('site', script.SitePerformance.message, 'info');
      await wait(2500);

      // Step C: Orchestrator (The Solution)
      setActiveAgent('orchestrator');
      addLog('orchestrator', "Synthesizing mitigation strategy...", 'info');
      await wait(1500);
      addLog('orchestrator', script.Orchestrator.message, 'success');
      
      // Finish
      setActiveAgent(null);
      setIsRunning(false);
      setShowPlan(true);

    } catch (err) {
      console.error("Simulation failed", err);
      setIsRunning(false);
    }
  };

  const handleAuthorize = () => {
    // Simulate the "signing" delay
    setTimeout(() => {
        setIsAuthorized(true);
        addLog('orchestrator', "PLAN AUTHORIZED BY HUMAN SUPERVISOR. EXECUTING...", 'success');
    }, 800);
  };

  const addLog = (agent: string, msg: string, type: any) => {
    setLogs(prev => [...prev, { id: Date.now().toString(), agent, msg, type }]);
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="h-full bg-slate-950 p-6 flex flex-col gap-6 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Agent Workspace <Badge variant="critical" className="animate-pulse">Site {siteId} Crisis</Badge>
            </h1>
            <p className="text-slate-500 text-sm">Autonomous Multi-Agent Investigation</p>
          </div>
        </div>
        <Button 
          onClick={runSimulation} 
          disabled={isRunning || showPlan}
          className="bg-blue-600 hover:bg-blue-500 text-white min-w-[150px]"
        >
          {isRunning ? <Terminal className="w-4 h-4 mr-2 animate-spin"/> : <Play className="w-4 h-4 mr-2"/>}
          {isRunning ? 'Agents Active...' : 'Initiate Protocol'}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Visualization (4 cols) */}
        <div className="col-span-4 flex flex-col gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">Neural Link Status</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentNetwork activeAgent={activeAgent} />
            </CardContent>
          </Card>

          {/* HUMAN-IN-THE-LOOP COMPLIANCE GATE */}
          <AnimatePresence>
            {showPlan && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className={`border-2 transition-colors duration-500 ${isAuthorized ? 'bg-green-950/30 border-green-500' : 'bg-blue-950/20 border-blue-500/50'}`}>
                  <CardHeader>
                    <CardTitle className={`${isAuthorized ? 'text-green-400' : 'text-blue-400'} flex items-center gap-2`}>
                      {isAuthorized ? <CheckCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />} 
                      {isAuthorized ? 'Action Authorized' : 'Proposed Mitigation Plan'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-200 space-y-3">
                    {/* The Plan */}
                    <div className="space-y-1">
                        <p className="flex items-start gap-2"><span className="text-slate-500">1.</span> Reassign Senior CRA from Site 008.</p>
                        <p className="flex items-start gap-2"><span className="text-slate-500">2.</span> Initiate Remote Monitoring Audit.</p>
                    </div>
                    
                    {/* AI Confidence Box */}
                    {!isAuthorized && (
                        <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono">
                        <div className="flex justify-between mb-1">
                            <span className="text-slate-500">AI Confidence:</span>
                            <span className="text-green-400 font-bold">94.2%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Reasoning:</span>
                            <span className="text-slate-400">Correlates with high CRA turnover.</span>
                        </div>
                        </div>
                    )}

                    {/* Interaction Buttons (The Gate) */}
                    {!isReviewing && !isAuthorized ? (
                        <div className="flex gap-2 mt-4 pt-2 border-t border-slate-800">
                            <Button 
                                onClick={() => setIsReviewing(true)} 
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                Review & Approve
                            </Button>
                            <Button variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950/30">
                                Reject
                            </Button>
                        </div>
                    ) : isReviewing && !isAuthorized ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-slate-700 bg-slate-900/50 p-3 rounded"
                        >
                            <div className="flex items-center gap-2 mb-3 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                                <AlertTriangle className="w-4 h-4" /> Compliance Check
                            </div>
                            <p className="text-xs text-slate-400 mb-4">
                                By authorizing, you confirm this action aligns with <strong>SOP-104 (Resource Allocation)</strong> and accepts the associated risk profile.
                            </p>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={handleAuthorize} 
                                    className="w-full bg-green-600 hover:bg-green-500 text-white flex justify-between items-center group"
                                >
                                    <span>e-Sign & Execute</span>
                                    <FileSignature className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setIsReviewing(false)}
                                    className="px-2 text-slate-500 hover:text-white"
                                >
                                    <XCircle className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="mt-4 pt-4 border-t border-green-900/50 flex flex-col gap-2">
                            <div className="text-xs text-green-400 font-mono flex justify-between">
                                <span>STATUS:</span>
                                <span>EXECUTING</span>
                            </div>
                             <div className="text-xs text-green-400/60 font-mono flex justify-between">
                                <span>AUTH_ID:</span>
                                <span>XC-992-MM</span>
                            </div>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Live Logs (8 cols) */}
        <div className="col-span-8">
          <Card className="h-full bg-black border-slate-800 flex flex-col">
            <CardHeader className="border-b border-slate-900 py-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-slate-500">SESSION_ID: {Date.now()}</span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
                  {isRunning ? 'LIVE CONNECTION' : 'STANDBY'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-sm">
               {logs.length === 0 && !isRunning && (
                 <div className="h-full flex items-center justify-center text-slate-600 italic">
                   Waiting to initiate investigation protocol...
                 </div>
               )}
               {logs.map((log) => (
                 <motion.div 
                   key={log.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`p-3 rounded border-l-2 ${
                     log.type === 'alert' ? 'bg-red-950/20 border-red-500 text-red-200' :
                     log.type === 'success' ? 'bg-green-950/20 border-green-500 text-green-200' :
                     'bg-blue-950/20 border-blue-500 text-blue-200'
                   }`}
                 >
                   <span className="font-bold opacity-50 text-[10px] block mb-1 uppercase tracking-wider">
                     {log.agent} AGENT
                   </span>
                   {log.msg}
                 </motion.div>
               ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}