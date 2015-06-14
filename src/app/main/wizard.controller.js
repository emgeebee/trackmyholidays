'use strict';

class calendar {
  constructor ($scope) {
    $scope.awesomeThings = [
    ];
    $scope.awesomeThings.forEach(function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }
}

calendar.$inject = ['$scope'];

export default calendar;