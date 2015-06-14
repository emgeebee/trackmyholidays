'use strict';

import calendar from './main/calendar.controller';
import settings from './main/settings.controller';
import summary from './main/summary.controller';
import wizard from './main/wizard.controller';
import UserData from './services/UserData';
import Dates from './services/Dates';
import NavbarCtrl from '../app/components/navbar/navbar.controller';
import monthDir from './components/month/month.directive';
import dayDir from './components/day/day.directive';

angular.module('trackMyHolidays', ['ngCookies', 'ngSanitize', 'restangular', 'ngRoute', 'mm.foundation'])
  .controller('calendar', calendar)
  .controller('summary', summary)
  .controller('settings', settings)
  .controller('wizard', wizard)
  .service('UserData', UserData)
  .service('Dates', Dates)
  .directive('monthDir', monthDir)
  .directive('dayDir', dayDir)

  .config(function ($routeProvider) {
    $routeProvider
      .when('/calendar', {
        templateUrl: 'app/main/calendar.html',
        controller: 'calendar'
      })
      .when('/summary', {
        templateUrl: 'app/main/summary.html',
        controller: 'summary'
      })
      .when('/settings', {
        templateUrl: 'app/main/settings.html',
        controller: 'settings'
      })
      .when('/wizard', {
        templateUrl: 'app/main/wizard.html',
        controller: 'wizard'
      })
      .otherwise({
        redirectTo: '/wizard'
      });
  })
;
