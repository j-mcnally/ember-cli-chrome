/* jshint node: true */
'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var unwatchedTree = require('./lib/unwatched-tree')
var utilities = require('./lib/utilities')


module.exports = {
  name: 'ember-cli-chrome',
  treeFor: function (name) {
    var treePath =  path.join('node_modules', 'ember-cli-chrome', name + '-addon');
    if (fs.existsSync(treePath)) {
      return unwatchedTree(treePath);
    }
    if (name == 'public') {
      var manifestTree = utilities.manifestTree(this.app);
      var iconTree = utilities.iconTree(this.app)
      return mergeTrees([iconTree, manifestTree]);
    }
  },
  included: function (app) {
    this._super.included(app);
    this.app = app;
    utilities.disableFingerPrints(app);
    utilities.addChromeHelper(app);
    utilities.forceHashLocation(app);
  }
};
