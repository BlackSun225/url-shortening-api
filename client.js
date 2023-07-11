const hamburger = document.getElementById("hamburger");
var show = false;
const menu = document.getElementById("menu");
const shortIt = document.getElementById("shortIt");
const urlAddress = document.getElementById("url");
const link = document.getElementById("links");
const alert = document.querySelector(".alert");

const copy = document.querySelectorAll(".copy");

const shortUrlApi = "https://api.shrtco.de/v2/shorten?url=";

urlAddress.addEventListener("input", function() {
  alert.style.display = "none";
  urlAddress.style.border = "none";
  urlAddress.style.color = "initial";
});
urlAddress.addEventListener("blur", function() {
  let a = /\s+/;
  if(a.test(urlAddress.value) || urlAddress.value == "") {
    urlAddress.style.border = "2px solid hsl(0, 87%, 67%)";
    urlAddress.style.color = "hsl(0, 87%, 67%)";
    alert.innerHTML = "Please enter a valid url";
    alert.style.display = "inline";
  }
});
hamburger.addEventListener("click", function() {
  show ? menu.style.display = "none" : menu.style.display = "block";
  show = !show;
});

localStorage.setItem("storedUrl", JSON.stringify({"url": []})); 
var registeredUrl = JSON.parse(localStorage.getItem("storedUrl")).url;
if(registeredUrl.length >= 1) {
  registeredUrl.forEach(elem => {
    addLink(elem);
  });
}
shortIt.addEventListener("click", function(event) {
  event.preventDefault();
  let a = [];
  for(let i = 0; i < registeredUrl.length; i++) {
    a.push(registeredUrl[i][1]);
  }

  if(!a.includes("http://" + urlAddress.value)) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", shortUrlApi + urlAddress.value);
    xhr.onload = function() {
      let res = xhr.responseText;
      const doc = JSON.parse(res);
      let validate = doc.ok;
      if(!validate) {
        urlAddress.style.border = "2px solid hsl(0, 87%, 67%)";
        urlAddress.style.color = "hsl(0, 87%, 67%)";
        alert.innerHTML = "Please enter a valid url";
        alert.style.display = "inline";
      }else {
        console.log(doc.result);
        let code = doc.result.code;
        let origUrl = doc.result.original_link;
        let smallUrl = doc.result.short_link;
  
        let a = [code, origUrl, smallUrl];
        registeredUrl.push(a);
        let c = {"url": registeredUrl};
        localStorage.setItem("storedUrl", JSON.stringify(c));
        addLink(a);
      }
    };
    xhr.send();
  }else{
    alert.innerHTML = "Please enter a new url";
    alert.style.display = "inline";
  }
});

Array.from(copy).forEach(elem => {
  elem.addEventListener("click", function(event) {
    let a = event.currentTarget;
    let b = a.previousElementSibling.lastElementChild.textContent;
    navigator.clipboard.writeText(b)
    .then(() => {
      console.log(b);
    });
  });
})

function addLink(elem) {
  let bigDiv = document.createElement("div");
  bigDiv.classList.add("link");
  let smallDiv = document.createElement("div");
  
  let firstA = document.createElement("a");
  firstA.setAttribute("href", "http://" +  elem[1]);
  let faTextnode = document.createTextNode(elem[1]);
  firstA.appendChild(faTextnode);
  
  let lastA = document.createElement("a");
  lastA.setAttribute("href", "http://" + elem[2]);
  let laTextnode = document.createTextNode(elem[2]);
  lastA.appendChild(laTextnode);

  smallDiv.append(firstA, lastA);
  
  let btn = document.createElement("button");
  btn.classList.add("copy");
  btn.addEventListener("click", function(event) {
    let a = event.currentTarget;
    let b = a.previousElementSibling.lastElementChild.textContent;
    navigator.clipboard.writeText(b)
    .then(() => {
      console.log(b);
    });
  });
  let btnTextnode = document.createTextNode("copy");
  btn.appendChild(btnTextnode);

  bigDiv.append(smallDiv, btn);
  link.appendChild(bigDiv);
};