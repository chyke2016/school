define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        template = require('text!html/Transfers/Yello_Diamond_Transfer_Banks_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),
        bank_Item_Template = require('text!html/Controls/Beneficiaries_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Yello_Diamond_Transfer_Banks_View = Base_Page_View.extend({

        id: "Yello_Diamond_Transfer_Banks",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),
        bank_Item_Template: _.template(bank_Item_Template),

        events: {
            'tap .From_Account .v-list-item': '_on_From_Account_Item_Tap',
            'tap .To_Account .Beneficiaries_List .v-list-item': '_on_To_Account_Item_Tap',
            'tap .To_Account .Add_Beneficiary': '_on_Add_Beneficiary_Item_Tap',
            'tap .Btn_Continue': '_on_Amount_Change',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap',
            'tap .To_Account .Btn_Delete': '_on_Beneficiaries_Delete_Item_Tap',
            'tap .To_Beneficiary_Detail .Btn_Beneficiary_Continue': '_on_Beneficiary_Tap',
            'keyup .To_Account .v-search-input': '_on_Benefeciary_Search_Change',
            'keydown .Amount_Input': '_on_Amount_Input_Key_Down',
            'keyup .Amount_Input': '_on_Amount_Input_Key_Up'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Beneficiary_Collection_Yello = new Backbone.Collection();
            this._Save_Beneficiary_Bool = false;
            this._beneficiaryFlag = false;
            this.benediciaryTap = false;
            this._beneficiaryName = '';
            this.val = '';
            this.valTemp = '';
            Yello_Diamond_Transfer_Banks_View.__super__.initialize.apply(this, [config]);

            if (AppData.Store.data && AppData.Store.data.diamondBeneficiary) {
                this._Beneficiary_Collection_Yello.reset(AppData.Store.data.diamondBeneficiary);
            } else {
                AppData.Store.data.diamondBeneficiary = [];
            }
        },

        _render: function () {
            Yello_Diamond_Transfer_Banks_View.__super__._render.apply(this);

            this.Mask = this.$el.find('.v-page-mask');
            this._Amount = this._Page.find('.Amount');
            this._Amount_Input = this._Page.find('.Amount_Input');
            this._Pin_Input = this._Page.find('.FinalPin');
            this._Review = this._Page.find('.Review');
            this._Loader = this._Page.find('.Transfer_loader');
            this._Benefeciary_Search = this.$el.find('.To_Account .v-search-input');
            this._To_Account_Model = new Backbone.Collection();
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

            if (screenName === "To_Account") {
                var beneficiaries = eval('{' + localStorage.getItem('DBTransferBeneficiary') + '}');
                this._Beneficiary_Collection_Yello.reset(beneficiaries);
                if (beneficiaries.length > 0) {
                    var length = beneficiaries.length;
                    var domStr = "";
                    for (var i = 0; i < length; i++) {
                        if (beneficiaries[i].transactionType == 'YELLO') {
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

        _on_Get_Beneficiary_Success: function (data) {
            this._Loader.fadeOut();

            this._Beneficiary_Collection_Yello.reset(data.beneficiaries);
            localStorage.setItem('DBTransferBeneficiary', JSON.stringify(data.beneficiaries));
            if (data.beneficiaries.length > 0) {
                var length = data.beneficiaries.length;
                var domStr = "";
                for (var i = 0; i < length; i++) {
                    if (data.beneficiaries[i].transactionType == 'YELLO') {
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

        _on_Get_Beneficiary_Error: function (data) {},

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

        _on_Add_Beneficiary_Item_Tap: function (event) {
            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_To_Account_Item_Tap: function (event) {
            this.benediciaryTap = true;
            if ($(event.currentTarget).hasClass('Add_Beneficiary')) {
                return;
            }
            this._To_Account_Model = {
                "accountNumber": $(event.currentTarget).find('.Accounts_List_Item_Account').html()
            };
            this.$el.find('.Beneficiary_Account_Number').val($(event.currentTarget).find('.Accounts_List_Item_Account').html());
            this._accountLookup_call();
        },

        _on_Beneficiary_Tap: function () {
            this.$el.find('input').blur();
            if (this.$el.find('.Beneficiary_Account_Number').val().length != 10) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid destination account number.'
                }));
                return;
            }
            var accountNumber = this.$el.find('.Beneficiary_Account_Number').val();
            this._To_Account_Model = {
                "accountNumber": this.$el.find('.Beneficiary_Account_Number').val()
            };
            this._accountLookup_call();
        },

        _accountLookup_call: function (event) {
            this._Loader.fadeIn();

            var reqData = {
                sessionId: AppData.Session_Id,
                accountNumber: this._To_Account_Model.accountNumber
            };
            $.ajax({
                type: 'GET',
                url: AppData.Service.yelloGetBeneficiary,
                data: reqData,
                success: _.bind(this._on_yelloGetBeneficiary_Success, this),
                error: _.bind(this._on_yelloGetBeneficiary_Error, this)
            });
        },

        _on_yelloGetBeneficiary_Success: function (data) {
            this._beneficiaryFlag = false;
            this._Loader.fadeOut();

            if (data.responseCode === 0) {
                if (!this.benediciaryTap) {
                    var data_Param = {
                        sessionId: AppData.Session_Id,
                        beneficiaryName: data.accountName,
                        beneficiaryAccountNumber: this.$el.find('.Beneficiary_Account_Number').val(),
                        destinationBankCode: '',
                        transactionType: 'YELLO'
                    };
                    if (this._Save_Beneficiary_Bool) {
                        var filter = this.$el.find('.Beneficiary_Account_Number').val();
                        var modelsToFilter = this._Beneficiary_Collection_Yello.models;
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
                        if (!this._beneficiaryFlag) {
                            $.ajax({
                                type: 'POST',
                                url: AppData.Service.createBillBeneficiaryTransfer,
                                data: data_Param,
                                success: _.bind(this._on_createBeneficiar_Success, this),
                                error: _.bind(this._on_createBeneficiar_Error, this)
                            });
                        }
                    }
                }
                this._beneficiaryName = data.accountName;

                if (this._Save_Beneficiary_Bool && !this._Beneficiary_Collection_Yello.get(this._To_Account_Model)) {
                    var thisBeneficiary = {
                        'beneficiaryName': this._beneficiaryName,
                        'beneficiaryAccountNumber': this.$el.find('.Beneficiary_Account_Number').val(),
                        'id': '',
                        'transactionType': 'YELLO'
                    };
                    this._Beneficiary_Collection_Yello.add(thisBeneficiary);
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
        },

        _on_createBeneficiar_Success: function (data) {
            this.benediciaryTap = false;
            this.update();
        },

        _on_createBeneficiar_Error: function (data) {},

        _on_yelloGetBeneficiary_Error: function (data) {
            this._Loader.fadeOut();
        },

        _on_Amount_Change: function () {
            if (this._Amount_Input.val().trim() === "" || isNaN(this._Amount_Input.val().replace(/\,/g, '').trim())) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid amount.'
                }));
                this._Review.find('input').val('');
                return;
            } else if (this._Pin_Input.val().trim() === '') {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            } else {
                this._Review.find('input').val(this._Amount_Input.val());
            }
            this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Confirm_Tap: function () {
            this.$el.find('input').blur();
            this._Loader.fadeIn();

            var reqData = {
                "beneficiaryAcct": this._To_Account_Model.accountNumber,
                "beneficiaryName": this._beneficiaryName,
                "originatorAcctNo": this._From_Account_Model.get('accountNumber'),
                "originatorName": AppData.Customer_Name,
                "sourceBankCode": this._From_Account_Model.get('productCode'),
                "amount": this._Amount_Input.val().trim().replace(/,/g, ''),
                "sessionId": AppData.Session_Id,
                "pin": this.$el.find('.FinalPin').val().trim()
            };

            $.ajax({
                type: 'POST',
                url: AppData.Service.yelloDiamondAccountTransfer,
                data: reqData,
                success: _.bind(this._on_yelloDiamondAccountTransfer_Success, this),
                error: _.bind(this._on_yelloDiamondAccountTransfer_Error, this)
            });
        },

        _on_yelloDiamondAccountTransfer_Success: function (data) {
            AppData.Get_Error = true;
            this._Loader.fadeOut();

            if (data.responseCode === 0) {
                this.trigger('Transfer_Success');
                Countly.event([{
                    key: 'Yello Diamond Bank Transfer',
                    count: 1,
                    sum: parseFloat(this._Amount_Input.val().trim().replace(/,/g, '')),
                    segmentation: {
                        Status: 'Success'
                    }
                }]);
                setTimeout(_.bind(this.clear, this), 400);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                Countly.event([{
                    key: 'Yello Diamond Bank Transfer',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_yelloDiamondAccountTransfer_Error: function (data) {
            this._Loader.fadeOut();

            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));
            Countly.event([{
                key: 'Yello Diamond Bank Transfer',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        _on_Beneficiaries_Delete_Item_Tap: function (event) {
            event.stopPropagation();
            var beneficiary_Model = this._Beneficiary_Collection_Yello.models[$(event.currentTarget).parent().data('model-id')];

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

        _on_Benefeciary_Search_Change: function () {
            var filter = this._Benefeciary_Search.val().toLowerCase(),
                modelsToFilter = this._Beneficiary_Collection_Yello.models,
                filteredModels = _.filter(modelsToFilter, function (model) {
                    if (!filter) {
                        return 1;
                    }
                    if (model.get('beneficiaryName').toLowerCase().search(filter) + 1) {
                        return 1;
                    }
                    if (model.get('beneficiaryAccountNumber').search(filter) + 1) {
                        return 1;
                    }

                }, this),
                domStr = '';
            for (var i = 0; i < filteredModels.length; i++) {
                var model = filteredModels[i];
                if (model.get('transactionType') == 'YELLO') {
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
            this._From_Account_Model = null;
            this._To_Account_Model = new Backbone.Collection();
            this._Amount_Input.val('');
            this._Pin_Input.val('');
            this._Review.find('input').val('');
            this.$el.find('.To_Account .To_Account_Input').val("");

            this.$el.find('.Screen').hide();
            this.$el.find('.From_Account').show();
            this._currentViewIndex = 0;
            this.val = '';
            this.valTemp = '';
        },

        clearInputs: function () {
            this._Amount_Input.val('');
            this._Pin_Input.val('');
            this.val = '';
            this.valTemp = '';
        }
    });
    return Yello_Diamond_Transfer_Banks_View;
});