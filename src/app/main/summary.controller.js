'use strict';

class Summary {
  constructor ($scope, $location, UserData, Dates) {

    //double check if the user has been here before, if not send to the wizard
    this.existingDates = UserData.getDates();
    if (this.existingDates == null) {
      $location.path( "/wizard" );
    }

    $scope.currentYear = Dates.getCurrentYear();
    $scope.dates = UserData.getDatesForYear($scope.currentYear);

  }

}

Summary.$inject = ['$scope', '$location', 'UserData', 'Dates'];

export default Summary;