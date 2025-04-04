// routes/api/llm-gemini.ts
import { Handlers } from "$fresh/server.ts";

// Define interface for request body
interface LLMRequest {
  message: string;
  history: {
    role: "user" | "assistant";
    content: string;
  }[];
}

// Gemini API only supports "user" and "model" roles
// We need to format our history to match this structure
interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

export const handler: Handlers = {
  async POST(req) {
    try {
      // Parse the request body
      const body: LLMRequest = await req.json();
      const { message, history } = body;
      
      // Get API key from environment variable
      const apiKey = Deno.env.get("GEMINI_API_KEY");
      console.log("API Key length:", apiKey ? apiKey.length : 0);
      
      if (!apiKey) {
        console.error("Gemini API key not found in environment variables");
        return new Response(JSON.stringify({
          error: "Gemini API key not found. Set the GEMINI_API_KEY environment variable."
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Format conversation history for Gemini API
      const formattedHistory: GeminiMessage[] = [];
      
      // Add system context as first user message if no history exists
      if (history.length === 0) {
        formattedHistory.push({
          role: "user",
          parts: [{ text: "You are a helpful assistant that provides concise and accurate information. Please respond to all future messages with this in mind." }]
        });
        
        // Add a placeholder model response to maintain the correct alternating pattern
        formattedHistory.push({
          role: "model",
          parts: [{ text: "I'll do my best to provide helpful, accurate, and concise responses." }]
        });
      }
      
      // Add conversation history, converting from our format to Gemini's format
      for (let i = 0; i < history.length; i++) {
        const msg = history[i];
        formattedHistory.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }
      
      // Add the new message
      formattedHistory.push({
        role: "user",
        parts: [{ text: message }]
      });
      
      // First, try to get the list of available models
      console.log("Getting list of available Gemini models...");
      const modelsUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
      
      let modelToUse = "";
      
      try {
        const modelsResponse = await fetch(modelsUrl);
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          console.log("Available models:", modelsData.models?.map((m: any) => m.name).join(", ") || "No models found");
          
          // Look for non-vision text models, preferring the newest ones (gemini-1.5-pro or gemini-1.5-flash)
          if (modelsData.models && modelsData.models.length > 0) {
            // First, try to find gemini-1.5-pro
            const gemini15Pro = modelsData.models.find((m: any) => 
              m.name.includes("gemini-1.5-pro") && !m.name.includes("vision"));
            
            if (gemini15Pro) {
              modelToUse = gemini15Pro.name;
              console.log(`Selected model: ${modelToUse}`);
            } else {
              // Fallback to any gemini model that doesn't have 'vision' in the name
              const textModel = modelsData.models.find((m: any) => 
                !m.name.includes("vision") && m.name.includes("gemini"));
              
              if (textModel) {
                modelToUse = textModel.name;
                console.log(`Selected fallback model: ${modelToUse}`);
              } else {
                // Last resort: just use the first model
                modelToUse = modelsData.models[0].name;
                console.warn(`Could not find suitable text model, using first available: ${modelToUse}`);
              }
            }
          }
        } else {
          console.warn("Could not fetch models list:", await modelsResponse.text());
        }
      } catch (e) {
        console.warn("Error fetching models:", e);
      }
      
      // If we couldn't determine a model from the API, use a default
      if (!modelToUse) {
        modelToUse = "models/gemini-1.5-pro";
        console.log(`Using default model: ${modelToUse}`);
      }
      
      // Gemini API endpoint - note we don't include "models/" again in the URL
      // The API already returns names with "models/" prefix
      const endpoint = `https://generativelanguage.googleapis.com/v1/${modelToUse}:generateContent`;
      const url = `${endpoint}?key=${apiKey}`;
      
      console.log(`Making request to Gemini API with model: ${modelToUse}`);
      console.log("Request URL:", endpoint);
      
      // Prepare the request payload
      const requestPayload = {
        contents: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.95,
          topK: 40
        }
      };
      
      // Make request to Gemini API
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });
      
      // Log response status
      console.log("Gemini API response status:", response.status);
      
      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error response:", errorText);
        
        // Try to parse the error response
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Gemini API error details:", JSON.stringify(errorJson, null, 2));
          
          // Return a more descriptive error
          if (errorJson.error) {
            return new Response(JSON.stringify({
              error: `Gemini API error: ${errorJson.error.message || errorJson.error.status || "Unknown error"}`
            }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
        } catch (parseError) {
          // Raw text wasn't JSON
          console.error("Could not parse error response as JSON");
        }
        
        // Generic error if we couldn't extract a more specific one
        return new Response(JSON.stringify({
          error: `Gemini API error: ${response.status}. Check server logs for details.`
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Parse the successful response
      const data = await response.json();
      console.log("Gemini API response structure:", Object.keys(data));
      
      // Extract the response text
      let assistantResponse = "";
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        assistantResponse = data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected response format:", JSON.stringify(data, null, 2));
        return new Response(JSON.stringify({
          error: "Unexpected response format from Gemini API"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Return the response
      return new Response(
        JSON.stringify({
          response: assistantResponse
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error processing Gemini LLM request:", error);
      
      return new Response(
        JSON.stringify({
          error: "Failed to process your request: " + error.message
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};