angular.module('rv.app')
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider
            .when('', '/');

        $stateProvider
            .state('app', {
                url: '',
                templateUrl: '/app/app.html',
                controller: 'AppCtrl'
            });

        cfpLoadingBarProvider.includeSpinner = false;
    })
    .run(function ($rootScope, $state) {
        $state.go('app');
    });
