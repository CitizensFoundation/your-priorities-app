function onSplashClick() {
  var loadContainer = document.getElementById('splash');
  loadContainer.parentNode.removeChild(loadContainer);
  document.body.classList.remove('loading');
}
