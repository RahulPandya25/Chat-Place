let socket = io();
let user = "";

socket.on("new message", (data) => {
  $(".messages").append(`<br/>${data.user}: ${data.message}`);
});
socket.on("new connection", (data) => {
  $(".messages").append(`<br/>${data.user} joined`);
});
socket.on("user disconnected", (data) => {
  $(".messages").append(`<br/>${data.user} disconnected`);
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
    socket.emit("broadcast", {
      user: user,
      message: "new connection",
      type: "NEW CONNECTION",
    });
    // removing from view port by moving it up - out of the screen
    $("#user-modal").css("top", "-100vh");
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
