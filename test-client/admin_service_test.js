/* eslint-env jasmine */
var angular = require('angular');

describe('admin service', () => {
  beforeEach(angular.mock.module('wbdbApp'));

  var admin;
  var $httpBackend;
  var plugin = false;

  beforeEach(angular.mock.inject((_admin_, _$httpBackend_) => {
    admin = _admin_;
    $httpBackend = _$httpBackend_;
  }));

  it('should be a service', () => {
    expect(typeof admin).toBe('object');
  });

  it('getChallenges to get challenges', () => {
    $httpBackend.expectGET('http://localhost:3000/api/admin/challenges')
      .respond(200, [{ title: 'challenge1' }, { title: 'challenge2' }]);
    admin.getChallenges((err, res) => {
      expect(err).toBe(null);
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(2);
      plugin = true;
    });
    $httpBackend.flush();
    expect(plugin).toBe(true);
  });

  it('getSolutions to get solutions', () => {
    $httpBackend.expectGET('http://localhost:3000/api/admin/solutions')
      .respond(200, [{ title: 'solution1' }, { title: 'solution2' }]);
    admin.getSolutions((err, res) => {
      expect(err).toBe(null);
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(2);
      plugin = true;
    });
    $httpBackend.flush();
    expect(plugin).toBe(true);
  });

  it('getSolutionChallenge', () => {
    $httpBackend.expectGET('http://localhost:3000/api/solutions/1')
      .respond(200, { title: 'solution1' });
     admin.getSolutionChallenge(1, (err, res) => {
       expect(err).toBe(null);
       expect(res.title).toBe('solution1');
       plugin = true;
     });
     $httpBackend.flush();
     expect(plugin).toBe(true);
  });

  it('should handle error', () => {
    $httpBackend.expectGET('http://localhost:3000/api/admin/challenges')
      .respond(404);
    admin.getChallenges((err) => {
      expect(typeof err).toBe('object');
      expect(err.status).toBe(404);
      plugin = true;
    });
    $httpBackend.flush();
    expect(plugin).toBe(true);
  });

});
