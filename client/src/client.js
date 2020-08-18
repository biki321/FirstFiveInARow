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
const getBoard = (canvas, numCells = 20) => {
  const ctx = canvas.getContext("2d");
  const cellSize = Math.floor(canvas.width / numCells);

  //here x,y refer to the coordinate of the cell
  const fillCell = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };

  const drawGrid = () => {
    ctx.strokeStyle = "#333";
    ctx.beginPath();

    for (let i = 0; i < numCells; i++) {
      //draw verticles lines
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, cellSize * numCells);

      //draw horizontal lines
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(cellSize * numCells, i * cellSize);
    }
    ctx.stroke();
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const reset = () => {
    clear();
    drawGrid();
  };

  //x,y is coordinate of the mouse click relative to canvas
  const getCellCoordinates = (x, y) => {
    return {
      x: Math.floor(x / cellSize),
      y: Math.floor(y / cellSize),
    };
  };

  return { fillCell, reset, getCellCoordinates };
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
  const { fillCell, reset, getCellCoordinates } = getBoard(canvas);

  const sock = io.connect("http://localhost:8000");

  const onClick = (e) => {
    //gets the coordinate of the mouse click relative to the canvas
    const { x, y } = getClickCoordinates(canvas, e);
    //emit the cell coordinates to server so that it is broadcasted
    //to others also
    sock.emit("turn", getCellCoordinates(x, y));
  };

  reset();

  /** receiving the data from server and acting accordingly **/
  sock.on("message", (text) => log(text));
  //draw a small pixel like rect when server sends a cell coordinate
  sock.on("turn", ({ x, y, color }) => fillCell(x, y, color));

  //declare events
  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));

  canvas.addEventListener("click", onClick);
})();
