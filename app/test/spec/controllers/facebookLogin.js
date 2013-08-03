'use strict';

describe('Controller: FacebookLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('newappApp'));

  var FacebookLoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FacebookLoginCtrl = $controller('FacebookLoginCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
