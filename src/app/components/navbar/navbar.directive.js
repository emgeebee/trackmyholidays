class NavbarDirective {
    constructor () {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html',
            scope: {
                creationDate: '='
            },
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }
}

class NavbarController {
    constructor ($scope, $location) {
        'ngLocation'
        $scope.isActive = this.isActive.bind(this, $location);
    }
    
    isActive($location, path) {
        if ($location.path().substr(0, $location.path().length) === path) {
            return 'active';
        } else {
            return '';
        }
    }
}

NavbarController.$inject = ['$scope', '$location'];

export default NavbarDirective;