'use strict';

describe('Controller: TwitterLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('rocketTweetsApp'));

  var TwitterLoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TwitterLoginCtrl = $controller('TwitterLoginCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
