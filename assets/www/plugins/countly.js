define(function (require) {

    'use strict';

    var AppData = require('js/appData');

    var Countly = function (config) {

        this.sessionInterval = null;
        this.carrier = null;
        this.carrierUrl = AppData.Url_Carrier;
        this.serverUrl = AppData.Url_Countly;
        this.countryCode = null;
        this.city = null;
        this.cooldownTime = (window.device && device.platform === 'blackberry10' && /^10\./.test(device.version === 10)) ? 2000 : 0;
        this.cooldownTimer = 0;
        this.sdk_version = '1.0';
        this.session_duration = 30 * 1000; // 30 seconds

        this.app_key = AppData.App_Key;
        this.appVersion = AppData.Version;
        this.device_id = window.device ? device.uuid : 'Desktop';

    };

    Countly.prototype.getCarrier = function () {
        if (window.device && navigator.connection.type !== 'none') {
            $.ajax({
                url: this.carrierUrl,
                data: {
                    api_key: AppData.Url_Bank_Info_Key
                },
                success: _.bind(this._on_Get_Carrier_Success, this),
                error: _.bind(this._on_Get_Carrier_Error, this)
            });
        }
    };

    Countly.prototype._on_Get_Carrier_Success = function (data) {
        this.carrier = JSON.parse(data).sData.isp;
        this.getLocation();
    };

    Countly.prototype._on_Get_Carrier_Error = function () {
        this.start();
    };

    Countly.prototype.getLocation = function () {
        navigator.geolocation.getCurrentPosition(_.bind(this._on_Get_Location_Success, this), _.bind(this._on_Get_Location_Error, this));
    };

    Countly.prototype._on_Get_Location_Success = function (position) {
        $.ajax({
            url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false',
            success: _.bind(this.on_Get_Location_Data_Success, this),
            error: _.bind(this._on_Get_Location_Error, this)
        });
    };

    Countly.prototype.on_Get_Location_Data_Success = function (data) {
        var country = data.results[0].address_components;
        for (var i = 0; i < country.length; i++) {
            if (country[i].types[0] == "country") {
                this.Country = country[i].short_name;
            }
        }
        for (var i = 0; i < country.length; i++) {
            if (country[i].types[0] == "locality") {
                this.County = country[i].long_name;
            }
        }
        setTimeout(_.bind(this.start, this), 0);
    };

    Countly.prototype._on_Get_Location_Error = function () {
        this.start();
    };

    Countly.prototype.start = function () {
        if (this.cooldownTimer + this.cooldownTime > new Date().getTime()) {
            return;
        }

        this.cooldownTimer = new Date().getTime();

        var data = {
            begin_session: 1,
            sdk_version: this.sdk_version,
            metrics: JSON.stringify({
                '_os': window.device ? device.platform : 'Desktop',
                '_os_version': window.device ? device.version : '-',
                //                '_device': core.device.model, // TODO: do we need it?
                '_resolution': Math.round($(window).width() * window.devicePixelRatio) + 'x' + Math.round($(window).height() * window.devicePixelRatio),
                '_carrier': this.carrier,
                '_app_version': this.appVersion
            })
        };

        if (this.Country) {
            $.extend(data, {
                country_code: this.Country,
                city: this.County
            });
        }

        this.send(data, _.bind(this._on_Start_Success, this));
    };

    Countly.prototype._on_Start_Success = function () {
        window.clearInterval(this.sessionInterval);
        this.sessionInterval = window.setInterval(_.bind(this.refresh, this), this.session_duration);
    };

    Countly.prototype.refresh = function () {
        this.send({
            session_duration: this.session_duration
        });
    };

    Countly.prototype.stop = function () {
        if (window.device) {
            this.send({
                end_session: 1
            });
        }

        window.clearInterval(this.sessionInterval);
        this.sessionInterval = null;
        this.cooldownTimer = 0;
    };

    Countly.prototype.event = function (events) {
        this.send({
            events: JSON.stringify(events)
        });
    };

    Countly.prototype.send = function (data, success) {
        if (window.device) {
            var ajaxParam = {
                url: this.serverUrl,
                data: $.extend({
                    app_key: this.app_key,
                    device_id: this.device_id,
                    t: new Date().getTime()
                }, data)
            };

            if (success) {
                ajaxParam.success = success;
            }

            $.ajax(ajaxParam);
        }
    };

    window.Countly = new Countly();
    window.Countly.getCarrier();
    return window.Countly;

});