//@ts-nocheck
'use client';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, Send, Trash2, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function ChatUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const router = useRouter();
  const toggleChat = () => setIsOpen((open) => !open);
  
  // Chat functionality
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop, setInput } = useChat({
    id: String(chatKey),
    maxSteps: 5,

    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'redirect') {
        const { page_name } = toolCall.args as { page_name: string };
        const path = page_name.startsWith('/') ? page_name : `/${page_name}`;
        router.push(path);
      }
    }
  });

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const clearMessages = () => {
    setChatKey(prev => prev + 1);
  };

  const renderMessageContent = (content: string | null | undefined) => {
    if (!content) return null;
    try {
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    } catch (error) {
      console.error("Failed to parse message content:", error);
      return (
        <div className="text-destructive">
          <p>Error parsing message content. Please try again later.</p>
        </div>
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const behavior = isLoading ? 'auto' : 'smooth';
    container.scrollTo({
      top: container.scrollHeight,
      behavior: behavior
    });
  }, [messages, isLoading]);

  useEffect(() => {
    console.log("Chat opened:", isOpen);
    if (isOpen && messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={chatRef}>
      {isOpen ? (
        <div className="flex flex-col bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-[400px] h-[600px] overflow-hidden backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-800 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <h1 className="text-xl font-semibold text-white">Zenith Assistant</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearMessages}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                title="Clear messages"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-800 to-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">Zenith Assistant</h2>
                <p className="text-gray-400">Your AI-powered assistant for task management and organization insights</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`relative max-w-[85%] p-4 rounded-xl transition-all ${
                  message.role === "user"
                    ? "ml-auto bg-gradient-to-br from-rose-700 to-red-600 text-white shadow-lg"
                    : "mr-auto bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600"
                }`}
              >
                {renderMessageContent(message.content)}
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto max-w-[85%] p-4 rounded-xl bg-gray-800 border border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse delay-100" />
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse delay-200" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 justify-center text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                <AlertTriangle size={20} />
                <div className="flex-1">
                  <p className="font-semibold">An error occurred:</p>
                  <p className="text-sm">{error.message || 'Please try again.'}</p>
                  <Button variant="destructive" size="sm" onClick={() => reload()} className="mt-2">
                    Retry Last Message
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="p-3 border-t border-gray-800 bg-gray-900"
          >
            <div className="flex items-center gap-2">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask Zenith Assistant..."
                rows={1}
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-xl resize-none text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-600"
              />
              
              <button
                type="submit"
                disabled={isLoading || input.trim() === ''}
                className="p-3 bg-gradient-to-br from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white p-4 rounded-xl shadow-2xl backdrop-blur-lg transition-all hover:shadow-xl flex items-center justify-center"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}