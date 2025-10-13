export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  const HF_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!HF_KEY) {
    return res.status(500).json({ error: "Chave da Hugging Face não configurada" });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();
    const reply = data[0]?.generated_text || "Desculpa, não consegui responder agora.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
