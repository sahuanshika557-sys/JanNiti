import React, { useState } from 'react';
import { 
  Bot, Sparkles, Send, X, RefreshCw, HelpCircle, 
  MessageSquare, ShieldCheck, ChevronRight, CornerDownLeft 
} from 'lucide-react';
import { apiService } from '../../services/api';

interface PolicyCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState?: string;
  selectedDistrict?: string;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  isGemini?: boolean;
  time: string;
}

const STARTER_QUESTIONS = [
  'Why is Lucknow showing high infrastructure demand?',
  'Which districts need urgent road intervention?',
  'What are the top 5 infrastructure priorities nationwide?',
  'Summarize the water and sanitation deficit across clusters.',
  'What project proposal benefits the largest population?'
];

export const PolicyCopilotModal: React.FC<PolicyCopilotModalProps> = ({
  isOpen,
  onClose,
  selectedState,
  selectedDistrict
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello! I am the **JanNiti AI Policy Copilot** powered by Google Gemini.

I have access to live aggregated citizen demand telemetry, detected spatial hotspots, and baseline government open datasets.

How can I assist your infrastructure prioritization decisions today?`,
      isGemini: true,
      time: 'Just now'
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiService.askPolicyCopilot(q, selectedState, selectedDistrict);
      const assistantMsg: Message = {
        sender: 'assistant',
        text: response.answer,
        isGemini: response.isRealtimeGemini,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Copilot query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an issue retrieving that insight. Please try asking again or selecting a suggested question.',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl h-[650px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-gov-800 to-gov-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm">JanNiti Policy Copilot</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini Grounded RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Grounded strictly in verified platform data &amp; open government datasets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Bar */}
        <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
          <span className="font-medium">
            AI-generated insight based on verified platform data. Advisory only.
          </span>
          <span className="font-bold text-slate-700">
            {selectedDistrict ? `Focus: ${selectedDistrict}` : selectedState ? `Focus: ${selectedState}` : 'Scope: Pan-India'}
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gov-700 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none prose prose-xs'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 animate-pulse w-fit">
              <Sparkles className="w-4 h-4 text-gov-600 animate-spin" />
              <span>Querying database metrics and synthesizing policy answer...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-100/80 border-t border-slate-200 overflow-x-auto flex items-center gap-2 text-[11px] scrollbar-none">
          <span className="text-slate-400 font-bold shrink-0 text-[10px] uppercase">Suggest:</span>
          {STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-gov-400 hover:text-gov-700 transition shrink-0 text-slate-700 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a policy question about citizen demand, hotspots, or schemes..."
            className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-gov-400 focus:border-gov-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-gov-700 hover:bg-gov-800 text-white transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
