import { GoogleGenAI } from "@google/genai";
import { SearchResult, SearchParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchDataSources = async (params: SearchParams): Promise<SearchResult> => {
  const modelId = 'gemini-2.5-flash';

  let systemInstruction = '';
  let prompt = '';

  if (params.mode === 'RESEARCH') {
    // Research Mode Prompt
    systemInstruction = `
      You are an academic research assistant specializing in Geography, GIS, and Remote Sensing.
      Your role is to help students and researchers find relevant academic papers, case studies, and methodologies.

      Guidance:
      - Prioritize peer-reviewed journals (e.g., International Journal of Geographical Information Science, Remote Sensing of Environment), academic conferences, and trusted repositories.
      - Focus on finding papers that match the user's specific methodology or topic.
      - Provide the full title, authors, year, and a brief summary of why it's relevant.
      - Use the googleSearch tool to find actual links to PDFs or publisher pages (DOI).
      - Do NOT make up papers.
    `;

    prompt = `
      I need to find research papers.
      
      Criteria:
      - Paper Type: ${params.dataType}
      - Geographic Focus: ${params.location || "General / Not specified"}
      - Research Topic/Question: ${params.question}

      Please search for relevant academic resources.
      Provide a curated list of papers. For each, include the Title, Authors, and a one-sentence summary of the methodology or finding.
      Highlight key search terms the student should use in Google Scholar.
    `;

  } else {
    // Data Mode Prompt
    systemInstruction = `
      You are an expert GIS Data Specialist and Geospatial Engineer. 
      Your role is to help analysts find the most accurate, authoritative, and up-to-date geospatial data sources.
      
      Guidance:
      - Prioritize official government portals (e.g., USGS, NASA, NOAA, local city open data), reputable research institutions, and major verified open data hubs (e.g., OSM, Natural Earth).
      - Assess accuracy and resolution suitable for professional analysis.
      - Explicitly mention file formats (Shapefile, GeoTIFF, API availability) when possible.
      - Provide a structured summary of where to look and why those sources are best for the specific location and problem.
      - Use the googleSearch tool to verify the existence of these datasets and get real URLs.
    `;

    prompt = `
      I need to find GIS data.
      
      Criteria:
      - Data Type: ${params.dataType}
      - Target Location: ${params.location}
      - Specific Question/Analysis Goal: ${params.question}

      Please perform a search to find the best available data sources. 
      Provide a comprehensive guide on where to download this data. 
      Highlight the "Best Source" based on accuracy and authority.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No detailed analysis provided.";
    
    // Extract grounding chunks for valid links
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title || "Web Source",
            uri: chunk.web.uri,
          };
        }
        return null;
      })
      .filter((source: any) => source !== null) as Array<{ title: string; uri: string }>;

    // Deduplicate sources by URI
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return {
      markdown: text,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to retrieve information. Please check your connection and API key.");
  }
};