function addMessage(sender, text, type) {
  const chat = document.getElementById("chat");

  const msgContainer = document.createElement("div");
  msgContainer.classList.add("message", type === "user" ? "user" : "bot");

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src =
    type === "user"
      ? "https://cdn-icons-png.flaticon.com/512/847/847969.png" // avatar do usuário
      : "logo.jpeg"; // logo do AuroraMind

  const msgBubble = document.createElement("div");
  msgBubble.classList.add("bubble");
  msgBubble.innerHTML = `<strong>${sender}:</strong> ${text}`;

  msgContainer.appendChild(avatar);
  msgContainer.appendChild(msgBubble);

  chat.appendChild(msgContainer);
  chat.scrollTop = chat.scrollHeight;

  return msgContainer;
}
