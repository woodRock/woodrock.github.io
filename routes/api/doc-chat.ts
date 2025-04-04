// routes/api/doc-chat.ts
import { Handlers } from "$fresh/server.ts";

// Function to get document text based on document path
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
    - The system can potentially accelerate analysis up to four times compared to traditional methods`,
    
    "wood2025hook.pdf": `Title: Hook, Line and Spectra: Machine Learning for Fish Species and Part Classification using Rapid Evaporative Ionization Mass Spectrometry
    Author: Jesse Wood
    Year: 2025
    Type: Journal Article
    Publisher: TBD

    Abstract: 
    Marine biomass composition analysis traditionally requires time-consuming processes and domain expertise. This study demonstrates the effectiveness of Rapid Evaporative ionization Mass Spectrometry (REIMS) combined with advanced machine learning techniques for accurate marine biomass composition determination. Using fish species and body parts as model systems representing diverse biochemical profiles, we investigate various machine learning methods, including unsupervised pre-training strategies for transformers. The deep learning approaches consistently outperformed traditional machine learning across all tasks. We further explored the explainability of the best-performing and mostly black-box models using Local Interpretable Model-agnostic Explanations to find important features driving decisions behind each of the top-performing classifiers. REIMS analysis with machine learning can be accurate and potentially explainable technique for automated marine biomass compositional analysis. It has potential applications in marine-based industry quality control, product optimization, and food safety monitoring.

    Key findings:
    - Deep learning models, especially transformers, significantly outperformed traditional methods in classifying fish species (99.62% accuracy) and body parts (83.94% accuracy)
    - Pre-training transformer models improved classification performance by capturing complex patterns in high-dimensional mass spectrometry data
    - Explainable AI techniques revealed specific mass-to-charge ratios that are critical for distinguishing between fish species and body parts
    - The research demonstrates the potential of machine learning to automate marine biomass analysis, with applications in quality control, fraud detection, and product optimization
    - The study introduces innovative techniques like progressive masking for pre-training, showing how machine learning can extract valuable insights from complex scientific data
    `
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
      const { documentPath, documentTitle, question, history } = await req.json();
      
      if (!documentPath || !question) {
        return new Response(JSON.stringify({
          error: "Missing required parameters"
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
              m.name.includes("flash"));
            
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
        modelToUse = "models/gemini-1.5-flash";
      }
      
      // Process chat history for context
      const chatContext = history
        ? history
            .filter((msg: any) => msg.role !== "system")
            .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n\n")
        : "";
      
      // Create a prompt for the LLM
      const prompt = `You are an AI research assistant helping a user chat about a document. The document is:

      ${documentText}

      ${chatContext ? `Previous conversation:\n${chatContext}\n\n` : ""}

      User's latest question: "${question}"

      Provide a helpful, accurate, and concise response focused on the document's content. If the question asks about information not in the document, you can make reasonable inferences based on the research area, but clearly indicate what's explicitly in the document versus what's inferred.

      Format your response in a clear, conversational style and make sure it directly addresses the user's question.`;
      
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
      
      // Specific handling for 429 error
      if (response.status === 429) {
        return new Response(JSON.stringify({
          error: "API credits exhausted. Please upgrade your plan.",
          statusCode: 429
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);
        return new Response(JSON.stringify({
          error: `API error: ${response.status}`,
          details: errorText
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const data = await response.json();
      
      let responseText = "";
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        responseText = data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response format:", JSON.stringify(data));
        return new Response(JSON.stringify({
          error: "Unexpected API response format"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Return the response
      return new Response(JSON.stringify({
        response: responseText
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Error in doc chat API:", err);
      
      return new Response(JSON.stringify({
        error: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};