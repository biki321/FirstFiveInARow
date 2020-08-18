const log = (text) => {
  const parent = document.querySelector("#events");
  const el = document.createElement("li");
  el.innerHTML = text;

  parent.appendChild(el);
};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();

  const input = document.querySelector("#chat");
  const text = input.value;
  input.value = "";

  //send the msg to server and server will broadcast to every nodes
  sock.emit("message", text);
};

(() => {
  const sock = io.connect("http://localhost:8000");
  sock.on("message", (text) => {
    log(text);
  });

  //declare events
  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));
})();
