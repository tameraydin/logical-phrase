/**
 * logical-phrase v0.1.0 (https://github.com/tameraydin/logical-phrase)
 * Copyright 2015 Tamer Aydin
 * Licensed under MIT (http://tameraydin.mit-license.org/)
 */
(function() {
  'use strict';

  var root = this;

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
  var _TYPE_MAP = {
    'AND': 'and',
    'OR': 'or',
    'NOT': 'falsy'
  };

  //TODO: use call instead of passing 'lp' as argument
  function _wrap(lp, text, level) {
    if (lp.levelWrappers[level]) {
      var wrapperStartTag = lp.levelWrappers[level].replace(' /', '');
      var wrapperEndTag = wrapperStartTag.split(' ')[0];

      wrapperEndTag = wrapperEndTag.replace('<', '</');
      if (wrapperEndTag[wrapperEndTag.length - 1] !== '>') {
        wrapperEndTag += '>';
      }

      text = wrapperStartTag + text + wrapperEndTag;
    }

    return text;
  }


  //TODO: optimize & simplify
  function _getTypeText(lp, type, filter) {
    var typeMap = _TYPE_MAP[type];

    return (type && (!filter || filter.indexOf(typeMap) > -1)) ?
      (lp[typeMap] + ' ') : (lp.truthy ? lp.truthy + ' ' : '');
  }

  function _getText(lp, data, level) {
    level = level || 0;

    var itemTextList = [];
    var typeText;

    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      typeText = _getTypeText(lp, item.type, ['falsy']);

      if (item.text) {
        itemTextList.push(typeText + item.text + ' ');
      }

      if (item.items) {
        var nextLevel = (item.type && _TYPE_MAP[item.type] !== 'falsy') ? level + 1 : level;

        itemTextList.push(typeText + _getText(lp, item, nextLevel) + ' ');
      }
    }

    return (lp.prefix ? lp.prefix + ' ' : '') +
      _wrap(lp, itemTextList.join(_getTypeText(lp, data.type)).replace(/^\s+|\s+$/g, ''), level);
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
    learn: function(obj) {
      for (var key in obj) {
        if (typeof this[key] !== 'undefined') {
          this[key] = obj[key];
        }
      }
    },
    generateBy: function(data) {
      return _getText(this, data);
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
