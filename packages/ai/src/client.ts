import OpenAI from "openai";
import type { ListingInput, OptimizationResult } from "./types";
import { buildOptimizationPrompt, buildQuickScorePrompt } from "./prompts";

// Initialize with DeepSeek (cheaper) or OpenAI
const client = new OpenAI({
  apiKey: process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY || "",
  baseURL: process.env.AI_BASE_URL || "https://api.deepseek.com/v1",
});

const MODEL = process.env.AI_MODEL || "deepseek-chat";

export async function optimizeListing(input: ListingInput): Promise<OptimizationResult> {
  const prompt = buildOptimizationPrompt(input);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an e-commerce marketplace SEO expert. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;

    console.log("[AI] Raw response content:", content?.substring(0, 500)); // debug

    if (!content) {
      return { success: false, error: "No response from AI" };
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "AI response was not valid JSON" };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log("[AI] Parsed successfully:", JSON.stringify(parsed).substring(0, 200)); // debug

    return {
      success: true,
      data: {
        title: parsed.title || input.title,
        description: parsed.description || input.description,
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        seoScore: typeof parsed.seoScore === "number" ? parsed.seoScore : 0,
      },
      tokensUsed: response.usage?.total_tokens || 0,
    };
  } catch (error) {
    console.error("[AI] Exception:", error); // debug
    return {
      success: false,
      error: error instanceof Error ? error.message : "AI optimization failed",
    };
  }
}

export async function quickScoreListing(input: ListingInput): Promise<{ score: number; issues: string[] } | null> {
  const prompt = buildQuickScorePrompt(input);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an SEO auditor. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}
