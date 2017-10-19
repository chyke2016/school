define(function (require) {
    'use strict';

    var AppData = require('js/appData');

    var PingProxy = function () {
        this._pinged = null;
        this._timeoutFn = null;
        this._ready = true;
    };

    PingProxy.prototype.ping = function () {
        if (!this._pinged) {
            this._pinged = true;
            this.getSignal();
        } else {
            this.timeoutFn = setTimeout(this.getSignal, 10000);
        }
    };

    PingProxy.prototype.getSignal = function () {
        if (this._ready) {
            this._ready = false;
            var ping, bars;
            ping = new Date().getTime();
            bars = $('div.network div');
            $('div.network').css('display', 'inline-table');
            $.ajax({
                type: 'GET',
                url: AppData.Url + 'getSignal',
                data: {},
                success: function (data, status, xhr) {

                    this._ready = true;
                    ping = new Date().getTime() - ping;

                    bars.height(2);
                    $('div.offline').hide();
                    if (ping < 4000) {
                        $('div.network div').eq(0).height(4);
                    }
                    if (ping < 3000) {
                        $('div.network div').eq(1).height(8);
                    }
                    if (ping < 2000) {
                        $('div.network div').eq(2).height(12);
                    }
                    if (ping < 1000) {
                        $('div.network div').eq(3).height(16);
                    }
                },
                error: function (xhr, errorType, error) {
                    this._ready = true;
                    $(bars).height(2);
                    $('div.network div.offline').css('display', 'inline-block');
                }
            });
        }
        PingProxy.prototype.ping();
    };

    PingProxy.prototype.clear = function () {

        this._ready = true;
        this._pinged = null;
        //clearTimeout(timeoutFn);
    };

    return new PingProxy();
});