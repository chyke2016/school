define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Cheques/Card_cc_View.html'),
        template_Card_Item = require('text!html/Cheques/Card_View_Item.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Card_cc_View = Base_Page_View.extend({

        id: "Card_cc",

        template: _.template(template),
        template_Card_Item: _.template(template_Card_Item),
        account_Item_Template: _.template(account_Item_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap',
            'tap .Main .v-list-item': '_on_Select_Card_Item_Tap',
            'tap .Accounts .v-list-item': '_on_Accounts_Item_Tap',
            'tap .Amount .Btn_Continue': '_on_Amount_Continue_Tap',
            'keyup .Amount_Val': '_on_Amount_Input_Key_Up',
            'keydown .Amount_Val': '_on_Amount_Input_Key_Down',
            'tap .Confirm .Btn_Continue': '_on_Confirm_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            //            this._Accounts_Collection = config.accounts_Collection;
            this._Accounts_Collection = config.accounts_Collection_Nairra;

            Card_cc_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Card_cc_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');
            this._Loader = this.$el.find('.v-loader');
            this._Amount_Input = this.$el.find('.Amount_Val');

            this.val = '';
            this.valTemp = '';
            this._SourceAccount = null;
            this._MaskPan = null;
            this._Amount = null;
            this._Pin = null;

            this._currentViewIndex = 0;
            this._viewArr = ['Main', 'Accounts', 'Amount', 'Confirm'];
        },

        fetch_Card_Details: function () {

            this._Loader.fadeIn();
            this.$el.find('.Main .v-list').html('');

            $.ajax({
                type: 'GET',
                url: AppData.Service.getCreditCards,
                data: {
                    sessionId: AppData.Session_Id
                },
                success: _.bind(this._on_fetch_Card_Details_Success, this),
                error: _.bind(this._on_fetch_Card_Details_Error, this)
            });
        },

        _on_fetch_Card_Details_Success: function (data) {
            Log.write("_on_fetch_Card_Details_Success = " + JSON.stringify(data));
            this._Loader.fadeOut();

            if (data.responseCode === 0) {

                var domStr = '',
                    i = 0;

                if (data.list && data.list.length > 0) {
                    for (i = 0; i < data.list.length; i++) {
                        domStr = domStr + this.template_Card_Item({
                            account: data.list[i].accountNo,
                            status: data.list[i].cardStatus,
                            cardNum: data.list[i].maskedCardNumber,
                            cardType: data.list[i].cardType,
                            modelId: data.list[i].maskedCardNumber
                        });
                    }
                } else {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'No cards found.'
                    }));

                }

                this._Screens.filter('.Main').find('.v-list').html(domStr);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

            }
        },

        _on_fetch_Card_Details_Error: function (data) {
            Log.write("_on_fetch_Card_Details_Error = " + JSON.stringify(data));
            this._Loader.fadeOut();
        },

        //Save Card Mask Number & Display Accounts avaliable
        _on_Select_Card_Item_Tap: function (event) {
            this._MaskPan = $(event.currentTarget).data('model-id');

            if (!this._Accounts_Collection.models.length) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'No accounts avaliable.'
                }));
                return;
            }

            var domStr = '',
                i = 0;

            for (i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];
                domStr = domStr + this.account_Item_Template({
                    account: model.get('accountNumber'),
                    accounttype: model.get('accountType'),
                    availablebalance: core.formatBalance(model.get('availableBalance'), 2, '.', ','),
                    currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                    modelId: i
                });
            }

            this._Screens.filter('.Accounts').find('.v-list').html(domStr);

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Save From Account Number & Display Amount Screen
        _on_Accounts_Item_Tap: function (event) {
            this._Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];
            this._SourceAccount = this._Account_Model.get('accountNumber');
            if (curCode.formatCurrencyCode(this._Account_Model.get('currencyCode')) == '₦') {
                this._Screens.filter('.Confirm').find('.Account').html(this.account_Item_Template({
                    account: this._Account_Model.get('accountNumber'),
                    accounttype: this._Account_Model.get('accountType'),
                    availablebalance: core.formatBalance(this._Account_Model.get('availableBalance'), 2, '.', ','),
                    currencyAlias: curCode.formatCurrencyCode(this._Account_Model.get('currencyCode')),
                    modelId: this._Account_Model.get('modelId')
                }));
            }

            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Save the Amount & Display PIN Screen
        _on_Amount_Continue_Tap: function (event) {
            this._Amount = this._Screens.filter('.Amount').find('.Amount_Val').val().replace(/\,/g, '').trim();
            this._Screens.filter('.Confirm').find('.Amount_Val').val(this._Amount);

            if (this._Amount === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid amount.'
                }));
                return;
            }

            this._Pin = this._Screens.filter('.Amount').find('.PIN_Val').val().trim();
            //this._Screens.filter('.Confirm').find('.PIN_Val').val(this._Pin);

            if (this._Pin === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            this._currentViewIndex = 3;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Save the PIN & Display Confirm Screen
        _on_PIN_Continue_Tap: function (event) {
            this._Pin = this._Screens.filter('.PIN').find('.PIN_Val').val().trim();
            //this._Screens.filter('.Confirm').find('.PIN_Val').val(this._Pin);

            if (this._Pin === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid amount.'
                }));
                return;
            }

            this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Finally call the API
        _on_Confirm_Tap: function () {

            var reqData = {
                sourceAccount: this._SourceAccount,
                maskPan: this._MaskPan,
                amount: this._Amount.replace(/,/g, ''),
                sessionId: AppData.Session_Id,
                pin: this._Pin,
                transactionTime: new Date().getTime().toString()
            }

            Log.write("url = " + AppData.Service.doCreditCardPayment);
            Log.write("reqData = " + JSON.stringify(reqData));

            this._Loader.fadeIn();

            $.ajax({
                type: 'POST',
                url: AppData.Service.doCreditCardPayment,
                data: reqData,
                success: _.bind(this._on_doCreditCardPayment_Success, this),
                error: _.bind(this._on_doCreditCardPayment_Error, this)
            });
        },

        _on_doCreditCardPayment_Success: function (data) {
            Log.write("_on_doCreditCardPayment_Success = " + JSON.stringify(data));
            this._Loader.fadeOut();

            if (parseInt(data.responseCode) === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Request submitted successfully.'
                }));
                this.trigger('Card_Success', {
                    message: 'Credit card repayment successful.'
                });

                Countly.event([{
                    key: 'CreditCards',
                    count: 1,
                    sum: parseFloat(this._Amount),
                    segmentation: {
                        Type: 'Payment',
                        Status: 'Success'
                    }
                }]);
                this.clear();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'CreditCards',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Type: 'Payment',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_doCreditCardPayment_Error: function (data) {
            Log.write("_on_doCreditCardPayment_Error = " + JSON.stringify(data));
            this._Loader.fadeOut();
            this.trigger('Close_with_Error', {});
            Countly.event([{
                key: 'CreditCards',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'Payment',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _change_Screen: function (screenName) {
            this.blur_Inputs();

            this._invisible();
            this._Screens.fadeOut();
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

        _on_Btn_Bck_Tap: function () {

            this.$el.find('input').blur();
            this.clearInputs();

            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
                this.clear();
            }
        },

        _on_Amount_Input_Key_Down: function (e) {
            if (e.keyCode !== 8) {
                if (e.keyCode < 48 || e.keyCode > 57) {
                    e.preventDefault();
                } else {
                    this.val += String.fromCharCode(e.keyCode);
                }
            } else {
                if (this.val.length < 2) {
                    this.val = '0';
                } else {
                    this.val = this.val.substr(0, this.val.length - 1);
                }
            }
        },

        _on_Amount_Input_Key_Up: function (e) {
            this.tempInputVal = this._Amount_Input.val().replace(/\./, '').replace(/,/g, '');
            if (!this.tempInputVal.match(/^\d+$/)) {
                if (this.val.length < 2) {
                    this.val = '0';
                } else {
                    this.val = this.val.substr(0, this.val.length - 1);
                }
            }
            if (!isNaN(parseFloat(this.val))) {
                this.valTemp = core.formatBalance(parseFloat(this.val) / 100, 2, '.', ',');
                this._Amount_Input.val(this.valTemp === '0.00' ? '' : this.valTemp);
            }
            e.preventDefault();
        },


        clear: function () {
            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this.$el.find('input').val("");
            this._SourceAccount = null;
            this._MaskPan = null;
            this._Amount = null;
            this._Pin = null;

            this.scrollTop();
            this._Loader.hide();
            this.val = '';
            this.valTemp = '';
        },

        clearInputs: function () {
            this.val = '';
            this.valTemp = '';
            this._Amount_Input.val('');
            this._Screens.filter('.Amount').find('.PIN_Val').val('');
        }
    });

    return Card_cc_View;

});