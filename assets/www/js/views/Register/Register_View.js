/*global $, define, document, _ , window , setTimeout , Backbone */
define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Register/Register_View.html'),

        AppData = require('js/appData');

    var Register_View = Base_Page_View.extend({

        id: "Register",

        template: _.template(template),

        events: {
            'tap .Btn_First_Time': '_on_First_Time_Reg_Button_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Back_Tap',
            'tap .Btn_Submit_First_Register_1': '_on_Btn_Submit_First_Register_1_Tap',
            'tap .Btn_Submit_First_Register_2': '_on_Btn_Submit_First_Register_2_Tap',
            'tap .Btn_Submit_First_Register_3': '_on_Btn_Submit_First_Register_3_Tap',
            'tap .Btn_Re_Register': '_on_Btn_Re_Register_Tap',
            'tap .Btn_Submit_Re_Register_1': '_on_Btn_Submit_Re_Register_1_Tap',
            'tap .Btn_Submit_Re_Register_2': '_on_Btn_Submit_Re_Register_2_Tap',
            'tap .Btn_Request_Assistance': '_on_Btn_Request_Assistance_Button_Tap',
            'change .Request_Assistance_1 .YourIssueList': '_on_Issue_List_Change',
            'tap .Btn_Submit_Request_Assistance_1': '_on_Btn_Submit_Request_Assistance_Button_Tap',
            'tap .Btn_Submit_Request_Assistance_2': '_on_Btn_Confirm_Request_Assistance_Button_Tap',
            'tap .Btn_User_Id': '_on_Btn_User_Id_Button_Tap',
            'tap .Btn_With_Card': '_on_Btn_With_Card_Button_Tap',
            'tap .Btn_Submit_Registration_With_Card_1': '_on_Btn_Submit_Registration_With_Card_1_Tap'
        },

        initialize: function (config) {
            Register_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Register_View.__super__._render.apply(this);
            this._Page.html(this.template());
            this._Loader = this.$el.find('.Register_Loader');
            this.Mask = this.$el.find('.v-page-mask');

            this._currentViewIndex = 0;
            this._viewArr = ['Main', 'First_Register_1', 'First_Register_2', 'First_Register_3', 'Request_Assistance_1', 'Request_Assistance_2', 'Registration_With_Card_1', 'Re_Register_1', 'Re_Register_2'];
            this._viewHistoryArr = ['Main'];
        },

        _on_First_Time_Reg_Button_Tap: function () {

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Submit_First_Register_1_Tap: function () {

            if ($(".First_Register_1 .InternetBankingID").val().trim() !== "" && $(".First_Register_1 .AccountNumber").val().trim() !== "") {

                this._Loader.fadeIn();

                $.ajax({
                    type: 'POST',
                    url: AppData.Service.initiateRegistration,
                    data: {
                        loginId: $(".First_Register_1 .InternetBankingID").val().trim(),
                        accountNumber: $(".First_Register_1 .AccountNumber").val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_initiateRegistration_Success, this),
                    error: _.bind(this._on_initiateRegistration_Error, this)
                });

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_initiateRegistration_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode === 0) {
                $(".First_Register_2 .InternetBankingID").val($(".First_Register_1 .InternetBankingID").val());
                this._currentViewIndex = 2;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_initiateRegistration_Error: function (data) {
            this._Loader.fadeOut();
        },

        _on_Btn_Submit_First_Register_2_Tap: function () {

            if ($(".First_Register_2 .InternetBankingID").val().trim() !== "" && $(".First_Register_2 .RegistrationCode").val().trim() !== "") {

                this._Loader.fadeIn();

                $.ajax({
                    type: 'POST',
                    url: AppData.Service.validateRegistrationCode,
                    data: {
                        loginId: $(".First_Register_2 .InternetBankingID").val().trim(),
                        registrationCode: $(".First_Register_2 .RegistrationCode").val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_validateRegistrationCode_Success, this),
                    error: _.bind(this._on_validateRegistrationCode_Error, this)
                });

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_validateRegistrationCode_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode === 0) {
                $(".First_Register_3 .InternetBankingID").val($(".First_Register_2 .InternetBankingID").val());
                this._currentViewIndex = 3;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_validateRegistrationCode_Error: function (data) {
            this._Loader.fadeOut();
        },

        _on_Btn_Submit_First_Register_3_Tap: function () {
            if ($(".First_Register_3 .InternetBankingID").val().trim() !== "" && $(".First_Register_3 .Password").val().trim() !== "" && $(".First_Register_3 .ConfirmPassword").val().trim() !== "" && $(".First_Register_3 .PIN").val().trim() !== "" && $(".First_Register_3 .ConfirmPIN").val().trim() !== "") {

                if ($(".First_Register_3 .Password").val().trim() !== $(".First_Register_3 .ConfirmPassword").val().trim()) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Your password does not match.'
                    }));
                    return;
                }

                if ($(".First_Register_3 .PIN").val().trim() !== $(".First_Register_3 .ConfirmPIN").val().trim()) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Your PIN does not match.'
                    }));
                    return;
                }

                this._Loader.fadeIn();
                $.ajax({
                    type: 'POST',
                    url: AppData.Service.completeRegistration,
                    data: {
                        loginId: $(".First_Register_3 .InternetBankingID").val().trim(),
                        password: $(".First_Register_3 .Password").val().trim(),
                        pin: $(".First_Register_3 .PIN").val().trim(),
                        deviceName: AppData.DevicePlatform,
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_completeRegistration_Success, this),
                    error: _.bind(this._on_completeRegistration_Error, this)
                });

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_completeRegistration_Success: function (data) {
            if (data.responseCode === 0) {
                this._Loader.fadeIn();
                navigator.geolocation.getCurrentPosition(_.bind(this._authenticate, this), _.bind(this._authenticate, this), {
                    timeout: 2000
                });
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'Registration',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                            }]);
            }
        },

        _authenticate: function (position) {
            var _data = {
                userId: $(".First_Register_3 .InternetBankingID").val().trim(),
                password: $(".First_Register_3 .Password").val().trim(),
                uuid: AppData.UUID,
                pushToken: PushApp.token
            };
            if (position.coords) {
                $.extend(_data, {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            }
            this.clear();

            Countly.event([{
                key: 'Registration',
                count: 1,
                segmentation: {
                    Status: 'Success'
                }
                }]);

            $.ajax({
                type: 'POST',
                url: AppData.Service.authenticate,
                data: _data,
                success: _.bind(this._on_Sign_In_Banking_Success, this),
                error: _.bind(this._on_Sign_In_Banking_Error, this)
            });
        },

        _on_completeRegistration_Error: function (data) {
            this._Loader.fadeOut();
            Countly.event([{
                key: 'Registration',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _on_Sign_In_Banking_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode === 0 && data.sessionId) {
                AppData.Session_Id = data.sessionId;
                this._Accounts_Collection = new Backbone.Collection();
                this.trigger('Signed_In_Banking', data.customerName);
                this.clear();

                Countly.event([{
                    key: 'Login',
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
                    key: 'Login',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_Sign_In_Banking_Error: function (data) {
            this._Loader.fadeOut();

            Countly.event([{
                key: 'Login',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _on_Btn_Request_Assistance_Button_Tap: function () {
            this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this._Request_Assistance_1_AccountNumber = this.$el.find('.Request_Assistance_1 .AccountNumber');
            // this._Request_Assistance_1_UserID = this.$el.find('.Request_Assistance_1 .UserID');
            this._Request_Assistance_1_Issue = this.$el.find('.Request_Assistance_1 .YourIssueOther');

            this._Request_Assistance_2_AccountNumber = this.$el.find('.Request_Assistance_2 .AccountNumber');
            // this._Request_Assistance_2_UserID = this.$el.find('.Request_Assistance_2 .UserID');
            this._Request_Assistance_2_Issue = this.$el.find('.Request_Assistance_2 .YourIssueOther');

            this.$el.find('.Request_Assistance_1 .Other').hide();
            this.$el.find('.Request_Assistance_1 .YourIssueList option:first-child').attr('selected', 'selected');
        },

        _on_Issue_List_Change: function (event) {
            this.$el.find('.Request_Assistance_1 .Other').hide();
            this._Request_Assistance_1_Issue.val($(event.currentTarget).val());
            if ($(event.currentTarget).val() === "Others") {
                this.$el.find('.Request_Assistance_1 .Other').fadeIn();
                this._Request_Assistance_1_Issue.val("");
            }
        },

        _on_Btn_Submit_Request_Assistance_Button_Tap: function () {
            this.$el.find('input').blur();

            if (this._Request_Assistance_1_AccountNumber.val().trim() !== "" && this._Request_Assistance_1_Issue.val().trim() !== "") {
                this._Request_Assistance_2_AccountNumber.val(this._Request_Assistance_1_AccountNumber.val().trim());
                // this._Request_Assistance_2_UserID.val(this._Request_Assistance_1_UserID.val().trim());
                this._Request_Assistance_2_Issue.val(this._Request_Assistance_1_Issue.val().trim());

                this._currentViewIndex = 5;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_Btn_Confirm_Request_Assistance_Button_Tap: function () {

            this._Loader.fadeIn();

            var reqData = {
                accountNumber: this._Request_Assistance_2_AccountNumber.val().trim(),
                // userId: this._Request_Assistance_2_UserID.val().trim(),
                requestType: $('.Request_Assistance_1 .YourIssueList').val().trim(),
                message: this.$el.find('.Request_Assistance_1 .Other input').val().trim()
            };

            $.ajax({
                type: 'POST',
                url: AppData.Service.assistanceRegistration,
                data: reqData,
                success: _.bind(this._on_assistanceRegistration_Success, this),
                error: _.bind(this._on_assistanceRegistration_Error, this)
            });
        },

        _on_assistanceRegistration_Success: function (data) {
            this._Loader.fadeOut();

            if (data.responseCode === 0) {
                this.clear();
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_assistanceRegistration_Error: function (data) {
            this._Loader.fadeOut();
        },

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();

            if (this._viewHistoryArr.indexOf(screenName) < 0) {
                this._viewHistoryArr.push(screenName);
            }

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

        _on_Btn_With_Card_Button_Tap: function () {

            this._currentViewIndex = 6;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_User_Id_Button_Tap: function () {

            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

        },

        _on_Btn_Submit_Registration_With_Card_1_Tap: function () {
            if ($(".Registration_With_Card_1 .CardNumber_").val().trim() !== "" && $(".Registration_With_Card_1 .AccountNumber").val().trim() !== "") {

                this._Loader.fadeIn();

                var cardNum = $(".Registration_With_Card_1 .CardNumber_").val().trim();
                //                var lastFourDigit = cardNum.substr(cardNum.length - 4);

                $.ajax({
                    type: 'POST',
                    url: AppData.Service.initiateRegistrationWithCard,
                    data: {
                        cardNumber: cardNum,
                        accountNumber: $(".Registration_With_Card_1 .AccountNumber").val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_initiateRegistrationCard_Success, this),
                    error: _.bind(this._on_initiateRegistrationCard_Error, this)
                });

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_initiateRegistrationCard_Success: function (data) {

            this._Loader.fadeOut();
            if (data.responseCode === 0) {
                this._currentViewIndex = 2;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_initiateRegistrationCard_Error: function (data) {
            this._Loader.fadeOut();
        },

        _on_Btn_Re_Register_Tap: function () {
            this._currentViewIndex = 7;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Submit_Re_Register_1_Tap: function () {

            if ($(".Re_Register_1 .InternetBankingID").val().trim() !== "" && $(".Re_Register_1 .Password").val().trim() !== "" && $(".Re_Register_1 .PIN").val().trim() !== "") {

                this._Loader.fadeIn();

                $.ajax({
                    type: 'POST',
                    url: AppData.Service.reRegister,
                    data: {
                        internetBankingId: $(".Re_Register_1 .InternetBankingID").val().trim(),
                        password: $(".Re_Register_1 .Password").val().trim(),
                        pin: $(".Re_Register_1 .PIN").val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_Re_Register_Success, this),
                    error: _.bind(this._on_Re_Register_Error, this)
                });

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            }
        },

        _on_Re_Register_Success: function (data) {

            this._Loader.fadeOut();

            if (data.responseCode === 0) {
                this._currentViewIndex = 8;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Re_Register_Error: function (data) {
            this._Loader.fadeOut();
        },

        _on_Btn_Submit_Re_Register_2_Tap: function () {

            if ($(".Re_Register_2 .ValidationCode").val().trim() !== "") {

                this._Loader.fadeIn();

                $.ajax({
                    type: 'POST',
                    url: AppData.Service.reRegisterValidate,
                    data: {
                        internetBankingId: $(".Re_Register_1 .InternetBankingID").val().trim(),
                        validationCode: $(".Re_Register_2 .ValidationCode").val().trim(),
                        pin: $(".Re_Register_1 .PIN").val().trim(),
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_Re_Register_Validate_Success, this),
                    error: _.bind(this._on_Re_Register_Validate_Error, this)
                });

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter the code you received via SMS.'
                }));
            }
        },

        _on_Re_Register_Validate_Success: function (data) {

            this._Loader.fadeOut();

            if (data.responseCode === 0) {
                $(".First_Register_3 .InternetBankingID").val($(".Re_Register_1 .InternetBankingID").val());
                $(".First_Register_3 .Password").val($(".Re_Register_1 .Password").val());
                this._on_completeRegistration_Success(data);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }

            this.clear();
        },

        _on_Re_Register_Validate_Error: function (data) {
            this._Loader.fadeOut();
        },

        clear: function () {
            this.$el.find('input').val('');

            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
            this._viewHistoryArr = ["Main"];
        },

        _on_Btn_Back_Tap: function () {
            this.$el.find('input').blur();

            if (this._viewArr.indexOf(this._viewHistoryArr.pop()) > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewHistoryArr[this._viewHistoryArr.length - 1]);
            } else {
                this.trigger('Close', {});
                this.clear();
            }
        }
    });

    return Register_View;

});