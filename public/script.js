// Always include at top of Javascript file
"use strict";

// UPLOAD IMAGE using a post request
// Called by the event listener that is waiting for a file to be chosen
function uploadFile() {
  // get the file chosen by the file dialog control
  const selectedFile = document.getElementById("fileChooser").files[0];
  // store it in a FormData object
  const formData = new FormData();
  // name of field, the file itself, and its name
  formData.append("newImage", selectedFile, selectedFile.name);

  // build a browser-style HTTP request data structure
  const xhr = new XMLHttpRequest();
  // it will be a POST request, the URL will this page's URL+"/upload"
  xhr.open("POST", "/upload", true);
  let uploading = document.getElementsByClassName("filestyle");
  // callback function executed when the HTTP response comes back
  xhr.onloadend = function(e) {
    // Get the server's response body
    console.log(xhr.responseText);
    // now that the image is on the server, we can display it!
    let newImage = document.getElementById("serverImage");
    newImage.src = "../images/" + selectedFile.name;
    imagetext();
  };
  uploading.innerHTML = "Uploading...";
  // actually send the request
  xhr.send(formData);
}

// Add event listener to the file input element
document.getElementById("fileChooser").addEventListener("change", uploadFile);

//let postcard = {
//  imageload: "",
//  message: "",
//  font: "font1",
//  color: "color1"
//};


//New button to replace previous image
let imagemessage = document.getElementById("controls");
function imagetext() {
  imagemessage.className = "flex";
  imagemessage.firstElementChild.classList.replace("filestyle", "newfilestyle");
  imagemessage.firstElementChild.innerHTML = "Replace Image";
}


//Change fonts in the message
let message = document.getElementById("message");
let fonts = document.getElementsByClassName("fontstyle");
let fontindex = 0;
const notselectedfont = "&#11046;";
const selectedfont = "&#10070;";
changefont(fontindex);

function changefont(n) {
  fontindex = fonts[n].classList[1];
  message.className = fontindex;
  let i;
  for (i = 0; i < fonts.length; i++) {
    fonts[i].firstElementChild.innerHTML = notselectedfont;
  }
  fonts[n].firstElementChild.innerHTML = selectedfont;
}

//Change background colors in the postcard
let postcard = document.getElementById("maincontent");
let colors = document.getElementsByClassName("box");
let colorindex = 0;
changecolor(colorindex);
function changecolor(n) {
  colorindex = colors[n].classList[1];
  postcard.className = colorindex;
  let i;
  for (i = 0; i < colors.length; i++) {
    colors[i].className = colors[i].className.replace(" current", "");
  }
  colors[n].className += " current";
}

//Share the postcard
document.querySelector("#share").addEventListener("click", () => {
  let message = document.querySelector("#message");
  let img = document.querySelector("#serverImage");
  let displayPostcard = {
    image: img.src,
    message: message.textContent,
    font: message.className,
    color: postcard.className
  };
  console.log(displayPostcard);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/saveDisplay", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onloadend = function(e) {
    console.log(xhr.responseText);
    window.location= "showpostcard.html";
  };
  xhr.send(JSON.stringify(displayPostcard));
});