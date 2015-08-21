'use strict';

class calendar {
	constructor ($scope, UserData) {
		this.UserData = UserData;
        $scope.calendars = this.getCalendars();
    }

    getCalendars() {
        return this.UserData.getCalendars();
    }
}

calendar.$inject = ['$scope', 'UserData'];

export default calendar;