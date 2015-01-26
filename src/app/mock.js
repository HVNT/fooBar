/**
 * Created with JetBrains WebStorm.
 * User: apledger
 * Date: 4/24/13
 * Time: 4:27 PM
 * File: /app/mock.js
 */

angular.module('rv.mock', ['rv.app', 'ngMockE2E'])
// Dummy Calls
    .run(['$httpBackend', '$timeout', function ($httpBackend, $timeout) {
        function randomDate (start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
        }

        function selectRandom (array) {
            return array[parseInt((Math.random() * array.length), 10)];
        }

        function randomInt (low, high) {
            return parseInt(((Math.random() * (high-low)) + low), 10);
        }

        function randomFloat (low, high, round) {
            return ((Math.random() * (high-low)) + low).toFixed(round || 0);
        }

        var NUM_ITEMS = randomInt(700, 1400);

        $httpBackend.whenGET(/views\//).passThrough();
        $httpBackend.whenGET(/assets\//).passThrough();
        $httpBackend.whenGET(/templates\//).passThrough();
        $httpBackend.whenGET(/\.html/).passThrough();
    }]);

angular.bootstrap(document, ['rv.mock']);



