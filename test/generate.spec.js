if (typeof LogicalPhrase === 'undefined') {
  var LogicalPhrase = require('../src/main.js');
}

var LP, data;

describe('logical-phrase', function() {

  describe('generate', function() {
    beforeEach(function() {
      LP = new LogicalPhrase();
    });

    it('case 1', function() {
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

      expect(LP.generateBy(data)).toBe('x AND y');
    });

    it('case 2', function() {
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

      expect(LP.generateBy(data)).toBe('x AND NOT y');
    });

    it('case 3', function() {
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
                    "value": "x"
                  },
                  {
                    "value": "y"
                  }
                ],
                "operator": "OR"
              }
            ],
            "operator": "NOT"
          },
          {
            "value": "z"
          }
        ],
        "operator": "AND"
      };

      expect(LP.generateBy(data)).toBe('NOT x OR y AND z');
    });
  });
});
