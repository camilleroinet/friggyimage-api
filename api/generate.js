import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Generate a realistic food photograph in JPEG format. " + prompt },
            { image_prompt: { mime_type: "image/jpeg" } }
          ]
        }
      ]
    });

    const base64 = result.response.candidates[0].content.parts[0].inlineData.data;

    res.status(200).json({ base64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
