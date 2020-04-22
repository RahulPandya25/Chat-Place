const socket = io();

socket.on("new message", (data) => {
  console.log(`new message from: ${data.user}, message: ${data.message}`);
});

function sendMessage() {
  var user = $("#user").val();
  var message = $("#message").val();

  console.log({ user, message });

  if (user !== "" && message !== "") {
    socket.emit("broadcast", { user: user, message: message });
  }
}
