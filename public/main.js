const socket = io("http://localhost/");

socket.on("message", (data) => {
  console.log(`got your data: ${JSON.stringify(data)}`);
  socket.emit("reply-msg", { client: "I'm fine, how are you?" });
});
