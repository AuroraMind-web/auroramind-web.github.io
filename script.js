// === Envio de mensagens ===
async function sendMessage() {
  const chat = document.getElementById("chat");
  const messageInput = document.getElementById("message");
  const provider = document.getElementById("provider").value;
  const message = messageInput.value.trim();

  if (!message) return;

  addMessage("Você", message, "user");
  messageInput.value = "";

  const typingMsg = addTypingMessage("AuroraMind está digitando...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, provider }),
    });

    const data = await res.json();
    chat.removeChild(typingMsg);

    const botMessage = addMessage("AuroraMind", data.answer || "Erro ao responder 😢", "bot");
    speak(data.answer || "Erro ao responder 😢"); // 🔊 AuroraMind fala
    animateAvatar(true); // ✨ Avatar brilha enquanto fala

    // Para o brilho depois de 3s
    setTimeout(() => animateAvatar(false), 3000);
  } catch (error) {
    chat.removeChild(typingMsg);
    addMessage("AuroraMind", "Erro ao conectar 😢", "bot");
  }

  chat.scrollTop = chat.scrollHeight;
}

// === Criação das mensagens ===
function addMessage(sender, text, type) {
  const chat = document.getElementById("chat");

  const msgContainer = document.createElement("div");
  msgContainer.classList.add("message", type === "user" ? "user" : "bot");

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = type === "user"
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

// === Mensagem de digitação animada ===
function addTypingMessage(text) {
  const chat = document.getElementById("chat");
  const msgContainer = document.createElement("div");
  msgContainer.classList.add("message", "bot", "typing");

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = "logo.jpeg";
  avatar.alt = "AuroraMind";

  const msgBubble = document.createElement("div");
  msgBubble.classList.add("bubble");
  msgBubble.innerHTML = `${text} <span class="dots"><span>.</span><span>.</span><span>.</span></span>`;

  msgContainer.appendChild(avatar);
  msgContainer.appendChild(msgBubble);
  chat.appendChild(msgContainer);

  return msgContainer;
}

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

// === Permitir enviar com Enter ===
document.getElementById("message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// === 🔊 Fala da AuroraMind ===
function speak(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-PT"; // ou "pt-BR"
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// === ✨ Avatar brilha enquanto fala ===
function animateAvatar(active) {
  const avatars = document.querySelectorAll(".message.bot .avatar");
  const lastAvatar = avatars[avatars.length - 1];
  if (lastAvatar) {
    if (active) {
      lastAvatar.style.boxShadow = "0 0 25px #00aaff";
      lastAvatar.style.transition = "box-shadow 0.3s ease";
    } else {
      lastAvatar.style.boxShadow = "";
    }
  }
}

// === 🎤 Reconhecimento de voz ===
const micButton = document.createElement("button");
micButton.textContent = "🎤";
micButton.id = "micButton";
document.querySelector("footer").appendChild(micButton);

let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "pt-PT"; // ou "pt-BR"
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("message").value = transcript;
    sendMessage();
  };

  recognition.onerror = function () {
    addMessage("AuroraMind", "Não consegui ouvir 😅, tenta de novo?", "bot");
  };

  micButton.addEventListener("click", () => {
    recognition.start();
    micButton.textContent = "🎧 Ouvindo...";
    setTimeout(() => (micButton.textContent = "🎤"), 4000);
  });
} else {
  micButton.textContent = "🎙️ (sem suporte)";
  micButton.disabled = true;
}
