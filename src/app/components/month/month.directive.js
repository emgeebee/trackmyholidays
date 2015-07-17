'use strict';

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function monthDir() {
  function link($scope, element, attrs) {
    $scope.name = months[attrs.id];
    $scope.dayNames = dayNames;
  }
  return {
    restrict: 'E',
    link: link,
    transclude: true,
    scope: true,
    templateUrl: 'app/components/month/month.html'
  };
}

export default monthDir;
