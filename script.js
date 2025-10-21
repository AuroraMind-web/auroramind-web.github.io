async function sendMessage() {
  const chat = document.getElementById("chat");
  const messageInput = document.getElementById("message");
  const provider = document.getElementById("provider").value;
  const message = messageInput.value.trim();

  if (!message) return;

  addMessage("Você", message, "user");
  messageInput.value = "";

  // Adiciona animação "digitando..."
  const typingMsg = addTypingAnimation("AuroraMind está digitando");

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
  msg.classList.add("message", type === "user" ? "user" : "bot");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  return msg;
}

// Cria animação "digitando..."
function addTypingAnimation(text) {
  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.classList.add("message", "bot", "typing");
  msg.innerHTML = `<strong>${text}</strong><span class="dots"><span>.</span><span>.</span><span>.</span></span>`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  return msg;
}

// Envia com Enter
document.getElementById("message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Alternar tema claro/escuro
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const btn = document.getElementById("themeToggle");
  btn.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});
