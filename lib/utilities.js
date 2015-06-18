var path = require('path');
var replace     = require('broccoli-replace');
var funnel   = require('broccoli-funnel');
var stringUtil = require('ember-cli/lib/utilities/string')
var unwatchedTree = require('./unwatched-tree')

var Utilities = (function() {
  return {
    treePath: path.join('node_modules', 'ember-cli-chrome', 'chrome-files'),
    disableFingerPrints: function(app) {
      app.options.fingerprint.enabled = false;
    },
    addChromeHelper: function(app) {
      app.import("vendor/ember-chrome.js")
    },
    forceHashLocation: function(app) {

      // This is a hack to allow us to forcefully set 
      // locationType to hash since auto wont work 
      // with chrome extensions

      var oldContentFor = app.contentFor.bind(app);
      app.contentFor = function(config, match, type) {
        config.locationType = "hash";
        return oldContentFor(config, match, type);
      }
    },
    manifestTree: function(app) {
      var self = this;

      var nameString = function() {
          return app.name;
      };

      var descString = function() {
          return app.project.pkg.description;
      };

      var versionString = function() {
          return app.project.pkg.version;
      };

      var files = ['manifest.json'];

      var manifestTree = funnel(unwatchedTree(self.treePath),{
        srcDir: '/',
        files: files,
        destDir: '/'
      });

      var tree = replace(manifestTree, {
        files: files,
        patterns: [
        {
          match: /\{\{APPNAME\}\}/g,
          replacement: nameString
        },
        {
          match: /\{\{APPDESC\}\}/g,
          replacement: descString
        },
        {
          match: /\{\{APPVERSION\}\}/g,
          replacement: versionString
        }]
      });

      return tree;
    },
    iconTree: function() {
      var self = this;
      var files = ['chrome-icon.png', 'chrome-icon-lg.png'];
      var tree = funnel(unwatchedTree(self.treePath),{
        srcDir: '/',
        files: files,
        destDir: '/'
      });
      return tree;
    }
  }
})();

module.exports = Utilities;