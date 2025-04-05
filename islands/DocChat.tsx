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
    <div class="flex flex-col h-[80vh]">
      {/* Error Banner */}
      {error && (
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">{error}</p>
              <div class="mt-2">
                <a
                  href="/"
                  class="inline-block bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 rounded-md"
                >
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rest of the component remains the same as in the original implementation */}
      {/* Chat messages */}
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div class="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              class={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                class={`max-w-[80%] px-4 py-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-indigo-600 text-white" 
                    : message.role === "system"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-white border border-gray-200 shadow-sm text-gray-800"
                }`}
              >
                <div class="whitespace-pre-wrap">
                  {message.content.split("\n").map((line, i) => (
                    <p key={i} class={line.trim() === "" ? "h-4" : "mb-2"}>
                      {line}
                    </p>
                  ))}
                </div>
                <div 
                  class={`text-xs mt-1 text-right ${
                    message.role === "user" 
                      ? "text-indigo-200" 
                      : "text-gray-500"
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
              <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Anchor for auto-scroll */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      
      {/* Document info panel */}
      <div class="p-3 border-t bg-gray-50 flex items-center justify-between text-sm">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-gray-700 truncate">
            {documentTitle}
            {documentAuthor && ` • ${documentAuthor}`}
            {documentYear && ` (${documentYear})`}
          </span>
        </div>
        <a
          href={documentPathWithPrefix}
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-600 hover:text-indigo-800 text-xs inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View PDF
        </a>
      </div>
      
      {/* Input area */}
      <div class="p-4 border-t">
        <form onSubmit={handleSendMessage} class="flex items-end space-x-2">
          <div class="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onInput={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              class="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Ask about the research..."
              disabled={isLoading}
            ></textarea>
            <div class="absolute bottom-2 right-2 text-xs text-gray-400">
              {!isLoading && "Shift+Enter for new line"}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            class={`px-4 py-3 rounded-lg ${
              isLoading || !inputValue.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
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