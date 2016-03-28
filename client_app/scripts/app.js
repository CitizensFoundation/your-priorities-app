var splashDiv;

if (window.location.hostname.indexOf('betrireykjavik') > -1) {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashBR";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
} else if (window.location.hostname.indexOf('betraisland') > -1) {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashBI";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
} else {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashYrPri";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
}

function onSplashClick() {
  var loadContainer = document.getElementById('splashYrPri');
  if (loadContainer) {
    loadContainer.parentNode.removeChild(loadContainer);
  }
  loadContainer = document.getElementById('splashBR');
  if (loadContainer) {
    loadContainer.parentNode.removeChild(loadContainer);
  }
  loadContainer = document.getElementById('splashBI');
  if (loadContainer) {
    loadContainer.parentNode.removeChild(loadContainer);
  }
  document.body.classList.remove('loading');
}
