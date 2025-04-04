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
    <div class="flex flex-col h-[600px]">
      {/* Provider selector */}
      <div class="bg-gray-100 p-4 rounded-t-lg mb-2 flex justify-between items-center">
        <div>
          <label class="mr-2 text-sm font-medium text-gray-700">LLM Provider:</label>
          <select 
            value={provider} 
            onChange={handleProviderChange}
            class="p-1 text-sm border rounded bg-white"
          >
            <option value="demo">Demo (Sample Responses)</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>
        <span class="text-xs text-gray-500">
          {provider === "demo" ? 
            "Using demo responses" : 
            `Using ${provider === "openai" ? "OpenAI" : "Google Gemini"} API`}
        </span>
      </div>
      
      {/* Messages container */}
      <div class="flex-1 overflow-y-auto mb-4 p-4">
        {messages.length === 0 ? (
          <div class="text-center text-gray-500 mt-8">
            <p>Send a message to start a conversation!</p>
            {provider !== "demo" && (
              <p class="text-xs mt-2">
                Make sure you have set your {provider === "openai" ? "OPENAI_API_KEY" : "GEMINI_API_KEY"} 
                environment variable.
              </p>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              class={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                class={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p class="whitespace-pre-wrap">{message.content}</p>
                <span class={`text-xs block mt-1 ${
                  message.role === "user" 
                    ? "text-indigo-200" 
                    : "text-gray-500"
                }`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div class="text-left mb-4">
            <div class="inline-block rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
              <div class="flex items-center">
                <div class="dot-typing"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={handleSubmit} class="flex items-center border-t p-4">
        <input
          type="text"
          value={inputText}
          onInput={(e) => setInputText((e.target as HTMLInputElement).value)}
          placeholder="Type your message here..."
          class="flex-1 border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          class={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          Send
        </button>
      </form>

      {/* CSS for the typing animation */}
      <style>
        {`
          .dot-typing {
            position: relative;
            left: -9px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #9880ff;
            color: #9880ff;
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
            left: -15px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #9880ff;
            color: #9880ff;
            animation: dot-typing 1s infinite linear;
            animation-delay: 0.25s;
          }

          .dot-typing::after {
            left: 15px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #9880ff;
            color: #9880ff;
            animation: dot-typing 1s infinite linear;
            animation-delay: 0.5s;
          }

          @keyframes dot-typing {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.5);
              opacity: 0.6;
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