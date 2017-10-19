/*global $, define, document, _ , window , setTimeout , Backbone */
define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        template = require('text!html/Sign_In/Sign_In_View.html'),

        Register_Terms_View = require('js/views/Register/Register_Terms_View'),
        Contact_Us_View = require('js/views/Contact_Us/Contact_Us_View'),
        Forgot_View = require('js/views/Forgot/Forgot_View'),
        Branches_View = require('js/views/Branches/Branches_View'),
        ReRegister_View = require('js/views/ReRegister/ReRegister_View'),
        Share_View = require('js/views/Share/Share_View'),
        Notifications_View = require('js/views/Notification/Notification_View'),
        Faq_View = require('js/views/Faq/Faq_View'),

        AppData = require('js/appData'),

        PingProxy = require('plugins/network'),

        core = require('plugins/core'),
        xml2json = require('plugins/xml2json');

    var Sign_In_View = Base_Page_View.extend({

        id: "Sign_In",

        template: _.template(template),

        events: {
            'tap .cameraImage': '_on_Camera_Image_Tap',
            'tap #Sign_In_Banking-Button': '_on_Btn_Sign_In_Banking_Tap',
            'tap .Sign_In_Save_BankingId': '_on_Btn_Save_BankingId_Tap',
            'tap .welcomeMenuList li': '_on_Dashboard_Item_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap'
        },

        initialize: function (config) {
            Sign_In_View.__super__.initialize.apply(this, [config]);
            this._beneficiaryLength;
            this._otherBeneficiaryLength;
            this._airtimeBeneficiaryLength;
            this._beneficiaryCounter = 0;
            this._otherBeneficiaryCounter = 0;
            this._airtimeBeneficiaryCounter = 0;
            this._pinged = null;
            this._timeoutFn = null;
            this._ready = true;
            this._ios = window.device ? (device.platform === 'iOS' ? true : false) : false;
            this._inAppAd();

            this.$el.find('.noDrag').hammer({
                drag_lock_to_axis: true
            }).on("touch dragleft dragright dragend", _.bind(this._handle_Top_Box, this));

            if (window.device && device.platform === "blackberry10" && $(window).height() === $(window).width()) {
                setTimeout(_.bind(this._on_Btn_Sign_In_Banking_Tap, this), 0);
            }
        },

        _render: function () {
            Sign_In_View.__super__._render.apply(this);

            this._Page.html(this.template());
            this.Mask = this.$el.find('.v-page-mask');
            if (AppData.Store.data && AppData.Store.data.userImage) {
                this.$el.find('.userImageDefault').addClass("hidden");

                var imgPath = "data:image/jpeg;base64," + AppData.Store.data.userImage;
                this.$el.find('.userImage').css('background-image', 'url(' + imgPath + ')')
                    .removeClass("hidden");
            }
            if (AppData.Store.data && AppData.Store.data.bankingId) {
                this.$el.find('.Sign_In_Save_BankingId').addClass('active');
                this.$el.find('#Sign_In_Banking-inputId').val(AppData.Store.data.bankingId);
            }
            PingProxy.ping();
        },

        _on_Btn_Continue_Tap: function () {
            this.$el.find('.SplashDouble').fadeOut();
        },

        _testVersion: function () {
            var appVersion = localStorage.getItem('AppVersion');

            if (AppData.Version != appVersion) {
                var data = localStorage.getItem('Diamond20');
                var dataBeneficiary = eval('(' + data + ')');
                if (dataBeneficiary && dataBeneficiary.beneficiary) {
                    this._beneficiaryLength = dataBeneficiary.beneficiary.length;
                    for (var i = this._beneficiaryCounter; i < dataBeneficiary.beneficiary.length; i++) {
                        var bankId = '';
                        var transactionType = '';
                        var url = '';
                        if (dataBeneficiary.beneficiary[i].intra) {
                            bankId = '063';
                            transactionType = 'LOCAL';
                        } else {
                            bankId = dataBeneficiary.beneficiary[i].bankId;
                            transactionType = 'NIP';
                        }
                        var data = {
                            sessionId: AppData.Session_Id,
                            beneficiaryName: dataBeneficiary.beneficiary[i].name,
                            beneficiaryAccountNumber: dataBeneficiary.beneficiary[i].accountNumber,
                            destinationBankCode: bankId,
                            transactionType: transactionType
                        };
                        $.ajax({
                            type: 'POST',
                            url: AppData.Service.createBillBeneficiaryTransfer,
                            data: data,
                            success: function () {
                                this._beneficiaryCounter++;

                                if (this._beneficiaryCounter == this._beneficiaryLength) {
                                    this._on_createBeneficiar_Success();
                                }
                            },
                            error: _.bind(this._on_createBeneficiar_Error, this)
                        });
                    }
                }
            }
        },

        _on_createBeneficiar_Success: function () {},

        _on_createBeneficiar_Error: function (data) {},

        _on_Btn_Sign_In_Banking_Tap: function (e) {
            var signinButObj = this.$el.find("#Sign_In_Banking-Button");

            if (signinButObj.hasClass("non-active")) {
                signinButObj.css("margin-top", "7px");
                signinButObj.removeClass("non-active");
                signinButObj.hide();
                this.$el.find("#Sign_In_Banking-DefaultHeader").hide();

                if (window.device && device.platform === "blackberry10" && $(window).height() === $(window).width()) {
                    signinButObj.fadeIn(0);
                    this.$el.find("#Sign_In_Banking-SignInView").fadeIn(0);
                    this.$el.find(".Sign_In_Save").fadeIn(0);
                } else {
                    signinButObj.fadeIn(500);
                    this.$el.find("#Sign_In_Banking-SignInView").fadeIn(500);
                    this.$el.find(".Sign_In_Save").fadeIn(500);
                }
                if (this._ios && (!localStorage.getItem('TouchIDOff'))) {
                    setTimeout(_.bind(this._check_Touch_Id, this), 200);
                }
            } else {
                this.$el.find('.Sign_In_Loader').fadeIn();
                navigator.geolocation.getCurrentPosition(_.bind(this._authenticate, this), _.bind(this._authenticate, this), {
                    timeout: 2000
                });
            }
        },

        _authenticate: function (position) {
            this.$el.find('input').blur();
            var _data = {
                userId: $('#Sign_In_Banking-inputId').val(),
                password: $('#Sign_In_Banking-inputPwd').val(),
                uuid: this._uuid($('#Sign_In_Banking-inputId').val()),
                pushToken: PushApp.token
            };
            if (position.coords) {
                $.extend(_data, {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            }
            if (_data.userId === '' || _data.password === '') {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please provide Internet Banking ID and Password.'
                }));
                this.$el.find('.Sign_In_Loader').fadeOut();
                return;
            }
            if (this.$el.find('.Sign_In_Save_BankingId').hasClass('active')) {
                AppData.Store.data.bankingId = this.$el.find('#Sign_In_Banking-inputId').val();
            } else {
                AppData.Store.data.bankingId = null;
            }
            core.save_Store(AppData.Store);

            $.ajax({
                type: 'POST',
                url: AppData.Service.authenticate,
                data: _data,
                success: _.bind(this._on_Sign_In_Banking_Success, this),
                error: _.bind(this._on_Sign_In_Banking_Error, this)
            });
        },

        _on_Btn_Forgot_Pwd_Tap: function () { 
            if (!this._ForgotPassword_View) {
                this._ForgotPassword_View = new Forgot_Pwd_View({
                    width: this._Width
                });
            }
            this.trigger('View_Change_Requested', this._ForgotPassword_View);
        },

        _on_Btn_Save_BankingId_Tap: function () { 
            this.$el.find('.Sign_In_Save_BankingId').toggleClass('active');
        },

        _on_Dashboard_Item_Tap: function (event) {
            this.$el.find('input').blur();
            var link = $(event.currentTarget).data('link');
            var view;
            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Register_Terms':
                    this._Register_Terms_View = new Register_Terms_View({
                        width: this._Width,
                        signin: this
                    });
                    view = this._Register_Terms_View;
                    break;

                case 'ContactUs':
                    this._ContactUs_View = new Contact_Us_View({
                        width: this._Width
                    });
                    view = this._ContactUs_View;
                    break;
                case 'Forgot':
                    this._Forgot_View = new Forgot_View({
                        width: this._Width
                    });
                    view = this._Forgot_View;
                    break;
                case 'ReRegister':
                    this._ReRegister_View = new ReRegister_View({
                        width: this._Width
                    });
                    view = this._ReRegister_View;
                    break;
                case 'Notifications':
                    this._Notifications_View = new Notifications_View({
                        width: this._Width
                    });
                    view = this._Notifications_View;
                    break;
                case 'Faq':
                    this._Faq_View = new Faq_View({
                        width: this._Width
                    });
                    view = this._Faq_View;
                    break;
                }
            } else {
                view = this['_' + link + '_View'];
            }
            if (link === "Notifications") {
                view.hide_Back_Butn(false);
            }

            this.trigger('View_Change_Requested', view);
        },

        renderBranches: function (data) {
            if (!this._Branches_View) {
                this._Branches_View = new Branches_View({
                    width: this._Width
                });
            }
            return this._Branches_View;
        },

        renderShare: function (data) {
            if (!this._Share_View) {
                this._Share_View = new Share_View({
                    width: this._Width
                });
            }
            return this._Share_View;
        },

        renderNotifications: function (data) {
            if (!this._Notifications_View) {
                this._Notifications_View = new Notifications_View({
                    width: this._Width
                });
            }
            return this._Notifications_View;
        },

        renderRegister: function () {
            if (!this._ForgotPassword_View) {
                this._ForgotPassword_View = new Forgot_Pwd_View({
                    width: this._Width
                });
            }
            this.trigger('View_Change_Requested', this._ForgotPassword_View);
        },

        _touch_Support_Save: function () {
            if (this.$el.find('#Sign_In_Banking-inputPwd').val().trim()) {
                localStorage.setItem('TouchIDPass', this.$el.find('#Sign_In_Banking-inputPwd').val() || localStorage.getItem('TouchIDPass'));
                this.$el.find('#Sign_In_Banking-inputPwd').val('');
            }
        },

        _on_Sign_In_Banking_Success: function (data) {
            localStorage.setItem('MBPPVersionCheck', data.mbppVersionNumber);
            if (!AppData.Store.data.bankingId) {
                this.$el.find('#Sign_In_Banking-inputId').val('');
            }
            if (this._ios) {
                touchid.checkSupport(_.bind(this._touch_Support_Save, this), function () {});
            }
            setTimeout(function () {
                $('#Sign_In_Banking-inputPwd').val('');
            }, 500);

            if (data.responseCode === 0 && data.sessionId) {
                AppData.Session_Id = data.sessionId;
                AppData.Store.data.customerName = data.customerName;
                core.save_Store(AppData.Store);
                this.trigger('Signed_In_Banking', data.customerName);
                this._testVersion();
                this._getBeneficiaries();
                localStorage.setItem('AppVersion', AppData.Version);
                Countly.event([{
                    key: 'Login',
                    count: 1,
                    segmentation: {
                        Status: 'Success'
                    }
                }]);
            } else {
                this.$el.find('.Sign_In_Loader').fadeOut();
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
            this.$el.find('.Sign_In_Loader').fadeOut();
            Countly.event([{
                key: 'Login',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _uuid: function (userId) {
            var uuidVal = AppData.UUID;
            switch (userId) {
            case 'btoapps2':
                uuidVal = 'testAccount';
                break;
            }
            return uuidVal;
        },

        _handle_Top_Box: function (ev) {
            ev.stopPropagation();
            ev.gesture.stopPropagation();
        },

        _check_Touch_Id: function () {
            touchid.checkSupport(_.bind(this._on_Touch_Id_Support, this), function () {});
        },

        _on_Touch_Id_Support: function () {
            var data = {
                touchID: localStorage.getItem('TouchIDPass'),
                userID: AppData.Store.data.bankingId
            }

            if (data.touchID && data.userID) {
                touchid.authenticate(_.bind(this._touch_Id_Success, this, data), _.bind(this._touch_Id_Error, this), 'Login to your banking using Touch ID!');
            }
        },

        _touch_Id_Success: function (data) {
            var _data = {
                userId: data.userID,
                password: data.touchID,
                uuid: this._uuid(data.userID),
                pushToken: PushApp.token
            };
            this.$el.find('.Sign_In_Loader').fadeIn();

            $.ajax({
                type: 'POST',
                url: AppData.Service.authenticate,
                data: _data,
                success: _.bind(this._on_Sign_In_Banking_Success, this),
                error: _.bind(this._on_Sign_In_Banking_Error, this)
            });
        },

        _touch_Id_Error: function () {},

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

        _on_Camera_Image_Tap: function (e) {
            if (navigator.camera) {
                //Take picture using camera, allow edit, and retrieve image as base64-encoded string
                navigator.camera.getPicture(this._on_Camera_Image_Success, this._on_Camera_Image_Fail, {
                    quality: 100,
                    targetWidth: 400,
                    targetHeight: 400,
                    allowEdit: true,
                    correctOrientation: true,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Camera not supported on your device'
                }));
            }
        },

        _on_Camera_Image_Success: function (imageData) {
            AppData.Store.data = {
                "userImage": imageData
            };
            core.save_Store(AppData.Store);
            var imgPath = "data:image/jpeg;base64," + imageData;
            $('.userImageDefault').addClass("hidden");
            $('.userImage').css('background-image', 'url(' + imgPath + ')')
                .removeClass("hidden");
        },

        _on_Camera_Image_Fail: function (message) {},

        _inAppAd: function () {
            this.$el.find('.v-adds-block-regular').html('');
            $.ajax({
                type: 'GET',
                url: AppData.Service.adUrl,
                data: {
                    zoneid: 5
                },
                dataType: 'xml',
                success: _.bind(this._on_Get_Adds_Success, this),
                error: _.bind(this._on_Get_Adds_Error, this)
            });
        },

        _on_Get_Adds_Success: function (data) {
            data = xml2json(data);
            this._adUrl = data.clickUrl;
            this.$el.find('.v-adds-block-regular').html('<img style="display: block; margin: 0 auto;" src="' + data.creativeUrl + '"/>')
        },

        _on_Get_Adds_Error: function (data) {}

    });
    return Sign_In_View;
});