
async function sendMessageToAuroraMind(message) {
  const chatBox = document.getElementById("chatBox");

  // Mostra “digitando...”
  chatBox.innerHTML += `<p id="loading"><strong>AuroraMind:</strong> Digitando...</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    document.getElementById("loading").remove();

    const reply = data?.answer || "Desculpa, não consegui responder agora 😅";
    chatBox.innerHTML += `<p><strong>AuroraMind:</strong> ${reply}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    document.getElementById("loading").remove();
    chatBox.innerHTML += `<p><strong>AuroraMind:</strong> Erro ao conectar 😢</p>`;
  }
}
