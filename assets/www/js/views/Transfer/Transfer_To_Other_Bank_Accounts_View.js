define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        template = require('text!html/Transfers/Transfer_To_Other_Bank_Accounts_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),
        bank_Item_Template = require('text!html/Controls/Banks_List_Item.html'),
        beneficiaries_Item_Template = require('text!html/Controls/Beneficiaries_List_Item.html'),

        AppData = require('js/appData'),
        bankName = require('plugins/banks'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Transfer_To_Other_Bank_Accounts_View = Base_Page_View.extend({

        id: "Transfer_To_Other_Bank_Account",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),
        bank_Item_Template: _.template(bank_Item_Template),
        beneficiaries_Item_Template: _.template(beneficiaries_Item_Template),

        events: {
            'tap .From_Account .v-list-item': '_on_From_Account_Item_Tap',
            'tap .To_Account .Beneficiaries_List .v-list-item': '_on_To_Account_Item_Tap',
            'tap .To_Beneficiary_Detail .Btn_Beneficiary_Continue': '_on_Beneficiary_Tap',
            'tap .To_Account .Btn_Delete': '_on_Beneficiaries_Delete_Item_Tap',
            'keyup .To_Account .v-search-input': '_on_Bank_Search_Change',
            'keydown .Amount_Input': '_on_Amount_Input_Key_Down',
            'keyup .Amount_Input': '_on_Amount_Input_Key_Up',
            'tap .Btn_Amount_Continue': '_on_Amount_Change',
            'tap .Btn_Review_Confirm': '_on_Btn_Review_Confirm_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap',
            'release .Beneficiary_Type .v-segmented-control-item': '_on_Segmented_Control_Item_Release'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Banks_Collection = new Backbone.Collection();
            this._Beneficiary_Collection = new Backbone.Collection();
            this._Beneficiary_Collection_Other = new Backbone.Collection();
            this._Save_Beneficiary_Bool = false;
            this._Show_Beneficiary_List = false;
            this._Search_Bank = true;
            this._Search_beneficiary = false;
            this._beneficiaryName = '';
            this._beneficiaryFlag = false;
            this._bankCode = '';
            this._bankName = '';
            this._bank = false;
            this.val = '';
            this.valTemp = '';


            Transfer_To_Other_Bank_Accounts_View.__super__.initialize.apply(this, [config]);

            if (AppData.Store.data && AppData.Store.data.otherBeneficiary) {
                this._Beneficiary_Collection_Other.reset(AppData.Store.data.otherBeneficiary);
            } else {
                AppData.Store.data.otherBeneficiary = [];
            }
        },

        _render: function () {
            Transfer_To_Other_Bank_Accounts_View.__super__._render.apply(this);

            this._Page.html(this.template());
            this.Mask = this.$el.find('.v-page-mask');

            this._Loader = this.$el.find('.Transfer_To_Own_Account-loader');
            this._Amount = this._Page.find('.Amount');
            this._Destination_Acc_Input = this._Page.find('.Beneficiary_Account_Number');
            this._Amount_Input = this._Page.find('.Amount_Input');
            this._Pin_Input = this._Page.find('.FinalPin');
            this._Review = this._Page.find('.Review');
            this._Bank_Search = this.$el.find('.To_Account .v-search-input');

            this._Page_Switcher = new Base_Switcher_View({
                parentNode: this.$el.find('.Save_Beneficiary-switcher')
            });
            this.listenTo(this._Page_Switcher, 'Change', _.bind(this._Save_Beneficiary_Change_Requested, this));
            this._currentViewIndex = 0;
            this._viewArr = ['From_Account', 'To_Account', 'To_Beneficiary_Detail', 'Amount', 'Review'];
        },

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();

            if (this._currentViewIndex === 2) {
                this._Save_Beneficiary_Change_Requested('left');
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

            $.ajax({
                type: 'GET',
                url: AppData.Service.getBanks,
                data: {},
                success: _.bind(this._on_getBanks_success, this),
                error: _.bind(this._on_getBanks_error, this)
            });

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

            this._render_Banks_search(this._Banks_Collection.models);

            if (this._To_Account_Model && this._From_Account_Model.cid === this._To_Account_Model.cid) {
                this._To_Account_Model = null;
                this._Review.find('.To').html('');
            }
        },

        _on_To_Account_Item_Tap: function (event) {

            var type = this.$el.find('.Beneficiary_Type .v-segmented-control-item.active').data('type');
            switch (type) {
            case 'Bank':
                this._Beneficiary = null;
                this._bank = true;
                this._To_Account_Model = this._Banks_Collection.get($(event.currentTarget).data('bank-id'));
                this.$el.find('.Beneficiary_Account_Number').val('');
                break;
            default:
                this._bank = false;
                this._toAccount = null;
                this._Beneficiary = this._Beneficiary_Collection_Other.where({
                    'beneficiaryAccountNumber': $(event.currentTarget).data('model-id')
                });
                this._To_Account_Model = this._Beneficiary_Collection_Other.get($(event.currentTarget).data('model-id'));


                if (!this._To_Account_Model) {
                    return;
                }
                this.$el.find('.Beneficiary_Account_Number').val(this._To_Account_Model.attributes.beneficiaryAccountNumber);
                this._Save_Beneficiary_Change_Requested('right');
                break;
            };
            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _render_Beneficiaries: function () {
            var beneficiaries = eval('{' + localStorage.getItem('DBTransferBeneficiary') + '}');

            this._Beneficiary_Collection_Other.reset(beneficiaries);

            if (beneficiaries.length > 0) {
                var length = beneficiaries.length;
                var domStr = "";
                for (var i = 0; i < length; i++) {
                    if (beneficiaries[i].transactionType == 'NIP') {
                        domStr = domStr + this.beneficiaries_Item_Template({
                            modelId: beneficiaries[i].id,
                            beneficiaryName: beneficiaries[i].beneficiaryName,
                            beneficiaryAccountCurrency :'',
                            beneficiaryAccountNumber: beneficiaries[i].beneficiaryAccountNumber + ' - ' + bankName.getName(beneficiaries[i].destinationBankCode)
                        });
                    }
                }
                this.scrollTop();
                this.$el.find('.Beneficiaries_List').html(domStr);
            } else {
                this.$el.find('.Beneficiaries_List').html('');
            }
        },

        _on_Get_Beneficiary_Success: function (data) {
            this._Loader.fadeOut();
            this._Beneficiary_Collection_Other.reset(data.beneficiaries);
            localStorage.setItem('DBTransferBeneficiary', JSON.stringify(data.beneficiaries));

            if (data.beneficiaries.length > 0) {
                var length = data.beneficiaries.length;
                var domStr = '';
                for (var i = 0; i < length; i++) {
                    if (data.beneficiaries[i].transactionType == 'NIP') {

                        domStr = domStr + this.beneficiaries_Item_Template({
                            modelId: data.beneficiaries[i].id,
                            beneficiaryName: data.beneficiaries[i].beneficiaryName,
                            beneficiaryAccountCurrency :'',
                            beneficiaryAccountNumber: data.beneficiaries[i].beneficiaryAccountNumber + ' - ' + bankName.getName(data.beneficiaries[i].destinationBankCode)
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

        _render_Banks_search: function (models) {
            var domStr = '';
            for (var i = 0; i < models.length; i++) {
                var model = models[i];
                domStr = domStr + this.bank_Item_Template({
                    id: model.get('id'),
                    name: model.get('name'),
                });
            }
            this.scrollTop();
            this.$el.find('.Beneficiaries_List').html(domStr);
        },

        _on_getBanks_success: function (data) {
            if (data.responseCode === 0 && data.bankList && data.bankList.length > 0) {
                this._Banks_Collection.reset(data.bankList);
                this._Banks_Collection.comparator = function (model) {
                    return model.get('name');
                }
                this._Banks_Collection.sort();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'No bank list found.'
                }));
            }
        },

        _on_getBanks_error: function (data) {},

        _on_Beneficiary_Tap: function () {
            if (!this._bank) {
                this._bankCode = this._To_Account_Model.attributes.destinationBankCode;
                this._bankName = bankName.getName(this._bankCode);
                this._bankAccountNumber = this._To_Account_Model.attributes.beneficiaryAccountNumber;
            } else {
                this._bankCode = this._To_Account_Model.get('id');
                this._bankName = bankName.getName(this._bankCode);
                this._bankAccountNumber = this._Destination_Acc_Input.val()
            }

            this.$el.find('input').blur();
            
            var accountValidity = core.checkAccountNumber(this._bankCode, this._bankAccountNumber);
            if(!accountValidity) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter a valid destination account number.'
                }));
                return;
            }
            
            this.$el.find('.Transfer_To_Own_Account-loader').fadeIn();
            var _data = {
                sessionId: AppData.Session_Id,
                destinationBankCode: this._bankCode,
                accountNumber: this._bankAccountNumber
            };
            $.ajax({
                type: 'GET',
                url: AppData.Service.nipAccountLookup,
                data: _data,
                success: _.bind(this._on_accountNameLookup_success, this),
                error: _.bind(this._on_accountNameLookup_error, this)
            });
        },

        _on_createBeneficiar_Success: function (data) {
            this.update();
        },

        _on_createBeneficiar_Error: function (data) {},

        _on_Amount_Change: function () {
            this.$el.find('input').blur();

            if (this._Amount_Input.val().trim() === "" || isNaN(this._Amount_Input.val().replace(/\,/g, '').trim())) {
                this._Amount_Input.val('');
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
                //this._Review.find('.Review_Amount').val(this._Amount_Input.val());
                this._Review.find('.Review_Amount').val(this._Amount_Input.val());
                this._Review.find('.Review_Remark').val(this.$el.find('.Remark_Input').val());
            }
            this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Review_Confirm_Tap: function () {
            this._Loader.fadeIn();
            this.$el.find('input').blur();
            $.ajax({
                type: 'POST',
                url: AppData.Service.transferToAnotherBank,
                data: {
                    sessionId: AppData.Session_Id,
                    sourceAccount: this._From_Account_Model.get('accountNumber'),
                    destinationBankCode: this._bankCode,
                    destinationAccount: this.$el.find('.Beneficiary_Account_Number').val().trim(),
                    destinationAccountName: this._beneficiaryName,
                    beneficiaryEmail: this.$el.find('.Beneficiary_Account_Mail').val().trim(),
                    beneficiaryPhoneNumber: this.$el.find('.Beneficiary_Account_Phone').val().trim(),
                    amount: this._Amount_Input.val().trim().replace(/,/g, ''),
                    narration: this.$el.find('.Remark_Input').val(),
                    pin: this._Pin_Input.val().trim(),
                    transactionTime: new Date().getTime().toString()
                },
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
                this.clear();
            }
        },

        _on_Transfer_Success: function (data) {
            AppData.Get_Error = true;
            this._Loader.fadeOut();
            if (data.responseCode === 0) {
                this.trigger('Transfer_Success');
                Countly.event([{
                    key: 'Transfer',
                    count: 1,
                    sum: parseFloat(this._Amount_Input.val().trim().replace(/,/g, '')),
                    segmentation: {
                        Type: 'Third Party',
                        Status: 'Success',
                        DestinationBank: this._Banks_Collection.get(this._To_Account_Model.get('destinationBankCode')).attributes.name
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
                        Type: 'Third Party',
                        Status: 'Failed',
                        DestinationBank: this._Banks_Collection.get(this._To_Account_Model.get('destinationBankCode')).attributes.name,
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_Transfer_Error: function (data) {
            this._Loader.fadeOut();
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));

            Countly.event([{
                key: 'Transfer',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'Third Party',
                    Status: 'Failed',
                    DestinationBank: this._Banks_Collection.get(this._To_Account_Model.get('destinationBankCode')).attributes.name,
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        _on_accountNameLookup_success: function (data) {
            this._beneficiaryFlag = false;
            this._beneficiaryName = data.accountName;

            if (data.responseCode === 0 && data.accountName && data.accountName !== "") {
                var data = {
                    sessionId: AppData.Session_Id,
                    beneficiaryName: data.accountName,
                    beneficiaryAccountNumber: this.$el.find('.Beneficiary_Account_Number').val(),
                    destinationBankCode: this._To_Account_Model.get('id'),
                    beneficiaryBankName: this._To_Account_Model.attributes.name,
                    transactionType: 'NIP'
                };

                if (this._Save_Beneficiary_Bool) {
                    var filter = this.$el.find('.Beneficiary_Account_Number').val();
                    var modelsToFilter = this._Beneficiary_Collection_Other.models;

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
                            data: data,
                            success: _.bind(this._on_createBeneficiar_Success, this),
                            error: _.bind(this._on_createBeneficiar_Error, this)
                        });
                    }
                }

                if (!this._beneficiaryFlag) {
                    if (this._Save_Beneficiary_Bool && !this._Beneficiary_Collection.get(this._To_Account_Model.get('id'))) {
                        var thisBeneficiary = {
                            'beneficiaryName': this._beneficiaryName,
                            'beneficiaryAccountNumber': this._Destination_Acc_Input[0].value,
                            'id': this._To_Account_Model.get('id'),
                            'transactionType': 'NIP'
                        };
                        this._Beneficiary_Collection.add(thisBeneficiary);
                        AppData.Store.data.otherBeneficiary.push(thisBeneficiary);
                        core.save_Store(AppData.Store);
                    }

                    this._toAccount = data.accountName;
                    this._Review.find('.To').html(this.account_Item_Template({
                        account: this._Destination_Acc_Input[0].value + ' - ' + this._bankName,
                        accounttype: this._beneficiaryName, //data.accountName,
                        availablebalance: "",
                        currencyAlias: this._From_Account_Model.get('currency'),
                        modelId: this._To_Account_Model.get('id')
                    }));
                    this._Review.find('.To .v-list-item-el:last-child').hide();

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

            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'Unable to process request'
            }));
        },

        _on_Segmented_Control_Item_Release: function (event) {
            if (event.currentTarget !== event.gesture.target) {
                return;
            }
            var $el = $(event.currentTarget);
            this.$el.find('.Beneficiary_Type .v-segmented-control-item').removeClass('active');
            $el.addClass('active');

            var type = this.$el.find('.Beneficiary_Type .v-segmented-control-item.active').data('type');

            switch (type) {
            case 'Bank':
                this._Search_Bank = true;
                this._Search_beneficiary = false;
                this._render_Banks_search(this._Banks_Collection.models);
                break;
            default:
                this._Search_Bank = false;
                this._Search_beneficiary = true;
                this._render_Beneficiaries();
                break;
            };
        },

        _on_Beneficiaries_Delete_Item_Tap: function (event) {
            event.stopPropagation();

            var beneficiary_Model = this._Beneficiary_Collection_Other.models[$(event.currentTarget).parent().data('model-id')];
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

        _handle_Confirm: function (modelId, index) {
            if (index === 1) {
                $.ajax({
                    type: 'POST',
                    url: AppData.Service.deleteBillBeneficiaryTransfer,
                    data: {
                        beneficiaryId: modelId
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

        _on_Bank_Search_Change: function () {
            if (this._Search_beneficiary) {
                var filter = this._Bank_Search.val().toLowerCase();
                var modelsToFilter = this._Beneficiary_Collection_Other.models;
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
                    if (model.get('transactionType') == 'NIP') {
                        domStr = domStr + this.beneficiaries_Item_Template({
                            beneficiaryAccountNumber: model.get('beneficiaryAccountNumber') + ' - ' + bankName.getName(model.get('destinationBankCode')),
                            beneficiaryAccountCurrency :'',
                            beneficiaryName: model.get('beneficiaryName'),
                            modelId: model.cid
                        });
                    }
                }
                this.scrollTop();
                this.$el.find('.Beneficiaries_List').html(domStr);
            }

            if (this._Search_Bank) {
                var filter = this._Bank_Search.val().toLowerCase();
                var modelsToFilter = this._Banks_Collection.models;

                if (!filter) {
                    var filteredModels = modelsToFilter;
                } else {
                    var filteredModels = _.filter(modelsToFilter, function (model) {
                        if (model.get('name').toLowerCase().search(filter) + 1 || model.get('id').toLowerCase().search(filter) + 1) {
                            return 1;
                        }
                    }, this);
                }
                this._render_Banks_search(filteredModels);
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
    return Transfer_To_Other_Bank_Accounts_View;
});