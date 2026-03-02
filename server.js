const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { validateQuery } = require("./ai-engine/queryValidator");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection URI - Replace with your Atlas string or local URI
const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);
const dbName = "QueryVantageDB";

app.post("/generate", async (req, res) => {
  try {
    const { query } = req.body;

    // 1. For now, we manually map your "Natural Language" to a JSON filter
    // Since we aren't using AI, we mimic the logic from your old 'fakeGeminiClient'
    const manualMQL = { marks: { $gt: 80 } }; 
    const collectionName = "students";

    // 2. Security Validation (using your existing validator logic)
    // We convert the object to a string to check for blocked keywords
    const validation = validateQuery(JSON.stringify(manualMQL));
    if (!validation.valid) {
      throw new Error("Unsafe operation detected by validator.");
    }

    // 3. Execute against real MongoDB
    await client.connect();
    const db = client.db(dbName);
    const results = await db.collection(collectionName).find(manualMQL).toArray();

    res.json({ 
      success: true, 
      result: manualMQL, // This shows the "Query" in your UI console
      data: results      // This is the actual data from MongoDB
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    await client.close();
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000 | Connected to MongoDB");
});