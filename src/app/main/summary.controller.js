'use strict';

class calendar {
  constructor ($scope, $location, UserData, Dates) {

    //double check if the user has been here before, if not send to the wizard
    this.existingDates = UserData.getDates();
    if (this.existingDates == null) {
      $location.path( "/wizard" );
    }

    $scope.currentYear = Dates.getCurrentYear();
    $scope.dates = Dates.getHolidaysForCurrentYear();

  }

}

calendar.$inject = ['$scope', '$location', 'UserData', 'Dates'];

export default calendar;