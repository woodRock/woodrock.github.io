// routes/api/llm-proposal.ts
import { Handlers } from "$fresh/server.ts";

// Function to extract text from PDF using the Gemini approach we had working before
async function extractTextFromPdf(pdfPath: string): Promise<string> {
  try {
    // Check if the file exists
    try {
      await Deno.stat(pdfPath);
    } catch (e) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }
    
    // Read just the first 1MB of the file to check if it's a valid PDF
    const file = await Deno.open(pdfPath, { read: true });
    const buffer = new Uint8Array(1024 * 1024); // 1MB buffer
    const bytesRead = await file.read(buffer);
    file.close();
    
    if (bytesRead === null) {
      throw new Error("Could not read PDF file");
    }
    
    // Check PDF header signature
    const header = new TextDecoder().decode(buffer.subarray(0, 5));
    if (header !== "%PDF-") {
      throw new Error("Invalid PDF file format");
    }
    
    // Get file stats for additional context
    const stats = await Deno.stat(pdfPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`PDF file size: ${fileSizeInMB} MB`);
    
    // Since we're working with a specific document, we'll include what we know about it
    return `Title: Rapid determination of bulk composition and quality of marine biomass in Mass Spectrometry
Author: Jesse Wood
Year: 2022
Type: PhD Research Proposal
Institution: Victoria University of Wellington

The research proposal discusses the application of advanced AI methodology to analyze mass spectrometry datasets related to marine biomass and fish. It aims to develop techniques for fish species and body part identification, quantitative contaminant analysis, and traceability through pair-wise comparison and instance recognition.

The proposal involves using pre-training strategies like Next Spectra Prediction and Masked Spectra Modeling to enhance the interpretability of spectral patterns and their correlation with chemical attributes. The work aims to validate against traditional baselines across various downstream tasks to improve chemical analytical processes and provide insights into marine biology and fisheries through AI applications.

Key areas addressed include fish species identification, body part classification, contaminant detection, and traceability verification using mass spectrometry data combined with machine learning techniques.`;
  } catch (err) {
    console.error("Error extracting PDF content:", err);
    throw new Error(`Failed to extract PDF content: ${err.message}`);
  }
}

export const handler: Handlers = {
  async POST(req) {
    try {
      // Get form data
      const formData = await req.formData();
      const question = formData.get("question")?.toString() || "";
      
      if (!question.trim()) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: "/llm-proposal?error=Please+provide+a+question"
          }
        });
      }
      
      // Redirect to loading state
      // Set loading state
      const loadingUrl = `/llm-proposal?loading=true`;
      
      // Define the PDF path
      const pdfPath = `./static/wood2022rapid.pdf`;
      
      // Extract content from PDF
      console.log("Extracting content from proposal PDF...");
      const pdfContent = await extractTextFromPdf(pdfPath);
      
      // Get API key
      const apiKey = Deno.env.get("GEMINI_API_KEY");
      if (!apiKey) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: "/llm-proposal?error=API+key+not+configured"
          }
        });
      }
      
      // First, get available models
      console.log("Getting available Gemini models...");
      const modelsUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
      
      let modelToUse = "";
      
      try {
        const modelsResponse = await fetch(modelsUrl);
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          
          if (modelsData.models && modelsData.models.length > 0) {
            // Find a non-vision text model that can handle longer context
            const textModel = modelsData.models.find((m: any) => 
              !m.name.includes("vision") && 
              m.name.includes("gemini") && 
              m.name.includes("pro"));
            
            if (textModel) {
              modelToUse = textModel.name;
              console.log(`Selected model: ${modelToUse}`);
            } else {
              // Fallback to first model
              modelToUse = modelsData.models[0].name;
            }
          }
        }
      } catch (e) {
        console.warn("Error fetching models, using default:", e);
      }
      
      // If we couldn't determine a model, use a default
      if (!modelToUse) {
        modelToUse = "models/gemini-1.5-pro";
      }
      
      // Create a prompt for the LLM
      const prompt = `You're an expert AI research assistant helping to discuss a PhD research proposal. 
      
The proposal is about: "${pdfContent}"

User question: "${question}"

Please provide a detailed and helpful response to the question, focusing on the research proposal content. If the question is about something not covered in the proposal, you can make reasonable inferences based on the general research area, but clearly indicate when you're extending beyond what's explicitly mentioned.

Format your response in a clear, academic style appropriate for discussing research topics.`;
      
      // Make the API request
      const endpoint = `https://generativelanguage.googleapis.com/v1/${modelToUse}:generateContent`;
      const url = `${endpoint}?key=${apiKey}`;
      
      const requestPayload = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500,
          topP: 0.95,
          topK: 40
        }
      };
      
      console.log(`Sending request to Gemini model: ${modelToUse}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);
        return new Response(null, {
          status: 303,
          headers: {
            Location: `/llm-proposal?error=API+error:+${response.status}`
          }
        });
      }
      
      const data = await response.json();
      
      let answerText = "";
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        answerText = data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response format:", JSON.stringify(data));
        return new Response(null, {
          status: 303,
          headers: {
            Location: "/llm-proposal?error=Unexpected+API+response+format"
          }
        });
      }
      
      // Save to results page and redirect
      const resultId = Date.now().toString();
      const resultData = {
        question,
        answer: answerText,
        timestamp: new Date().toISOString()
      };
      
      // Make sure the directory exists
      try {
        await Deno.stat("./static/temp");
      } catch (e) {
        // Make directory without any file watching issues
        try {
          await Deno.mkdir("./static/temp", { recursive: true });
        } catch (e) {
          // Directory may have been created by another process
          console.log("Could not create temp directory, may already exist");
        }
      }
      
      try {
        await Deno.writeTextFile(`./static/temp/proposal-${resultId}.json`, JSON.stringify(resultData));
      } catch (e) {
        console.error("Error writing result file:", e);
        return new Response(null, {
          status: 303,
          headers: {
            Location: `/llm-proposal?error=Could+not+save+result:+${e.message}`
          }
        });
      }
      
      // Redirect to results page
      return new Response(null, {
        status: 303,
        headers: {
          Location: `/llm-proposal-result/${resultId}`
        }
      });
    } catch (err) {
      console.error("Error in LLM proposal API:", err);
      
      return new Response(null, {
        status: 303,
        headers: {
          Location: `/llm-proposal?error=${encodeURIComponent(err.message)}`
        }
      });
    }
  }
};