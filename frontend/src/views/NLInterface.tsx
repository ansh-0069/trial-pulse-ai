import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Bot, User, Sparkles, ThumbsUp, ThumbsDown, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  feedback?: 'positive' | 'negative' | null; // Track feedback state
}

export function NLInterface({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', text: 'Hello. I am TrialPulse. Ask me about site risks, enrollment status, or database lock predictions.', feedback: null }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 1. Send Text to Backend
  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: query, feedback: null };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/nl-query', { query: userMsg.text });
      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', text: res.data.response, feedback: null };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: "Error connecting to server.", feedback: null }]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Mock Voice Input (Simulates listening)
  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setQuery("Is Site 042 ready for database lock?");
        setIsListening(false);
      }, 2000); 
    }
  };

  // 3. HITL FEATURE: Active Learning Feedback Loop
  const handleFeedback = (id: number, type: 'positive' | 'negative') => {
    if (type === 'negative') {
        // SIMULATE ACTIVE LEARNING: Ask expert for ground truth
        const correction = window.prompt("🚩 Flagged for Retraining: What is the correct information?");
        
        if (correction) {
            // In a real app, send this to backend for fine-tuning
            console.log(`[Active Learning] Tuning model with correction: ${correction}`);
            // Provide visual confirmation to the user
            alert("✅ Knowledge Base Updated. The model will prioritize this correction in future queries.");
        } else {
            return; // User cancelled
        }
    }

    // Update UI to show feedback was registered
    setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, feedback: type } : msg
    ));
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
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    {msg.role === 'ai' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`p-4 rounded-2xl ${msg.role === 'ai' ? 'bg-slate-800 text-slate-100' : 'bg-blue-600 text-white'}`}>
                    {msg.text}
                    </div>
                </div>

                {/* HITL FEEDBACK CONTROLS (Only for AI messages) */}
                {msg.role === 'ai' && (
                    <div className="flex items-center gap-2 mt-2 ml-14">
                        {msg.feedback === 'positive' ? (
                            <span className="text-green-400 text-xs flex items-center gap-1">
                                <Check className="w-3 h-3" /> Helpful
                            </span>
                        ) : msg.feedback === 'negative' ? (
                            <span className="text-yellow-400 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Flagged for Review
                            </span>
                        ) : (
                            <>
                                <button 
                                    onClick={() => handleFeedback(msg.id, 'positive')}
                                    className="text-slate-500 hover:text-green-400 text-xs flex items-center gap-1 transition-colors"
                                >
                                    <ThumbsUp className="w-3 h-3" /> Helpful
                                </button>
                                <span className="text-slate-700">|</span>
                                <button 
                                    onClick={() => handleFeedback(msg.id, 'negative')}
                                    className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                                >
                                    <ThumbsDown className="w-3 h-3" /> Incorrect
                                </button>
                            </>
                        )}
                    </div>
                )}
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
              className={`rounded-full h-12 w-12 shrink-0 ${isListening ? 'animate-pulse bg-red-500/20 border-red-500 text-red-500' : ''}`}
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