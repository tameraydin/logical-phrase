(function() {
  'use strict';

  var root = this;

  var LogicalPhrase = function() {

  };

  LogicalPhrase.prototype = {
    learn: function() {
      console.log(1);
    },
    forget: function() {

    },
    generateBy: function() {

    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = LogicalPhrase;
    }
    exports.LogicalPhrase = LogicalPhrase;
  } else {
    root.LogicalPhrase = LogicalPhrase;
  }

}).call(this);
