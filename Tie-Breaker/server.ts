import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up Express to parse JSON bodies
app.use(express.json());

// Initialize Gemini Client safely
// Set User-Agent as 'aistudio-build' for telemetry as requested
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Decision evaluating API endpoint
app.post("/api/tiebreaker", async (req, res) => {
  try {
    const { title, optionA, optionB } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "A decision topic/question is required." });
    }

    const ai = getGeminiClient();

    const userPrompt = `
      Decision Topic: "${title}"
      Option A provided: "${optionA || ""}"
      Option B provided: "${optionB || ""}"
    `;

    const systemInstruction = `You are "The Tiebreaker", an elite personal and strategic decision consultant.
Your job is to take a difficult decision, break it down objectively, and help the user resolve it.

If the user did not specify Option A or Option B names (or if they are blank), you MUST infer the two most plausible competing, realistic options based on their decision question.
Ensure the name of optionA and optionB are concise and represent these two competing paths (e.g. "Buy Tesla Model 3" vs "Keep 2012 Sedan").

Task details to fill in and return as JSON:
1. Formulate 4 to 6 Pros and 4 to 6 Cons for both Option A and Option B. Each pro and con must have:
   - "text": Description of why it is a pro or con.
   - "impact": An integer from 1 (negligible) to 5 (highest importance/critical weight).
   - "category": Simple theme label (e.g. "Financial", "Lifestyle", "Time", "Emotional", "Convenience", "Career").
2. Construct a side-by-side comparison matrix of exactly 5 key criteria items (e.g., "Upfront Cost", "Mental Peace", "Future Flexibility"). Give each option a score from 1 to 5 and a short 1-sentence analytical justification.
3. Formulate a complete SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) for each option with at least 3 distinct bullets per quadrant.
4. Give an honest raw "overallScore" out of 100 for each option summarizing their objective viability.
5. In "verdict", state a clear final recommendation, summarizing which option is mathematically/critically recommended.
6. In "recommendationReasoning", deliver a deeply thoughtful, detailed 2-3 paragraph breakdown of the core trade-offs, making the ultimate rationale clear, persuasive, and actionable.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        optionA: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            pros: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  impact: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                },
                required: ["text", "impact", "category"],
              },
            },
            cons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  impact: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                },
                required: ["text", "impact", "category"],
              },
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"],
            },
          },
          required: ["name", "overallScore", "summary", "pros", "cons", "swot"],
        },
        optionB: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            pros: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  impact: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                },
                required: ["text", "impact", "category"],
              },
            },
            cons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  impact: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                },
                required: ["text", "impact", "category"],
              },
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"],
            },
          },
          required: ["name", "overallScore", "summary", "pros", "cons", "swot"],
        },
        comparisonTable: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              criteria: { type: Type.STRING },
              optionAScore: { type: Type.INTEGER },
              optionAExplanation: { type: Type.STRING },
              optionBScore: { type: Type.INTEGER },
              optionBExplanation: { type: Type.STRING },
            },
            required: [
              "criteria",
              "optionAScore",
              "optionAExplanation",
              "optionBScore",
              "optionBExplanation",
            ],
          },
        },
        verdict: { type: Type.STRING },
        recommendationReasoning: { type: Type.STRING },
      },
      required: ["optionA", "optionB", "comparisonTable", "verdict", "recommendationReasoning"],
    };

    console.log("Calling Gemini API for tiebreaker evaluation...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response returned from Gemini API");
    }

    const parsedData = JSON.parse(textOutput);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini decision processing failure:", error);
    res.status(500).json({
      error: "Failed to evaluate your decision. Please try again.",
      details: error.message || String(error),
    });
  }
});

// Serve Frontend according to environment instructions
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server boot secure on http://localhost:${PORT}`);
  });
}

setupServer();
