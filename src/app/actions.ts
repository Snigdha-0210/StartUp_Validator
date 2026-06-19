"use server";

import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateStartupRoast(startupDescription: string, intensityLabel: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a brutal, highly experienced Silicon Valley venture capitalist. 
      Roast this startup idea and point out its fatal flaws, market risks, and why it might fail. 
      Be concise, direct, and constructive but harsh. The intensity level requested is: ${intensityLabel}.
      
      Respond EXACTLY with a JSON object in this format, and absolutely nothing else:
      {
        "monetization": {
          "title": "A short, punchy quote about why they won't make money",
          "description": "2-3 sentences explaining the core monetization flaw.",
          "score": 2.4
        },
        "marketSentiment": {
          "saturation": "CRITICAL / HIGH / MEDIUM",
          "moat": "SHALLOW / NONE / DEEP",
          "viralCoefficient": "0.12 (a low number)"
        },
        "productStrategy": {
          "title": "A short quote about weak differentiation",
          "description": "2-3 sentences on why the product strategy is bad."
        },
        "landscapeAudit": {
          "title": "A short quote about existing competitors",
          "description": "2-3 sentences about competitors.",
          "competitors": ["COMPANY 1", "COMPANY 2", "COMPANY 3"]
        },
        "unitEconomics": {
          "title": "Quote about acquisition costs",
          "description": "2-3 sentences explaining why CAC/LTV is terrible."
        }
      }

      Startup Idea: ${startupDescription}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    // Gemini sometimes wraps JSON in markdown blocks even with application/json
    let rawText = response.text || "";
    if (typeof rawText === 'function') {
      // Just in case it's the old SDK
      rawText = (response as any).text();
    }
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanText);
    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("Failed to generate roast. Raw error:", error);
    
    // If Gemini is overloaded (503), return fallback data so the demo never breaks
    if (error.message && error.message.includes("503")) {
      return { 
        success: true, 
        data: {
          "monetization": {
            "title": "A solution looking for a problem.",
            "description": "[FALLBACK MODE - API OVERLOADED] Your value proposition feels like a nice-to-have utility. Businesses are slashing non-critical SaaS.",
            "score": 2.4
          },
          "marketSentiment": {
            "saturation": "CRITICAL",
            "moat": "SHALLOW",
            "viralCoefficient": "0.12"
          },
          "productStrategy": {
            "title": "Your differentiation is weak.",
            "description": "You're entering a crowded market with a me-too feature set. Without a proprietary data advantage, you'll be invisible."
          },
          "landscapeAudit": {
            "title": "Existing tools replace you.",
            "description": "Notion just added this. Slack is building this. Why would an enterprise add another seat for your narrow feature?",
            "competitors": ["NOTION", "SLACK", "LINEAR"]
          },
          "unitEconomics": {
            "title": "Acquisition is expensive.",
            "description": "Your LTV/CAC ratio is trending toward zero. Organic growth is a myth for your category."
          }
        } 
      };
    }

    return { success: false, error: error.message || "Failed to generate roast." };
  }
}

export async function fetchIndustryTrends(query: string) {
  try {
    const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}`);
    const data = await res.json();
    return { success: true, articles: data.articles?.slice(0, 5) || [] };
  } catch (error) {
    return { success: false, error: "Failed to fetch news." };
  }
}

export async function generateGroqMarketSignals(startupDescription: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert AI venture analyst. Analyze the startup idea and return a JSON object with strictly these keys: market_score (number 0-10), competition_score (number 0-10), monetization_score (number 0-10), execution_score (number 0-10), confidence (number 0-100). Do not output any markdown formatting, only pure JSON."
        },
        {
          role: "user",
          content: `Startup Idea: ${startupDescription}`
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const rawContent = chatCompletion.choices[0]?.message?.content || "{}";
    const cleanContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanContent);
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to generate market signals via Groq:", error);
    return { success: false, error: error.message || "Failed to generate market signals." };
  }
}
