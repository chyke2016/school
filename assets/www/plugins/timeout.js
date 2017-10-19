define(function (require) {
    'use strict';

    var AppData = require('js/appData');

    var Timeout = function () {
        this._Duration = 1000 * 60 * 3;
        this._Timer = null;
    };

    Timeout.prototype.update = function () {
        if (this._Timer) {
            clearTimeout(this._Timer);
        }
        this._Timer = setTimeout(_.bind(this._trigger, this), this._Duration);
    };

    Timeout.prototype._trigger = function () {
        if (AppData.Session_Id) {
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'Session timeout, please re-login.'
            }));
            document.dispatchEvent(new CustomEvent('Timeout', {
                'detail': 'TIMEOUT'
            }));
        }
    };

    return new Timeout();
});