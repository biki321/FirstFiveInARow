const http = require("http");
const express = require("express");
const socket = require("socket.io");
const randomcolor = require("randomcolor");
const createBoard = require("./create_board");
const createCooldown = require("./create_cooldown");

const app = express();

port = process.env.PORT | 8000;

//serve static files
// __dirname is provided by node gives the name of current dir
app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socket(server);

//we will have only global board for storing the current state of
//the all players
const { clear, getBoard, makeTurn } = createBoard(20);

io.on("connection", (sock) => {
  //here color will be the only identification of a player
  const color = randomcolor();

  const cooldown = createCooldown(2000);

  //give every new player connected, the current state
  //of the game(i.e the global board stored in server)
  sock.emit("board", getBoard());

  //broadcasting the msg sent by one client
  sock.on("message", (text) => io.emit("message", text));

  //whenever a client will do a mouse click on their canvas
  //we will get the cell coordinates on canvas ,it is broadcated to others.
  //also sending each player or socket a unique color
  sock.on("turn", ({ x, y }) => {
    if (cooldown()) {
      //store the turn in board in server
      //and check if the turn made is winningturn
      const playerWon = makeTurn(x, y, color);
      io.emit("turn", { x, y, color });

      if (playerWon) {
        sock.emit("message", "You Won");
        io.emit("message", "New Round");
        clear();
        io.emit("board");
      }
    }
  });
});

server.on("error", () => {
  console.log(err);
});

server.listen(port, () => {
  console.log(`server is ready`);
});
