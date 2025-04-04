// test-gemini.ts
// Run with: deno run -A test-gemini.ts

// Get API key from environment variable
const apiKey = Deno.env.get("GEMINI_API_KEY");
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY environment variable not set");
  Deno.exit(1);
}

console.log("API key length:", apiKey.length);
console.log("API key first 5 chars:", apiKey.substring(0, 5) + "...");

// Step 1: List available models
async function listModels() {
  console.log("\n--- Step 1: Listing available models ---");
  
  const modelsUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  console.log("Requesting models from:", modelsUrl);
  
  try {
    const response = await fetch(modelsUrl);
    console.log("Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Available models:");
      if (data.models && data.models.length > 0) {
        data.models.forEach((model: any) => {
          console.log(`- ${model.name}`);
        });
        return data.models[0].name; // Return first model name for testing
      } else {
        console.log("No models found in response");
        return null;
      }
    } else {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return null;
  }
}

// Step 2: Test generating content with a model
async function testGeneration(modelName: string) {
  console.log(`\n--- Step 2: Testing content generation with model: ${modelName} ---`);
  
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent`;
  const url = `${endpoint}?key=${apiKey}`;
  
  console.log("Request URL:", endpoint);
  
  const requestPayload = {
    contents: [
      {
        role: "user",
        parts: [{ text: "Say hello and introduce yourself in one short sentence." }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 100
    }
  };
  
  try {
    console.log("Sending request...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestPayload)
    });
    
    console.log("Response status:", response.status);
    
    const responseText = await response.text();
    console.log("Raw response:", responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content && data.candidates[0].content.parts) {
          console.log("\nSuccessful response! Model output:");
          console.log(data.candidates[0].content.parts[0].text);
        } else {
          console.log("Unexpected response structure");
        }
      } catch (e) {
        console.error("Error parsing JSON response:", e);
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

// Run the test
async function runTest() {
  console.log("Starting Gemini API test...");
  
  // First, list available models
  const modelName = await listModels();
  
  // If we found a model, test content generation
  if (modelName) {
    await testGeneration(modelName);
  } else {
    // Try with default model names
    console.log("\nTrying with default model name: gemini-pro");
    await testGeneration("gemini-pro");
  }
}

runTest();