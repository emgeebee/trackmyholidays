'use strict';

class calendar {
  constructor ($scope, $location, UserData, Dates) {

    this.UserData = UserData;
    this.Dates = Dates;

    //double check if the user has been here before, if not send to the wizard
    this.existingDates = UserData.getDates();
    if (this.existingDates == null) {
      $location.path( "/wizard" );
    }

    this.currentYear = Dates.getCurrentYear();

    $scope.currentYear = this.currentYear;
    $scope.dates = Dates.getHolidaysForCurrentYear();
    $scope.calendar = this.getCalendarArray();

  }

  nextYear() {
    this.currentYear++;
  }

  prevYear() {
    this.currentYear--;
  }

  getCalendarArray() {
    var startMonth = this.UserData.getYearStart();
    var currentYear = this.Dates.getCurrentYear();

    var d = new Date(currentYear, startMonth, '01');
    var startMonth = d.getMonth();
    var monthCounter = 0;
    var startDay;

    var calendar = [];
    while (monthCounter < 12) {
      var month = {id: startMonth, dates: []};
      startDay = d.getDay();

      while (startDay > 0) {
        d.setDate(d.getDate()-1);
        startDay = d.getDay();
      }

      var newMonth = startMonth;

      while (startMonth === newMonth || startDay < 6) {

        month.dates.push(d.getTime());
        d.setDate(d.getDate()+1);
        startDay = d.getDay();
        newMonth = d.getMonth();
      }

      calendar.push(month);
      if (startMonth < 11) {
        startMonth++; 
      } else {
        startMonth = 0;
      }
      monthCounter++;
    }
    return calendar;
  }

}

calendar.$inject = ['$scope', '$location', 'UserData', 'Dates'];

export default calendar;