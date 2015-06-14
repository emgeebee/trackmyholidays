'use strict';

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function monthDir() {
  function link(scope, element, attrs) {
    scope.name = months[attrs.id];
  }
  return {
    restrict: 'E',
    link: link,
    scope: true,
    template: '{{name}}<div class="day" ng-repeat="day in month.dates"><day-dir day={{day}}></day-dir></div>'
  };
}

export default monthDir;
