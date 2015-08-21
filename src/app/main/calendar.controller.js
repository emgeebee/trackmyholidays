'use strict';

class calendar {
    constructor ($scope, $location, UserData, Dates) {

        this.UserData = UserData;
        this.Dates = Dates;
        this.scope = $scope;

        this.currentYear = Dates.getCurrentYear();
        this.existingDates = UserData.getDates(this.currentYear);

        //double check if the user has been here before, if not send to the wizard
        if (this.existingDates == null) {
            $location.path("/wizard");
        }

        $scope.currentYear = this.currentYear;
        $scope.calendar = this.getCalendarArray();
        $scope.calendars = this.getCalendars();
        $scope.prevYear = this.prevYear.bind(this);
        $scope.nextYear = this.nextYear.bind(this);
        $scope.isCurrentlySelected = Dates.isCurrentlySelected.bind(Dates);
        $scope.currentlySelected = Dates.getCurrentlySelected.bind(Dates);
        $scope.isNewSelectionStarted = Dates.isNewSelectionStarted.bind(Dates);

        $scope.removeGroup = Dates.removeGroup.bind(Dates);
        $scope.halfDay = Dates.halfDay.bind(Dates);

        $scope.remainingDays = UserData.getRemainingHolidays.bind(UserData);

    }

    nextYear() {

        this.currentYear++;
        this.Dates.setCurrentYear(this.currentYear);
        this.scope.currentYear = this.Dates.getCurrentYear();
        this.scope.calendar = this.getCalendarArray();

    }

    prevYear() {

        this.currentYear--;
        this.Dates.setCurrentYear(this.currentYear);
        this.scope.currentYear = this.Dates.getCurrentYear();
        this.scope.calendar = this.getCalendarArray();

    }

    getCalendars() {
        return this.UserData.getCalendars();
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