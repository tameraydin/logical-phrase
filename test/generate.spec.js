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
});
