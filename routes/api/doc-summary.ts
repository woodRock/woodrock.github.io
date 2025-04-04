// routes/api/doc-summary.ts
import { Handlers } from "$fresh/server.ts";

// Function to get document text based on document path (shared with doc-chat.ts)
async function getDocumentText(documentPath: string): Promise<string> {
  // Extract filename from path
  const filename = documentPath.split('/').pop() || "";
  
  // Map of known documents and their content
  const knownDocuments: Record<string, string> = {
    "wood2022rapid.pdf": `Title: Rapid determination of bulk composition and quality of marine biomass in Mass Spectrometry
Author: Jesse Wood
Year: 2022
Type: PhD Research Proposal
Institution: Victoria University of Wellington

The proposal focuses on developing AI methods for analyzing mass spectrometry data from marine biomass and fish samples.

Key Research Objectives:
1. Fish species and body part identification through binary and multi-class classification
2. Quantitative contaminant analysis using multi-label classification and multi-output regression
3. Traceability verification through pair-wise comparison and instance recognition techniques

The proposed methodology includes:
- Pre-training strategies like Next Spectra Prediction and Masked Spectra Modeling
- Improved interpretation of spectra patterns and their correlation with chemical attributes
- Validation against traditional baseline methods across downstream tasks

Expected outcomes include enhanced chemical analytical processes and fresh insights into marine biology and fisheries through advanced AI applications. The work combines mass spectrometry techniques with machine learning to address important challenges in seafood quality, composition analysis, and traceability.`,

    "wood2022automated.pdf": `Title: Automated Fish Classification Using Unprocessed Fatty Acid Chromatographic Data: A Machine Learning Approach
Author: Jesse Wood
Year: 2022
Type: Conference Paper
Publisher: Australasian Joint Conference on Artificial Intelligence

Abstract:
Fish is approximately 40% edible fillet. The remaining 60% can be processed into low-value fertilizer or high-value pharmaceutical-grade omega-3 concentrates. High-value manufacturing options depend on the composition of the biomass, which varies with fish species, fish tissue and seasonally throughout the year. Fatty acid composition, measured by Gas Chromatography, is an important measure of marine biomass quality. This technique is accurate and precise, but processing and interpreting the results is time-consuming and requires domain-specific expertise. 

The paper investigates different classification and feature selection algorithms for their ability to automate the processing of Gas Chromatography data. Experiments found that SVM could classify compositionally diverse marine biomass based on raw chromatographic fatty acid data. The SVM model is interpretable through visualization which can highlight important features for classification. Experiments demonstrated that applying feature selection significantly reduced dimensionality and improved classification performance on high-dimensional low sample-size datasets. According to the reduction rate, feature selection could accelerate the classification system up to four times.

Key findings:
- SVM models can successfully classify different fish species based on fatty acid profiles
- Feature selection methods significantly improve classification performance
- The approach reduces the need for manual processing of chromatographic data
- The system can potentially accelerate analysis up to four times compared to traditional methods`
  };
  
  // Return known document content or a generic placeholder
  if (knownDocuments[filename]) {
    return knownDocuments[filename];
  } else {
    // For unknown documents, provide a generic response based on the filename
    const nameWithoutExt = filename.replace(/\.pdf$/i, "");
    return `Document: ${nameWithoutExt}\n\nThis appears to be a document about ${nameWithoutExt.replace(/[_-]/g, " ")}.`;
  }
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const { documentPath } = await req.json();
      
      if (!documentPath) {
        return new Response(JSON.stringify({
          error: "Missing document path"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Get API key
      const apiKey = Deno.env.get("GEMINI_API_KEY");
      if (!apiKey) {
        return new Response(JSON.stringify({
          error: "API key not configured"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Get document text
      const documentText = await getDocumentText(documentPath);
      
      // First, get available models
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
      
      // Extract filename for context
      const filename = documentPath.split('/').pop() || "document";
      
      // Create a prompt for the LLM to generate a summary
      const prompt = `I'll be sharing a document. Please provide a brief, friendly introduction to this document that summarizes its main focus in 3-4 sentences. Your response should be conversational as if you're introducing the document to someone in a chat.

Here's the document content:

${documentText}

Keep your response concise, informative, and welcoming. Focus on helping the user understand what this document is about and what they might learn by discussing it.`;
      
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
          maxOutputTokens: 800,
          topP: 0.95,
          topK: 40
        }
      };
      
      console.log(`Sending summary request to Gemini model: ${modelToUse}`);
      
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
        return new Response(JSON.stringify({
          error: `API error: ${response.status}`
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const data = await response.json();
      
      let summaryText = "";
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        summaryText = data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response format:", JSON.stringify(data));
        return new Response(JSON.stringify({
          error: "Unexpected API response format"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Return the summary
      return new Response(JSON.stringify({
        summary: summaryText
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Error in doc summary API:", err);
      
      return new Response(JSON.stringify({
        error: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};