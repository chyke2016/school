define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/ReRegister/ReRegister_View.html'),
        
        core = require('plugins/core'),
        AppData = require('js/appData');

    var ReRegister = Base_Page_View.extend({

        id: "ReRegister",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap',
            'tap .Btn_Re_Register': '_on_Btn_Re_Register_Tap',
            'tap .Btn_Submit_Re_Register_1': '_on_Btn_Submit_Re_Register_1_Tap',
            'tap .Btn_Submit_Re_Register_2': '_on_Btn_Submit_Re_Register_2_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            ReRegister.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            ReRegister.__super__._render.apply(this);
            this._Page.html(this.template());
            this._Loader = this.$el.find('.Register_Loader');
            this.Mask = this.$el.find('.v-page-mask');

            this._data = {};
            this._currentViewIndex = 0;
            this._viewArr = ['Main', 'Re_Register_1', 'Re_Register_2'];
            this._viewHistoryArr = ['Main'];
        },

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();

            if (this._viewHistoryArr.indexOf(screenName) < 0) {
                this._viewHistoryArr.push(screenName);
            }
            this._invisible()
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

        _on_Btn_Re_Register_Tap: function () {
            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Submit_Re_Register_1_Tap: function () {
            this._data = {
                bankingId: this.$el.find(".Re_Register_1 .InternetBankingID").val().trim(),
                password: this.$el.find(".Re_Register_1 .Password").val().trim(),
                pin: this.$el.find(".Re_Register_1 .PIN").val().trim()
            };
            if (!this._data.bankingId || !this._data.password || !this._data.pin) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
                return;
            }

            this._Loader.fadeIn();
            $.ajax({
                type: 'POST',
                url: AppData.Service.reRegister,
                data: {
                    internetBankingId: this.$el.find(".Re_Register_1 .InternetBankingID").val().trim(),
                    password: this.$el.find(".Re_Register_1 .Password").val().trim(),
                    pin: this.$el.find(".Re_Register_1 .PIN").val().trim(),
                    uuid: AppData.UUID
                },
                success: _.bind(this._on_Re_Register_Success, this),
                error: _.bind(this._on_Re_Register_Error, this)
            });
        },

        _on_Re_Register_Success: function (data) {
            this._Loader.fadeOut();
            this.$el.find(".Re_Register_1 .Password").val('');
            this.$el.find(".Re_Register_1 .PIN").val('');

            if (data.responseCode === 0) {
                this._currentViewIndex = 2;
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

        _getBeneficiaries: function () {
            this.$el.find('.Sign_In_Loader').fadeIn();

            $.ajax({
                type: 'GET',
                url: AppData.Service.getBillBeneficiaryTransfer,
                data: {
                    sessionId: AppData.Session_Id,
                },
                success: _.bind(this._on_Get_Beneficiary_Success, this),
                error: _.bind(this._on_Get_Beneficiary_Error, this)
            });

            $.ajax({
                type: 'GET',
                url: AppData.Service.getBillBeneficiary,
                data: {
                    sessionId: AppData.Session_Id,
                },
                success: _.bind(this._on_Get_Bill_Beneficiary_Success, this),
                error: _.bind(this._on_Get_Bill_Beneficiary_Error, this)
            });
        },

        _on_Get_Beneficiary_Success: function (data) {
            this.$el.find('.Sign_In_Loader').fadeOut();
            localStorage.setItem('DBTransferBeneficiary', JSON.stringify(data.beneficiaries));

        },

        _on_Get_Beneficiary_Error: function (data) {
            localStorage.setItem('DBTransferBeneficiary', JSON.stringify(data.beneficiaries));
        },

        _on_Get_Bill_Beneficiary_Success: function (data) {
            this.$el.find('.Sign_In_Loader').fadeOut();
            localStorage.setItem('DBBillBeneficiary', JSON.stringify(data.beneficiaries));
        },

        _on_Get_Bill_Beneficiary_Error: function (data) {
            localStorage.setItem('DBBillBeneficiary', JSON.stringify(data.beneficiaries));
        },

        _on_Sign_In_Banking_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode === 0 && data.sessionId) {
                AppData.Session_Id = data.sessionId;
                this._Accounts_Collection = new Backbone.Collection();
                this.trigger('Signed_In_Banking', data.customerName);
                this._getBeneficiaries();

                this.$el.find('input').val('');
                this._data = {};

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

        _on_Btn_Submit_Re_Register_2_Tap: function () {
            if (this.$el.find(".Re_Register_2 .ValidationCode").val().trim() !== "") {

                this._Loader.fadeIn();
                $.ajax({
                    type: 'POST',
                    url: AppData.Service.reRegisterValidate,
                    data: {
                        internetBankingId: this._data.bankingId,
                        validationCode: this.$el.find(".Re_Register_2 .ValidationCode").val().trim(),
                        pin: this._data.pin,
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
            if (data.responseCode === 0) {
                localStorage.clear();
                delete AppData.Store.data;
                AppData.Store.data = {
                    notifications: []
                };
                core.save_Store(AppData.Store);
                navigator.geolocation.getCurrentPosition(_.bind(this._authenticate, this), _.bind(this._authenticate, this), {
                    timeout: 2000
                });
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _authenticate: function (position) {
            var _data = {
                userId: this._data.bankingId,
                password: this._data.password,
                uuid: AppData.UUID,
                pushToken: PushApp.token
            };
            if (position.coords) {
                $.extend(_data, {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            }
            $.ajax({
                type: 'POST',
                url: AppData.Service.authenticate,
                data: _data,
                success: _.bind(this._on_Sign_In_Banking_Success, this),
                error: _.bind(this._on_Sign_In_Banking_Error, this)
            });
        },

        _on_Re_Register_Validate_Error: function (data) {
            this._Loader.fadeOut();
        },

        clear: function () {
            this.$el.find('input').val('');
            this._data = {};
            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
            this._viewHistoryArr = ["Main"];
        },

        _on_Btn_Close_Tap: function () {
            this.$el.find('input').blur();
            if (this._viewArr.indexOf(this._viewHistoryArr.pop()) > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewHistoryArr[this._viewHistoryArr.length - 1]);
            } else {
                this.trigger('Close', {});
                this.clear();
            }
        },
    });
    return ReRegister;
});