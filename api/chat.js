export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, provider } = req.body;
  if (!message || !provider) {
    return res.status(400).json({ error: "Mensagem ou provedor ausente" });
  }

  let apiUrl, headers, body;

  switch (provider) {
    case "grok":
      apiUrl = "https://api.x.ai/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
      };
      body = {
        model: "grok-3",
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

    case "suno":
      apiUrl = "https://api.sunoapi.org/v1/chat";
      headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
      };
      body = {
        prompt: message,
      };
      break;

    case "studio":
      apiUrl = "https://api.studio.ai/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.STUDIO_API_KEY}`,
      };
      body = {
        model: "studio-pro",
        messages: [{ role: "user", content: message }],
      };
      break;

    default:
      return res.status(400).json({ error: "Provedor inválido" });
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API:", data);
      return res.status(500).json({ error: data.error?.message || "Erro ao conectar" });
    }

    let answer =
      data.choices?.[0]?.message?.content ||
      data.output ||
      data.result ||
      "Sem resposta.";

    res.status(200).json({ answer });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}
