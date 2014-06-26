'use strict';

var path = require('path');
var fs   = require('fs');
var replace     = require('broccoli-replace');
var pickFiles   = require('broccoli-static-compiler');
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
  var envJsonString = function(){
    var my_env = fn(env);
    if (env != "development") {
      my_env.locationType = 'none';
    }

    return JSON.stringify(my_env);
  };
  var namespaceString = function() {
      return stringUtil.classify(name);
  };
  var nameString = function() {
    return name;
  }

  var baseTag = function(){
    var envJSON      = fn(env);
    var baseURL      = cleanBaseURL(envJSON.baseURL);
    var locationType = envJSON.locationType;

    if (locationType === 'hash' || locationType === 'none') {
      return '';
    }

    if (baseURL) {
      return '<base href="' + baseURL + '" />';
    } else {
      return '';
    }
  };

  return replace(tree, {
    files: files,
    patterns: [{
      match: /\{\{ENV\}\}/g,
      replacement: envJsonString
    },
    {
      match: /\{\{APPNAME\}\}/g,
      replacement: nameString
    },
    {
      match: /\{\{NAMESPACE\}\}/g,
      replacement: namespaceString
    },
    {
      match: /\{\{BASE_TAG\}\}/g,
      replacement: baseTag
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
  var treePath =  path.join('node_modules', 'ember-cli-chrome', 'public-addon');
  var files = ['ember-chrome.js'];
  var env = pickFiles(unwatchedTree(treePath),{
    srcDir: '/',
    files: files,
    destDir: '/'
  });
  var envTree = injectENVJson(app.name, app.options.getEnvJSON, app.env, env, files);

  var files = ['manifest.json'];
  var manifest = pickFiles(unwatchedTree(treePath),{
    srcDir: '/',
    files: files,
    destDir: '/'
  });
  var manifestTree = injectManifest(app, manifest, files);
  
  var files = ['chrome-icon.png', 'chrome-icon-lg.png'];
  var iconTree = pickFiles(unwatchedTree(treePath),{
    srcDir: '/',
    files: files,
    destDir: '/'
  });

  app.publicFolder = function() {
    return mergeTrees([envTree, manifestTree, iconTree, 'public'], { overwrite: true });
  };

  app.options.fingerprint.enabled = false; // Disabled fingerprinting, pointless in a chrome extension.


}

module.exports = EmberCLIChrome;