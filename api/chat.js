export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, provider } = req.body;

  if (!message || !provider) {
    return res.status(400).json({ error: "Mensagem ou provedor ausente." });
  }

  try {
    let apiUrl = "";
    let headers = {};
    let body = {};

    switch (provider) {
      // 🧠 OpenAI (ChatGPT)
      case "openai":
        apiUrl = "https://api.openai.com/v1/chat/completions";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        };
        body = {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        };
        break;

      // 🌞 Gemini (Google)
      case "gemini":
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
        headers = { "Content-Type": "application/json" };
        body = { contents: [{ parts: [{ text: message }] }] };
        break;

      // 🤖 Claude (Anthropic)
      case "claude":
        apiUrl = "https://api.anthropic.com/v1/messages";
        headers = {
          "Content-Type": "application/json",
          "x-api-key": process.env.CLAUDE_API_KEY,
        };
        body = {
          model: "claude-3-opus-20240229",
          messages: [{ role: "user", content: message }],
          max_tokens: 300,
        };
        break;

      // 🧩 DeepSeek
      case "deepseek":
        apiUrl = "https://api.deepseek.com/v1/chat/completions";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        };
        body = {
          model: "deepseek-chat",
          messages: [{ role: "user", content: message }],
        };
        break;

      // 🚀 Grok
      case "grok":
        apiUrl = "https://api.x.ai/v1/chat/completions";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        };
        body = {
          model: "grok-beta",
          messages: [{ role: "user", content: message }],
        };
        break;

      // 🎵 Suno (IA de música ou texto)
      case "suno":
        apiUrl = "https://api.suno.ai/v1/chat";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        };
        body = { message };
        break;

      // 💻 Copilot (Microsoft)
      case "copilot":
        apiUrl = "https://api.githubcopilot.com/v1/chat";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COPILOT_API_KEY}`,
        };
        body = { messages: [{ role: "user", content: message }] };
        break;

      // 🧬 StudioAI
      case "studioai":
        apiUrl = "https://api.studioai.com/v1/chat";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STUDIOAI_API_KEY}`,
        };
        body = { input: message };
        break;

      default:
        return res.status(400).json({ error: "Provedor desconhecido." });
    }

    // 🔥 Faz a requisição à API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 🧩 Extrai a resposta de acordo com o provedor
    let answer = "Desculpa, não consegui responder agora 😅";

    if (provider === "openai" || provider === "deepseek" || provider === "grok" || provider === "copilot") {
      answer = data?.choices?.[0]?.message?.content || answer;
    } else if (provider === "gemini") {
      answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || answer;
    } else if (provider === "claude") {
      answer = data?.content?.[0]?.text || answer;
    } else if (provider === "suno" || provider === "studioai") {
      answer = data?.response || data?.output || answer;
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Erro completo da API:", error);
    res.status(500).json({ error: "Erro ao conectar com a IA." });
  }
}
