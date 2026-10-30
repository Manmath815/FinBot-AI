import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, User, Trash2, Send 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage, LanguageCode } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
  language?: LanguageCode;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setInputText(e.target.value);
      // Auto expand textarea
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-[750px] relative overflow-hidden">
      
      {/* 1. Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">FinBot AI Assistant</h2>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Online • IBM Watsonx Granite</span>
            </div>
          </div>
        </div>

        {/* Clear Chat Button */}
        <button
          onClick={onClearChat}
          className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        
        {/* Initial Welcome Greeting */}
        <div className="flex items-start space-x-3 max-w-[92%] sm:max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center mt-1">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-relaxed border border-slate-100 dark:border-slate-700/60 shadow-xs">
              <p className="font-medium text-slate-900 dark:text-white mb-2">
                👋 <strong>Namaste! I'm FinBot</strong> — your AI-powered Digital Financial Literacy companion!
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-2">I can help you with:</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 ml-1">
                <li>• 🔓 UPI & digital payment safety</li>
                <li>• 🚨 Identifying and avoiding scams</li>
                <li>• 📈 SIP, mutual funds & investments</li>
                <li>• 💰 Budgeting & financial goals</li>
                <li>• 🏛️ Government schemes & benefits</li>
                <li>• 🌐 Support in Hindi, Tamil, Telugu & 8 more languages</li>
              </ul>
              <p className="mt-3 text-slate-500 dark:text-slate-400 italic">
                Ask me anything in your preferred language! 😊
              </p>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 ml-1">Just now</div>
          </div>
        </div>

        {/* Dynamic Chat Messages */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start max-w-[92%] sm:max-w-[85%]'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700/60 shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  ) : (
                    <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 space-y-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex-shrink-0 flex items-center justify-center mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator (Matches Screenshot 2) */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 py-2 ml-1">
            <span className="flex space-x-1">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-300">FinBot is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Chat Input Box (Matches Screenshot) */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 transition focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about UPI, scams, SIP, budgeting... (any language)"
            className="w-full bg-transparent resize-none border-0 focus:ring-0 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 py-1.5 px-2 max-h-32 outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition ${
              inputText.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 cursor-pointer'
                : 'bg-blue-300 dark:bg-slate-700 text-white dark:text-slate-400 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Sub-bar: Instructions & Character Count */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2 px-1 font-medium">
          <div className="flex items-center space-x-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-white rounded">Enter</kbd>
            <span>to send ·</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-white rounded">Shift+Enter</kbd>
            <span>for newline</span>
          </div>

          <div>
            <span>{inputText.length}</span>
            <span>/1000</span>
          </div>
        </div>
      </div>

    </div>
  );
};
