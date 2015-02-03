/**
 * logical-phrase v0.1.0 (https://github.com/tameraydin/logical-phrase)
 * Copyright 2015 Tamer Aydin
 * Licensed under MIT (http://tameraydin.mit-license.org/)
 */
(function() {
  'use strict';

  var root = this;

  //TODO: object validation

  /**
   *
   * {
   *   "items": [...],
   *   "type": 'AND'|'OR'|'NOT'
   * }
   *
   * {
   *   "text": "...",
   *   "type": 'AND'|'OR'|'NOT'
   * }
   *
   */

  // LOCALS
  var _OPERATOR_MAP = {
    'AND': 'and',
    'OR': 'or',
    'NOT': 'falsy'
  };

  function _wrap(lp, value, level) {
    if (lp.levelWrappers[level]) {
      var wrapperStartTag = lp.levelWrappers[level].replace(' /', '');
      var wrapperEndTag = wrapperStartTag.split(' ')[0];

      wrapperEndTag = wrapperEndTag.replace('<', '</');
      if (wrapperEndTag[wrapperEndTag.length - 1] !== '>') {
        wrapperEndTag += '>';
      }

      value = wrapperStartTag + value + wrapperEndTag;
    }

    return value;
  }


  //TODO: optimize & simplify
  function _getOperatorValue(lp, operatorKey, filter) {
    var operator = _OPERATOR_MAP[operatorKey];

    return (operatorKey && (!filter || filter.indexOf(operator) > -1)) ?
      (lp[operator] + ' ') : (lp.truthy ? lp.truthy + ' ' : '');
  }

  function _getValue(lp, data, level) {
    level = level || 0;

    var itemValueList = [];
    var operatorValue = '';

    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];

      if (level === 0 || i !== 0) {
        operatorValue = _getOperatorValue(lp, item.operator, ['falsy']);
      }

      if (item.value) {
        itemValueList.push(operatorValue + item.value + ' ');
      }

      if (item.items) {
        var nextLevel = (item.operator && _OPERATOR_MAP[item.operator] !== 'falsy') ? level + 1 : level;

        itemValueList.push(operatorValue + _getValue(lp, item, nextLevel) + ' ');
      }
    }

    return (lp.prefix && level === 0 ? lp.prefix + ' ' : '') +
      _wrap(lp, itemValueList.join(_getOperatorValue(lp, data.operator)).replace(/^\s+|\s+$/g, ''), level);
  }

  // MODULE
  var LogicalPhrase = function() {
    this.prefix = '';

    this.and = 'AND';
    this.or = 'OR';
    this.truthy = '';
    this.falsy = 'NOT';

    this.levelWrappers = [];
  };

  LogicalPhrase.prototype = {
    configure: function(obj) {
      for (var key in obj) {
        if (typeof this[key] !== 'undefined') {
          this[key] = obj[key];
        }
      }
    },
    generateBy: function(data) {
      return _getValue(this, data);
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
