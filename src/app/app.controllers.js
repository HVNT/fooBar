angular.module('rv.app')
    .controller('AppCtrl', function ($scope) {
        $scope.demo = {};
        $scope.testText = "Dynamic Text";
        $scope.headingText = "Heading Text";
        $scope.colors = ['primary', 'success', 'warning', 'danger'];
        $scope.sizes = ['sm', 'md', 'lg'];

        $scope.componentNavItems = [
            {
                title: 'Base',
                state: 'app.base'
            },
            {
                title: 'Buttons',
                state: 'app.buttons'
            },
            {
                title: 'Breadcrumbs',
                state: 'app.breadcrumbs'
            },
            {
                title: 'Switches',
                state: 'app.switches'
            },
            {
                title: 'Tables',
                state: 'app.tables'
            },
            {
                title: 'Tabs',
                state: 'app.tabs'
            },
            {
                title: 'Forms',
                state: 'app.forms'
            }
        ]
    });
