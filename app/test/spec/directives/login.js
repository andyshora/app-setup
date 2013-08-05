'use strict';

describe('Directive: login', function () {
  beforeEach(module('rocketTweetsApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<login></login>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the login directive');
  }));
});
