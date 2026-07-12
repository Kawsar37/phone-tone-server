import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const getPhoneSpecsFromGemini = async (phoneName: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
    });

    const prompt = `
      You are a strict JSON API. 
      I will give you a phone name: "${phoneName}".
      Return ONLY a valid JSON object containing the detailed specifications for this exact phone. 
      Do not include markdown formatting (like \`\`\`json), do not include any text outside the JSON.
      
      The JSON must strictly follow this structure:
      {
        "shortDescription": "A 1 sentence catchy summary.",
        "description": "A 2-3 sentence detailed overview.",
        "price": 999,
        "operatingSystem": "Android 14",
        "processor": "Snapdragon 8 Gen 3",
        "chipset": "SM8650-AC",
        "gpu": "Adreno 750",
        "ram": "12GB",
        "storage": "256GB",
        "display": { "type": "AMOLED", "size": "6.8 inches", "resolution": "1440 x 3120", "refreshRate": "120Hz" },
        "battery": { "capacity": "5000 mAh", "charging": "65W wired" },
        "camera": { "rear": "200MP + 50MP + 10MP", "front": "12MP" },
        "connectivity": { "network": "5G", "wifi": "Wi-Fi 7", "bluetooth": "5.3", "nfc": "Yes" },
        "colors": ["Titanium Black", "Titanium Gray", "Titanium Violet"],
        "releaseDate": "2024-01-17T00:00:00.000Z",
        "rating": 4.8,
        "stock": 50
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown if Gemini accidentally adds it
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const specs = JSON.parse(text);
    return specs;
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to generate phone specs from AI.");
  }
};
