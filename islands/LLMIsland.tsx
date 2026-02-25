// islands/LLMIsland.tsx
import { useState, useRef, useEffect } from "preact/hooks";

// Message type definition
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// LLM Provider type
type LLMProvider = "demo" | "openai" | "gemini";

export default function LLMIsland() {
  // State for messages, input, and loading
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<LLMProvider>("demo");
  
  // Ref for the messages container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get endpoint based on selected provider
  const getEndpoint = () => {
    switch (provider) {
      case "gemini":
        return "/api/llm-gemini";
      case "demo":
      default:
        return "/api/llm";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    // Don't submit empty messages
    if (!inputText.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: Date.now(),
    };
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    
    try {
      // Call the API to get LLM response
      const response = await fetch(getEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };
      
      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting LLM response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "Something went wrong. Please try again."}`,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp to readable format
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Handle provider change
  const handleProviderChange = (e: Event) => {
    setProvider((e.target as HTMLSelectElement).value as LLMProvider);
  };

  return (
    <div class="flex flex-col h-[600px] bg-zinc-950/20 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      {/* Provider selector */}
      <div class="bg-white/5 border-b border-white/5 p-5 flex justify-between items-center backdrop-blur-md">
        <div>
          <label class="mr-3 text-xs font-black uppercase tracking-widest text-slate-500">Provider</label>
          <select 
            value={provider} 
            onChange={handleProviderChange}
            class="bg-zinc-900 border border-white/10 text-white text-xs font-bold rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="demo">Demo (Sample)</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {provider === "demo" ? "Simulation Mode" : "API Connected"}
          </span>
        </div>
      </div>
      
      {/* Messages container */}
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div class="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-bold">Neural Interface Ready</p>
              <p class="text-xs text-slate-400 uppercase tracking-widest mt-1">Send a message to initiate sequence</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              class={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                class={`inline-block rounded-3xl px-5 py-3 max-w-[85%] transition-all duration-300 ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                    : "bg-white/5 border border-white/10 backdrop-blur-md text-slate-200 shadow-xl"
                }`}
              >
                <p class="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                <span class={`text-[10px] block mt-2 font-black uppercase tracking-widest ${
                  message.role === "user" 
                    ? "text-indigo-200/60" 
                    : "text-slate-500"
                }`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div class="flex justify-start">
            <div class="inline-block rounded-2xl px-5 py-4 bg-white/5 border border-white/10 backdrop-blur-md">
              <div class="flex items-center space-x-2">
                <div class="dot-typing"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={handleSubmit} class="p-6 border-t border-white/5 bg-white/[0.02]">
        <div class="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onInput={(e) => setInputText((e.target as HTMLInputElement).value)}
            placeholder="Type your message..."
            class="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            class={`p-4 rounded-2xl transition-all ${
              isLoading || !inputText.trim()
                ? "bg-white/5 text-slate-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] active:scale-95"
            }`}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>

      {/* CSS for the typing animation */}
      <style>
        {`
          .dot-typing {
            position: relative;
            left: -9px;
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background-color: #818cf8;
            color: #818cf8;
            animation: dot-typing 1s infinite linear;
          }

          .dot-typing::before,
          .dot-typing::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
          }

          .dot-typing::before {
            left: -12px;
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background-color: #818cf8;
            color: #818cf8;
            animation: dot-typing 1s infinite linear;
            animation-delay: 0.25s;
          }

          .dot-typing::after {
            left: 12px;
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background-color: #818cf8;
            color: #818cf8;
            animation: dot-typing 1s infinite linear;
            animation-delay: 0.5s;
          }

          @keyframes dot-typing {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.4);
              opacity: 0.4;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}