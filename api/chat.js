export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, provider } = req.body;

  if (!message || !provider) {
    return res.status(400).json({ error: "Mensagem ou provedor ausente" });
  }

  try {
    let apiUrl = "";
    let headers = {};
    let body = {};

    switch (provider) {
      case "openai":
        apiUrl = "https://api.openai.com/v1/chat/completions";
        headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        };
        body = {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        };
        break;

      case "gemini":
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
        headers = { "Content-Type": "application/json" };
        body = { contents: [{ parts: [{ text: message }] }] };
        break;

      case "claude":
        apiUrl = "https://api.anthropic.com/v1/messages";
        headers = {
          "Content-Type": "application/json",
          "x-api-key": process.env.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
        };
        body = {
          model: "claude-3-sonnet-20240229",
          max_tokens: 200,
          messages: [{ role: "user", content: message }],
        };
        break;

      case "deepseek":
        apiUrl = "https://api.deepseek.com/v1/chat/completions";
        headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        };
        body = {
          model: "deepseek-chat",
          messages: [{ role: "user", content: message }],
        };
        break;

      default:
        return res.status(400).json({ error: "Provedor inválido" });
    }

    const response = await fetch(apiUrl, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API:", data);
      return res.status(500).json({ error: data.error?.message || "Erro ao conectar com a IA." });
    }

    // Extrai resposta de cada tipo de IA
    let answer = "";
    if (provider === "openai" || provider === "deepseek") {
      answer = data.choices?.[0]?.message?.content || "Sem resposta.";
    } else if (provider === "gemini") {
      answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";
    } else if (provider === "claude") {
      answer = data.content?.[0]?.text || "Sem resposta.";
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Erro geral:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}
