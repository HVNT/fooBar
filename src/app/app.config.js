angular.module('rv.app')
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider
            .when('', '/base')
            .when('/', '/base');

        $stateProvider
            .state('app', {
                url: '',
                templateUrl: '/app/app.html',
                controller: 'AppCtrl'
            });
    })
    .run(function ($rootScope, $state) {
        $state.go('app');
    });
