if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () {
};

angular.module('rv.app', [
    'ui.router',
    'ngAnimate',
    'chieffancypants.loadingBar',
    'rv.core',
    'rv.config'
]);
