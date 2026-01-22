import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Le modèle d'image AI Studio
    const model = genAI.getGenerativeModel({
      model: "imagen-3.0"
    });

    // Appel image
    const result = await model.generateImage({
      prompt,
      size: "1024x1024"
    });

    // Récupération du base64
    const image = result.images?.[0]?.base64;

    if (!image) {
      return res.status(500).json({
        error: "No image returned",
        raw: result
      });
    }

    res.status(200).json({ base64: image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
