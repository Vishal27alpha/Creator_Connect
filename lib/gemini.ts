import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
if (!apiKey) {
  throw new Error("❌ Missing Gemini API key. Set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Embedding + Chat Models
export const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
export const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ✅ Helper function to generate embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("⚠️ Cannot generate embedding for empty text");
  }

  const result = await embeddingModel.embedContent(text);

  // Ensure Gemini actually returned embeddings
  const embedding = (result as any)?.embedding?.values as number[] | undefined;

  if (!embedding || embedding.length === 0) {
    throw new Error("⚠️ Gemini returned no embedding");
  }

  return embedding;
}
