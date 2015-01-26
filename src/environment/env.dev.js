/**
 * Created with JetBrains WebStorm.
 * User: apledger
 * Date: 4/24/13
 * Time: 8:35 PM
 * File: /core/config/deploy-dev.js
 */

'use strict';

angular.module('rv.config', [])
    .config(function ($logProvider) {
        $logProvider.debugEnabled(true);
    })
    .factory('Environment', function ($http) {
        var url = {
            dev: '',
            remote: '',
            test: ''
        };

        return {
            name: 'dev',
            path: url.test,
            config: {}
        };
    });
