"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateCompleteStartupProfile(idea: string, severity: number, targetMarket: string, unfairAdvantage: string, customerType: string, existingSolutions: string[]) {
  try {
    let retries = 3;
    let response;
    
    const modelsToTry = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
    let currentModelIndex = 0;

    while (retries > 0) {
      try {
        const activeModel = modelsToTry[currentModelIndex % modelsToTry.length];
        console.log(`Attempting validation with model: ${activeModel}`);
        
        const promptContent = `You are an elite Silicon Valley venture capitalist, pricing strategist, and product leader.
          A founder has submitted their startup idea for validation.
          
          Startup Idea / Pitch: "${idea}"
          Target Market: "${targetMarket}"
          Customer Type: "${customerType}"
          Self-Reported Problem Severity: ${severity}/10
          Existing Solutions: ${existingSolutions.join(', ')}
          Self-Reported Unfair Advantage: "${unfairAdvantage}"
          
          Analyze this startup comprehensively and return a massive JSON object detailing every aspect of the business.
          
          Respond EXACTLY with a JSON object in this format, and absolutely nothing else. Ensure all data is valid JSON.

          {
            "name": "A catchy name for this startup",
            "tagline": "A punchy 5-7 word tagline",
            "category": "SaaS",
            "description": "A 2-3 sentence elevator pitch",
            "founder": "Anonymous Founder",
            
            "overallScore": 75,
            "marketScore": 80,
            "productScore": 70,
            "teamScore": 50,
            "riskLevel": "High",
            
            "primaryICP": {
              "title": "Short title of target persona",
              "description": "1 sentence description",
              "painPoint": "Primary pain point",
              "budget": "$X/month"
            },
            
            "roadmapCurrent": "What they should be building now",
            "roadmapNext": "What they should build in 6 months",
            
            "pricingModel": "e.g. Freemium, Per-Seat, Usage",
            "monthlyPrice": 99,
            
            "roastData": {
              "monetization": { "title": "...", "description": "...", "score": 2.5 },
              "marketSentiment": { "saturation": "HIGH", "moat": "NONE", "viralCoefficient": "0.1" },
              "productStrategy": { "title": "...", "description": "..." },
              "landscapeAudit": { "title": "...", "description": "...", "competitors": ["Comp1", "Comp2"] },
              "unitEconomics": { "title": "...", "description": "..." }
            },
            
            "competitors": [
              {
                "name": "Competitor 1",
                "threatLevel": "High",
                "strengths": ["Strength 1", "Strength 2"],
                "weaknesses": ["Weakness 1", "Weakness 2"],
                "differentiation": "How the user's startup is different"
              },
              {
                "name": "Competitor 2",
                "threatLevel": "Medium",
                "strengths": ["Strength 1"],
                "weaknesses": ["Weakness 1"],
                "differentiation": "How the user's startup is different"
              },
              {
                "name": "Competitor 3",
                "threatLevel": "Low",
                "strengths": ["Strength 1"],
                "weaknesses": ["Weakness 1"],
                "differentiation": "How the user's startup is different"
              }
            ],
            
            "deepIcp": {
              "demographics": { "age": "...", "income": "...", "location": "...", "occupation": "..." },
              "psychographics": { "goals": ["Goal 1", "Goal 2"], "fears": ["Fear 1"], "values": ["Value 1"] }
            },
            
            "deepPricing": {
              "starterPrice": 29,
              "growthPrice": 99,
              "enterprisePrice": 499,
              "insight": "1 paragraph on why this pricing works and the psychology behind it.",
              "features": [
                { "feature": "Core Feature 1", "starter": true, "growth": true, "enterprise": true },
                { "feature": "Advanced Analytics", "starter": false, "growth": true, "enterprise": true },
                { "feature": "Custom Branding", "starter": false, "growth": false, "enterprise": true },
                { "feature": "SSO", "starter": false, "growth": false, "enterprise": true },
                { "feature": "API Access", "starter": false, "growth": "1k calls/mo", "enterprise": "Unlimited" },
                { "feature": "Support", "starter": "Email", "growth": "Priority", "enterprise": "24/7 Phone" }
              ]
            },
            
            "investorData": {
              "decision": "YES",
              "confidenceScore": 94,
              "thesis": "A 1-2 paragraph VC thesis on why this is a good or bad investment.",
              "thesisPoints": [
                { "title": "Strong Point 1", "description": "Why it matters" },
                { "title": "Strong Point 2", "description": "Why it matters" },
                { "title": "Weak Point 1", "description": "Why it matters" }
              ],
              "tags": ["SAAS", "SEED", "HIGH-RISK"],
              "marketPotential": {
                "tam": "$10B",
                "sam": "$2B",
                "som": "$100M"
              },
              "riskProfile": {
                "executionRisk": 40,
                "marketSaturation": 80,
                "technicalMoat": 20,
                "criticalConcern": "A 1 sentence critical concern."
              },
              "founderFit": {
                "score": "8.5/10",
                "description": "Short explanation",
                "capability": "Technical background needed"
              }
            }
            }
          }`;
          
        response = await groq.chat.completions.create({
          model: activeModel,
          messages: [{ role: "user", content: promptContent }],
          response_format: { type: "json_object" },
          temperature: 0.2
        });
        break; // If successful, exit the retry loop
      } catch (err: any) {
        retries--;
        currentModelIndex++; // Switch to the next model for the retry
        console.error(`Attempt failed. Retries left: ${retries}. Error:`, err.message);
        if (retries === 0) throw err;
        // Wait 2 seconds before retrying
        await new Promise(res => setTimeout(res, 2000));
      }
    }

    if (!response) {
      throw new Error("Failed to get response after multiple attempts.");
    }

    let rawText = response.choices[0]?.message?.content || "";
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanText);
    
    // give it a random ID
    parsedData.id = "startup-" + Math.random().toString(36).substring(2, 9);
    
    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("Failed to generate complete profile. Raw error:", error);
    return { success: false, error: error.message || "Failed to generate AI validation." };
  }
}
