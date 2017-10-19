define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Bills/Fuel_Voucher_View.html'),
        account_Item_Template = require('text!html/Controls/Accounts_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),
        core = require('plugins/core');

    var Fuel_Voucher_View = Base_Page_View.extend({

        id: "Fuel_Voucher",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),

        events: _.extend({
            'tap .Btn_Back_Fuel': '_on_Btn_Close_Tap',
            'tap .ProductType .v-list-item': '_on_Product_Type_Tap',
            'tap .Accounts .v-list-item': '_on_Accounts_List_Item_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Fuel_Voucher_View.__super__.initialize.apply(this, [config]);

            this._Accounts_Collection = config.accounts_Collection;
            this._billerCharge = config.billerCharge;
            this._topUp = true;
            this._Data = {};
            this._render_Accounts();
        },

        _render: function () {
            Fuel_Voucher_View.__super__._render.apply(this);

            this._currentViewIndex = 0;
            this._viewArr = ['Accounts', 'ProductType', 'Data', 'Confirm'];

            this._Screens = this.$el.find('.Screen');
            this._Review = this.$el.find('.Confirm');
            this._InputScreen = this.$el.find('.Data');
            this._Loader = this.$el.find('.v-content-loader');
        },

        _render_Accounts: function () {
            var domStr = '';
            for (var i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];

                if (curCode.formatCurrencyCode(model.get('currencyCode')) == '₦') {
                    domStr = domStr + this.account_Item_Template({
                        account: model.get('accountNumber'),
                        accounttype: model.get('accountType'),
                        availablebalance: core.formatBalance(model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                        currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                        modelId: model.cid
                    });
                }
            }
            this.$el.find('.Accounts .v-list').html(domStr);
        },

        _on_Product_Type_Tap: function (event) {
            var $el = $(event.currentTarget);
            this._topUp = $el.data('type') == 'topup';
            
            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');
        },

        _on_Accounts_List_Item_Tap: function (event) {

            this._Account = this._Accounts_Collection.get($(event.currentTarget).data('model-id'));
            this._Data.account = this._Account.get('accountNumber');

            this._Review.find('.From_Account').html(this.account_Item_Template({
                account: this._Account.get('accountNumber'),
                accounttype: this._Account.get('accountType'),
                availablebalance: core.formatBalance(this._Account.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._Account.get('currencyCode')),
                modelId: this._Account.cid
            }));
            this._Review.find('.From_Account .v-list-item-el:last-child').hide();

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();

            this._invisible();
            this._Screens.fadeOut();
            this.$el.find('.' + screenName).fadeIn();

            setTimeout(_.bind(this._invisible, this), 400);

        },

        _on_Btn_Continue_Tap: function () {
            this.blur_Inputs();

            if (this._currentViewIndex == 2) {
                this._Data.mobileNumber = this._InputScreen.find('.mno_input').val().trim();
                this._Data.email = this._InputScreen.find('.mail_input').val().trim();
                this._Data.amount = this._InputScreen.find('.amount_input').val().trim();
                this._Data.pin = this._InputScreen.find('.pin_input').val().trim();

                if (!this._Data.mobileNumber || !this._Data.email || !this._Data.amount || !this._Data.pin) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Please fill all inputs.'
                    }));
                    return;
                } else {
                    this._name_Lookup();
                    return;
                }
            }

            this._currentViewIndex++;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Close_Tap: function () {
            this.$el.find('input').blur();
            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close');
                this.clear();
            }
            if (this._currentViewIndex == 2) {
                this._InputScreen.find('.pin_input').val('');
                this._InputScreen.find('.amount_input').val('');
            }
        },

        _name_Lookup: function () {
            this._Loader.fadeIn();
            $.ajax({
                url: AppData.Service.fuelNameLookup,
                type: 'GET',
                data: {
                    mobileNumber: this._Data.mobileNumber,
                    sessionId: AppData.Session_Id,
                    uuid: AppData.UUID
                },
                success: _.bind(this._name_Lookup_Success, this),
                error: _.bind(this._name_Lookup_Error, this)
            });
        },

        _name_Lookup_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode == 0) {
                this._Review.find('.Beneficiary').val(data.name);
                this._Review.find('.MobileNumber').val(this._Data.mobileNumber);
                this._Review.find('.Mail').val(this._Data.email);
                this._Review.find('.Amount').val(this._Data.amount);
                this._Review.find('.BillerCharge').val(this._billerCharge);

                this._currentViewIndex++;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this._InputScreen.find('.pin_input').val('');
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _name_Lookup_Error: function (error) {
            this._Loader.fadeOut();
            this._InputScreen.find('.pin_input').val('');
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));
        },

        _on_Btn_Confirm_Tap: function () {
            this._Loader.fadeIn();

            this._Data.sessionId = AppData.Session_Id;
            this._Data.uuid = AppData.UUID;
            
            $.ajax({
                url: this._topUp ? AppData.Service.fuelTopUp : AppData.Service.fuelVoucher,
                type: 'POST',
                data: this._Data,
                success: _.bind(this._on_Confirm_Success, this),
                error: _.bind(this._on_Confirm_Error, this)
            });
        },

        _on_Confirm_Success: function (data) {
            this._Loader.fadeOut();
            if(data.responseCode == 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Payment Successful.'
                }));
                this.trigger('Close');
                
                Countly.event([{
                    key: 'Bill Payment',
                    count: 1,
                    sum: parseFloat(this._Data.amount),
                    segmentation: {
                        Status: 'Success',
                        Biller: 'Fuel',
                        Product: this._topUp ? 'Top Up Wallet' : 'Purchase Voucher'
                    }
                }]);

                Countly.event([{
                    key: 'iap',
                    count: 1,
                    sum: parseFloat(this._Data.amount),
                    segmentation: {
                        Status: 'Success'
                    }
                }]);
                this.clear();
                
                
           } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                
                Countly.event([{
                    key: 'Bill Payment',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Status: 'Failure',
                        FailMessage: data.statusMessage,
                        Biller: 'Fuel',
                        Product: this._topUp ? 'Top Up Wallet' : 'Purchase Voucher'
                    }
                }]);
            }
        },

        _on_Confirm_Error: function () {
            this._Loader.fadeOut();
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));
            
            Countly.event([{
                key: 'Bill Payment',
                count: 1,
                sum: 0,
                segmentation: {
                    Status: 'Failure',
                    FailMessage: 'Connection error!'
                }
            }]);
        },

        clear: function () {
            this._currentViewIndex = 0;
            this._Screens.hide();
            this.$el.find('.Accounts').show();
            this._topUp = true;
            this._Data = {};
            this.$el.find('input').val('');
        }
    });

    return Fuel_Voucher_View;
});