
/*import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const serviceAccountPath = path.join(__dirname, "serviceAccount.json");
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("Place your Firebase admin JSON at scripts/serviceAccount.json");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))),
  });
}

const db = admin.firestore();

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY in env");

const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
const paraphraseModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // 🚀 use Gemini for synonym expansion

// Expand text with synonyms / paraphrasing
async function expandWithSynonyms(text: string): Promise<string> {
  if (!text) return text;
  try {
    const prompt = `Expand this text with synonyms and paraphrases, without changing the meaning. 
Keep it short, 1–2 sentences max. 
Text: "${text}"`;
    const res = await paraphraseModel.generateContent(prompt);
    const output = res.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return `${text}. ${output || ""}`;
  } catch (err) {
    console.warn("⚠️ Paraphrasing failed, using original text:", err);
    return text;
  }
}

// Embedding with retries
async function generateEmbeddingWithRetries(text: string, maxRetries = 4) {
  let delay = 1000;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await embeddingModel.embedContent(text);
      return (res as any).embedding?.values as number[];
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      const is429 = err?.status === 429 || /too many requests|quota/i.test(msg);
      if (!is429 || i === maxRetries) {
        throw err;
      }
      console.warn(`Gemini embedding 429 - retrying in ${delay}ms (attempt ${i + 1})`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("Failed to generate embedding");
}

async function backfill() {
  const snapshot = await db.collection("creators").get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (Array.isArray(data.embedding) && data.embedding.length > 1) {
      console.log(`⏭️ Skipping ${doc.id} (already has embedding)`);
      continue;
    }

    // ✅ include ALL relevant fields
    const combinedText = [
      data.name,
      data.instagramHandle,
      data.niche,
      data.location,
      data.bio,
      data.about,
      data.followerCount ? `Followers: ${data.followerCount}` : null,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!combinedText) {
      console.log(`⏭️ Skipping ${doc.id} (no searchable text)`);
      continue;
    }

    try {
      console.log(`⚡ Expanding text for ${doc.id}...`);
      const expanded = await expandWithSynonyms(combinedText);

      console.log(`⚡ Generating embedding for ${doc.id}...`);
      const emb = await generateEmbeddingWithRetries(expanded, 3);

      if (Array.isArray(emb) && emb.length) {
        await doc.ref.update({ embedding: emb });
        console.log(`✅ Updated ${doc.id}`);
      } else {
        console.warn(`❌ Empty embedding for ${doc.id}`);
      }
    } catch (err) {
      console.error(`❌ Failed for ${doc.id}:`, err instanceof Error ? err.message : err);
      await new Promise((r) => setTimeout(r, 30_000)); // wait 30s on failure
    }

    await new Promise((r) => setTimeout(r, 1500)); // respect rate limits
  }

  console.log("🎉 Backfill complete with synonym expansion");
}

backfill()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });*/
  import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const serviceAccountPath = path.join(__dirname, "serviceAccount.json");
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("Place your Firebase admin JSON at scripts/serviceAccount.json");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))),
  });
}

const db = admin.firestore();

// server-only API key
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY in env");

const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
const paraphraseModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // 🚀 used for query expansion

// 🔑 Expand text with synonyms & paraphrases before embedding
async function expandWithSynonyms(text: string): Promise<string> {
  if (!text) return text;
  try {
    const prompt = `Rewrite and expand this text with synonyms, related words, and short paraphrases. 
Keep meaning the same. 
Return 1–2 short sentences only. 
Text: "${text}"`;

    const res = await paraphraseModel.generateContent(prompt);
    const output = res.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return `${text}. ${output || ""}`;
  } catch (err) {
    console.warn("⚠️ Paraphrasing failed, fallback to original text:", err);
    return text;
  }
}

// Retry wrapper for embeddings
async function generateEmbeddingWithRetries(text: string, maxRetries = 4) {
  let delay = 1000;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await embeddingModel.embedContent(text);
      return (res as any).embedding?.values as number[];
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      const is429 = err?.status === 429 || /too many requests|quota/i.test(msg);
      if (!is429 || i === maxRetries) throw err;

      console.warn(`429 quota hit — retrying in ${delay}ms (attempt ${i + 1})`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("Failed to generate embedding after retries");
}

async function backfill() {
  const snapshot = await db.collection("creators").get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (Array.isArray(data.embedding) && data.embedding.length > 1) {
      console.log(`⏭️ Skipping ${doc.id} (already has embedding)`);
      continue;
    }

    // ✅ Combine all relevant fields into searchable text
    const combinedText = [
      data.name,
      data.instagramHandle,
      data.niche,
      data.location,
      data.bio,
      data.about,
      data.followerCount ? `Followers: ${data.followerCount}` : null,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!combinedText) {
      console.log(`⏭️ Skipping ${doc.id} (no searchable text)`);
      continue;
    }

    try {
      console.log(`⚡ Expanding text for ${doc.id}...`);
      const expanded = await expandWithSynonyms(combinedText);

      console.log(`⚡ Generating embedding for ${doc.id}...`);
      const emb = await generateEmbeddingWithRetries(expanded, 3);

      if (Array.isArray(emb) && emb.length) {
        await doc.ref.update({ embedding: emb });
        console.log(`✅ Updated ${doc.id}`);
      } else {
        console.warn(`❌ Empty embedding for ${doc.id}`);
      }
    } catch (err) {
      console.error(`❌ Failed for ${doc.id}:`, err instanceof Error ? err.message : err);
      await new Promise((r) => setTimeout(r, 30_000)); // wait 30s if failure
    }

    await new Promise((r) => setTimeout(r, 1500)); // avoid RPM limit
  }

  console.log("🎉 Backfill complete (with synonym expansion)");
}

backfill()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

