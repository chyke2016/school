define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Transfers/Transfer_To_Own_Accounts_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Transfer_To_Own_Accounts_View = Base_Page_View.extend({

        id: "Transfer_To_Own_Accounts",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),

        events: {
            'tap .From_Account .v-list-item': '_on_From_Account_Item_Tap',
            'tap .To_Account .v-list-item': '_on_To_Account_Item_Tap',
            'tap .Btn_Continue': '_on_Amount_Change',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap',
            'keydown .Amount_Input': '_on_Amount_Input_Key_Down',
            'keyup .Amount_Input': '_on_Amount_Input_Key_Up',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection_Nairra;
            this.val = '';
            this.valTemp = '';
            Transfer_To_Own_Accounts_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Transfer_To_Own_Accounts_View.__super__._render.apply(this);

            this._Page.html(this.template());
            this.Mask = this.$el.find('.v-page-mask');
            this._Amount = this._Page.find('.Amount');
            this._Amount_Input = this._Page.find('.Amount_Input');
            this._Pin_Input = this._Page.find('.FinalPin');
            this._Review = this._Page.find('.Review');

            this._currentViewIndex = 0;
            this._viewArr = ['From_Account', 'To_Account', 'Amount', 'Review'];
        },

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();
            this._invisible();
            this.$el.find('.Screen').fadeOut();
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
        
        render_Accounts: function () {
            if (!this._Accounts_Collection.models.length) {
                return;
            }
            var domStr = '';
            for (var i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];
                
                if (curCode.formatCurrencyCode(model.get('currencyCode')) == '₦' && model.get('productCode').indexOf("TD") == -1) {
                    domStr = domStr + this.account_Item_Template({
                        account: model.get('accountNumber'),
                        accounttype: model.get('accountType'),
                        availablebalance: core.formatBalance(model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                        currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                        modelId: i
                    });
                }
            }

            this.$el.find('.From_Account .v-list').html(domStr);
            this.$el.find('.To_Account .v-list').html(domStr);
        },

        _on_From_Account_Item_Tap: function (event) {
            this._From_Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];
            this.$el.find('.To_Account .v-list-item').removeClass('disabled');
            this.$el.find('.To_Account .v-list-item[data-model-id="' + $(event.currentTarget).data('model-id') + '"]').addClass('disabled');

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            var currencyAlias = curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode'));
            this._Amount.find('.CurrencyAlias').html(currencyAlias);
            this._Review.find('.CurrencyAlias').html(currencyAlias);
            this._Review.find('.From').html(this.account_Item_Template({
                account: this._From_Account_Model.get('accountNumber'),
                accounttype: this._From_Account_Model.get('accountType'),
                availablebalance: core.formatBalance(this._From_Account_Model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode')),
                modelId: this._From_Account_Model.get('modelId')
            }));
            this._Review.find('.From .v-list-item-el:last-child').hide();

            if (this._To_Account_Model && this._From_Account_Model.cid === this._To_Account_Model.cid) {
                this._To_Account_Model = null;
                this._Review.find('.To').html('');
            }
        },

        _on_To_Account_Item_Tap: function (event) {
            if ($(event.currentTarget).hasClass('disabled')) {
                return;
            }
            this._To_Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];

            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this._Review.find('.To').html(this.account_Item_Template({
                account: this._To_Account_Model.get('accountNumber'),
                accounttype: this._To_Account_Model.get('accountType'),
                availablebalance: core.formatBalance(this._To_Account_Model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._To_Account_Model.get('currencyCode')),
                modelId: this._To_Account_Model.get('modelId')
            }));
            this._Review.find('.To .v-list-item-el:last-child').hide();
        },

        _on_Amount_Change: function () {
            if (this._Amount_Input[0].value.trim() === "" || isNaN(this._Amount_Input[0].value.replace(/\,/g, '').trim())) {
                this._Amount_Input[0].value = '';
                this._Review.find('input').val('');
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid amount.'
                }));
                return;
            } else if (this._Pin_Input.val().trim() === '') {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            } else {
                this._Review.find('.Review_Amount').val(this._Amount_Input.val());
                this._Review.find('.Review_Remark').val(this.$el.find('.Remark_Input').val());
            }
            this._currentViewIndex = 3;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Confirm_Tap: function () {
            this.$el.find('input').blur();
            if (this._Pin_Input.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN'
                }));
                return;
            }

            this.$el.find('.Transfer_To_Own_Account-loader').fadeIn();
            var reqData = {
                sessionId: AppData.Session_Id,
                sourceAccount: this._From_Account_Model.get('accountNumber'),
                destinationAccount: this._To_Account_Model.get('accountNumber'),
                amount: this._Amount_Input[0].value.trim().replace(/,/g, ''),
                narration: this.$el.find('.Remark_Input').val(),
                pin: this._Pin_Input.val().trim(),
                transactionTime: new Date().getTime().toString()
            };

            $.ajax({
                type: 'POST',
                url: AppData.Service.localTransfer,
                data: reqData,
                success: _.bind(this._on_Transfer_Success, this),
                error: _.bind(this._on_Transfer_Error, this)
            });
        },

        _on_Btn_Bck_Tap: function () {
            this.$el.find('input').blur();
            this.clearInputs();
            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
            }
        },

        _on_Transfer_Success: function (data) {
            AppData.Get_Error = true;
            this.$el.find('.Transfer_To_Own_Account-loader').fadeOut();
            if (data.responseCode === 0) {
                this.trigger('Transfer_Success');
                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: parseFloat(this._Amount_Input[0].value.trim().replace(/,/g, '')),
                    segmentation: {
                        Type: 'Own Accounts',
                        Status: 'Success'
                    }
                }]);
                setTimeout(_.bind(this.clear, this), 400);
            } else {
                this.$el.find('.Transfer_To_Own_Account-loader').fadeOut();
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Type: 'Own Accounts',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_Transfer_Error: function (data) {
            this.$el.find('.Transfer_To_Own_Account-loader').fadeOut();

            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));
            Countly.event([{
                key: 'Transfer',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'Own Accounts',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
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
            this._From_Account_Model = null;
            this._To_Account_Model = null;
            this.val = '';
            this.valTemp = '';
            this.$el.find('.Screen').hide();
            this.$el.find('.From_Account').show();
            this._currentViewIndex = 0;
            this.$el.find('input').val('');
            this.$el.find('.Transfer_To_Own_Account-loader').hide();
        },

        clearInputs: function () {
            this.$el.find('.Remark_Input').val('');
            this._Amount_Input.val('');
            this._Pin_Input.val('');
            this.val = '';
            this.valTemp = '';
        }
    });
    return Transfer_To_Own_Accounts_View;
});