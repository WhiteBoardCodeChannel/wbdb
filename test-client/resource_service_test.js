/* eslint-env jasmine */

const { angular } = window;

describe('resource service', () => {
  beforeEach(angular.mock.module('wbdbApp'));

  var $httpBackend;
  var Resource;
  var testResource;
  var called;

  beforeEach(angular.mock.inject((_$httpBackend_, _Resource_) => {
    $httpBackend = _$httpBackend_;
    Resource = _Resource_;
    testResource = new Resource('/test');
    called = 0;
  }));

  it('should be a service', () => {
    expect(typeof Resource).toBe('function');
  });

  it('should have a property storing the resource location', () => {
    expect(testResource.resourceName).toBe('/test');
  });

  it('should make a GET request', () => {
    $httpBackend.expectGET('http://localhost:3000/api/test')
      .respond(200, { name: 'test' });
    testResource.getAll((err, data) => {
      expect(err).toBe(null);
      expect(data.name).toBe('test');
      called++;
    });
    $httpBackend.flush();
    expect(called).toBe(1);
  });

  it('should make a POST request', () => {
    $httpBackend.expectPOST('http://localhost:3000/api/test', { name: 'sent' })
      .respond(200, { name: 'response' });
    testResource.create({ name: 'sent' }, (err, data) => {
      expect(err).toBe(null);
      expect(data.name).toBe('response');
      called++;
    });
    $httpBackend.flush();
    expect(called).toBe(1);
  });

  it('should make a PUT request', () => {
    $httpBackend.expectPUT('http://localhost:3000/api/test/nm')
      .respond(200, { name: 'response' });
    testResource.update({ _id: 'nm' }, (err, data) => {
      expect(err).toBe(null);
      expect(data.name).toBe('response');
      called++;
    });
    $httpBackend.flush();
    expect(called).toBe(1);
  });

  it('should make a DELETE request', () => {
    $httpBackend.expectDELETE('http://localhost:3000/api/test/nm')
      .respond(200, { name: 'response' });
    testResource.delete({ _id: 'nm' }, (err, data) => {
      expect(err).toBe(null);
      expect(data.name).toBe('response');
      called++;
    });
    $httpBackend.flush();
    expect(called).toBe(1);
  });

  it('should handle errors', () => {
    $httpBackend.expectGET('http://localhost:3000/api/test')
      .respond(404);
    testResource.getAll((err) => {
      expect(typeof err).toBe('object');
      expect(err.status).toBe(404);
      called++;
    });
    $httpBackend.flush();
    expect(called).toBe(1);
  });

});
