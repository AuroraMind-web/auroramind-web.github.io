export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, provider } = req.body;

  if (!message || !provider) {
    return res.status(400).json({ error: "Mensagem ou provedor não informado." });
  }

  try {
    let apiUrl = "";
    let apiKey = "";
    let bodyData = {};

    // Seleciona o provedor conforme o menu
    switch (provider) {
      case "openai":
        apiUrl = "https://api.openai.com/v1/chat/completions";
        apiKey = process.env.OPENAI_API_KEY;
        bodyData = {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        };
        break;

      case "claude":
        apiUrl = "https://api.anthropic.com/v1/messages";
        apiKey = process.env.CLAUDE_API_KEY;
        bodyData = {
          model: "claude-3-opus-20240229",
          max_tokens: 1024,
          messages: [{ role: "user", content: message }],
        };
        break;

      case "gemini":
        apiUrl =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          process.env.GEMINI_API_KEY;
        bodyData = { contents: [{ parts: [{ text: message }] }] };
        break;

      case "deepseek":
        apiUrl = "https://api.deepseek.com/v1/chat/completions";
        apiKey = process.env.DEEPSEEK_API_KEY;
        bodyData = {
          model: "deepseek-chat",
          messages: [{ role: "user", content: message }],
        };
        break;

      case "suno":
        apiUrl = "https://api.suno.ai/v1/generate";
        apiKey = process.env.SUNO_API_KEY;
        bodyData = { prompt: message };
        break;

      case "grok":
        apiUrl = "https://api.x.ai/v1/chat/completions";
        apiKey = process.env.GROK_API_KEY;
        bodyData = {
          model: "grok-beta",
          messages: [{ role: "user", content: message }],
        };
        break;

      default:
        return res.status(400).json({ error: "Provedor inválido." });
    }

    // Cabeçalhos
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    // Requisição à API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    // Resposta padrão
    let answer = "Não consegui gerar resposta 😅";

    // Cada IA tem formato diferente de resposta
    if (provider === "openai" || provider === "deepseek" || provider === "grok") {
      answer = data?.choices?.[0]?.message?.content || answer;
    } else if (provider === "claude") {
      answer = data?.content?.[0]?.text || data?.output_text || answer;
    } else if (provider === "gemini") {
      answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || answer;
    } else if (provider === "suno") {
      answer = data?.result || data?.output || "Suno processou mas não retornou texto.";
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ error: "Erro ao conectar com a IA." });
  }
}
