// routes/api/llm.ts
import { Handlers } from "$fresh/server.ts";

// Define interface for request body
interface LLMRequest {
  message: string;
  history: {
    role: "user" | "assistant";
    content: string;
  }[];
}

// Define example responses for demonstration purposes
const exampleResponses = [
  "I'm just a demo LLM interface. To connect to a real LLM API like OpenAI, you would need to add your API key and make the appropriate API call.",
  "This is a basic example of an LLM chat interface built with Deno Fresh. You can extend this to connect to any LLM API.",
  "In a real implementation, you would send the message history to an LLM API and stream the response back to the user.",
  "You can enhance this interface with features like markdown rendering, code highlighting, and streaming responses.",
  "To implement this with a real LLM, you would need to add your API credentials and update the API endpoint in this file.",
];

export const handler: Handlers = {
  async POST(req) {
    try {
      // Parse the request body
      const body: LLMRequest = await req.json();
      const { message } = body;
      
      // Log the incoming message (for debugging)
      console.log("Received message:", message);
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, choose a random response
      // In a real implementation, you would call an actual LLM API here
      const randomResponse = exampleResponses[Math.floor(Math.random() * exampleResponses.length)];
      
      // Return the response
      return new Response(
        JSON.stringify({
          response: randomResponse
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error processing LLM request:", error);
      
      return new Response(
        JSON.stringify({
          error: "Failed to process your request"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};