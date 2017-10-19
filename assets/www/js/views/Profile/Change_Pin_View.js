define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Profile/Change_Pin_View.html'),

        AppData = require('js/appData');

    var Change_Pin_View = Base_Page_View.extend({

        id: "Profile_Change_Pin",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Back': '_on_Btn_Back_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Change_Pin_View.__super__.initialize.apply(this, [config]);

            this._Loader = this.$el.find('.v-loader');
            this._OldPIN = this.$el.find('.OldPIN');
            this._NewPIN = this.$el.find('.NewPIN');
            this._CnfmNewPIN = this.$el.find('.CnfmNewPIN');
        },

        _render: function () {
            Change_Pin_View.__super__._render.apply(this);
        },

        _on_Btn_Continue_Tap: function () {
            if (this._OldPIN.val().trim() === "" || this._NewPIN.val().trim() === "" || this._CnfmNewPIN.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            } else if (this._NewPIN.val().trim() !== this._CnfmNewPIN.val().trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'New PIN mismatch.'
                }));
            } else {
                this._Loader.fadeIn();
                $.ajax({
                    type: 'POST',
                    url: AppData.Service.profileChangePIN,
                    data: {
                        sessionId: AppData.Session_Id,
                        oldPIN: this._OldPIN.val().trim(),
                        newPIN: this._NewPIN.val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_profileChangePIN_Success, this),
                    error: _.bind(this._on_profileChangePIN_Error, this)
                });
            }
        },

        _on_profileChangePIN_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'PIN changed Successfully.'
                }));
                this.clear();

                Countly.event([{
                    key: 'Change Pin',
                    count: 1,
                    segmentation: {
                        Status: 'Success'
                    }
                }]);

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                Countly.event([{
                    key: 'Change Pin',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_profileChangePIN_Error: function (data) {
            this._Loader.fadeOut();
            Countly.event([{
                key: 'Change Pin',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _on_Btn_Back_Tap: function (event) {
            this.clear();
        },

        clear: function () {
            this.$el.find('input').val("");
            this.scrollTop();
            this._Loader.hide();
        }

    });

    return Change_Pin_View;

});