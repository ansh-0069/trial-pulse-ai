import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

export function NLInterface({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', text: 'Hello. I am TrialPulse. Ask me about site risks, enrollment status, or database lock predictions.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 1. Send Text to Backend
  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), role: 'user' as const, text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/nl-query', { query: userMsg.text });
      const aiMsg = { id: Date.now() + 1, role: 'ai' as const, text: res.data.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Mock Voice Input (Browser API is flaky in iframes/some envs, this is safer for demo)
  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setQuery("Is Site 042 ready for database lock?");
        setIsListening(false);
      }, 2000); // Simulate 2s of listening then auto-fill
    }
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-3xl z-10 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-400" />
            Natural Language Command
          </h1>
          <Button variant="ghost" onClick={onBack} className="text-slate-400">Close</Button>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 bg-slate-900/80 border-slate-800 backdrop-blur-md overflow-hidden flex flex-col shadow-2xl">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                  {msg.role === 'ai' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'ai' ? 'bg-slate-800 text-slate-100' : 'bg-blue-600 text-white'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="flex items-center gap-1 h-10">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"/>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"/>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-300"/>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-4 items-center">
            <Button 
              variant={isListening ? "default" : "outline"} 
              className={`rounded-full h-12 w-12 shrink-0 ${isListening ? 'animate-pulse' : ''}`}
              onClick={toggleVoice}
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about trial risks, sites, or generate reports..." 
              className="h-12 bg-slate-900 border-slate-700 text-lg rounded-full px-6 focus-visible:ring-blue-500"
            />
            <Button 
              onClick={handleSend} 
              className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-500 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}