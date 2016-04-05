/* eslint-env jasmine */
var angular = require('angular');

describe('user service', () => {
  beforeEach(angular.mock.module('wbdbApp'));

  var User;
  var $httpBackend;
  var plugin = false;

  beforeEach(angular.mock.inject((_user_, _$httpBackend_) => {
    User = _user_;
    $httpBackend = _$httpBackend_;
  }));

  it('should be a service', () => {
    expect(typeof User).toBe('object');
  });

  it('createUser', () => {
    var user = {
      username: 'test',
      email: 'test@test.com',
      password: 'forbar123',
      confirmpassword: 'forbar123'
    };
    $httpBackend.expectPOST('http://localhost:3000/api/signup', user)
      .respond(200, user);
    User.createUser(user, (err, res) => {
      expect(err).toBe(null);
      expect(res.username).toBe(user.username);
      expect(res.email).toBe(user.email);
      expect(res.password).toBe(user.password);
      expect(res.confirmpassword).toBe(user.confirmpassword);
      plugin = true;
    });
    $httpBackend.flush();
    expect(plugin).toBe(true);
  });
});
