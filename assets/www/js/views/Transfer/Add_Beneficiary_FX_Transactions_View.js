define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        template = require('text!html/Transfers/Add_Beneficiary_FX_Transactions_View.html'),
        currencyCode_Template = require('text!html/Transfers/currencyCode.html'),

        AppData = require('js/appData'),
        curCode = require('data/fcyCodes'),

        core = require('plugins/core');

    var Add_Beneficiary_FX_Transactions_View = Base_Page_View.extend({

        id: "Add_Beneficiary_FX_Transactions",

        template: _.template(template),
        currencyCode_Template: _.template(currencyCode_Template),

        events: _.extend({
            'blur .Swift_Input': '_on_Swipe_Input_Blur',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Save': '_on_Btn_Save_Tap',
            'tap .Btn_Back_Beneficiary': '_on_Btn_Bck_Tap',
            'change .RoutingType select': '_on_Routing_Type_Change',
            'blur .InterBankSwift': '_get_Intermediary_Details'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Beneficiaries_Collection = config.beneficiaries_Collection;
            this._Save_Beneficiary_Bool = false;
            this._Data = {
                intermediaryBank: 'NO'
            };

            Add_Beneficiary_FX_Transactions_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Add_Beneficiary_FX_Transactions_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');
            this._Loader = this.$el.find('.Page_Loader.v-loader');
            this._Intermediary_Switcher = new Base_Switcher_View({
                parentNode: this.$el.find('.Intermediary_Switcher')
            });
            this.listenTo(this._Intermediary_Switcher, 'Change', _.bind(this._on_Intermediary_Change, this));
            this._Page_Switcher = new Base_Switcher_View({
                parentNode: this.$el.find('.Save_Beneficiary-switcher')
            });
            this.listenTo(this._Page_Switcher, 'Change', _.bind(this._Save_Beneficiary_Change_Requested, this));

            this._currentViewIndex = 0;
            this._viewArr = ['Bank', 'Beneficiary'];
            this._render_CurrencyCodes();
        },

        _Save_Beneficiary_Change_Requested: function (position) {
            switch (position) {
            case 'left':
                this.$el.find('.Save_Beneficiary_Switcher_View .v-switcher').css("background", "#848484");
                this._Save_Beneficiary_Bool = false;
                break;
            case 'right':
                this.$el.find('.Save_Beneficiary_Switcher_View .v-switcher').css("background", "#b4d431");
                this._Save_Beneficiary_Bool = true;
                break;
            }
        },

        _render_CurrencyCodes: function () {
            var domStr = '<option value="1000">Beneficiary account currency</option>';
            for (var key in curCode.currencyCodes) {
                if (curCode.currencyCodes.hasOwnProperty(key)) {
                    domStr = domStr + this.currencyCode_Template({
                        currencyName: curCode.currencyCodes[key].currency,
                        currencyCode: key
                    });
                }
            }
            this.$el.find('#fx_countryList').html(domStr);
        },

        _next_Screen: function () {
            this.blur_Inputs();
            this._invisible();
            this._Screens.fadeOut();
            this._Screens.filter('.' + this._viewArr[this._currentViewIndex]).fadeIn();
            setTimeout(_.bind(this._invisible, this), 400);
        },

        _on_Routing_Type_Change: function () {
            if (!this.$el.find('.RoutingType select').val()) {
                this.$el.find('.RoutingValue input')[0].disabled = true;
                this.$el.find('.RoutingValue input').attr('Placeholder', 'Select Options');
            } else {
                this.$el.find('.RoutingValue input')[0].disabled = false;
                this.$el.find('.RoutingValue input').attr('Placeholder', this.$el.find('.RoutingType select').val());
            }

        },

        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },

        _on_Swipe_Input_Blur: function () {
            if (this.$el.find('.Swift_Input').val().trim()) {
                this.$el.find('.beneficiaryBank')[0].disabled = false;
                this.$el.find('.beneficiaryBankAdd')[0].disabled = false;
                this._Data.beneficiaryBankSwiftCode = this.$el.find('.Swift_Input').val().trim();
                this._Loader.fadeIn();
                $.ajax({
                    url: AppData.Service.getFCYSwiftDetails,
                    type: 'GET',
                    data: {
                        swiftCode: this._Data.beneficiaryBankSwiftCode,
                        sessionId: AppData.Session_Id,
                        uuid: AppData.UUID
                    },
                    success: _.bind(this._on_Get_Bank_Info_Success, this),
                    error: _.bind(this._on_Get_Bank_Info_Error, this)
                });
            }
        },

        _on_Get_Bank_Info_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode == 0) {
                this._Data.beneficiaryBankName = data.bankname;
                this._Data.beneficiaryBankAddress = data.bankAddress;
                this.$el.find('.beneficiaryBank').val(data.bankname);
                this.$el.find('.beneficiaryBankAdd').val(data.bankAddress);
                this.$el.find('.beneficiaryBank')[0].disabled = true;
                this.$el.find('.beneficiaryBankAdd')[0].disabled = true;
            } else {
                this._Data.beneficiaryBankSwiftCode = null;
                this.$el.find('.Swift_Input').val('');
                this.$el.find('.beneficiaryBank').val('');
                this.$el.find('.beneficiaryBankAdd').val('');
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Get_Bank_Info_Error: function () {
            this._Loader.fadeOut();
            this._Data.benBank = null;
        },

        _get_Intermediary_Details: function () {
            this._Data.intermediaryBankSwiftCode = this.$el.find('.InterBankSwift').val().trim();
            if (!this._Data.intermediaryBankSwiftCode) {
                return;
            }
            this._Loader.fadeIn();
            $.ajax({
                url: AppData.Service.getFCYSwiftDetails,
                type: 'GET',
                data: {
                    swiftCode: this._Data.intermediaryBankSwiftCode,
                    sessionId: AppData.Session_Id,
                    uuid: AppData.UUID
                },
                success: _.bind(this._on_Get_iBank_Info_Success, this),
                error: _.bind(this._on_Get_iBank_Info_Error, this)
            });
        },

        _on_Btn_Continue_Tap: function (event) {
            this._Data.beneficiaryBankName = this.$el.find('.beneficiaryBank').val().trim();
            this._Data.beneficiaryBankAddress = this.$el.find('.beneficiaryBankAdd').val().trim();

            if (!this._Data.beneficiaryBankName || !this._Data.beneficiaryBankAddress) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter complete bank details.'
                }));
                return;
            }

            this.blur_Inputs();
            this._Data.beneficiaryBankCode = this.$el.find('.SortCode').val().trim();
            this._Data.intermediaryBankAccount = this.$el.find('.InterBankAcc').val().trim();
            this._Data.intermediaryBankName = this.$el.find('.InterBankName').val().trim();
            this._Data.intermediaryBankAddress = this.$el.find('.InterBankAddress').val().trim();
            if (this._Data.intermediaryBank == 'YES' && (!this._Data.intermediaryBankName || !this._Data.intermediaryBankAddress)) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter intermediary bank details.'
                }));
                return;
            }

            if (this._Data.beneficiaryBankCode) {
                this._Data.beneficiaryBankCode = (this.$el.find('.RoutingType select').val().trim() + '/') + this._Data.beneficiaryBankCode;
            } else {
                this._Data.beneficiaryBankCode = '';
            }

            this._currentViewIndex = 1;
            this._next_Screen();
        },

        _on_Get_iBank_Info_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode == 0) {
                this._Data.intermediaryBankName = data.bankname;
                this._Data.intermediaryBankAddress = data.bankAddress;
                this.$el.find('.InterBankName').val(data.bankname);
                this.$el.find('.InterBankAddress').val(data.bankAddress);
            } else {
                this._Data.intermediaryBankSwiftCode = null;
                this.$el.find('.InterBankSwift').val('');
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Get_iBank_Info_Error: function () {
            this._Loader.fadeOut();
        },

        _on_Intermediary_Change: function (position) {
            switch (position) {
            case 'left':
                this._Data.intermediaryBank = 'NO';
                this.$el.find('.Intermediary_Input').slideUp('fast');
                this.$el.find('.Intermediary_Switcher .v-switcher').css("background", "#848484");
                this.$el.find('.InterBankAcc').val('');
                this.$el.find('.InterBankSwift').val('');
                this._Data.intermediaryBankName = '';
                this._Data.intermediaryBankAddress = '';
                break;
            case 'right':
                this._Data.intermediaryBank = 'YES';
                this.$el.find('.Intermediary_Switcher .v-switcher').css("background", "#b4d431");
                this.$el.find('.Intermediary_Input').slideDown('fast');
                this.blur_Inputs();
                break;
            }
        },

        _on_Btn_Save_Tap: function () {
            this._beneficiaryFlag = false;
            this.blur_Inputs();
            this._Data.beneficiaryName = this.$el.find('.BeneficiaryName').val().trim();
            this._Data.beneficiaryAccountNumber = this.$el.find('.BeneficiaryAccount').val().trim();
            this._Data.beneficiaryAddress = this.$el.find('.BeneficiaryAddress').val().trim();

            if (!this._Data.beneficiaryName || !this._Data.beneficiaryAccountNumber) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter beneficiary details.'
                }));
                return;
            }

            this._Data.currency = this.$el.find('#fx_countryList').val();

            if (this._Data.currency == '1000') {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please select a beneficiary account currency.'
                }));
                return;
            }

            this._Data.sessionId = AppData.Session_Id;

            if (this._Save_Beneficiary_Bool) {
                var filter = this._Data.beneficiaryAccountNumber;
                var modelsToFilter = this._Beneficiaries_Collection.models;

                if (!filter) {
                    var filteredModels = modelsToFilter;
                } else {
                    var filteredModels = _.filter(modelsToFilter, function (model) {
                        if (model.get('beneficiaryAccountNumber')) {
                            if (model.get('beneficiaryAccountNumber').search(filter) + 1) {
                                document.dispatchEvent(new CustomEvent('alert', {
                                    'detail': 'Beneficiary is already in list.'
                                }));
                                this._beneficiaryFlag = true;
                                return 1;
                            }
                        }

                    }, this);
                }
                if (!this._beneficiaryFlag) {
                    this._Loader.fadeIn();
                    $.ajax({
                        url: AppData.Service.createFCYBeneficiary,
                        type: 'POST',
                        data: this._Data,
                        success: _.bind(this._on_Add_FX_Beneficiary_Success, this),
                        error: _.bind(this._on_Add_FX_Beneficiary_Error, this)
                    });
                }
            } else {
                this.trigger('Add_Success', this._Data);
            }

        },

        _on_Add_FX_Beneficiary_Success: function (response) {
            this._Loader.fadeOut();
            if (response.responseCode == 0) {
                this.trigger('Add_Success', this._Data);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': response.statusMessage
                }));
            }
        },

        _on_Add_FX_Beneficiary_Error: function (response) {
            this._Loader.fadeOut();
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'An error occured while adding the beneficiary.'
            }));
            this.trigger('Close');
        },

        _on_Btn_Bck_Tap: function () {
            this.$el.find('.input').blur();
            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._next_Screen();
            } else {
                this.trigger('Close');
            }
        },

        clear: function () {
            this._currentViewIndex = 0;
            this._Screens.hide();
            this.$el.find('.Bank').show();
            this.$el.find('input').val('');
            this._Data = {
                intermediaryBank: 'NO'
            };
            this.$el.find('.beneficiaryBank')[0].disabled = false;
            this.$el.find('.beneficiaryBankAdd')[0].disabled = false;
            this._Intermediary_Switcher.set_Position(0, false);
            this.$el.find('.v-switcher').css("background", "#848484");
            this.$el.find('.Intermediary_Input').slideUp('fast');
            this._Loader.hide();
        }
    });

    return Add_Beneficiary_FX_Transactions_View;
});