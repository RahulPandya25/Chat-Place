const express = require("express");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;
const path = require("path");
const ANGULAR_APP_PATH = "src/";
const userService = require("./user-service");

app.use(express.static(ANGULAR_APP_PATH));

// listen
server.listen(PORT, () => {
  console.log(`Server Started and Running on PORT: ${PORT}`);
});

// get req
app.get("/", (req, res) => {
  var options = { root: path.join(__dirname, ANGULAR_APP_PATH) };
  res.sendFile("index.html", options);
});

// on connection
io.on("connection", (socket) => {
  // new user connects
  userService.incUserCount();
  // broadcast message
  socket.on("broadcast", broadcast);

  // broadcast function
  function broadcast(data) {
    // add time to data
    data.time = new Date();
    if (data.type !== "NEW CONNECTION")
      // for New Connection it is to be handled by diff way
      // push to convo first
      userService.addConvo(data);

    if (data.type === "NEW MESSAGE") {
      socket.broadcast.emit("new message", data);
    } else if (data.type === "NEW CONNECTION") {
      if (!userService.getUserList().includes(data.user)) {
        userService.addUser(data.user);
        socket.broadcast.emit("new connection", data);
        socket.emit("okay login");
        // now push to convo
        userService.addConvo(data);
      } else socket.emit("username exists");
    } else if (data.type === "OLD CONNECTION") {
      if (userService.getUserList().includes(data.user)) {
        var oldConvo = [];
        var allConvo = userService.getConvo();
        var userFound = false;
        var userFoundIndex;
        for (let i = allConvo.length - 1; i >= 0; i--) {
          if (
            allConvo[i].user === data.user &&
            allConvo[i].type === "NEW CONNECTION"
          ) {
            userFound = true;
            userFoundIndex = i;
          }
          if (userFound) {
            for (let j = i; j < allConvo.length - 1; j++) {
              oldConvo.push(allConvo[j]);
            }
            break;
          }
        }
        console.log("old: " + oldConvo);
        console.log("all : " + allConvo);

        socket.emit("old messages", oldConvo);
        // removed this because of inconsistency in ui
        // socket.broadcast.emit("user rejoined", data);
      }
    } else if (data.type === "USER DISCONNECTED") {
      //  remove user from user list
      userService.removeUserFromList(data.user);
      // broadcast others
      socket.broadcast.emit("user disconnected", data);
    }
  }
});
