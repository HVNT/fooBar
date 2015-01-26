/**
 * Created with JetBrains WebStorm.
 * User: apledger
 * Date: 4/24/13
 * Time: 8:32 PM
 * File: /core/config/dev.js
 */

'use strict';

angular.module('rv.config', [])
    .config(function ($logProvider) {
        $logProvider.debugEnabled(true);
    })
    .factory('Environment', function () {
        var url = {
            dev: '',
            remote: '',
            test: ''
        };

        return {
            name: 'local',
            path: url.test,
            config: {}
        };
    });