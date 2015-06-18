var UnwatchedTree = function(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

module.exports = UnwatchedTree;