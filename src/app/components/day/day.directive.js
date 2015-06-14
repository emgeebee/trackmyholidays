'use strict';

function dayDir(UserData) {
  function link(scope, element, attrs) {
    var dateObj = new Date(parseInt(attrs.day));
    var workingDate = UserData.workingDateFromDateObject(dateObj);
    var holidays = UserData.getDatesForYear(scope.currentYear);

    for (var holiday in holidays) {
      if (holidays[holiday]['-id'] === workingDate) {
        var calendars = holidays[holiday]['holidayCalendars'];
      }
    }
    scope.wd = workingDate;
    scope.calendars = calendars;
  }
  return {
    link: link,
    scope: true,
    template: '{{wd}} >> {{calendars}}'
  };
}

dayDir.$injecy = ['UserData'];

export default dayDir;
