let socket = io();
let user = "";

socket.on("new message", (data) => {
  $(".messages").append(`<br/>${data.user}: ${data.message}`);
});
socket.on("new connection", (data) => {
  $(".messages").append(`<br/>${data.user} joined`);
});
socket.on("user list", (data) => {
  console.log(data);
});

function openModal() {
  $("#user-modal").show();
  $(".no-user-error").hide();
  $(".user-taken-error").hide();
}

function closeModal() {
  user = $("#user").val().trim();
  if (user && user !== "") {
    // todo: and already user scenario - use api
    $("#user-modal").hide();
    socket.emit("broadcast", {
      user: user,
      message: "new connection",
      type: "NEW CONNECTION",
    });
  } else {
    $(".no-user-error").show();
  }
}

function sendMessage() {
  var message = $("#message").val();
  if (user !== "" && message !== "") {
    socket.emit("broadcast", {
      user: user,
      message: message,
      type: "NEW MESSAGE",
    });
    $("#message").val("");
    $(".messages").append(`<br/>You: ${message}`);
  }
}
