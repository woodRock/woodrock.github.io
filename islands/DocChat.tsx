// islands/DocChatIsland.tsx
import { useEffect, useState, useRef } from "preact/hooks";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface DocChatIslandProps {
  documentTitle: string;
  documentPath: string;
  documentAuthor?: string;
  documentYear?: string;
}

export default function DocChatIsland({ 
  documentTitle, 
  documentPath, 
  documentAuthor, 
  documentYear 
}: DocChatIslandProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentSummary, setDocumentSummary] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize chat with system message
  useEffect(() => {
    const initialMessage: Message = {
      id: "system-1",
      role: "system",
      content: `Welcome! I'm your research assistant for discussing "${documentTitle}". Ask me questions about this document, and I'll provide insights based on its content.`,
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
    
    // Fetch document summary on load
    fetchDocumentSummary();
  }, [documentTitle]);
  
  // Fetch document summary
  const fetchDocumentSummary = async () => {
    try {
      setIsLoading(true);
      
      // Make API request to get document summary
      const response = await fetch("/api/doc-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          documentPath 
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get document summary: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add assistant message with summary
      const summaryMessage: Message = {
        id: "assistant-summary",
        role: "assistant",
        content: data.summary,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, summaryMessage]);
      setDocumentSummary(data.summary);
      
    } catch (err) {
      console.error("Error fetching document summary:", err);
      setError(`Could not load document information: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Focus input field after loading
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);
  
  // Handle sending message
  const handleSendMessage = async (e?: Event) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setError(null);
    setIsLoading(true);
    
    try {
      // Make API request
      const response = await fetch("/api/doc-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          documentPath,
          documentTitle,
          question: inputValue,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });
      
      // Specific handling for 429 error
      if (response.status === 429) {
        throw new Error("You have run out of API credits. Please upgrade your plan or try again later.");
      }
      
      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      console.error("Error in chat:", err);
      
      // Specific handling for 429 error
      if (err.message.includes('429') || err.message.includes('API credits')) {
        setError("You have run out of API credits. Please upgrade your plan or try again later.");
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
      
      // Add error message
      const errorMessage: Message = {
        id: `system-error-${Date.now()}`,
        role: "system",
        content: `Error: ${err.message}. Please try again.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: Event) => {
    setInputValue((e.target as HTMLTextAreaElement).value);
  };
  
  // Handle textarea height adjustment
  const adjustTextareaHeight = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };
  
  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Path for viewing the document.
  const staticPath = "./static/";
  const documentPathWithoutStatic = documentPath.replace(staticPath, "");
  // Add woodrock.deno.dev/ prefix to document path
  const documentPathWithPrefix = `https://woodrock.deno.dev/${documentPathWithoutStatic}`;
  
  return (
    <div class="flex flex-col h-[80vh] bg-zinc-950/20">
      {/* Error Banner */}
      {error && (
        <div class="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 backdrop-blur-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-200/80">{error}</p>
              <div class="mt-2">
                <a
                  href="/"
                  class="inline-block bg-yellow-500/20 px-3 py-2 text-xs font-bold text-yellow-200 hover:bg-yellow-500/30 rounded-full transition-all"
                >
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat messages */}
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div class="space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              class={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                class={`max-w-[85%] px-5 py-4 rounded-3xl transition-all duration-300 ${
                  message.role === "user" 
                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]" 
                    : message.role === "system"
                    ? "bg-white/5 border border-white/5 text-slate-400 text-xs italic"
                    : "bg-white/5 border border-white/10 backdrop-blur-md text-slate-200 shadow-xl"
                }`}
              >
                <div class="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content.split("\n").map((line, i) => (
                    <p key={i} class={line.trim() === "" ? "h-3" : "mb-2"}>
                      {line}
                    </p>
                  ))}
                </div>
                <div 
                  class={`text-[10px] mt-2 font-black uppercase tracking-widest ${
                    message.role === "user" 
                      ? "text-indigo-200/60" 
                      : "text-slate-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div class="flex justify-start">
              <div class="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 shadow-sm backdrop-blur-md">
                <div class="flex items-center space-x-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Anchor for auto-scroll */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      
      {/* Document info panel */}
      <div class="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div class="flex items-center min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-slate-400 text-xs truncate font-medium">
            {documentTitle}
            {documentAuthor && ` • ${documentAuthor}`}
            {documentYear && ` (${documentYear})`}
          </span>
        </div>
        <a
          href={documentPathWithPrefix}
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-400 hover:text-indigo-300 text-[10px] font-black uppercase tracking-widest flex items-center ml-4 flex-shrink-0 transition-colors"
        >
          View PDF
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
      
      {/* Input area */}
      <div class="p-6 border-t border-white/5">
        <form onSubmit={handleSendMessage} class="flex items-end space-x-3">
          <div class="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onInput={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none placeholder-slate-500"
              placeholder="Ask a question about the research..."
              disabled={isLoading}
            ></textarea>
            <div class="absolute bottom-4 right-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest pointer-events-none">
              {!isLoading && "Enter"}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            class={`p-4 rounded-2xl transition-all ${
              isLoading || !inputValue.trim()
                ? "bg-white/5 text-slate-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] active:scale-95"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}