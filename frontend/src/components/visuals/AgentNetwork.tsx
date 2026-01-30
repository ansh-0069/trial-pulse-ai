import { motion } from 'framer-motion';

// The 5 Agents and their positions on a pentagon/circle
const AGENTS = [
  { id: 'orchestrator', label: 'Orchestrator', x: 150, y: 150, color: '#3b82f6' }, // Center (Blue)
  { id: 'quality', label: 'Data Quality', x: 150, y: 50, color: '#ef4444' },     // Top (Red)
  { id: 'site', label: 'Site Performance', x: 250, y: 120, color: '#eab308' },  // Right (Yellow)
  { id: 'compliance', label: 'Compliance', x: 200, y: 220, color: '#a855f7' },  // Bottom Right (Purple)
  { id: 'query', label: 'Query Res', x: 100, y: 220, color: '#22c55e' },       // Bottom Left (Green)
];

// Connections (Everyone talks to Orchestrator)
const CONNECTIONS = [
  { from: 'quality', to: 'orchestrator' },
  { from: 'site', to: 'orchestrator' },
  { from: 'compliance', to: 'orchestrator' },
  { from: 'query', to: 'orchestrator' },
];

export function AgentNetwork({ activeAgent }: { activeAgent: string | null }) {
  return (
    <div className="w-full h-[300px] flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800 relative overflow-hidden">
      <svg width="300" height="300" className="absolute">
        {/* Draw Lines */}
        {CONNECTIONS.map((conn, i) => (
          <motion.line
            key={i}
            x1={AGENTS.find(a => a.id === conn.from)?.x}
            y1={AGENTS.find(a => a.id === conn.from)?.y}
            x2={AGENTS.find(a => a.id === conn.to)?.x}
            y2={AGENTS.find(a => a.id === conn.to)?.y}
            stroke="#475569"
            strokeWidth="2"
            // If connection is active, glow bright
            animate={{
              stroke: activeAgent === conn.from || activeAgent === 'orchestrator' ? '#60a5fa' : '#475569',
              strokeWidth: activeAgent === conn.from ? 4 : 2
            }}
          />
        ))}
      </svg>

      {/* Draw Nodes (Agents) */}
      {AGENTS.map((agent) => (
        <motion.div
          key={agent.id}
          className="absolute flex flex-col items-center justify-center"
          style={{ left: agent.x - 30, top: agent.y - 30 }} // Center div
          animate={{
            scale: activeAgent === agent.id ? 1.2 : 1,
            opacity: activeAgent && activeAgent !== agent.id && activeAgent !== 'orchestrator' ? 0.5 : 1
          }}
        >
          {/* Glowing Circle */}
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2"
            style={{ 
              backgroundColor: '#1e293b', 
              borderColor: agent.color,
              boxShadow: activeAgent === agent.id ? `0 0 20px ${agent.color}` : 'none'
            }}
          >
            {/* Simple initial */}
            <span className="text-white font-bold text-lg">{agent.label[0]}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 font-mono bg-black/50 px-1 rounded">
            {agent.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}