define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        template = require('text!html/Transfers/Transfer_To_Diamond_Bank_Accounts_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),
        bank_Item_Template = require('text!html/Controls/Beneficiaries_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Transfer_To_Diamond_Bank_Accounts_View = Base_Page_View.extend({

        id: "Transfer_To_Diamond_Bank_Accounts",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),
        bank_Item_Template: _.template(bank_Item_Template),

        events: {
            'tap .From_Account .v-list-item': '_on_From_Account_Item_Tap',
            'tap .To_Account .Beneficiaries_List .v-list-item': '_on_To_Account_Item_Tap',
            'tap .To_Account .Add_Beneficiary': '_on_Add_Beneficiary_Item_Tap',
            'tap .To_Account .Btn_Delete': '_on_Beneficiaries_Delete_Item_Tap',
            'tap .To_Beneficiary_Detail .Btn_Beneficiary_Continue': '_on_Beneficiary_Tap',
            'tap .Btn_Continue': '_on_Amount_Change',
            'keydown .Amount_Input': '_on_Amount_Input_Key_Down',
            'keyup .Amount_Input': '_on_Amount_Input_Key_Up',
            'keyup .To_Account .v-search-input': '_on_Benefeciary_Search_Change',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Save_Beneficiary_Bool = false;
            this._Beneficiary_Collection_Diamond = new Backbone.Collection();
            this._beneficiaryName = '';
            this.beneficiaryTap = false;
            this._beneficiaryFlag = false;
            this.val = '';
            this.valTemp = '';
            this._currency = '';

            if (AppData.Store.data && AppData.Store.data.diamondBeneficiary) {
                this._Beneficiary_Collection_Diamond.reset(AppData.Store.data.diamondBeneficiary);
            } else {
                AppData.Store.data.diamondBeneficiary = [];
            }
            Transfer_To_Diamond_Bank_Accounts_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Transfer_To_Diamond_Bank_Accounts_View.__super__._render.apply(this);

            this._Page.html(this.template());
            this.Mask = this.$el.find('.v-page-mask');
            this._Loader = this.$el.find('.Transfer_To_Own_Account-loader');
            this._Amount = this._Page.find('.Amount');
            this._Amount_Input = this._Page.find('.Amount_Input');
            this._Destination_Acc_Input = this._Page.find('.Beneficiary_Account_Number');
            this._Pin_Input = this._Page.find('.FinalPin');
            this._Review = this._Page.find('.Review');
            this._Benefeciary_Search = this.$el.find('.To_Account .v-search-input');
            this._currentViewIndex = 0;
            this._viewArr = ['From_Account', 'To_Account', 'To_Beneficiary_Detail', 'Amount', 'Review'];

            this._Page_Switcher = new Base_Switcher_View({
                parentNode: this.$el.find('.Save_Beneficiary-switcher')
            });
            this.listenTo(this._Page_Switcher, 'Change', _.bind(this._Save_Beneficiary_Change_Requested, this));
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

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();
            this._Loader.fadeOut();

            if (screenName === "To_Account") {
                var beneficiaries = eval('{' + localStorage.getItem('DBTransferBeneficiary') + '}');
                this._Beneficiary_Collection_Diamond.reset(beneficiaries);

                if (beneficiaries.length > 0) {
                    var length = beneficiaries.length;
                    var domStr = "";
                    for (var i = 0; i < length; i++) {
                        if (beneficiaries[i].transactionType == 'LOCAL' && beneficiaries[i].currency == this._currency) {
                            domStr = domStr + this.bank_Item_Template({
                                modelId: beneficiaries[i].id,
                                beneficiaryName: beneficiaries[i].beneficiaryName,
                                beneficiaryAccountCurrency :'',
                                beneficiaryAccountNumber: beneficiaries[i].beneficiaryAccountNumber
                            });
                        }
                    }
                    this.scrollTop();
                    this.$el.find('.Beneficiaries_List').html(domStr);
                } else {
                    this.$el.find('.Beneficiaries_List').html('');
                }
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

        _on_Get_Beneficiary_Error: function (data) {},

        _on_Get_Beneficiary_Success: function (data) {
            this._Loader.fadeOut();

            this._Beneficiary_Collection_Diamond.reset(data.beneficiaries);
            localStorage.setItem('DBTransferBeneficiary', JSON.stringify(data.beneficiaries));
            if (data.beneficiaries.length > 0) {

                var length = data.beneficiaries.length;
                var domStr = "";
                for (var i = 0; i < length; i++) {
                    if (data.beneficiaries[i].transactionType == 'LOCAL' && data.beneficiaries[i].currency == this._currency) {
                        domStr = domStr + this.bank_Item_Template({
                            modelId: data.beneficiaries[i].id,
                            beneficiaryName: data.beneficiaries[i].beneficiaryName,
                            beneficiaryAccountCurrency :'',
                            beneficiaryAccountNumber: data.beneficiaries[i].beneficiaryAccountNumber
                        });
                    }
                }
                this.scrollTop();
                this.$el.find('.Beneficiaries_List').html(domStr);
            } else {
                this.$el.find('.Beneficiaries_List').html('');
            }
        },

        render_Accounts: function () {
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
            this.$el.find('.From_Account .v-list').html(domStr);
        },

        _on_From_Account_Item_Tap: function (event) {

            this._From_Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];
            this._currency = curCode.getCode(this._From_Account_Model.get('currencyCode'));
            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
            
            var domStr = "";
            for (var i = 0; i < this._Beneficiary_Collection_Diamond.models.length; i++) {
                var model = this._Beneficiary_Collection_Diamond.models[i];
                if (model.get('transactionType') == 'LOCAL' && model.get('currency') == this._currency) {
                    domStr = domStr + this.bank_Item_Template({
                        modelId: model.get('id'),
                        beneficiaryName: model.get('beneficiaryName'),
                        beneficiaryAccountCurrency :'',
                        beneficiaryAccountNumber: model.get('beneficiaryAccountNumber')
                    });
                }
            }

            this.scrollTop();
            this.$el.find('.Beneficiaries_List').html(domStr);
            var currencyAlias = curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode'));
            this._Amount.find('.CurrencyAlias').html(currencyAlias);
            this._Review.find('.CurrencyAlias').html(currencyAlias);
            this._Review.find('.From').html(this.account_Item_Template({
                account: this._From_Account_Model.get('accountNumber'),
                accounttype: this._From_Account_Model.get('accountType'),
                availablebalance: core.formatBalance(this._From_Account_Model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: this._From_Account_Model.get('currency'),
                modelId: this._From_Account_Model.get('modelId')
            }));
            this._Review.find('.From .v-list-item-el:last-child').hide();

            if (this._To_Account_Model && this._From_Account_Model.cid === this._To_Account_Model.cid) {
                this._To_Account_Model = null;
                this._Review.find('.To').html('');
            }
        },

        _on_Add_Beneficiary_Item_Tap: function (event) {
            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_To_Account_Item_Tap: function (event) {
            this.beneficiaryTap = true;
            if ($(event.currentTarget).hasClass('Add_Beneficiary')) {
                return;
            }
            this._To_Account_Model = {
                "accountNumber": $(event.currentTarget).find('.Accounts_List_Item_Account').html()
            };
            this.$el.find('.Beneficiary_Account_Number').val($(event.currentTarget).find('.Accounts_List_Item_Account').html());
            this._accountLookup_call();
        },

        _accountLookup_call: function () {
            this.$el.find('.Transfer_To_Own_Account-loader').fadeIn();
            var reqData = {
                sessionId: AppData.Session_Id,
                accountNumber: this._To_Account_Model.accountNumber
            };
            $.ajax({
                type: 'GET',
                url: AppData.Service.accountNameLookup,
                data: reqData,
                success: _.bind(this._on_accountNameLookup_success, this),
                error: _.bind(this._on_accountNameLookup_error, this)
            });
        },

        _on_accountNameLookup_success: function (data) {
            this._beneficiaryFlag = false;
            this._beneficiaryName = data.accountName;
            if (data.responseCode === 0 && data.accountName && data.accountName !== "") {
                if (!this.beneficiaryTap) {
                    var data_param = {
                        sessionId: AppData.Session_Id,
                        beneficiaryName: this._beneficiaryName,
                        beneficiaryAccountNumber: this.$el.find('.Beneficiary_Account_Number').val(),
                        destinationBankCode: '063',
                        beneficiaryBankName: 'Diamond Bank',
                        transactionType: 'LOCAL',
                        currency: this._currency
                    };

                    if (this._Save_Beneficiary_Bool) {
                        $.ajax({
                            type: 'POST',
                            url: AppData.Service.createBillBeneficiaryTransfer,
                            data: data_param,
                            success: _.bind(this._on_createBeneficiar_Success, this),
                            error: _.bind(this._on_createBeneficiar_Error, this)
                        });
                        var filter = this.$el.find('.Beneficiary_Account_Number').val();
                        var modelsToFilter = this._Beneficiary_Collection_Diamond.models;

                        if (!filter) {
                            var filteredModels = modelsToFilter;
                        } else {
                            var filteredModels = _.filter(modelsToFilter, function (model) {
                                if (model.get('beneficiaryAccountNumber').search(filter) + 1) {
                                    document.dispatchEvent(new CustomEvent('alert', {
                                        'detail': 'Beneficiary is already in list.'
                                    }));
                                    this._beneficiaryFlag = true;
                                    return 1;
                                }
                            }, this);
                        }
                    }
                }
                this._beneficiaryName = data.accountName;
                if (this._Save_Beneficiary_Bool && !this._Beneficiary_Collection_Diamond.get(this._To_Account_Model)) {
                    var thisBeneficiary = {
                        'beneficiaryName': this._beneficiaryName,
                        'beneficiaryAccountNumber': this.$el.find('.Beneficiary_Account_Number').val(),
                        'id': '063',
                        'transactionType': 'LOCAL'
                    };
                    this._Beneficiary_Collection_Diamond.add(thisBeneficiary);
                    AppData.Store.data.diamondBeneficiary.push(thisBeneficiary);
                    core.save_Store(AppData.Store);
                }
                this._Review.find('.To').html(this.account_Item_Template({
                    account: this._To_Account_Model.accountNumber,
                    accounttype: this._beneficiaryName,
                    availablebalance: "",
                    currencyAlias: "",
                    modelId: ""
                }));
                this._Review.find('.To .v-list-item-el:last-child').hide();

                if (!this._beneficiaryFlag) {
                    this._currentViewIndex = 3;
                    this._change_Screen(this._viewArr[this._currentViewIndex]);
                }
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
            this.$el.find('.Transfer_To_Own_Account-loader').fadeOut();
        },

        _on_accountNameLookup_error: function (data) {
            this.$el.find('.Transfer_To_Own_Account-loader').fadeOut();
        },

        _on_Beneficiary_Tap: function () {
            this.$el.find('input').blur();

            var accountNumber = this.$el.find('.Beneficiary_Account_Number').val();
            
            var accountValidity = core.checkAccountNumber('063', accountNumber);
            if(!accountValidity) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid destination account number.'
                }));
                return;
            }
            
            this._To_Account_Model = {
                "accountNumber": accountNumber
            };
            this._accountLookup_call();
        },

        _on_createBeneficiar_Success: function (data) {
            this.beneficiaryTap = false;
            this.update();
        },

        _on_createBeneficiar_Error: function (data) {},

        _on_Beneficiaries_Delete_Item_Tap: function (event) {
            event.stopPropagation();

            var beneficiary_Model = this._Beneficiary_Collection_Diamond.models[$(event.currentTarget).parent().data('model-id')];

            if (!window.device) {
                var con = confirm("Do you really want to delete beneficiary ? ");
                if (con) {
                    $.ajax({
                        type: 'POST',
                        url: AppData.Service.deleteBillBeneficiaryTransfer,
                        data: {
                            beneficiaryId: $(event.currentTarget).parent().data('model-id')
                        },
                        success: _.bind(this._on_Delete_Success, this),
                        error: _.bind(this._on_Delete_Error, this)
                    });
                }
            } else {
                navigator.notification.confirm("Do you really want to delete beneficiary ? ", _.bind(this._handle_Confirm, this, $(event.currentTarget).parent().data('model-id')), 'Delete');
            }
        },

        _handle_Confirm: function (id, index) {
            if (index === 1) {
                $.ajax({
                    type: 'POST',
                    url: AppData.Service.deleteBillBeneficiaryTransfer,
                    data: {
                        beneficiaryId: id
                    },
                    success: _.bind(this._on_Delete_Success, this),
                    error: _.bind(this._on_Delete_Error, this)
                });
            }
        },

        _on_Delete_Success: function (data) {
            if (data.responseCode === 0) {
                this.update();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Delete_Error: function (data) {
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'Connection error! Beneficiary could not be deleted.'
            }));
        },

        _on_Amount_Change: function () {
            this.$el.find('input').blur();

            if (this._Amount_Input[0].value.trim() === "" || isNaN(this._Amount_Input[0].value.replace(/\,/g, '').trim())) {
                this._Amount_Input[0].value = '';
                this._Review.find('.Review_Amount').val('');
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

            this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Confirm_Tap: function () {
            this.$el.find('input').blur();

            if (this._Pin_Input.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            this.$el.find('.Transfer_To_Own_Account-loader').fadeIn();

            var reqData = {
                sessionId: AppData.Session_Id,
                sourceAccount: this._From_Account_Model.get('accountNumber'),
                destinationAccount: this._To_Account_Model.accountNumber,
                amount: this._Amount_Input[0].value.trim().replace(/,/g, ''),
                narration: this.$el.find('.Remark_Input').val(),
                pin: this._Pin_Input[0].value.trim(),
                transactionTime: new Date().getTime().toString(),
                currency: this._currency
            };
            $.ajax({
                type: 'POST',
                url: AppData.Service.localTransfer,
                data: reqData,
                success: _.bind(this._on_Transfer_Success, this),
                error: _.bind(this._on_Transfer_Error, this)
            });
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
                        Type: 'Diamond',
                        Status: 'Success'
                    }
                }]);
                setTimeout(_.bind(this.clear, this), 400);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Type: 'Diamond',
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
            this.trigger('Close_with_Error', {});
            Countly.event([{
                key: 'Transfer',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'Diamond',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        _on_Benefeciary_Search_Change: function () {
            var filter = this._Benefeciary_Search.val().toLowerCase();
            var modelsToFilter = this._Beneficiary_Collection_Diamond.models;

            var filteredModels = _.filter(modelsToFilter, function (model) {
                if (!filter) {
                    return 1;
                }
                if (model.get('beneficiaryName').toLowerCase().search(filter) + 1) {
                    return 1;
                }
                if (model.get('beneficiaryAccountNumber').search(filter) + 1) {
                    return 1;
                }
            }, this);

            var domStr = '';
            for (var i = 0; i < filteredModels.length; i++) {
                var model = filteredModels[i];
                if (model.get('transactionType') == 'LOCAL' && model.get('currency') == this._currency) {
                    domStr = domStr + this.bank_Item_Template({
                        beneficiaryAccountNumber: model.get('beneficiaryAccountNumber'),
                        beneficiaryName: model.get('beneficiaryName'),
                        beneficiaryAccountCurrency :'',
                        modelId: model.cid
                    });
                }
            }
            this.scrollTop();
            this.$el.find('.Beneficiaries_List').html(domStr);
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
            this.$el.find('input').val('');
            this._From_Account_Model = null;
            this._To_Account_Model = null;
            this._Amount_Input.val('');
            this._Pin_Input.val('');
            this._Review.find('input').val('');
            this.val = '';
            this.valTemp = '';
            this.$el.find('.Save_Beneficiary_Switcher_View .v-switcher').css("background", "#848484");
            this._Save_Beneficiary_Bool = false;
            this._Page_Switcher.set_Position(0, true);
            this.$el.find('.Screen').hide();
            this.$el.find('.From_Account').show();
            this._currentViewIndex = 0;
            this.$el.find('.Transfer_To_Own_Account-loader').hide();
        },

        update: function () {
            $.ajax({
                type: 'GET',
                url: AppData.Service.getBillBeneficiaryTransfer,
                data: {
                    sessionId: AppData.Session_Id,
                },
                success: _.bind(this._on_Get_Beneficiary_Success, this),
                error: _.bind(this._on_Get_Beneficiary_Error, this)
            });
        },

        clearInputs: function () {
            this._Amount_Input.val('');
            this.$el.find('.Remark_Input').val('')
            this._Pin_Input.val('');
            this.val = '';
            this.valTemp = '';
        }
    });
    return Transfer_To_Diamond_Bank_Accounts_View;
});