import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      "Generate a hyper-realistic food photograph in base64. Dish: " + prompt
    );

    const response = await result.response;
    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64) {
      return res.status(500).json({
        error: "No image returned",
        raw: response
      });
    }

    res.status(200).json({ base64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
