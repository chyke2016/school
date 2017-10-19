define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Transfers/Diamond_Money_Transfer_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Diamond_Money_Transfer_View = Base_Page_View.extend({

        id: "Diamond_Money_Transfer",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),

        events: {
            'tap .From_Account .v-list-item': '_on_From_Account_Item_Tap',
            'tap .Btn_Continue': '_on_Amount_Change',
            'tap .Btn_Id_Continue': '_on_Btn_Id_Continue_Tap',
            'keydown .Amount_Input': '_on_Amount_Input_Key_Down',
            'keyup .Amount_Input': '_on_Amount_Input_Key_Up',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection_Nairra;
            Diamond_Money_Transfer_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Diamond_Money_Transfer_View.__super__._render.apply(this);
            this._Page.html(this.template());
            this.Mask = this.$el.find('.v-page-mask');
            this._Details = this._Page.find('.Details');
            this._Identification = this._Page.find('.Identification');
            this._Review = this._Page.find('.Review');
            this._Amount = this._Page.find('.Amount_Input');
            this._Remark = this._Page.find('.Remark_Input');
            this._IdType = this._Page.find('.IdType_Select');
            this._Name = this._Page.find('.Name_Input');
            this._IdNumber = this._Page.find('.IdNumber_Input');
            this._Mobile = this._Page.find('.Mobile_Input');
            this._Address = this._Page.find('.Address_Input');
            this._Pin = this._Page.find('.Pin_Input');
            this.val = '';
            this.valTemp = '';
            this._currentViewIndex = 0;
            this._viewArr = ['From_Account', 'Details', 'Identification', 'Review', ];
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

                if (curCode.formatCurrencyCode(model.get('currencyCode')) == '₦') {
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
        },

        _on_From_Account_Item_Tap: function (event) {
            this._From_Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            var currencyAlias = curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode'));
            this._Details.find('.CurrencyAlias').html(currencyAlias);
            this._Review.find('.CurrencyAlias').html(currencyAlias);

            this._Review.find('.From').html(this.account_Item_Template({
                account: this._From_Account_Model.get('accountNumber'),
                accounttype: this._From_Account_Model.get('accountType'),
                availablebalance: core.formatBalance(this._From_Account_Model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode')),
                modelId: this._From_Account_Model.get('modelId')
            }));
            this._Review.find('.From .v-list-item-el:last-child').hide();
        },

        _on_Amount_Change: function () {
            this.$el.find('input').blur();

            if (this._Amount.val().trim() === "" || isNaN(this._Amount.val().replace(/\,/g, '').trim())) {
                this._Amount.val('');
                this._Review.find('.Amount').val('');
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid amount.'
                }));
                return;
            } else if (this._Pin.val().trim() === '') {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            } else {
                this._Review.find('.Amount').val(this._Amount.val());
                this._Review.find('.Remark').val(this._Remark.val());
            }
            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Id_Continue_Tap: function () {
            this.$el.find('input').blur();
            if (this._Name.val().trim() === "" || this._IdNumber.val().trim() === "" || this._Mobile.val().trim() === "" || this._Address.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
                return;
            } else if (this._Mobile.val().length < 11) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid mobile number.'
                }));
                return;
            } else {
                this._Review.find('.IdType').val(this._IdType.val());
                this._Review.find('.Name').val(this._Name.val());
                this._Review.find('.IdNumber').val(this._IdNumber.val());
                this._Review.find('.Mobile').val(this._Mobile.val());
                this._Review.find('.Address').val(this._Address.val());
            }
            this._currentViewIndex = 3;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Confirm_Tap: function () {
            this.$el.find('input').blur();
            if (this._Pin.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            this.$el.find('.Diamond_Money_Transfer-loader').fadeIn();
            var reqData = {
                sessionId: AppData.Session_Id,
                sourceAccount: this._From_Account_Model.get('accountNumber'),
                amount: this._Amount.val().trim().replace(/,/g, ''),
                narration: this._Remark.val(),
                pin: this._Pin.val().trim(),
                beneficiary: this._Name.val(),
                beneficiaryIdType: this._IdType.val(),
                beneficiaryIdNo: this._IdNumber.val(),
                beneficiaryMobile: this._Mobile.val(),
                beneficiaryAddress: this._Address.val()
            };
            $.ajax({
                type: 'POST',
                url: AppData.Service.diamondMoneyTransfer,
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
            this.$el.find('.Diamond_Money_Transfer-loader').fadeOut();
            if (data.responseCode === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                this.trigger('Transfer_Success');
                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: parseFloat(this._Amount.val().trim().replace(/,/g, '')),
                    segmentation: {
                        Type: 'WalkIn',
                        Status: 'Success'
                    }
                }]);
                setTimeout(_.bind(this.clear, this), 400);
            } else {
                this.$el.find('.Diamond_Money_Transfer-loader').fadeOut();
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Type: 'WalkIn',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_Transfer_Error: function (data) {
            this.$el.find('.Diamond_Money_Transfer-loader').fadeOut();

            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));
            Countly.event([{
                key: 'Transfer',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'WalkIn',
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
            this.tempInputVal = this._Amount.val().replace(/\./, '').replace(/,/g, '');
            if (!this.tempInputVal.match(/^\d+$/)) {
                if (this.val.length < 2) {
                    this.val = '0';
                } else {
                    this.val = this.val.substr(0, this.val.length - 1);
                }
            }
            if (!isNaN(parseFloat(this.val))) {
                this.valTemp = core.formatBalance(parseFloat(this.val) / 100, 2, '.', ',');
                this._Amount.val(this.valTemp === '0.00' ? '' : this.valTemp);
            }
            e.preventDefault();
        },

        clear: function () {
            this._From_Account_Model = null;
            this.val = '';
            this.valTemp = '';
            this.$el.find('.Screen').hide();
            this.$el.find('.From_Account').show();
            this._currentViewIndex = 0;
            this.$el.find('input').val('');
            this.$el.find('.Diamond_Money_Transfer-loader').hide();
        },

        clearInputs: function () {
            this._Amount.val('');
            this._Remark.val('')
            this._Pin.val('');
            this.val = '';
            this.valTemp = '';
        }
    });
    return Diamond_Money_Transfer_View;
});