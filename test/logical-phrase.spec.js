if (typeof LogicalPhrase === 'undefined') {
  var LogicalPhrase = require('../src/main.js');
}

var LP, data;

//TODO: seperate into different specs
describe('logical-phrase', function() {

  describe('module', function() {

    it('should initialize a constructor', function() {
      expect(typeof LogicalPhrase).toBe('function');
    });
  });

  describe('learn', function() {
    LP = new LogicalPhrase();

    it('prefix', function() {
      LP.learn({
        'prefix': 'x',
        'truthy': 'did',
        'levelWrappers': [
          '<div>',
          '<span>'
        ]
      });

      expect(LP.prefix).toBe('x');
      expect(LP.truthy).toBe('did');
      expect(LP.levelWrappers[0]).toBe('<div>');
      expect(LP.levelWrappers[1]).toBe('<span>');
    });
  });

  describe('generate', function() {
    beforeEach(function() {
      LP = new LogicalPhrase();
    });

    it('case 1', function() {
      data = {
        "items": [
          {
            "text": "x"
          },
          {
            "text": "y"
          }
        ],
        "type": "AND"
      };

      expect(LP.generateBy(data)).toBe('x AND y');
    });

    it('case 2', function() {
      data = {
        "items": [
          {
            "text": "x"
          },
          {
            "text": "y",
            "type": "NOT"
          }
        ],
        "type": "AND"
      };

      expect(LP.generateBy(data)).toBe('x AND NOT y');
    });

    it('case 3', function() {
      data = {
        "items": [
          {
            "items": [
              {
                "text": "x"
              },
              {
                "text": "y"
              }
            ],
            "type": "OR"
          },
          {
            "text": "z",
            "type": "NOT"
          }
        ],
        "type": "AND"
      };

      expect(LP.generateBy(data)).toBe('x OR y AND NOT z');
    });

    it('case 4', function() {
      data = {
        "items": [
          {
            "items": [
              {
                "items": [
                  {
                    "text": "x"
                  },
                  {
                    "text": "y"
                  }
                ],
                "type": "OR"
              }
            ],
            "type": "NOT"
          },
          {
            "text": "z"
          }
        ],
        "type": "AND"
      };

      expect(LP.generateBy(data)).toBe('NOT x OR y AND z');
    });
  });

  describe('combined', function() {
    var prefix = 'select ones that';
    var truthy = 'did';
    var falsy = 'did not';

    beforeEach(function() {
      LP = new LogicalPhrase();
    });

    //TODO: tests for each property

    it('should reflect prefix/truthy/values', function() {
      LP.learn({
        'prefix': prefix,
        'truthy': truthy,
        'falsy': falsy
      });

      data = {
        "items": [
          {
            "text": "x"
          },
          {
            "text": "y",
            "type": "NOT"
          }
        ],
        "type": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        prefix + ' ' + truthy + ' x AND ' + falsy + ' y');
    });

    it('should wrap with certain level elements', function() {
      LP.learn({
        'levelWrappers': [
          '<div class="level-0">',
          '<span class="level-1" />',
          '<span>'
        ]
      });

      data = {
        "items": [
          {
            "text": "x"
          },
          {
            "text": "y"
          }
        ],
        "type": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        '<div class="level-0">x AND y</div>');

      data = {
        "items": [
          {
            "items": [
              {
                "text": "x"
              },
              {
                "text": "y"
              }
            ],
            "type": "OR"
          },
          {
            "text": "z",
            "type": "NOT"
          }
        ],
        "type": "AND"
      };

      expect(LP.generateBy(data)).toBe(
        '<div class="level-0"><span class="level-1">x OR y</span> AND NOT z</div>');

      LP.learn({
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
                "text": "x"
              },
              {
                "text": "y"
              }
            ],
            "type": "OR"
          },
          {
            "items": [
              {
                "text": "a"
              },
              {
                "text": "b"
              }
            ],
            "type": "AND"
          },
          {
            "text": "c"
          },
          {
            "items": [
              {
                "items": [
                  {
                    "text": "d"
                  },
                  {
                    "text": "e"
                  }
                ],
                "type": "OR"
              },
              {
                "text": "f"
              }
            ],
            "type": "AND"
          },
          {
            "items": [
              {
                "items": [
                  {
                    "text": "z"
                  },
                  {
                    "text": "w"
                  },
                  {
                    "text": "q",
                    "type": "NOT"
                  }
                ],
                "type": "OR"
              }
            ],
            "type": "NOT"
          }
        ],
        "type": "AND"
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
          'z OR w OR NOT q' +
        '</b>');
    });
  });
});
