function addMessage(sender, text, type) {
  const chat = document.getElementById("chat");

  // Cria o container da mensagem
  const msgContainer = document.createElement("div");
  msgContainer.classList.add("message", type === "user" ? "user" : "bot");

  // Cria o avatar
  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src =
    type === "user"
      ? "https://cdn-icons-png.flaticon.com/512/847/847969.png"
      : "logo.jpeg";
  avatar.alt = type === "user" ? "Usuário" : "AuroraMind";

  // Cria a bolha de texto
  const msgBubble = document.createElement("div");
  msgBubble.classList.add("bubble");

  // Adiciona o conteúdo
  msgBubble.innerHTML = `<strong>${sender}:</strong> ${text}`;

  // Monta os elementos (ordem muda dependendo do tipo)
  if (type === "user") {
    msgContainer.appendChild(msgBubble);
    msgContainer.appendChild(avatar);
  } else {
    msgContainer.appendChild(avatar);
    msgContainer.appendChild(msgBubble);
  }

  // Adiciona ao chat
  chat.appendChild(msgContainer);
  chat.scrollTop = chat.scrollHeight;

  return msgContainer;
}
