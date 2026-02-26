// routes/api/doc-summary.ts
import { Handlers } from "$fresh/server.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function extractPDFText(pdfPath: string): Promise<string> {
  console.log(`Summary API: Attempting to extract text from ${pdfPath}`);
  try {
    // Normalize path: if it starts with ./static/ or /static/, remove it to get just the filename
    const filename = pdfPath.replace(/^(\.?\/)?static\//, "");
    
    const possiblePaths = [
      `./static/${filename}`,
      `./static/pdf/${filename}`,
      filename,
    ];

    let pdfFile: Uint8Array | null = null;
    let successfulPath = "";

    // Try multiple path variations
    for (const path of possiblePaths) {
      try {
        pdfFile = await Deno.readFile(path);
        if (pdfFile) {
          successfulPath = path;
          console.log(`Summary API: Successfully read PDF from ${path}`);
          break;
        }
      } catch (e) {
        // Silently continue to next path
      }
    }

    if (!pdfFile) {
      throw new Error(`File system error: Could not find PDF file: ${filename} (tried: ${possiblePaths.join(", ")})`);
    }
    
    // Parse PDF and extract text
    try {
      const parseResult = await pdfParse(pdfFile);
      
      // Clean up and normalize text
      const extractedText = parseResult.text
        .replace(/\s+/g, ' ')
        .trim();
      
      if (!extractedText) {
        console.warn("Summary API: Extracted text is empty");
        return "No text could be extracted from this PDF.";
      }

      console.log(`Summary API: Extracted ${extractedText.length} characters`);
      return extractedText;
    } catch (parseError) {
      console.error("Summary API: pdf-parse error:", parseError);
      throw new Error(`PDF Parsing Error: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Summary API: Extraction error:", error);
    throw error;
  }
}

// Function to generate summary using Gemini API
async function generateSummary(documentText: string): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  
  if (!apiKey || apiKey.trim().length === 0) {
    console.error("Summary API: GEMINI_API_KEY is missing or empty");
    throw new Error("Configuration Error: Gemini API key not found. Please check your .env file.");
  }

  console.log("Summary API: Generating summary with Gemini...");

  const prompt = `Please provide a concise, informative summary of the following document. 
  Focus on the key points, main arguments, and significant findings. 
  The summary should be clear, objective, and capture the essence of the document:

  ${documentText.substring(0, 15000)} // Truncate to stay within context limits

  Summary:`;

  const endpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-3-flash-preview:generateContent";
  const url = `${endpoint}?key=${apiKey}`;

  try {
    const requestPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
        topP: 0.95,
        topK: 40
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Summary API: Gemini API error status:", response.status);
      throw new Error(`Gemini API Error (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    // Extract summary text
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error("API Error: Unexpected response format from Gemini");
  } catch (apiError) {
    console.error("Summary API: Fetch error:", apiError);
    throw apiError;
  }
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { documentPath } = body;
      
      if (!documentPath) {
        return new Response(JSON.stringify({
          error: "Missing parameter: No document path provided"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Extract text from PDF
      const extractedText = await extractPDFText(documentPath);
      
      // Generate summary
      const summary = await generateSummary(extractedText);
      
      // Return summary
      return new Response(JSON.stringify({
        summary
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Summary API: Global handler catch:", error);
      
      return new Response(JSON.stringify({
        error: error.message || "An internal server error occurred"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};