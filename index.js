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

  // broadcast message
  socket.on("broadcast", (data) => {
    // add time to data
    data.time = new Date();
    // push to convo first
    userService.addConvo(data);
    console.log(data);

    if (data.type === "NEW MESSAGE") {
      socket.broadcast.emit("new message", data);
      socket.emit("user list", userService.getUserList());
    } else if (data.type === "NEW CONNECTION") {
      if (!userService.getUserList().includes(data.user))
        userService.addUser(data.user);
      socket.broadcast.emit("new connection", data);
    } else if (data.type === "OLD CONNECTION") {
      if (userService.getUserList().includes(data.user)) {
        socket.emit("old messages", userService.getConvo());
        socket.broadcast.emit("user rejoined", data);
      }
    } else if (data.type === "USER DISCONNECTED") {
      //  remove user from user list
      socket.broadcast.emit("user disconnected", data);
      // disconnect from socket io
    }
  });
});
