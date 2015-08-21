'use strict';

class NavbarCtrl {
  	constructor ($scope, $location) {
  		$scope.isActive = this.isActive;
  	}

  	isActive(path) {
  		console.log($location.path().substr(0, path.length));
		if ($location.path().substr(0, path.length) === path) {
			return 'active';
		} else {
			return '';
		}
	}
}

NavbarCtrl.$inject = ['$scope', '$location'];

export default NavbarCtrl;
