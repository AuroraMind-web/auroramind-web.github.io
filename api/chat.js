export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = await req.json();

    // Conecta à API de IA (OpenAI ou HuggingFace)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é AuroraMind, uma IA futurista e amigável que ajuda os visitantes com ideias, tecnologia e criatividade." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpa, não consegui responder agora.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
