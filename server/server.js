const http = require("http");
const express = require("express");
const socket = require("socket.io");
const randomcolor = require("randomcolor");

const app = express();

port = process.env.PORT | 8000;

//serve static files
// __dirname is provided by node gives the name of current dir
app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socket(server);

io.on("connection", (sock) => {
  const color = randomcolor();
  sock.emit("message", "You are connected");

  //broadcasting the msg sent by one client
  sock.on("message", (text) => io.emit("message", text));
  //whenever a client will do a mouse click on their canvas
  //we will get the cell coordinates on canvas ,it is broadcated to others.
  //also sending each player or socket a unique color
  sock.on("turn", ({ x, y }) => io.emit("turn", { x, y, color }));
});

server.on("error", () => {
  console.log(err);
});

server.listen(port, () => {
  console.log(`server is ready`);
});
