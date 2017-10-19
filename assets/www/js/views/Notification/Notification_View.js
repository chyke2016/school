define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        core = require('plugins/core'),

        AppData = require('js/appData'),

        template = require('text!html/Notification/Notification_View.html'),
        notification_Template = require('text!html/Notification/Notification_Item.html');

    var Notification_View = Base_Page_View.extend({

        id: "Notifications",

        template: _.template(template),
        notification_Template: _.template(notification_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Notification_View.__super__.initialize.apply(this, [config]);

            this._Notification_Collection = new Backbone.Collection();

            this._Loader = this.$el.find('.Notification_Loader');
        },

        _render: function () {
            Notification_View.__super__._render.apply(this);
        },

        hide_Back_Butn: function (flag) {
            var backButn = this.$el.find('.Btn_Back_Custom');
            var menuButn = this.$el.find('.Btn_Menu');
            if (flag) {
                menuButn.removeClass("hidden");
                backButn.addClass("hidden");
            } else {
                backButn.removeClass("hidden");
                menuButn.addClass("hidden");
            }
        },

        _fill_Screen: function () {
            this._Notification_Collection.reset();
            this._Notification_Collection.add(AppData.Store.data.notifications);
            if (this._Notification_Collection.models.length > 0) {
                var date = this._Notification_Collection.models[0].attributes.date ? new Date(this._Notification_Collection.models[0].attributes.date) : new Date(this._Notification_Collection.models[0].attributes.time),
                    domStr = ' <div class="v-list-title">' + new Date(date).format('dS mmm yyyy') + '</div><ul class="v-list" style="padding: 0 0 0 12px;">',
                    newDate;
                for (var i = 0; i < this._Notification_Collection.models.length; i++) {
                    newDate = this._Notification_Collection.models[i].attributes.date || this._Notification_Collection.models[i].attributes.time;
                    if (new Date(newDate).format('dd/mm/yyyy') !== date.format('dd/mm/yyyy')) {
                        date = new Date(newDate);
                        domStr = domStr + '</ul><div class="v-list-title">' + new Date(date).format('dS mmm yyyy') + '</div><ul class="v-list" style="padding: 0 12px;">';
                    }

                    domStr = domStr + this.notification_Template(this._Notification_Collection.models[i].toJSON());
                }
                this.$el.find('.Notifications').html(domStr);
            } else {

                this.$el.find('.Notifications').html("<p style='text-align:center; text-align:center; margin: 30px 10px; font-family: HelveticaNeue-Light; font-size: 20px; color: #777;'>No notification available</p>");

            }
        },

        _update: function () {
            if (!window.device || (window.device && device.platform === "blackberry10")) {
                return;
            }
            this._Loader.fadeIn();
            var data = {
                    hardware_id: device.uuid
                },
                date = new Date().format('isoUtcDateTime'),
                url = 'https://rtcp.mimo.com.ng/api/notifications/recent?' + $.param(data),
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
                success: _.bind(this._get_Notifications_Success, this),
                error: _.bind(this._get_Notifications_Error, this)
            });
        },

        _get_Notifications_Success: function (data) {
            this._Loader.fadeOut();
            AppData.Store.data.notifications = data.notifications;
            core.save_Store(AppData.Store);
            this._fill_Screen();
            for (var i = 0; i < data.notifications.length; i++) {
                if (!data.notifications[i].read) {
                    PushApp.sendReceipt(data.notifications[i].push_id);
                }
            }
        },

        _get_Notifications_Error: function () {
            this._Loader.fadeOut();
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }
    });

    return Notification_View;

});