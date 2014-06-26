window.{{NAMESPACE}}ENV = {{ENV}};
window.EmberENV = window.{{NAMESPACE}}ENV.EmberENV;
window.ENV = window.{{NAMESPACE}}ENV; // Legacy support remove when all plugins are up to date.



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


function loadScript(src, callback)
{
  var s,
      r,
      t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      callback();
    }
  };
  t = document.getElementsByTagName('body')[0];
  t.appendChild(s);
}

loadScript("assets/vendor.js", function() {
  loadScript("assets/{{APPNAME}}.js", function() {
    var appView = require('{{APPNAME}}/views/application')['default'];
    appView.prototype.classNames = ['chromeApp'];
    window.{{NAMESPACE}} = require('{{APPNAME}}/app')['default'].create({{NAMESPACE}}ENV.APP);
  });
});