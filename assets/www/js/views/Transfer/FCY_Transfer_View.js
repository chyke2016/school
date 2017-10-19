define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        Add_Beneficiary_FX_Transactions_View = require('js/views/Transfer/Add_Beneficiary_FX_Transactions_View'),

        template = require('text!html/Transfers/FCY_Transfer_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),
        beneficiary_Item_Template = require('text!html/Controls/Beneficiaries_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var FCY_Transfer_View = Base_Page_View.extend({

        id: "FCY_Transfer",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),
        beneficiary_Item_Template: _.template(beneficiary_Item_Template),

        events: {
            'tap .From_Account .v-list-item': '_on_From_Account_Item_Tap',
            'tap .Accounts_Commission .options': '_on_Option_Tab',
            'tap .To_Account .Add_Beneficiary': '_on_Add_Beneficiary_Item_Tap',
            'tap .Btn_Delete': '_on_Btn_Delete_Tap',
            'tap .To_Account .Beneficiaries_List .beneficiary_Item': '_on_Beneficiaries_Item_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'keydown .Amount_Input': '_on_Amount_Input_Key_Down',
            'keyup .Amount_Input': '_on_Amount_Input_Key_Up',
            'keyup .To_Account .v-search-input': '_on_Benefeciary_Search_Change',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;

            this._Beneficiary_Collection_FX = new Backbone.Collection();
            this._single_Beneficiary_Collection_FX = new Backbone.Collection();
            this._Beneficiary_Collection_FX_New = new Backbone.Collection();

            FCY_Transfer_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            FCY_Transfer_View.__super__._render.apply(this);

            this.Mask = this.$el.find('.v-page-mask');
            this._Loader = this.$el.find('.FCY_Transfer-loader');
            this._Details = this.$el.find('.Details');
            this._Review = this.$el.find('.Review');
            this._Amount = this.$el.find('.Amount_Input');
            this._Benefeciary_Search = this.$el.find('.To_Account .v-search-input');
            this.val = '';
            this.valTemp = '';
            this._currency = '';
            this._userFlag = true;
            this._Data = {};
            this._Continue = true;
            this._Fix = false;

            this._currentViewIndex = 0;
            this._viewArr = ['From_Account', 'Accounts_Commission', 'To_Account', 'Details', 'Review'];

        },

        _switch_Screen: function (screenName) {
            this.$el.find('input').blur();

            if (this._currentViewIndex == 1) {
                this._Data.amount = 0;
                this._Amount.val('');
                this.val = '';
                this.valTemp = '';
            }

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
                if (curCode.formatCurrencyCode(model.get('currencyCode')) !== '₦') {
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

        _render_Beneficiaries: function () {
            this.$el.find('.Beneficiaries_List.v-list').html('');
            if (!this._Beneficiary_Collection_FX.models.length) {
                return;
            }

            var domStr = '';
            for (var i = 0, temp = 0; i < this._Beneficiary_Collection_FX.models.length; i++) {
                var model = this._Beneficiary_Collection_FX.models[i];
                if (model.get('beneficiaryAccountNumber')) {
                    domStr = domStr + this.beneficiary_Item_Template({
                        beneficiaryName: model.get('beneficiaryName'),
                        beneficiaryAccountNumber: model.get('beneficiaryAccountNumber'),
                        beneficiaryAccountCurrency: curCode.formatCurrencyCode(model.get('currency')),
                        modelId: i
                    });
                }
            }
            this.$el.find('.Beneficiaries_List.v-list').html(domStr);
        },

        _on_From_Account_Item_Tap: function (event) {
            this._From_Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];
            this._Data.sourceAccount = this._From_Account_Model.get('accountNumber');
            this._Data.currency = curCode.getCode(this._From_Account_Model.get('currencyCode'));
            this._Data.bearsCharge = 'A';
            this._currentViewIndex = 1;
            this._switch_Screen(this._viewArr[this._currentViewIndex]);

            var _currencyAlias = curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode'));
            
            this._Review.find('.Account').html(this.account_Item_Template({
                account: this._From_Account_Model.get('accountNumber'),
                accounttype: this._From_Account_Model.get('accountType'),
                availablebalance: core.formatBalance(this._From_Account_Model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: _currencyAlias,
                modelId: this._From_Account_Model.get('modelId')
            }));
            this._Review.find('.Account .v-list-item-el:last-child').hide();

            this._render_Beneficiaries();
        },

        _on_Option_Tab: function (event) {
            var $el = $(event.currentTarget);
            if ($el.data('type') == 'User' || $el.data('type') == undefined) {
                this._Data.bearsCharge = 'A';
            } else {
                this._Data.bearsCharge = 'B';
            }
            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');
        },

        _on_Btn_Continue_Tap: function () {
            this.blur_Inputs();
            switch (this._currentViewIndex) {
            case 1:
                this._Data.amount = this._Amount.val().trim();
                if (!this._Data.amount) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Please enter an amount.'
                    }));
                    return;
                }
                this._Review.find('.Review_Amount').val(this._Data.amount);
                break;
            case 3:
                this._Data.pin = this._Details.find('.PIN').val().trim();
                this._Data.purpose = this._Details.find('.Remark_Input').val().trim();
                if (!this._Data.pin) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Please enter your PIN.'
                    }));
                    return;
                }
                this._Review.find('.Review_Remark').val(this._Data.purpose);
                this._Review.find('.Review_Pin').val(this._Data.pin);
                break;
            }
            this._currentViewIndex++;
            this._switch_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Delete_Tap: function (ev) {
            this._Beneficiary = this._Beneficiary_Collection_FX.models[$(ev.currentTarget).parent().data('model-id')];
            this._Continue = true;

            if (!window.device) {
                var con = confirm("Do you really want to delete beneficiary ? ");
                if (con) {
                    this._Loader.fadeIn();
                    $.ajax({
                        type: 'POST',
                        url: AppData.Service.deleteFCYBeneficiary,
                        data: {
                            sessionId: AppData.Session_Id,
                            beneficiaryAccountNumber: this._Beneficiary.get('beneficiaryAccountNumber'),
                            beneficiaryBankCode: this._Beneficiary.get('beneficiaryBankCode')
                        },
                        success: _.bind(this._on_Delete_Success, this),
                        error: _.bind(this._on_Delete_Error, this)
                    });
                }
            } else {
                navigator.notification.confirm("Do you really want to delete beneficiary ? ", _.bind(this._handle_Confirm, this, $(ev.currentTarget).parent().data('model-id')), 'Delete');
            }
        },

        _handle_Confirm: function (id, index) {
            if (index === 1) {
                this._Loader.fadeIn();
                $.ajax({
                    type: 'POST',
                    url: AppData.Service.deleteFCYBeneficiary,
                    data: {
                        sessionId: AppData.Session_Id,
                        beneficiaryAccountNumber: this._Beneficiary.get('beneficiaryAccountNumber'),
                        beneficiaryBankCode: this._Beneficiary.get('beneficiaryBankCode')
                    },
                    success: _.bind(this._on_Delete_Success, this),
                    error: _.bind(this._on_Delete_Error, this)
                });
            }
        },

        _on_Delete_Success: function (data) {
            if (data.responseCode == 0) {
                setTimeout(_.bind(this._update, this), 1500);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Delete_Error: function () {
            this._Loader.fadeOut();
        },

        _on_Add_Beneficiary_Item_Tap: function () {
            if (!this._Add_Beneficiary_FX_Transactions_View) {
                this._Add_Beneficiary_FX_Transactions_View = new Add_Beneficiary_FX_Transactions_View({
                    width: this._Width,
                    beneficiaries_Collection: this._Beneficiary_Collection_FX
                });
            }
            this.trigger('View_Change_Requested', this._Add_Beneficiary_FX_Transactions_View);
        },

        _on_Beneficiaries_Item_Tap: function (event, data) {
            if(!data) {
                this._BeneficiaryNew = this._Beneficiary_Collection_FX.where({
                        'beneficiaryAccountNumber':$(event.currentTarget).find('.Accounts_List_Item_Account').html()
                });
                this._Beneficiary_Collection_FX_New.reset(this._BeneficiaryNew);
            }
            
            this._Beneficiary = data ? this._single_Beneficiary_Collection_FX.models[0] : this._Beneficiary_Collection_FX_New.models[0];
            this._Review.find('.Beneficiary').html(this.beneficiary_Item_Template({
                beneficiaryName: this._Beneficiary.get('beneficiaryName'),
                modelId: this._Beneficiary.cid,
                beneficiaryAccountCurrency: curCode.formatCurrencyCode(this._Beneficiary.get('currency')),
                beneficiaryAccountNumber: this._Beneficiary.get('beneficiaryAccountNumber')
            }));
            this._Review.find('.Beneficiary .v-list-item-el:last-child').hide();
            this._Review.find('.Beneficiary .v-list-item-el:first-child').hide();
            
            if(this._Beneficiary.get('intermediaryBank') == 'NO') {
                this.$el.find('.IntermediaryBank').hide();
            } else {
                this.$el.find('.IntermediaryBank').show();
                this._Review.find('.Review_iBankAddress').val(this._Beneficiary.get('intermediaryBankAddress'));
                this._Review.find('.Review_iBankName').val(this._Beneficiary.get('intermediaryBankName'));
                
                if(this._Beneficiary.get('intermediaryBankAccount')) {
                   this.$el.find('.iBAccount').show(); this._Review.find('.Review_iBankAccount').val(this._Beneficiary.get('intermediaryBankAccount'));
                } else {
                    this.$el.find('.iBAccount').hide();
                }
            }

            this._Data.iBank = this._Beneficiary.get('intermediaryBank');
            this._Data.iBankAddress = this._Beneficiary.get('intermediaryBankAddress');
            this._Data.iBankName = this._Beneficiary.get('intermediaryBankName');
            this._Data.iBankAccount = this._Beneficiary.get('intermediaryBankAccount');

            this._Data.beneAccount = this._Beneficiary.get('beneficiaryAccountNumber');
            this._Data.bankAddress = this._Beneficiary.get('beneficiaryBankAddress');
            this._Data.bankCode = this._Beneficiary.get('beneficiaryBankCode');
            this._Data.bankName = this._Beneficiary.get('beneficiaryBankName');
            this._Data.customerAddress = this._Beneficiary.get('beneficiaryAddress');
            this._Data.bankSwiftCode = this._Beneficiary.get('beneficiaryBankSwiftCode');
            this._Data.beneName = this._Beneficiary.get('beneficiaryName');
            this._Data.customerName = AppData.Store.data.customerName;
            this._Data.internetBankingID = AppData.Store.data.bankingId;

            var reqData = {
                sessionId: AppData.Session_Id,
                amount: this._Data.amount.replace(/\,/g, ''),
                currency: this._Data.currency,
                accountNumber: this._Data.sourceAccount,
                bearsCharge: this._Data.bearsCharge,
                uuid: AppData.UUID
            };
            
            this._Loader.fadeIn();
            $.ajax({
                type: 'GET',
                url: AppData.Service.getFCYTransferEstimate,
                data: reqData,
                success: _.bind(this._on_GetEstimate_Success, this),
                error: _.bind(this._on_GetEstimate_Error, this)
            });
        },

        _on_GetEstimate_Success: function (data) {
            this._Loader.fadeOut();

            if (data.responseCode === 0) {
                this._Review.find('.Review_Charges').val(data.fees);
                this._Review.find('.Review_Bank').val(this._Data.bankName);
                this._Review.find('.Review_Intermediary_Bank').val(this._Data.iBankName);
                this._Review.find('.Review_Intermediary_Bank_Address').val(this._Data.iBankAddress);

                this._currentViewIndex = 3;
                this._switch_Screen(this._viewArr[this._currentViewIndex]);

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_GetEstimate_Error: function (data) {
            this._Loader.fadeOut();
        },

        _on_Btn_Confirm_Tap: function () {
            this.$el.find('input').blur();
            this._Loader.fadeIn();
            this._Data.sessionId = AppData.Session_Id;
            this._Data.uuid = AppData.UUID;
            this._Data.amount = this._Data.amount.replace(/\,/g, '');
            $.ajax({
                type: 'POST',
                url: AppData.Service.doFCYTransfer,
                data: this._Data,
                success: _.bind(this._on_Transfer_Success, this),
                error: _.bind(this._on_Transfer_Error, this)
            });
        },

        _on_Transfer_Success: function (data) {
            this._Loader.fadeOut();
            AppData.Get_Error = true;
            if (data.responseCode === 0) {
                this.trigger('Transfer_Success');

                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: parseFloat(this._Data.amount.replace(/\,/g, '')),
                    segmentation: {
                        Type: 'FCY Accounts',
                        Status: 'Success'
                    }
                }]);

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                this.trigger('Close_with_Error', {});
                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Type: 'FCY Accounts',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_Transfer_Error: function (data) {
            AppData.Get_Error = true;
            this._Loader.fadeOut();

            Countly.event([{
                key: 'Transfer',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'FCY Accounts',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _on_Btn_Bck_Tap: function () {
            this.$el.find('input').blur();
            if (this._currentViewIndex == 4) {
                this._Details.find('.PIN').val('');
            }
            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._switch_Screen(this._viewArr[this._currentViewIndex]);
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
        
        _on_Benefeciary_Search_Change: function () {
            var filter = this._Benefeciary_Search.val().toLowerCase(),
            modelsToFilter = this._Beneficiary_Collection_FX.models,
            
            filteredModels = _.filter(modelsToFilter, function (model) {
                if (!filter) {
                    return 1;
                }
                if (model.get('beneficiaryName').toLowerCase().search(filter) + 1) {
                    return 1;
                }

            }, this);

            var domStr = '';
                
            for (var i = 0; i < filteredModels.length; i++) {
                var model = filteredModels[i];

                if (model.get('beneficiaryAccountNumber')) {
                    domStr = domStr + this.beneficiary_Item_Template({
                        beneficiaryName: model.get('beneficiaryName'),
                        beneficiaryAccountNumber: model.get('beneficiaryAccountNumber'),
                        beneficiaryAccountCurrency: curCode.formatCurrencyCode(model.get('currency')),
                        modelId: i
                    });
                }
            }
            this.$el.find('.Beneficiaries_List.v-list').html(domStr);
        },

        _get_Beneficiaries_Success: function (data) {
            if (this._Continue) {
                this._Loader.fadeOut();
            }

            if (data.responseCode == 0) {
                this._Beneficiary_Collection_FX.reset(data.list);
                this._render_Beneficiaries();
            }
        },

        _get_Beneficiaries_Error: function () {
            this._Loader.fadeOut();
        },

        _update: function () {
            this._Loader.fadeIn();
            $.ajax({
                url: AppData.Service.getFCYBeneficiary,
                type: 'GET',
                data: {
                    sessionId: AppData.Session_Id
                },
                success: _.bind(this._get_Beneficiaries_Success, this),
                error: _.bind(this._get_Beneficiaries_Error, this)
            });
        },

        clear: function () {
            this._Continue = true;
            this._Data = {};
            this.val = '';
            this.valTemp = '';
            this._userFlag = true;
            this.$el.find('.Screen').hide();
            this.$el.find('.From_Account').show();
            this._currentViewIndex = 0;
            this.$el.find('input').val('');
            this._Loader.hide();
        }
    });

    return FCY_Transfer_View;
});