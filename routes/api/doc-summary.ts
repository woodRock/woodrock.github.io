// routes/api/doc-summary.ts
import { Handlers } from "$fresh/server.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib";

// Function to extract text from PDF
import pdfParse from "npm:pdf-parse";

async function extractPDFText(pdfPath: string): Promise<string> {
  try {
    // Normalize path variations
    const possiblePaths = [
      `./static/pdf/${pdfPath}`,
      `./static/${pdfPath}`,
      `./${pdfPath}`,
      `../../${pdfPath}`
    ];

    let pdfFile: Uint8Array | null = null;

    // Try multiple path variations
    for (const path of possiblePaths) {
      try {
        pdfFile = await Deno.readFile(path);
        if (pdfFile) {
          console.log(`Successfully read PDF from ${path}`);
          break;
        }
      } catch (e) {
        console.log(`Failed to read file at ${path}:`, e);
      }
    }

    if (!pdfFile) {
      throw new Error(`Could not find PDF file: ${pdfPath}`);
    }
    
    // Parse PDF and extract text
    const parseResult = await pdfParse(pdfFile);
    
    // Clean up and normalize text
    const extractedText = parseResult.text
      .replace(/\s+/g, ' ')
      .trim();
    
    return extractedText;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Function to generate summary using Gemini API
async function generateSummary(documentText: string): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("API key not configured");
  }

  const prompt = `Please provide a concise, informative summary of the following document. 
  Focus on the key points, main arguments, and significant findings. 
  The summary should be clear, objective, and capture the essence of the document:

  ${documentText}

  Summary:`;

  const endpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
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
    throw new Error(`Gemini API error: ${errorText}`);
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

  throw new Error("Unexpected API response format");
}

export const handler: Handlers = {
  async POST(req) {
    try {
      // Parse request body
      const { documentPath } = await req.json();
      
      if (!documentPath) {
        return new Response(JSON.stringify({
          error: "No document path provided"
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
      console.error("Error in doc summary API:", error);
      
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};