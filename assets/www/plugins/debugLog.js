define(function (require) {

    'use strict';

    var AppData = require('js/appData');

    var Log = function () {
        this.debug = AppData.Debug;
    };

    Log.prototype.write = function (mesg) {
        if (this.debug && mesg) {
            console.log(mesg);
        }
    };

    window.Log = new Log();
    return window.Log;
});