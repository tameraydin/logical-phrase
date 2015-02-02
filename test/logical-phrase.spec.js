if (typeof LogicalPhrase === 'undefined') {
  var LogicalPhrase = require('../src/main.js');
}

describe('logical-phrase', function() {

  it('should initialize a constructor', function() {
    expect(typeof LogicalPhrase).toBe('function');
  });
});
