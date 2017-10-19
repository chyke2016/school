/*global define , require , $ , document , _ , setTimeout , window , Countly , navigator */
define(function (require) {

    'use strict';

    var core = require('plugins/core'),

        App_Navigation_View = require('js/views/App_Navigation_View'),
        AppData = null,
        //        Beacon = require('plugins/beacon'),
        Timeout = require('plugins/timeout');

    var App = function () {

        this._add_Event_Listeners();

        if (!mobile) {
            this._on_Device_Ready();
        }
    };

    App.prototype._add_Event_Listeners = function () {
        if (mobile) {
            document.addEventListener('deviceready', _.bind(this._on_Device_Ready, this), false);
        }
    };

    App.prototype._on_Device_Ready = function () {
        AppData = require('js/appData');
        core.load_Store(AppData.Store);

        //BB10 Q5 fix
        window.isBBQLike = !!(window.device && device.platform === "blackberry10" && $(window).height() === $(window).width());
        if (isBBQLike) {
            var viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute('content', 'width=device-width, initial-scale=0.8, maximum-scale=0.8, user-scalable=0');
        }

        if (!window.localStorage.getItem(AppData.Store.name)) {
            core.save_Store(AppData.Store);
        }
        document.addEventListener('alert', _.bind(this._on_Alert, this), false);

        if (mobile) {
            setTimeout(navigator.splashscreen.hide, 400);

            document.addEventListener('resume', _.bind(this._on_Resume, this), false);

            document.addEventListener('pause', _.bind(this._on_Pause, this), false);

            document.addEventListener('backbutton', _.bind(this._on_Back_Button, this), false);

            document.addEventListener('menubutton', _.bind(this._on_Menu_Button, this), false);

            document.addEventListener('vansoPush', _.bind(this._on_Push, this), false);
        }

        var width = $(window).width();
        var height = $(window).height();

        var css = document.createElement("style");
        css.type = "text/css";

        css.innerHTML = 'body .v-navigation { height: ' + height + 'px; }';
        css.innerHTML += 'body .v-page { height : ' + height + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '#Sign_In_Banking .v-nav-bar { background-size: ' + width + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '#Sign_In_Money .v-nav-bar { background-size: ' + width + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '#Accounts .v-nav-bar { background-size: ' + width + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '#MM_Account .v-nav-bar { background-size: ' + width + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '.Transaction_Details-top-section { background-size: ' + width + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '.Country_Select { left: ' + Math.floor(width / 3) + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '.Menu .v-page-content { background-size: ' + width + 'px ' + height + 'px; }';
        document.body.appendChild(css);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '.v-list-menu-item.active { background-size: ' + width + 'px 52px; }';
        document.body.appendChild(css);

        this._App_Navigation_View = new App_Navigation_View({
            width: $(window).width()
        });

        // Beacons
        //        if (mobile && device.platform != "blackberry10") {
        //            var Beacon = window.plugins.beaconplugin;
        //
        //            Beacon.onDidRangeBeacon = function (beacon) {
        ////                navigator.notification.alert("Found beacon: " + beacon.name + "\n\nUUID: " + beacon.uuid + "\nMajor: " + beacon.major + "\nMinor: " + beacon.minor);
        //            };
        //            
        //            var storedUserName = "";
        //            if (AppData.Store.data.customerName !== undefined && AppData.Store.data.customerName !== null) {
        //                storedUserName = " " + AppData.Store.data.customerName;
        //            }
        //        
        //            Beacon.checkVersion({
        //                uuids: [AppData.beaconUUID],
        //                appSecret: AppData.push_secret,
        //                appId: AppData.push_app_Id,
        //                messages: {
        //                    notifTitle: 'Diamond Mobile', // required
        //                    notifText: 'Hello' + storedUserName + ', welcome to PGD\'s Place. Diamond Bank.' // required
        //                },
        //                error: function (err) {
        //                    navigator.notification.alert(err, function () {}, 'Beacon Plugin', 'OK');
        //                }
        //            });
        //        }


        $('body').append(this._App_Navigation_View.$el);

        require(['plugins/countly', 'plugins/push', 'plugins/debugLog', 'plugins/network']);
    }

    App.prototype._on_Resume = function () {
        Timeout.update();
        Countly.getCarrier();
        if (this._App_Navigation_View.check_Top_View() === 'Notifications') {
            this._App_Navigation_View._on_Notification_Update();
        }
    };

    App.prototype._on_Pause = function () {
        Countly.stop();
    };

    App.prototype._on_Back_Button = function () {
        var currentView = this._App_Navigation_View.check_Top_View();
        if (currentView === "Sign_In") {
            if (window.device) {
                navigator.notification.confirm('Are you sure you want to exit the application?', function (b) {
                    if (b === 1) {
                        navigator.app.exitApp();
                    }
                }, 'Quit', ['YES', 'NO']);
            }
        } else if ((currentView === "Transfers" || currentView === "Life" || currentView === "Bills" || currentView === "Cheques" || currentView === "Branches" || currentView === "Profile" || currentView === "Share" || currentView === "Notifications" || currentView === "Accounts") && AppData.Session_Id) {
            this._App_Navigation_View._on_Btn_Menu_Tap();
        } else {

            if (currentView === "Movie_Details") {
                this._App_Navigation_View.on_Hide_Trailer_View();
            }

            this._App_Navigation_View.pop();
        }
    };

    App.prototype._on_Menu_Button = function () {

    };

    App.prototype._on_Alert = function (evt) {
        if (mobile) {
            if (!device.platform === "blackberry10") {
                navigator.notification.vibrate(300);
            }
            navigator.notification.alert(evt.detail, function () {}, 'Alert', 'OK');
        } else {
            alert(evt.detail);
        }
    };

    App.prototype._on_Push = function (evt) {
        if (this._App_Navigation_View.check_Top_View() === 'Notifications') {
            this._App_Navigation_View._on_Notification_Update();
        }
    };

    return App;

});