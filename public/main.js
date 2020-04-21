// const io = require("socket.io-client");
const socket = io.connect("https://my-chat-place.herokuapp.com");

socket.on("message", (data) => {
  console.log(`got your data: ${JSON.stringify(data)}`);
  socket.emit("reply-msg", { client: "I'm fine, how are you?" });
});
