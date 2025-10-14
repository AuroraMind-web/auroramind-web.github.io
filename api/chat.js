export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message } = req.body;

  try {
    const reply = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await reply.json();

    res.status(200).json({
      answer: data.choices?.[0]?.message?.content || "Desculpa, não consegui responder agora 😅"
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao conectar com a IA." });
  }
}
