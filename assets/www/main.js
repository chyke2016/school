/*global require */
require.config({

    baseUrl: '',

    paths: {
        js: 'js',
        base: 'base',
        plugins: 'plugins',
        data: 'data',
        html: 'html',
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'date.format': 'plugins/date.format',
        'underscore': 'bower_components/underscore/underscore',
        'backbone': 'bower_components/backbone/backbone',
        'hammerjs': 'bower_components/hammerjs/hammer.min',
        'jquery-hammerjs': 'bower_components/jquery-hammerjs/jquery.hammer.min',
        'text': 'bower_components/requirejs-text/text',
        'cordova': 'cordova',
        //        'beacon': 'plugins/beacon',
        'async': 'bower_components/requirejs-plugins/src/async'
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    }
});

require([
    'jquery',
    'date.format',
    'underscore',
    'backbone',
    'hammerjs',
    'jquery-hammerjs'
], function () {
    window.mobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|IEMobile|Opera Mini/i.test(navigator.userAgent));
    if (window.mobile) {
        require([
            'cordova'
            ]);
    }
    require(['js/app'], function (App) {
        new App();
    });

    if (typeof CustomEvent === 'undefined') {
        CustomEvent = function (type, eventInitDict) {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, eventInitDict['bubbles'], eventInitDict['cancelable'], eventInitDict['detail']);
            return event;
        };
    }
});