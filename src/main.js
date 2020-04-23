// fixing height for mobile devices
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);
// We listen to the resize event
window.addEventListener("resize", () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

let socket = io();
let user = "";

socket.on("new message", (data) => {
  $(".conversation").append(`        <div class="item new-message">
  <div class="content">
    <p class="sender">${data.user}</p>
    <p class="sender-message">${data.message}</p>
  </div>`);
});
socket.on("new connection", (data) => {
  $(".conversation").append(`<div class="item new-user-joined">
  <p>${data.user} joined</p>
</div>`);
});
socket.on("user disconnected", (data) => {
  $(".conversation").append(`<div class="item user-left">
  <p>${data.user} left</p>
</div>`);
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
    setTimeout(function () {
      $("#user-modal").hide();
    }, 1000);
    $(".conversation").append(`<div class="item new-user-joined">
    <p>You joined</p>
  </div>`);
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
    $(".conversation").append(`<div class="item my-message">
    <p class="sender-message">${message}</p>
  </div>`);
  }
}
