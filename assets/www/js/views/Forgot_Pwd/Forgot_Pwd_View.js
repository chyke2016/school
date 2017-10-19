define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Forgot_Pwd/Forgot_Pwd_View.html'),
        
        Forgot_Pwd_Success_View = require('js/views/Forgot_Pwd/Forgot_Pwd_Success_View'),
        
        AppData = require('js/appData');

    var Forgot_Pwd_View = Base_Page_View.extend({

        id: "Forgot_Pwd",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Submit_Forgot_Step_1': '_on_Btn_Submit_Forgot_Step_1_Tap',
            'tap .Btn_Submit_Forgot_Step_2': '_on_Btn_Submit_Forgot_Step_2_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Forgot_Pwd_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Forgot_Pwd_View.__super__._render.apply(this);

            this._currentViewIndex = 0;
            this._viewArr = ['Forgot_Step_1', 'Forgot_Step_2'];
            this._valInternetBankingID = this.$el.find('.Forgot_Step_1 .InternetBankingID');
            this._loader = this.$el.find('.Forgot_Password_Loader');
            this._valPIN = this.$el.find('.Forgot_Step_1 .PIN');
            this._valTemporaryPassword = this.$el.find('.Forgot_Step_2 .TemporaryPassword');
            this._valNewPassword = this.$el.find('.Forgot_Step_2 .NewPassword');
            this._valConfirmNewPassword = this.$el.find('.Forgot_Step_2 .ConfirmNewPassword');
        },

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();

            this._invisible();
            this.$el.find('.v-screen').fadeOut();
            this.$el.find('.' + screenName).fadeIn();

            setTimeout(_.bind(this._invisible, this), 400);

        },
        
        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },

        _on_Btn_Submit_Forgot_Step_1_Tap: function () {
            if (this._valInternetBankingID.val().trim() && this._valPIN.val().trim()) {

                this._loader.fadeIn();

                $.ajax({
                    type: 'POST',
                    url: AppData.Service.forgot_GenerateTempPassword,
                    data: {
                        loginId: this._valInternetBankingID.val().trim(),
                        pin: this._valPIN.val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_forgot_GenerateTempPassword_Success, this),
                    error: _.bind(this._on_forgot_GenerateTempPassword_Error, this)
                });
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_forgot_GenerateTempPassword_Success: function (data) {
            this._loader.fadeOut();

            if (data.responseCode === 0) {
                this._currentViewIndex = 1;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
                
                Countly.event([{
                    key: 'Forgot Password',
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
                    key: 'Forgot Password',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_forgot_GenerateTempPassword_Error: function (data) {
            this._loader.fadeOut();
            Log.write(data);
            
             Countly.event([{
                key: 'Forgot Password',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _on_Btn_Submit_Forgot_Step_2_Tap: function () {

            if (this._valTemporaryPassword.val().trim() && this._valNewPassword.val().trim() && this._valConfirmNewPassword.val().trim() && this._valInternetBankingID.val().trim()) {

                this._loader.fadeIn();

                $.ajax({
                    type: 'POST',
                    url: AppData.Service.forgot_ResetPassword,
                    data: {
                        loginId: this._valInternetBankingID.val().trim(),
                        tempPassword: this._valTemporaryPassword.val().trim(),
                        newPassword: this._valNewPassword.val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_forgot_ResetPassword_Success, this),
                    error: _.bind(this._on_forgot_ResetPassword_Error, this)
                });
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_forgot_ResetPassword_Success: function (data) {
            this._loader.fadeOut();
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': data.statusMessage
            }));
            this._clear();
            if (!this._Forgot_Pwd_Success_View) {
                this._Forgot_Pwd_Success_View = new Forgot_Pwd_Success_View({
                    width: this._Width
                });
            }

            this.trigger('View_Change_Requested', this._Forgot_Pwd_Success_View);
        },

        _on_forgot_ResetPassword_Error: function (data) {
            this._loader.fadeOut();
            Log.write(data);
        },

        _clear: function () {
            this.$el.find('input').val('');

            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Close_Tap: function (event) {

            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close');
                this._clear();
            }
        }

    });

    return Forgot_Pwd_View;

});