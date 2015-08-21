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

        var weekends = this.userData.getWeekendDays();
        var classes = {'day': true};
        if (parseInt(this.month) === this.dateObj.getMonth() && weekends.indexOf(this.dateObj.getDay()) === -1) {
            classes['day' + this.dateObj.getDay()] = true;

            var holidayDate = this.userData.getHoliday(this.dateObj, this.currentYear);
            //console.log(holidayDate);
            if (holidayDate !== null) {
                angular.extend(classes, holidayDate.classes);
            }

            if (this.scope.selected && this.dateFunctions.isNewSelectionStarted()) {
                classes['selected'] = true;
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
