define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        core = require('plugins/core'),
        app = require('js/app'),
        AppData = require('js/appData');

    var Push = function (options) {
        this.token = null;

        this.init();
    };


    Push.prototype.init = function () {
        if (window.device) {
            this.register_Device();
        }
    };

    Push.prototype.register_Device = function () {
        var plf = window.device ? device.platform : 'desktop';
        switch (plf) {
        case 'iOS':
            window.plugins.pushNotification.register(_.bind(this.onSuccess, this), _.bind(this.onError, this), {
                badge: true,
                sound: true,
                alert: true,
                ecb: 'PushApp.onPush'
            });
            break;
        case 'Android':
            window.plugins.pushNotification.register(_.bind(this.onSuccess, this), _.bind(this.onError, this), {
                senderID: '245174187097',
                ecb: 'PushApp.onPush'
            });
            break;
        case 'blackberry10':
            break;
        }
    };

    Push.prototype.register_Server = function () {
        var device_type,
            device_Platform,
            plf = window.device ? device.platform : 'desktop';
        switch (plf) {
        case 'iOS':
            device_type = 1;
            device_Platform = 'IosPlatform';
            break;
        case 'Android':
            device_type = 3;
            device_Platform = 'AndroidPlatform';
            break;
        default:
            device_type = -1;
            break;
        }

        var data = {
                device: {
                    app_id: AppData.push_app_Id,
                    device_type: AppData.push_devicetype,
                    hardware_id: window.device ? device.uuid : '-',
                    language: AppData.push_language,
                    platform_type: device_Platform,
                    push_token: this.token,
                    tags: AppData.push_tags,
                    time_zone: AppData.push_timezone
                }
            },
            date = new Date().format('isoUtcDateTime'),
            url = AppData.Url_Push_Registration + $.param(data),
            urlParam = url + date,
            signatureToken = CryptoJS.HmacSHA256(urlParam, AppData.push_secret).toString(CryptoJS.enc.Hex);

        if (navigator.connection.type !== 'none') {
            $.ajax({
                silent: true,
                type: 'POST',
                url: url,
                beforeSend: function (request) {
                    request.setRequestHeader('AUTH-APP-ID', AppData.push_app_Id);
                    request.setRequestHeader('AUTH-TIMESTAMP', date);
                    request.setRequestHeader('AUTH-SIGNATURE', signatureToken);
                },
                success: function (data) {},
                error: function (xhr, errorType, error) {}
            });
        }
    };

    Push.prototype.sendReceipt = function (id) {
        var data = {
                hardware_id: window.device ? device.uuid : '-',
                push_id: id,
                time: new Date(new Date().getTime()).format('isoUtcDateTime')
            },
            date = new Date().format('isoUtcDateTime'),
            url = AppData.Url_Push_Receipt + $.param(data),
            urlParam = url + date,
            signatureToken = CryptoJS.HmacSHA256(urlParam, AppData.push_secret).toString(CryptoJS.enc.Hex);

        $.ajax({
            silent: true,
            type: 'POST',
            url: url,
            beforeSend: function (request) {
                request.setRequestHeader('AUTH-APP-ID', AppData.push_app_Id);
                request.setRequestHeader('AUTH-TIMESTAMP', date);
                request.setRequestHeader('AUTH-SIGNATURE', signatureToken);
            },
            success: function (data) {},
            error: function (xhr, errorType, error) {}
        });
    };

    Push.prototype.onSuccess = function (data) {
        var plf = window.device ? device.platform : 'desktop';
        switch (plf) {
        case 'iOS':
            this.token = data;
            this.register_Server();
            break;
        case 'Android':
            break;
        case 'blackberry10':
            break;
        }
    };

    Push.prototype.onError = function (error) {
        var plf = window.device ? device.platform : 'desktop';
        switch (plf) {
        case 'iOS':
            break;
        case 'Android':
            break;
        case 'blackberry10':
            break;
        }
    };

    Push.prototype.onPush = function (push) {

        if (AppData.Store.data.notifications.length === 10) {
            AppData.Store.data.notifications.pop();
        }
        var plf = window.device ? device.platform : 'desktop';
        switch (plf) {
        case 'iOS':
            this.sendReceipt(push.app_data.push_id);
            navigator.notification.alert(push.aps.alert, function () {}, 'Push', 'OK');
            AppData.Store.data.notifications.unshift({
                date: new Date(),
                message: push.aps.alert,
                push: push
            });
            break;
        case 'Android':
            switch (push.event) {
            case 'registered':
                this.token = push.regid;
                this.register_Server();
                break;
            case 'message':
                this.sendReceipt(push.payload.app_data.push_id);
                navigator.notification.alert(push.payload.title, function () {}, 'Push', 'OK');
                AppData.Store.data.notifications.unshift({
                    date: new Date(),
                    message: push.payload.title,
                    push: push
                });
                break;
            case 'error':
                break;
            default:
                break;
            }
            break;
        case 'blackberry10':
            break;
        }
        core.save_Store(AppData.Store);
        document.dispatchEvent(new CustomEvent('vansoPush', {}));
    };

    window.PushApp = new Push();
    return window.PushApp;
});