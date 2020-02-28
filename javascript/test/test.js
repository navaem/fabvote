var assert = require('assert');
require("mocha")
const FabVote = require('../lib/fabvote');

describe('fabvote', function() {
  describe('#findMajority()', function() {
    it('should return return the majority', function() {
      const votesStr = [
        {
          "choice": "Abraham Lincoln",
          "docType": "vote",
          "election": "EL0",
          "voter": "id0"
        },
        {
          "choice": "Abraham Lincoln",
          "docType": "vote",
          "election": "EL0",
          "voter": "x509::/OU=client/OU=org1/OU=department1/CN=user1::/C=US/ST=California/L=San Francisco/O=org1.example.com/CN=ca.org1.example.com"
        },
        {
          "choice": "Abraham Lincoln",
          "docType": "vote",
          "election": "EL0",
          "voter": "x509::/OU=client/OU=org1/OU=department1/CN=user1::/C=US/ST=California/L=San Francisco/O=org1.example.com/CN=ca.org1.example.com"
        }
      ]
      const fabvote = new FabVote();
      assert.equal(fabvote.findMajority(votesStr),"Abraham Lincoln");
    });
  });
});