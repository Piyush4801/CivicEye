'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, X, MessageSquare, Send, Sparkles, MapPin, Building2, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  { text: "Nearby Issues", icon: <MapPin className="w-3 h-3 mr-1" /> },
  { text: "City Health", icon: <Sparkles className="w-3 h-3 mr-1" /> },
  { text: "Find NGOs", icon: <Building2 className="w-3 h-3 mr-1" /> },
  { text: "Volunteer", icon: <HeartHandshake className="w-3 h-3 mr-1" /> },
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Hello! I am your Civic Copilot. How can I assist you with your city today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let aiReply = "I am processing the latest smart city telemetry...";
      const msg = text.toLowerCase();
      
      if (msg.includes('nearby') || msg.includes('issue')) {
        aiReply = "There are 14 active reports near your location. The most critical is a 'Live Electrical Wire' in Ward West. The Trust Engine has verified it and dispatched emergency teams. Estimated resolution: 2 hours.";
      } else if (msg.includes('health') || msg.includes('city')) {
        aiReply = "The current City Health Score is 84/100. We've recorded a 12% drop in unresolved infrastructure complaints this week, thanks to 1,204 community verification actions!";
      } else if (msg.includes('ngo') || msg.includes('volunteer')) {
        aiReply = "The 'Green Earth Initiative' is a highly rated (95% Trust) NGO nearby. They are hosting a tree plantation drive tomorrow. Joining will grant you 50 Civic XP. Shall I open their profile?";
      } else if (msg.includes('emergency')) {
        aiReply = "URGENT: If this is life-threatening, dial 911. Otherwise, submit a report marked as 'Emergency'. Our AI will instantly route it to Disaster Management overriding standard queues.";
      } else {
        aiReply = "I've logged your query. Our intelligence engine is constantly learning to improve city routing. Is there a specific department or area you'd like me to focus on?";
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Connection to the intelligence engine failed. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <Button 
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-2xl p-0 bg-primary hover:bg-primary/90 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                <MessageSquare className="h-6 w-6" />
              </motion.div>
              {/* Subtle pulsing background */}
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <Card className="w-[340px] md:w-[380px] shadow-2xl flex flex-col overflow-hidden border-border bg-background/95 backdrop-blur-xl">
              <CardHeader className="bg-primary text-primary-foreground py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Bot className="h-5 w-5" /> 
                  <div>
                    <div className="leading-none">Civic Copilot</div>
                    <div className="text-[10px] font-normal text-primary-foreground/70 mt-0.5 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" /> Online
                    </div>
                  </div>
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary-foreground/20 rounded-full text-primary-foreground" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[450px] min-h-[350px] bg-slate-50/50 dark:bg-slate-900/50">
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-4 py-2.5 text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                        : 'bg-card border border-border text-foreground rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-card border border-border text-foreground rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="px-3 pt-2 pb-0 bg-card overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-border flex gap-2">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug.text)}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-accent hover:bg-accent/80 text-xs font-medium text-foreground transition-colors border border-border"
                  >
                    {sug.icon} {sug.text}
                  </button>
                ))}
              </div>

              <CardFooter className="p-3 bg-card pt-3">
                <form 
                  className="flex w-full gap-2 relative"
                  onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                >
                  <Input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Ask about your city..." 
                    className="flex-1 text-sm h-10 bg-background focus-visible:ring-primary pr-10 rounded-full"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input.trim() || isLoading} 
                    className="absolute right-1 top-1 h-8 w-8 rounded-full"
                  >
                    <Send className="h-3.5 w-3.5 ml-0.5" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
