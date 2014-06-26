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
    return JSON.stringify(fn(env));
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



  app.publicFolder = function() {
    return mergeTrees([envTree, 'public'], { overwrite: true });
  };

}

module.exports = EmberCLIChrome;