/* eslint-env jasmine */
/* eslint-disable no-undefined */
var angular = require('angular');

describe('auth service', () => {
  beforeEach(angular.mock.module('wbdbApp'));

  var rootScope;
  var window;
  var auth;
  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2ZTA5M2ZhMjd' +
  'kMTVlNjQwYjI2NjJkNyIsImlhdCI6MTQ1NzYyMDkwM30.34v0dcujjK4Ill6Meu20QtmPZ2m' +
  '0OYAEhIk4WL44RAA';

  beforeEach(angular.mock.inject((_$rootScope_, _$window_, _auth_) => {
    rootScope = _$rootScope_;
    window = _$window_;
    auth = _auth_;
  }));

  it('should be a service', () => {
    expect(typeof auth).toBe('object');
  });

  it('the default token and username should be null', () => {
    expect(auth.token).toBe(null);
    expect(auth.username).toBe(null);
    expect(rootScope.loggedIn).toBe(false);
  });

  it('parseJWT used to parse Token as object with id property', () => {
    expect(typeof auth.parseJWT(token)).toBe('object');
    expect(auth.parseJWT(token).id).toBeDefined();
    expect(auth.parseJWT(token).id).toBe('56e093fa27d15e640b2662d7');
  });

  it('saveToken used to save Token to window.localStorage', () => {
    auth.saveToken(token);
    expect(window.localStorage.jwtToken).toBe(token);
    expect(auth.token).toBe(token);
    expect(auth.username).toBe(auth.parseJWT(auth.token).usrname);
  });

  it('getToken to retreive the token from window.localStorage', () => {
    expect(auth.getToken()).toBe(token);
  });

  it('logout to remove the token', () => {
    var cb = function() {};
    auth.logout(cb);
    expect(window.localStorage.jwtToken).toBe(undefined);
  });

  it('getUserId to retrieve the id of token', () => {
    auth.token = token;
    expect(auth.getUserId()).toBe('56e093fa27d15e640b2662d7');
    auth.logout(() => {});
    expect(auth.getUserId()).toBe(null);
  });
});
