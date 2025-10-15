export default async function handler(req, res) {
  // Garante que só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API OpenAI:", errorText);
      return res.status(500).json({ error: "Erro na API da OpenAI." });
    }

    const data = await response.json();

    return res.status(200).json({
      answer: data.choices?.[0]?.message?.content || "Desculpa, não consegui responder agora 😅"
    });
  } catch (error) {
    console.error("Erro interno:", error);
    return res.status(500).json({ error: "Erro ao conectar com a IA." });
  }
}
