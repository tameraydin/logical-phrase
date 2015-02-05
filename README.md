# logical-phrase [![Build Status](http://img.shields.io/travis/tameraydin/logical-phrase/master.svg?style=flat-square)](https://travis-ci.org/tameraydin/logical-phrase) [![Coverage Status](https://img.shields.io/coveralls/tameraydin/logical-phrase/master.svg?style=flat-square)](https://coveralls.io/r/tameraydin/logical-phrase?branch=master)

Transforms following JSON:
```json
{
  "items": [
    {
      "value": "foo"
    },
    {
      "value": "bar"
    },
    {
      "value": "baz",
      "operator": "NOT"
    }
  ],
  "operator": "AND"
}
```
into:
``foo AND bar AND NOT baz``


Furthermore, with a given configuration as follows:
```javascript
var lp = new LogicalPhrase();

lp.configure({
  'prefix': 'Select users who',
  'truthy': 'did',
  'falsy': 'did not',
  'and': 'and',
  'or': 'or'
});
```
it can transform this:
```json
{
  "items": [
    {
      "value": "visit 'site.homepage'",
      "operator": "NOT"
    },
    {
      "items": [
        {
          "value": "use campaign 'x'"
        },
        {
          "value": "use campaign 'y'"
        }
      ],
      "operator": "OR"
    }
  ],
  "operator": "AND"
}
```
into:
``Select users who did not visit 'site.homepage' and did use campaign 'x' or did use campaign 'y'``

It is also possible to wrap each level of items into different HTML tags.

See /test for more examples.
