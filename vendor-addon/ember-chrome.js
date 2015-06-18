// Ensure our window is always the size of our dom.

var windowSizeTimer = null;
document.addEventListener('DOMSubtreeModified', function() {
    var self = this;
    if(windowSizeTimer != null) {
      window.clearTimeout(windowSizeTimer);
    } 
    windowSizeTimer = window.setTimeout(function() {
      var rootElement = document.getElementsByClassName("chromeApp")[0];
      if (rootElement != null) {
        var newHeight = rootElement.offsetHeight;
        document.body.style.height = newHeight;
        document.getElementsByTagName("html")[0].style.height = newHeight;
      }
      windowSizeTimer = null;
    }, 100);
});