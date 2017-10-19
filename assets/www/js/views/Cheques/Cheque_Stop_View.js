define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Cheques/Cheque_Stop_View.html'),
        //account_Item_Template = require('text!html/Controls/Accounts_List_Item.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Cheque_Stop_View = Base_Page_View.extend({

        id: "Cheque_Stop",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),

        events: _.extend({
            'tap .Accounts .v-list-item': '_on_Accounts_Item_Tap',
            'change .Data input': '_on_Data_Change',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Continue_Review': '_on_Btn_Continue_Review_Tap',
            //'tap .Btn_Confirm': '_on_Btn_Confirm_Tap',
            'keyup .Amount': '_on_Amount_Input_Change',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            //            this._Accounts_Collection = config.accounts_Collection;
            this._Accounts_Collection = config.accounts_Collection_Nairra;

            Cheque_Stop_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Cheque_Stop_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');

            this._Loader = this.$el.find('.Cheque_Stop-loader');

            this._ChequeNumber = this._Page.find('.Data .Number');
            this._ChequeAmount = this._Page.find('.Data .Amount');
            this._Beneficiary = this._Page.find('.Data .Beneficiary');
            this._Date = this._Page.find('.Data .Date');
            this._Date.val(new Date().format('yyyy-mm-dd'));

            this._Review = this._Page.find('.Review');
            this._Review.find('.Date').val(this._Date.val());
            this._Confirm = this._Page.find('.Confirm');

            this._Carousel = new Base_Carousel_View({
                $el: this._Page.find('.v-screen-carousel'),
                paneWidth: parseInt(this._Width / 2)
            });

            this._currentViewIndex = 0;
            this._viewArr = ['Accounts', 'Data', 'Review', 'Confirm'];

            this._render_Accounts();
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

        _render_Accounts: function () {
            if (!this._Accounts_Collection.models.length) {
                return;
            }

            var domStr = '';
            for (var i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];
                domStr = domStr + this.account_Item_Template({
                    account: model.get('accountNumber'),
                    accounttype: model.get('accountType'),
                    availablebalance: core.formatBalance(model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                    currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                    modelId: i
                });
            }

            this._Screens.filter('.Accounts').find('.v-list').html(domStr);
        },

        _on_Accounts_Item_Tap: function (event) {
            this._Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            var currencyAlias = curCode.formatCurrencyCode(this._Account_Model.get('currencyCode'));
            this._Page.find('.Data .CurrencyAlias').html(currencyAlias);
            this._Review.find('.CurrencyAlias').html(currencyAlias);

            if (curCode.formatCurrencyCode(this._Account_Model.get('currencyCode')) == '₦') {
                this._Review.find('.Account').html(this.account_Item_Template({
                    account: this._Account_Model.get('accountNumber'),
                    accounttype: this._Account_Model.get('accountType'),
                    availablebalance: core.formatBalance(this._Account_Model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                    currencyAlias: curCode.formatCurrencyCode(this._Account_Model.get('currencyCode')),
                    modelId: this._Account_Model.get('modelId')
                }));
                this._Review.find('.Account .v-list-item-el:last-child').hide();
            }

        },

        _on_Data_Change: function (event) {
            var el = $(event.currentTarget);

            if (el.hasClass('Number')) {
                if (!el.val().trim() || isNaN(el.val().trim())) {
                    this._ChequeNumber.val('');
                    this._Review.find('.Number').val('');
                } else {
                    this._Review.find('.Number').val(this._ChequeNumber.val());
                }
                return;
            }

            if (el.hasClass('Amount')) {
                if (!el.val().trim() || isNaN(el.val().trim())) {
                    this._ChequeAmount.val('');
                    this._Review.find('.Amount').val('');
                } else {
                    this._Review.find('.Amount').val(this._ChequeAmount.val());
                }
                return;
            }

            if (el.hasClass('Beneficiary')) {
                if (!el.val().trim()) {
                    this._Beneficiary.val('');
                    this._Review.find('.Beneficiary').val('');
                } else {
                    this._Review.find('.Beneficiary').val(this._Beneficiary.val());
                }
                return;
            }

            if (el.hasClass('Date')) {
                if (!el.val().trim()) {
                    this._Date.val('');
                    this._Review.find('.Date').val('');
                } else {
                    this._Review.find('.Date').val(this._Date.val());
                }
                return;
            }
        },

        _on_Btn_Continue_Tap: function () {
            this.blur_Inputs();

            if (this._ChequeNumber.val().trim() === "" || this._ChequeAmount.val().trim() === "" || this._Beneficiary.val().trim() === "" || this._Date.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
                return;
            }

            if (!this.$el.find('.Data .Token').val().trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }


            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Continue_Review_Tap: function () {
            this.blur_Inputs();
            //this._currentViewIndex = 3;
            //this._change_Screen(this._viewArr[this._currentViewIndex]);

            this._Loader.fadeIn();

            var reqData = {
                sourceAccount: this._Account_Model.get('accountNumber'),
                chqAmount: this._ChequeAmount.val().replace(/\,/g, '').trim(),
                chqNumber: this._ChequeNumber.val().trim(),
                pin: this.$el.find('.Data .Token').val().trim(),
                beneficiary: this._Beneficiary.val().trim(),
                chqDate: this._Date.val().trim(),
                chqStopReason: "reason",
                sessionId: AppData.Session_Id
            };

            Log.write("url = " + AppData.Service.chequeStop);
            Log.write("reqData = " + JSON.stringify(reqData));

            $.ajax({
                type: 'POST',
                url: AppData.Service.chequeStop,
                data: reqData,
                success: _.bind(this._on_Cheque_Success, this),
                error: _.bind(this._on_Cheque_Error, this)
            });
        },

        _on_Amount_Input_Change: function () {

            this.$el.find('.Amount').val(core.formatBalance(this.$el.find('.Amount').val().replace(/\,/g, ''), 0, '.', ','));
        },

        _on_Btn_Confirm_Tap: function () {
            this.blur_Inputs();

            if (!this.$el.find('.Confirm .Token').val().trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            this._Loader.fadeIn();

            var reqData = {
                sourceAccount: this._Account_Model.get('accountNumber'),
                chqAmount: this._ChequeAmount.val().trim(),
                chqNumber: this._ChequeNumber.val().trim(),
                pin: this.$el.find('.Confirm .Token').val().trim(),
                beneficiary: this._Beneficiary.val().trim(),
                chqDate: this._Date.val().trim(),
                chqStopReason: "reason",
                sessionId: AppData.Session_Id
            };

            Log.write("url = " + AppData.Service.chequeStop);
            Log.write("reqData = " + JSON.stringify(reqData));

            $.ajax({
                type: 'POST',
                url: AppData.Service.chequeStop,
                data: reqData,
                success: _.bind(this._on_Cheque_Success, this),
                error: _.bind(this._on_Cheque_Error, this)
            });
        },

        _on_Cheque_Success: function (data) {
            if (data.responseCode === 0) {
                AppData.Get_Error = true;
                this.trigger('Cheque_Success');

                Countly.event([{
                    key: 'Cheques',
                    count: 1,
                    sum: parseFloat(this._ChequeAmount.val().trim()),
                    segmentation: {
                        Type: 'Stop Cheque',
                        Status: 'Success'
                    }
                }]);

                setTimeout(_.bind(this.clear, this), 400);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'Cheques',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Type: 'Stop Cheque',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }

            this._Loader.fadeOut();
        },

        _on_Cheque_Error: function (data) {
            this._Loader.fadeOut();

            Countly.event([{
                key: 'Cheques',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'Stop Cheque',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        _on_Btn_Bck_Tap: function () {

            this.$el.find('input').blur();

            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
            }
        },

        clear: function () {
            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this.$el.find('input').val("");
            this._Account_Model = null;
            this._Date.val(new Date().format('yyyy-mm-dd'));

            this._Page.find('.Data input').val('');
            this._Review.find('input').val('');
            this._Review.find('.Date').val(this._Date.val());

            this.scrollTop();

            this._Loader.hide();
        }

    });

    return Cheque_Stop_View;

});