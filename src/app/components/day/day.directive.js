'use strict';

class day {
    constructor($scope, date, month, userData, dateFunctions) {

        this.scope = $scope;
        this.dateObj = new Date(parseInt(date));
        this.currentYear = this.scope.currentYear;
        this.month = month;
        this.scope.selected = false;
        this.userData = userData;
        this.dateFunctions = dateFunctions;

        this.getDayData();

    }

    getDayData() {

        this.scope.dateId = this.dateObj.toJSON();
        this.scope.displayDate = this.dateObj.getDate();
        this.scope.prepareClasses = this.prepareClasses.bind(this);

        this.scope.selectDate = this.selectDate.bind(this);

    }

    prepareClasses() {

        var classes = {"day": true};
        if (parseInt(this.month) === this.dateObj.getMonth()) {
            classes["day" + this.dateObj.getDay()] = true;

            var calendars = this.userData.isDayAHoliday(this.dateObj, this.currentYear);
            for (var i = calendars.length - 1; i >= 0; i--) {
                classes["calendar-" + calendars[i]] = true;
            };

            if (this.scope.selected && this.dateFunctions.getCurrentlySelected()) {
                classes["selected"] = true;
            } else {
                this.scope.selected = false;
            }
        } else {
            classes['outOfScope'] = true;
        }

        return classes;

    }

    selectDate() {

        this.scope.selected = !this.scope.selected;
        this.dateFunctions.selectDate(this.dateObj);

    }
}

function dayDir(UserData, Dates) {

    function link($scope, element, attrs) {
        new day($scope, attrs.day, attrs.month, UserData, Dates);
    }

    return {
        link: link,
        transclude: true,
        scope: true,
        templateUrl: 'app/components/day/day.html'
    };
}


export default dayDir;
