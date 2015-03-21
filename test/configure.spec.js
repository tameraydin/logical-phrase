if (typeof LogicalPhrase === 'undefined') {
  var LogicalPhrase = require('../src/main.js');
}

var LP, data;

describe('logical-phrase', function() {

  describe('module', function() {

    it('should initialize a constructor', function() {
      expect(typeof LogicalPhrase).toBe('function');
    });
  });

  describe('configure', function() {

    it('should be respected', function() {
      LP = new LogicalPhrase();

      LP.configure({
        'prefix': 'x',
        'truthy': 'did',
        'levelWrappers': [
          '<div>',
          '<span>'
        ],
        'nonExisting': undefined
      });

      expect(LP.prefix).toBe('x');
      expect(LP.truthy).toBe('did');
      expect(LP.levelWrappers[0]).toBe('<div>');
      expect(LP.levelWrappers[1]).toBe('<span>');
      expect(LP.hasOwnProperty('nonExisting')).toBeFalsy();
    });
  });

  describe('prefix', function() {
    var prefix = 'select ones that';

    beforeEach(function() {
      LP = new LogicalPhrase();

      LP.configure({
        'prefix': prefix
      });
    });

    it('should be applied', function() {

      data = {
        "items": [
          {
            "value": "x"
          },
          {
            "value": "y",
            "operator": "NOT"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        prefix + ' x AND NOT y');
    });

    it('should not repeated if NOT operator is assigned to a list', function() {

      data = {
        "items": [
          {
            "operator": "OR",
            "items": [
              {
                "value": "x"
              }
            ]
          },
          {
            "operator": "NOT",
            "items": [
              {
                "value": "z"
              }
            ]
          },
          {
            "operator": "OR",
            "items": [
              {
                "value": "w"
              }
            ]
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        prefix + ' x AND NOT z AND w');
    });

    it('should work at second level', function() {

      data = {
        "items": [
          {
            "items": [
              {
                "value": "x"
              },
              {
                "value": "y",
                "operator": "NOT"
              }
            ],
            "operator": "OR"
          },
          {
            "value": "z",
            "operator": "NOT"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        prefix + ' x OR NOT y AND NOT z');
    });
  });

  describe('truthy / values', function() {
    var truthy = 'did';
    var falsy = 'did not';

    beforeEach(function() {
      LP = new LogicalPhrase();
    });

    it('should be applied', function() {
      LP.configure({
        'truthy': truthy,
        'falsy': falsy
      });

      data = {
        "items": [
          {
            "value": "x"
          },
          {
            "value": "y",
            "operator": "NOT"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        truthy + ' x AND ' + falsy + ' y');
    });

    it('should work at second level', function() {
      LP.configure({
        'truthy': truthy,
        'falsy': falsy
      });

      data = {
        "items": [
          {
            "value": "x",
            "operator": "NOT"
          },
          {
            "items": [
              {
                "value": "y"
              },
              {
                "value": "z"
              }
            ],
            "operator": "OR"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        falsy + ' x AND ' + truthy + ' y OR ' + truthy + ' z');
    });
  });

  describe('levelWrappers', function() {

    it('should work', function() {
      LP = new LogicalPhrase();

      LP.configure({
        'levelWrappers': [
          '<div class="level-0">',
          '<span class="level-1" />',
          '<span>'
        ]
      });

      data = {
        "items": [
          {
            "value": "x"
          },
          {
            "value": "y"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        '<div class="level-0">x AND y</div>');

      data = {
        "items": [
          {
            "items": [
              {
                "value": "x"
              },
              {
                "value": "y"
              }
            ],
            "operator": "OR"
          },
          {
            "value": "z",
            "operator": "NOT"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        '<div class="level-0"><span class="level-1">x OR y</span> AND NOT z</div>');

      LP.configure({
        'levelWrappers': [
          null,
          '<b>',
          '<span>'
        ]
      });

      data = {
        "items": [
          {
            "items": [
              {
                "value": "x"
              },
              {
                "value": "y"
              }
            ],
            "operator": "OR"
          },
          {
            "items": [
              {
                "value": "a"
              },
              {
                "value": "b"
              }
            ],
            "operator": "AND"
          },
          {
            "value": "c"
          },
          {
            "items": [
              {
                "items": [
                  {
                    "value": "d"
                  },
                  {
                    "value": "e"
                  }
                ],
                "operator": "OR"
              },
              {
                "value": "f"
              }
            ],
            "operator": "AND"
          },
          {
            "items": [
              {
                "items": [
                  {
                    "value": "z"
                  },
                  {
                    "value": "w"
                  },
                  {
                    "value": "q",
                    "operator": "NOT"
                  }
                ],
                "operator": "OR"
              }
            ],
            "operator": "NOT"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        '<b>x OR y</b>' +
        ' AND ' +
        '<b>a AND b</b>' +
        ' AND ' +
        'c' +
        ' AND ' +
        '<b><span>d OR e</span> AND f</b>' +
        ' AND NOT ' +
        '<b>' +
          '<span>z OR w OR NOT q</span>' +
        '</b>');
    });
  });
});
