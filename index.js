import express from "express";

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

server.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log(`user connected`);
  socket.emit("message", { server: "how are you?" });
  socket.on("reply-msg", (data) => {
    console.log(`got your data: ${JSON.stringify(data)}`);
  });
});
