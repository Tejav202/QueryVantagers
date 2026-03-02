const { systemPrompt } = require("./systemPrompt");
const { validateQuery } = require("./queryValidator");

async function generateQuery(userInput, geminiClient) {
  try {
    const prompt = `${systemPrompt}\nInput: ${userInput}\nOutput:`;
    const response = await geminiClient.generateContent(prompt);
    const generatedQuery = response?.response?.text()?.trim();

    if (!generatedQuery) {
      throw new Error("AI did not return a valid query");
    }

    const validation = validateQuery(generatedQuery);
    if (!validation.valid) {
      throw new Error("Unsafe query blocked by validation layer");
    }

    return generatedQuery;
  } catch (error) {
    console.error("AI Query Generation Error:", error.message);
    throw error; 
  }
}

module.exports = { generateQuery };