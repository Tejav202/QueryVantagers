require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Initialize Gemini with your secret key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateMQL(userInput) {
    try {
        console.log("⏳ Translating English to MongoDB Query Language...");
        
        // Use the flash model for maximum speed
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // The "Pro Prompt" that forces Gemini to act strictly as a database translator
        const prompt = `You are an expert MongoDB administrator. Convert this natural language into a MongoDB query JSON object: "${userInput}". Output ONLY valid JSON, no markdown formatting like \`\`\`json, and no conversational text.`;
        
        const result = await model.generateContent(prompt);
        console.log("\n✅ SUCCESS! AI Engine Output:");
        console.log(result.response.text());
        
    } catch (error) {
        console.error("❌ ERROR:", error.message);
    }
}

// Fire the test sequence
generateMQL("Find all high priority maintenance requests for unit 101");