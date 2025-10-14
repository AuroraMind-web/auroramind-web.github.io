export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = await req.json();

    // Simulação temporária (teste)
    // Aqui depois ligaremos ao modelo GPT real da AuroraMind
    const reply = `🤖 AuroraMind: Entendi sua mensagem "${message}". Estou evoluindo!`;

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
