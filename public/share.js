"use strict";

let xhr = new XMLHttpRequest();
xhr.open("GET", "/saveDisplay", true);
xhr.onloadend = function() {
  let data = JSON.parse(xhr.responseText); //turn to object
  let image = document.getElementById("serverImage");
  image.src = data.image;
  let postcard = document.getElementById("maincontent");
  postcard.className = data.color;
  let message = document.getElementById("message")
  message.className = data.font;
  message.innerHTML = data.message
};

xhr.send(null);