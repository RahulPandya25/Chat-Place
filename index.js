const express = require("express");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;
const path = require("path");
const ANGULAR_APP_PATH = "src/";

app.use(express.static(ANGULAR_APP_PATH));

server.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});

app.get("/", (req, res) => {
  var options = { root: path.join(__dirname, ANGULAR_APP_PATH) };
  res.sendFile("index.html", options);
});

io.on("connection", (socket) => {
  console.log(`user connected`);
  socket.emit("message", { server: "how are you?" });
  socket.on("reply-msg", (data) => {
    console.log(`got your data: ${JSON.stringify(data)}`);
  });
});
