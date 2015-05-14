'use strict';

var path = require('path');
var fs   = require('fs');
var replace     = require('broccoli-replace');
var funnel   = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var stringUtil = require('ember-cli/lib/utilities/string')

function EmberCLIChrome(project) {
  this.project = project;
  this.name    = 'Ember CLI Chrome';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

function injectENVJson(name, fn, env, tree, files) {
  // TODO: real templating
  var self = this;
  var nameString = function() {
    return name;
  }

  return replace(tree, {
    files: files,
    patterns: [
    {
      match: /\{\{APPNAME\}\}/g,
      replacement: nameString
    }]
  });
}

function injectManifest(app, tree, files) {
  // TODO: real templating
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


  return replace(tree, {
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
}

EmberCLIChrome.prototype.treeFor = function treeFor(name) {

}

EmberCLIChrome.prototype.included = function included(app) {
  var root_path = app.project.root;
  var getJSON = require(root_path + "/config/environment.js")

  var treePath =  path.join('node_modules', 'ember-cli-chrome', 'chrome-files');
  if (fs.existsSync(treePath)) {
    var files = ['ember-chrome.js'];
    var env = funnel(unwatchedTree(treePath),{
      srcDir: '/',
      files: files,
      destDir: '/'
    });
    var envTree = injectENVJson(app.name, getJSON, app.env, env, files);
  }


  var files = ['manifest.json'];
  var manifest = funnel(unwatchedTree(treePath),{
    srcDir: '/',
    files: files,
    destDir: '/'
  });
  var manifestTree = injectManifest(app, manifest, files);
  


  var files = ['chrome-icon.png', 'chrome-icon-lg.png'];
  var iconTree = funnel(unwatchedTree(treePath),{
    srcDir: '/',
    files: files,
    destDir: '/'
  });


  app.oldIndex = app.index;
  app.index = function() {
    var indexTree = app.oldIndex();
    return mergeTrees([indexTree, envTree, iconTree, manifestTree]);
  };

  app.options.fingerprint.enabled = false; // Disabled fingerprinting, pointless in a chrome extension.


}

module.exports = EmberCLIChrome;
