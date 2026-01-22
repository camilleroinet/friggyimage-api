import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          {
            text:
              "Imagine a hyper-realistic food photograph in JPEG format. Describe it in detail and embed the image as base64. Dish: " +
              prompt
          }
        ]
      }
    ]);

    const parts = result.response.candidates?.[0]?.content?.parts;

    const base64 = parts?.find(p => p.inlineData)?.inlineData?.data;

    if (!base64) {
      return res.status(500).json({ error: "No image returned", raw: parts });
    }

    res.status(200).json({ base64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
