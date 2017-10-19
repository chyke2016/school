define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Profile/Change_Password_View.html'),

        AppData = require('js/appData');

    var Change_Password_View = Base_Page_View.extend({

        id: "Profile_Change_Password",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Back': '_on_Btn_Back_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Change_Password_View.__super__.initialize.apply(this, [config]);

            this._Loader = this.$el.find('.v-loader');
            this._OldPwd = this.$el.find('.OldPwd');
            this._NewPwd = this.$el.find('.NewPwd');
            this._CnfmNewPwd = this.$el.find('.CnfmNewPwd');
            this._ios = window.device ? (device.platform === 'iOS' ? true : false) : false;
        },

        _render: function () {
            Change_Password_View.__super__._render.apply(this);
        },

        _on_Btn_Continue_Tap: function () {
            if (this._OldPwd.val().trim() === "" || this._NewPwd.val().trim() === "" || this._CnfmNewPwd.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            } else if (this._NewPwd.val().trim() !== this._CnfmNewPwd.val().trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'New password mismatch.'
                }));
            } else {
                this._Loader.fadeIn();
                $.ajax({
                    type: 'POST',
                    url: AppData.Service.profileChangePassword,
                    data: {
                        sessionId: AppData.Session_Id,
                        oldPassword: this._OldPwd.val().trim(),
                        newPassword: this._NewPwd.val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_profileChangePassword_Success, this),
                    error: _.bind(this._on_profileChangePassword_Error, this)
                });
            }
        },

        _on_profileChangePassword_Success: function (data) {
            this._Loader.fadeOut();

            if (data.responseCode === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Password changed successfully.'
                }));
                if (this._ios) {
                    localStorage.setItem('TouchIDPass', this.$el.find('.NewPwd'));
                }
                this.clear();

                Countly.event([{
                    key: 'Change Password',
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
                    key: 'Change Password',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);

            }
        },

        _on_profileChangePassword_Error: function (data) {
            this._Loader.fadeOut();

            Countly.event([{
                key: 'Change Password',
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
            this.$el.find('input').val('');
            this.scrollTop();
            this._Loader.hide();
        }
    });

    return Change_Password_View;

});