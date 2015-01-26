/**
 * Created with JetBrains WebStorm.
 * User: apledger
 * Date: 4/24/13
 * Time: 8:34 PM
 * File: /core/config/local.js
 */

'use strict';

angular.module('rv.config', [])
    .config(function($logProvider) {
        $logProvider.debugEnabled(false);
    })
    .factory('Environment', function () {
        var url = {
            dev: '',
            remote: '',
            test: ''
        };

        return {
            name: 'mock',
            path: url.test,
            config: {}
        };
    });
