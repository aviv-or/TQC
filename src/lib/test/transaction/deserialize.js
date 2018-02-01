import Transaction from '../../transaction'
import chai from'chai'
const should = chai.should()
const expect = chai.expect

var vectors_valid = require('../data/pqcoind/tx_valid.json');
var vectors_invalid = require('../data/pqcoind/tx_invalid.json');

describe('Transaction deserialization', function() {

  describe('valid transaction test case', function() {
    var index = 0;
    vectors_valid.forEach(function(vector) {
      it('vector #' + index, function() {
        if (vector.length > 1) {
          var hexa = vector[1];
          Transaction(hexa).serialize(true).should.equal(hexa);
          index++;
        }
      });
    });
  });
  describe('invalid transaction test case', function() {
    var index = 0;
    vectors_invalid.forEach(function(vector) {
      it('invalid vector #' + index, function() {
        if (vector.length > 1) {
          var hexa = vector[1];
          Transaction(hexa).serialize(true).should.equal(hexa);
          index++;
        }
      });
    });
  });
});
