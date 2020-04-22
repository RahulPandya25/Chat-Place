const express = require("express");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;
const path = require("path");
const ANGULAR_APP_PATH = "src/";
const userService = require("./user-service");

app.use(express.static(ANGULAR_APP_PATH));

server.listen(PORT, () => {
  console.log(`Server Started and Running on PORT: ${PORT}`);
});

app.get("/", (req, res) => {
  var options = { root: path.join(__dirname, ANGULAR_APP_PATH) };
  res.sendFile("index.html", options);
});

io.on("connection", (socket) => {
  // new user connects
  userService.incUserCount();
  console.log(`user connected, total users: ${userService.getUserCount()}`);

  socket.on("broadcast", (data) => {
    console.log(data);
    socket.broadcast.emit("new message", data);
  });
});
