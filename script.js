// === Enviar mensagem ===
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
    // 🌐 URL da API (ajuste automático se necessário)
    const apiUrl =
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname.includes("localhost")
        ? "/api/chat"
        : "https://auroramind-web-github-io.vercel.app/api/chat";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, provider }),
    });

    const data = await res.json();

    chat.removeChild(typingMsg);
    addMessage("AuroraMind", data.answer || "Erro ao responder 😢", "bot");
  } catch (error) {
    console.error("Erro:", error);
    chat.removeChild(typingMsg);
    addMessage("AuroraMind", "Erro ao conectar 😢", "bot");
  }

  chat.scrollTop = chat.scrollHeight;
}

// === Adicionar mensagens no chat ===
function addMessage(sender, text, type) {
  const chat = document.getElementById("chat");

  const msgContainer = document.createElement("div");
  msgContainer.classList.add("message", type === "user" ? "user" : "bot");

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src =
    type === "user"
      ? "https://cdn-icons-png.flaticon.com/512/847/847969.png"
      : "logo.jpeg";
  avatar.alt = type === "user" ? "Usuário" : "AuroraMind";

  const msgBubble = document.createElement("div");
  msgBubble.classList.add("bubble");
  msgBubble.innerHTML = `<strong>${sender}:</strong> ${text}`;

  if (type === "user") {
    msgContainer.appendChild(msgBubble);
    msgContainer.appendChild(avatar);
  } else {
    msgContainer.appendChild(avatar);
    msgContainer.appendChild(msgBubble);
  }

  chat.appendChild(msgContainer);
  chat.scrollTop = chat.scrollHeight;

  return msgContainer;
}

// === Enviar com Enter ===
document.getElementById("message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// === Alternar tema claro/escuro ===
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌞";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "🌞" : "🌙";
});
