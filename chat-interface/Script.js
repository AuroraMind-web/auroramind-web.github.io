async function sendMessage() {
  const chat = document.getElementById("chat");
  const messageInput = document.getElementById("message");
  const provider = document.getElementById("provider").value;
  const message = messageInput.value.trim();

  if (!message) return;

  addMessage("Você", message, "user");
  messageInput.value = "";

  const typingMsg = addMessage("AuroraMind", "digitando...", "typing");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, provider }),
    });

    const data = await res.json();
    chat.removeChild(typingMsg);
    addMessage(provider, data.answer || "Erro ao responder 😢", "bot");
  } catch (error) {
    chat.removeChild(typingMsg);
    addMessage("AuroraMind", "Erro ao conectar 😢", "bot");
  }

  chat.scrollTop = chat.scrollHeight;
}

function addMessage(sender, text, type) {
  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(type === "user" ? "user" : "bot");
  if (type === "typing") msg.classList.add("typing");
  msg.textContent = `${sender}: ${text}`;
  chat.appendChild(msg);
  return msg;
}

// Permite enviar com Enter
document.getElementById("message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
