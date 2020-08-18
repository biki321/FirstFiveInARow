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

//draw on canvas
const getBoard = (canvas) => {
  const ctx = canvas.getContext("2d");

  const fillRect = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - 10, y - 10, 20, 20);
  };
  return { fillRect };
};

//gets the coordinate of the mouse click relative to the element,
//it have to be calculated as no function exist who do the job
//directly
const getClickCoordinates = (element, ev) => {
  const { top, left } = element.getBoundingClientRect();
  const { clientX, clientY } = ev;

  return {
    x: clientX - left,
    y: clientY - top,
  };
};

(() => {
  const canvas = document.querySelector("canvas");
  const { fillRect } = getBoard(canvas);
  const sock = io.connect("http://localhost:8000");

  const onClick = (e) => {
    //gets the coordinate of the mouse click relative to the canvas
    const { x, y } = getClickCoordinates(canvas, e);
    //emit the coordinates to server so that it is broadcasted to others also
    sock.emit("turn", { x, y });
  };

  /** receiving the data from server and acting accordingly **/

  sock.on("message", (text) => log(text));
  //draw a small pixel like rect when server sends a coordinate
  sock.on("turn", ({ x, y }) => fillRect(x, y, "green"));

  //declare events
  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));

  canvas.addEventListener("click", onClick);
})();
