const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const providerSelect = document.getElementById("provider");
const themeToggle = document.getElementById("themeToggle");

function addMessage(sender, text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = `${sender}: ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  return msg;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  const provider = providerSelect.value;

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
    typingMsg.remove();
    addMessage(provider, data.answer || "Erro ao responder 😢", "bot");
  } catch (error) {
    typingMsg.remove();
    addMessage("AuroraMind", "Erro ao conectar 😢", "bot");
  }
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// 🌙/🌞 alternância de tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "🌞" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// Carrega o tema salvo
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "🌞";
  }
});
