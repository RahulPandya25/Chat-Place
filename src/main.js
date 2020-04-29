let socket = io();
let user = localStorage.getItem("user");

if (user && user !== "") {
  socket.emit("broadcast", {
    user: user,
    message: "old connection",
    type: "OLD CONNECTION",
  });
  $("#user-modal").hide();
} else {
  $("#user-modal").show();
}

socket.on("new message", (data) => {
  $(".conversation").append(`        <div class="item new-message">
  <div class="content">
    <p class="sender">${data.user}</p>
    <p class="sender-message">${data.message}</p>
  </div>`);
  // scroll down
  scrollDown();
});
socket.on("new connection", (data) => {
  $(".conversation").append(`<div class="item new-user-joined">
  <p>${data.user} joined</p>
</div>`);
  // scroll down
  scrollDown();
});
socket.on("username exists", () => {
  $(".user-taken-error").show();
});
socket.on("okay login", () => {
  // removing from view port by moving it up - out of the screen
  $("#user-modal").css("top", "-100vh");
  setTimeout(function () {
    $("#user-modal").hide();
  }, 1000);
  $(".conversation").append(`<div class="item new-user-joined">
<p>You joined</p>
</div>`);
});

socket.on("user rejoined", (data) => {
  $(".conversation").append(`<div class="item new-user-joined">
  <p>${data.user} rejoined</p>
</div>`);
  // scroll down
  scrollDown();
});
socket.on("user disconnected", (data) => {
  $(".conversation").append(`<div class="item user-left">
  <p>${data.user} left</p>
</div>`);
  // scroll down
  scrollDown();
});
socket.on("user list", (data) => {
  console.log(data);
});
socket.on("old messages", (data) => {
  if (data && data.length !== 0) {
    data.forEach((convo) => {
      if (convo.type === "NEW MESSAGE") {
        if (convo.user === user) {
          // my message
          $(".conversation").append(`<div class="item my-message">
    <p class="sender-message">${convo.message}</p>
  </div>`);
        } else {
          // new messages snippet
          $(".conversation").append(`<div class="item new-message">
        <div class="content">
          <p class="sender">${convo.user}</p>
          <p class="sender-message">${convo.message}</p>
        </div>`);
        }
      } else if (convo.type === "NEW CONNECTION") {
        //   // user joined snippet
        $(".conversation").append(`<div class="item new-user-joined">
      <p>${user === convo.user ? "You" : convo.user} joined</p>
    </div>`);
        //   } else if (convo.type === "OLD CONNECTION") {
        //     // user rejoined snippet
        //     $(".conversation").append(`<div class="item new-user-joined">
        // <p>${user === convo.user ? "You" : convo.user} rejoined</p>
        // </div>`);
      } else if (convo.type === "USER DISCONNECTED") {
        //   // user left snippet
        $(".conversation").append(`<div class="item user-left">
    <p>${user === convo.user ? "You" : convo.user} left</p>
    </div>`);
      }
    });
  }

  // scroll down
  scrollDown();
});

function closeModal() {
  user = $("#user").val().trim();
  if (user && user !== "") {
    localStorage.setItem("user", user);
    // todo: and already user scenario - use api
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
    $(".conversation").append(`<div class="item my-message">
    <p class="sender-message">${message}</p>
  </div>`);
  }
  $("#message").focus();
  // scroll down
  scrollDown();
}

function logout() {
  socket.emit("broadcast", {
    user: user,
    message: "user disconnected",
    type: "USER DISCONNECTED",
  });
  toggleNavbar();
  // cleaning up storage
  localStorage.removeItem("user");

  // show user modal
  $("#user-modal").show();
  setTimeout(function () {
    $("#user-modal").css("top", "0");
  }, 1000);

  // cleaning up convo
  $(".conversation").empty();
}

function toggleNavbar() {
  var burger = $(".burger");
  var navMenu = $(".nav-menu");
  if (burger.hasClass("menu-open")) {
    // menu already open, close it
    burger.removeClass("menu-open");
    navMenu.css("top", "-100vh");
  } else {
    // meni is closed, open it
    burger.addClass("menu-open");
    navMenu.css("top", "0");
  }
}

function scrollDown() {
  $("html, body").animate({ scrollTop: $(document).height() }, 500);
}
