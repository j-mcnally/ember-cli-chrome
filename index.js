/* jshint node: true */
'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var unwatchedTree = require('./lib/unwatched-tree');
var utilities = require('./lib/utilities');

module.exports = {
  name: 'supertree-chrome-extension',
  treeFor: function (name) {
    var treePath =  path.join('node_modules', 'supertree-chrome-extension', name + '-addon');

    if (fs.existsSync(treePath)) {
      return unwatchedTree(treePath);
    }

    if (name === 'public') {
      var manifestTree = utilities.manifestTree(this.app);
      var iconTree = utilities.iconTree(this.app);
      var scriptTree = utilities.scriptTree(this.app);
      return mergeTrees([iconTree, manifestTree, scriptTree]);
    }
  },
  included: function (app) {
    this._super.included(app);
    this.app = app;
    utilities.disableFingerPrints(app);
    utilities.addChromeHelper(app);
    utilities.forceHashLocation(app);
  },
};
