const chai = require('chai');
const expect = chai.expect;

const jwtAuth = require(__dirname + '/../lib/jwt_auth.js');

describe('JSON Web Token authenticat Test', () => {
  it('should fail to authenticate if token is invalid', () => {
    var req = {
      headers: {
        authorization: 'Bearer '
      }
    };

    var res = {
      status: function(statusCode) {
        expect(statusCode).to.equal(401);
        return {
          json: function(obj) {
            expect(obj.msg).to.equal('authenticat seyzz one');
          }
        };
      }
    };

    var next = function() {};

    jwtAuth(req, res, next);
  });
});
