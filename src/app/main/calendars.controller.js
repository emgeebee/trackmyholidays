'use strict';

class Calendars {
	constructor ($scope, UserData) {
		this.UserData = UserData;
        $scope.calendars = this.getCalendars();
    }

    getCalendars() {
        return this.UserData.getCalendars();
    }
}

Calendars.$inject = ['$scope', 'UserData'];

export default Calendars;