define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),
        Bills_Success_View = require('js/views/Bills/Bills_Success_View'),

        template = require('text!html/Bills/Smile_View.html'),
        account_Item_Template = require('text!html/Controls/Accounts_List_Item.html'),
        beneficiary_Item_Template = require('text!html/Controls/Beneficiaries_List_Item.html'),
        product_Template = require('text!html/Bills/Bills_Product.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),
        core = require('plugins/core');

    var Smile_View = Base_Page_View.extend({

        id: "Smile",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),
        beneficiary_Item_Template: _.template(beneficiary_Item_Template),
        product_Template: _.template(product_Template),


        events: _.extend({
            'tap .Btn_Back_Smile': '_on_Btn_Close_Tap',
            'tap .ProductType .v-list-item': '_on_Product_Type_Tap',
            'tap .ProductType .Btn_Continue': '_on_Btn_Charge_Continue_Tap',
            'tap .Products .v-list-item': '_on_Products_List_Item_Tap',
            'tap .Accounts .v-list-item': '_on_Accounts_List_Item_Tap',
            'tap .v-segmented-control-item': '_on_Segmented_Control_Item_Tap',
            'tap .Beneficiaries .v-list-item': '_on_Beneficiaries_List_Item_Tap',
            'tap .Beneficiaries .Btn_Delete': '_on_Beneficiaries_Delete_Item_Tap',
            'tap .Beneficiaries .Btn_Continue': '_on_Btn_Continue_Tap',
            'keyup .Review .quantity': '_on_Quantity_Change',
            'tap .Review .Btn_Confirm': '_on_Btn_Review_Confirm_Tap',
            'keydown .Review .Amount': '_on_Amount_Input_Key_Down',
            'keyup .Review .Amount': '_on_Amount_Input_Key_Up',
            'tap .Confirm .Btn_Confirm': '_on_Btn_Confirm_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {

            //this._Smile_Collection = config.smileData;
            this._Accounts_Collection = config.accounts_Collection;
            this._price = config.price;
            this._airtimeFlag = true;
            this._Data = {};
            this._DirectInput = false;
            this._Current_Biller = '';
            this._customerId = '';
            this._productCode = '';
            this.billers = 0;
            this._Smile_Product_price = 0;
            this._Smile_Product = '';
            this._Smile_Product_Code = '';
            this._totalAmount = 0;

            this._Current_Biller = config.currentBiller;
            this._billerCharge = config.billerCharge;
            this._Beneficiaries_Collection = new Backbone.Collection();
            this._Payment_Collection = new Backbone.Collection();
            this._Smile_Collection = new Backbone.Collection();
            this.listenTo(this._Beneficiaries_Collection, 'add', _.bind(this._get_Beneficiaries, this));

            Smile_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Smile_View.__super__._render.apply(this);

            this._Content_Loader = this.$el.find('.v-loader.v-content-loader');
            this._Page_Loader = this.$el.find('.v-loader.v-page-loader');
            this._SubScreens = this.$el.find('.v-sub-screen');
            this._Screens = this.$el.find('.Screen');
            this._Amount_Input = this._Page.find('.Amount');

            this._Phone_Number = this.$el.find('.Phone .Phone_Number');
            this._Review = this.$el.find('.Review');
            this._Confirm = this.$el.find('.Confirm');

            this._currentViewIndex = 0;
            this._viewArr = ['ProductType', 'Products', 'Accounts', 'Beneficiaries', 'Review', 'Confirm'];

            this._Page_Switcher = new Base_Switcher_View({
                parentNode: this.$el.find('.Save_Beneficiary-switcher')
            });
            this.listenTo(this._Page_Switcher, 'Change', _.bind(this._Save_Beneficiary_Change_Requested, this));

            this._render_Accounts();
            this._get_Beneficiaries();
        },

        _change_Screen: function (screenName) {
            this.$el.find('input').blur();

            if (screenName == 'Review' && this._airtimeFlag) {
                this._Review.find('.Amount').val('');
                this._Confirm.find('.Amount').val('');
                this._Review.find('.PIN').val('');
                this._Review.find('.biller').val("SMILE");
                this._Confirm.find('.biller').val("SMILE");
                this._Review.find('.BillerCharge').val(this._billerCharge);
                this._Confirm.find('.BillerCharge').val(this._billerCharge);
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

        _on_Btn_Charge_Continue_Tap: function () {
            this.blur_Inputs();

            if (!this._airtimeFlag) {
                this._Review.find('.Amount')[0].disabled = true;
                this.$el.find('.productQuantity').show();
                this.$el.find('.smileProduct').show();
                this._Content_Loader.fadeIn();
                $.ajax({
                    type: 'GET',
                    url: AppData.Service.smileBundleCatalogues,
                    data: {
                        sessionId: AppData.Session_Id
                    },
                    success: _.bind(this._on_Get_Smile_Products_Success, this),
                    error: _.bind(this._on_Get_Products_Error, this)
                });
            } else {
                this._Review.find('.Amount')[0].disabled = false;
                this.$el.find('.productQuantity').hide();
                this.$el.find('.smileProduct').hide();
                this._currentViewIndex = 2;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            }
        },

        _on_Get_Smile_Products_Success: function (data) {
            this._Content_Loader.fadeOut();
            var mbppString = JSON.parse(data.responseString);

            if (mbppString.success) {

                this._Smile_Collection.reset(mbppString.responseData.bundles);
                this._render_Products(this._Smile_Collection);

                this._currentViewIndex = 1;
                this._change_Screen(this._viewArr[this._currentViewIndex]);

            } else {
                this._render_Products(new Backbone.Collection());
            }

        },

        _on_Get_Products_Error: function () {
            this._render_Products(new Backbone.Collection());
            this._Content_Loader.fadeOut();
        },

        _on_Products_List_Item_Tap: function (event) {
            var productData = this._Smile_Collection.get($(event.currentTarget).data('model-id'));

            this._Smile_Product_price = productData.get('price');
            this._Smile_Product = productData.get('description');
            this._Smile_Product_Code = productData.get('code');

            this._Review.find('.quantity').val('1');
            this._Review.find('.Amount').val(this._Smile_Product_price);
            this._Review.find('.biller').val("SMILE");
            this._Review.find('.product').val(this._Smile_Product);
            this._Review.find('.BillerCharge').val(this._billerCharge);
            this._Confirm.find('.BillerCharge').val(this._billerCharge);

            this._Confirm.find('.quantity').val('1');
            this._Confirm.find('.Amount').val(this._Smile_Product_price);
            this._Confirm.find('.biller').val("SMILE");
            this._Confirm.find('.product').val(this._Smile_Product);

            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _render_Products: function (productsCollection) {
            //            this._Products_Collection.sort();
            var domStr = '';

            for (var i = 0; i < productsCollection.models.length; i++) {
                domStr = domStr + this.product_Template({
                    model: productsCollection.models[i]
                });
            }

            this.$el.find('.Products .v-list').html(domStr);
        },

        _on_Product_Type_Tap: function (event) {
            var $el = $(event.currentTarget);
            if ($el.data('type') == 'airtime') {
                this._airtimeFlag = true;
            } else {
                this._airtimeFlag = false;
            }

            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');

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

        _on_Accounts_List_Item_Tap: function (event) {

            this._Data.account = this._Accounts_Collection.get($(event.currentTarget).data('model-id'));

            this._Review.find('.From_Account').html(this.account_Item_Template({
                account: this._Data.account.get('accountNumber'),
                accounttype: this._Data.account.get('accountType'),
                availablebalance: core.formatBalance(this._Data.account.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._Data.account.get('currencyCode')),
                modelId: this._Data.account.cid
            }));
            this._Review.find('.From_Account .v-list-item-el:last-child').hide();
            this._Confirm.find('.From_Account').html(this.account_Item_Template({
                account: this._Data.account.get('accountNumber'),
                accounttype: this._Data.account.get('accountType'),
                availablebalance: core.formatBalance(this._Data.account.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._Data.account.get('currencyCode')),
                modelId: this._Data.account.cid
            }));
            this._Confirm.find('.From_Account .v-list-item-el:last-child').hide();

            this._currentViewIndex = 3;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Segmented_Control_Item_Tap: function (event) {
            this.blur_Inputs();

            var target = event.currentTarget.dataset.screen;

            if (target !== this._Active_Segment_Control) {
                this._SubScreens.fadeOut();
                this.$el.find('.' + target).fadeIn();
                this._Active_Segment_Control = target;
            }
            this.$el.find('.v-segmented-control-item').removeClass('active');
            $(event.currentTarget).addClass('active');
        },

        _Save_Beneficiary_Change_Requested: function (position) {
            switch (position) {
            case 'left':
                this.$el.find('.Save_Beneficiary_Switcher_View .v-switcher').css("background", "#848484");
                this._Save_Beneficiary_Bool = false;
                this.$el.find('.Save_Beneficiary_Wrapper').slideUp('fast');
                //                this._Saved = false;
                break;
            case 'right':
                this.$el.find('.Save_Beneficiary_Switcher_View .v-switcher').css("background", "#b4d431");
                this._Save_Beneficiary_Bool = true;
                this.$el.find('.Save_Beneficiary_Wrapper').slideDown('fast');
                break;
            }
        },

        _on_lookup_Success: function (data) {
            this._Content_Loader.hide();

            if (data.responseCode === 0) {
                var name = data.firstName + ' ' + data.middleName + ' ' + data.lastName;
                this._Review.find('.customerName').html(name);
                this._Confirm.find('.customerName').html(name);

                this.blur_Inputs();
                this._beneficiaryFlag = false;
                var alias = this.$el.find('.ReferenceAlias').val();

                if (this._DirectInput === '' || !this._DirectInput) {
                    this._DirectInput = this.$el.find('.ReferenceNumber').val();
                }

                if (this._currentViewIndex === 3 && this._Save_Beneficiary_Bool) {
                    if (!alias || alias.trim() == '') {
                        document.dispatchEvent(new CustomEvent('alert', {
                            'detail': 'Please enter a beneficiary alias, if you want to save the beneficiary.'
                        }));
                        return;

                    } else {

                        var filter = this.$el.find('.ReferenceNumber').val();
                        var modelsToFilter = this._Beneficiaries_Collection.models;

                        if (!filter) {
                            var filteredModels = modelsToFilter;
                        } else {
                            var filteredModels = _.filter(modelsToFilter, function (model) {
                                if (model.get('beneficiaryReferenceNumber') === filter) {
                                    this._beneficiaryFlag = true;
                                    return 1;
                                }
                            }, this);
                        }
                        if (!this._beneficiaryFlag) {

                            var data = {
                                sessionId: AppData.Session_Id,
                                beneficiaryName: alias,
                                beneficiaryRefNumber: this.$el.find('.ReferenceNumber').val(),
                                billerCode: this._Current_Biller
                            };

                            $.ajax({
                                type: 'POST',
                                url: AppData.Service.createBillBeneficiary,
                                data: data,
                                success: _.bind(this._on_createBeneficiary_Success, this),
                                error: _.bind(this._on_createBeneficiary_Error, this)
                            });
                        } else {
                            document.dispatchEvent(new CustomEvent('alert', {
                                'detail': 'Beneficiary is already in list.'
                            }));
                            this._beneficiaryFlag = false;
                        }
                    }

                } else {

                    setTimeout(_.bind(function () {
                        //this.clearInputs();
                    }, this), 400);

                    this._currentViewIndex = 4;
                    this._change_Screen(this._viewArr[this._currentViewIndex]);
                }
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_lookup_Error: function (data) {
            Log.write('Error = ');
            Log.write(JSON.stringify(data));

        },

        _get_Beneficiaries: function () {

            var beneficiaries = eval('{' + localStorage.getItem('DBBillBeneficiary') + '}');
            this._Beneficiaries_Collection.reset(beneficiaries);

            if (beneficiaries.length > 0) {
                var length = beneficiaries.length;
                var domStr = "";
                for (var i = 0; i < this._Beneficiaries_Collection.models.length; i++) {
                    var model = this._Beneficiaries_Collection.models[i];

                    if (model.get('billerCode') == this._Current_Biller) {
                        var data = {
                            beneficiaryName: model.get('beneficiaryName'),
                            beneficiaryAccountNumber: model.get('beneficiaryReferenceNumber'),
                            beneficiaryAccountCurrency: '',
                            modelId: model.get('id')
                        };

                        domStr = domStr + this.beneficiary_Item_Template(data);
                    }
                }
                this.$el.find('.Beneficiaries .v-list').html(domStr);
                //this._Screens.filter('.Beneficiaries').find('.v-list').html(domStr);

            } else {
                this.$el.find('.Beneficiaries .v-list').html(domStr);
                //this._Screens.filter('.Beneficiaries').find('.v-list').html('');
            }
        },

        _get_Beneficiaries_proxy: function () {
            $.ajax({
                type: 'GET',
                url: AppData.Service.getBillBeneficiary,
                data: {
                    sessionId: AppData.Session_Id,
                },
                success: _.bind(this._on_Get_Beneficiary_Success, this),
                error: _.bind(this._on_Get_Beneficiary_Error, this)
            });
        },

        _on_Get_Beneficiary_Success: function (data) {
            Log.write(data);
            Log.write("data.beneficiaries.length = " + data.beneficiaries.length);
            localStorage.setItem('DBBillBeneficiary', JSON.stringify(data.beneficiaries));

            var beneficiariesStr = data.beneficiaries;
            this._Beneficiaries_Collection.reset(beneficiariesStr);
            this._get_Beneficiaries();

        },

        _on_Get_Beneficiary_Error: function (data) {
            Log.write("Error");
            Log.write(data);
        },

        _on_Beneficiaries_List_Item_Tap: function (event) {
            this._Data.beneficiary = this._Beneficiaries_Collection.get($(event.currentTarget).data('model-id'));

            this._DirectInput = false;
            this.$el.find('.ReferenceNumber').val('');
            this._customerId = this._Data.beneficiary.get('beneficiaryReferenceNumber');

            this._on_Btn_Continue_Tap(this._Data.beneficiary.get('beneficiaryReferenceNumber'));
            /*this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);*/
        },

        _on_Beneficiaries_Delete_Item_Tap: function (event) {
            event.stopPropagation();

            var beneficiary_Model = this._Beneficiaries_Collection.get($(event.currentTarget).parent().data('model-id'));

            if (!window.device) {
                var con = confirm("Do you really want to delete this beneficiary? ");
                if (con) {

                    //if (this.index === 1) {
                    this._Content_Loader.fadeIn();

                    $.ajax({
                        type: 'POST',
                        url: AppData.Service.deleteBillBeneficiary,
                        data: {
                            beneficiaryId: beneficiary_Model.get('id')
                        },
                        success: _.bind(this._on_Delete_Success, this),
                        error: _.bind(this._on_Delete_Error, this)
                    });
                }
            } else {
                navigator.notification.confirm("Do you really want to delete this beneficiary? ", _.bind(this._handle_Confirm, this, beneficiary_Model.get('id'), 'Delete'));
            }
        },

        _handle_Confirm: function (id, index) {

            this._Content_Loader.fadeIn();

            //if (index === 1) {
            $.ajax({
                type: 'POST',
                url: AppData.Service.deleteBillBeneficiary,
                data: {
                    beneficiaryId: id
                },
                success: _.bind(this._on_Delete_Success, this),
                error: _.bind(this._on_Delete_Error, this)
            });
            //}
        },

        _on_Delete_Success: function (data) {
            this._Content_Loader.fadeOut();
            if (data.responseCode == '0') {
                this.update_Beneficiaries();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Delete_Error: function (data) {
            this._Content_Loader.fadeOut();
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));
        },

        update_Beneficiaries: function () {
            this._get_Beneficiaries_proxy();
        },

        _on_Btn_Continue_Tap: function (data) {
            this._Content_Loader.fadeIn();

            if (data && isNaN(data) == false) {
                this._DirectInput = data
            } else {
                this._DirectInput = this.$el.find('.ReferenceNumber').val().trim().split(' ').join('').replace('+', '');
            }

            var testData = {
                destMsisdn: this._DirectInput,
                sessionId: AppData.Session_Id
            };
            $.ajax({
                type: 'POST',
                url: AppData.Service.doValidate,
                data: {
                    destMsisdn: this._DirectInput,
                    sessionId: AppData.Session_Id
                },
                success: _.bind(this._on_lookup_Success, this),
                error: _.bind(this._on_lookup_Error, this)
            });
        },

        _on_createBeneficiary_Success: function (data) {
            this.update_Beneficiaries();
            if (!data.responseCode === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }

            this._DirectInput = this.$el.find('.ReferenceNumber').val().trim().split(' ').join('').replace('+', '');
            if (this._DirectInput) {
                this._customerId = this.$el.find('.ReferenceNumber').val().trim().split(' ').join('').replace('+', '');

                this._Data.beneficiary = this._DirectInput;
            }

            this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_createBeneficiary_Error: function (data) {
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));

            this._currentViewIndex = 4;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Quantity_Change: function () {
            if (this._Review.find('.quantity').val()) {
                this._totalAmount = this._Smile_Product_price * this._Review.find('.quantity').val();
                this._Review.find('.FixedAmount').hide();
                this._Review.find('.Amount').show();
                this._Review.find('.Amount').val(this._totalAmount);

                this._Review.find('.Amount')[0].disabled = true;

                this._Confirm.find('.FixedAmount').hide();
                this._Confirm.find('.Amount').show();
                this._Confirm.find('.Amount').val(this._totalAmount);
                this._Confirm.find('.quantity').val(this._Review.find('.quantity').val());
            }

        },

        _on_Amount_Input_Key_Down: function (e) {
            if (e.keyCode == 8) {
                return true;
            } else if (e.keyCode < 48 || e.keyCode > 57) {
                return false;
            } else {
                return true;
            }
        },

        _on_Amount_Input_Key_Up: function (e) {
            e.target.value = e.target.value.match(/\d+/) ? e.target.value.match(/\d+/)[0] : '';
        },

        _on_Btn_Review_Confirm_Tap: function () {
            this.blur_Inputs();
            if (!this._Review.find('.Amount').val() || this._Review.find('.Amount').val() == '') {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter an amount.'
                }));
                return;
            }

            if (this._Review.find('.Amount').val() < 25) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'The minimum amount for this transaction is ₦25.'
                }));
                return;
            }

            if (!this.$el.find('.Review .PIN').val().trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }
            this._Confirm.find('.Amount').val(this._Review.find('.Amount').val());
            this._currentViewIndex = 5;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        _on_Btn_Confirm_Tap: function () {
            this.blur_Inputs();
            this._Content_Loader.fadeIn();
            this._totalAmount = this._Smile_Product_price * this._Review.find('.quantity').val();
            var reqSmileData = '';
            var urlSmile = '';

            if (this._airtimeFlag) {

                this._Smile_Product = 'Airtime Topup';
                urlSmile = AppData.Service.doRecharge;
                reqSmileData = {
                    //productCode: this._Smile_Product_Code,
                    sessionId: AppData.Session_Id,
                    pin: this.$el.find('.Review .PIN').val().trim(),
                    sourceAccount: this._Data.account.get('accountNumber'),
                    remarks: '',
                    amount: this._Confirm.find('.Amount').val(),
                    tranTime: new Date().getTime().toString(),
                    destMsisdn: this._customerId || this._DirectInput
                };
            } else {

                urlSmile = AppData.Service.purchaseBundle;
                reqSmileData = {
                    //productCode: this._Data.product.get('productCode'),
                    sessionId: AppData.Session_Id,
                    pin: this.$el.find('.Review .PIN').val().trim(),
                    sourceAccount: this._Data.account.get('accountNumber'),
                    remarks: '',
                    amount: this._totalAmount,
                    tranTime: new Date().getTime().toString(),
                    destMsisdn: this._customerId || this._DirectInput,
                    quantity: this._Review.find('.quantity').val(),
                    code: this._Smile_Product_Code

                };
            }

            $.ajax({
                type: 'POST',
                url: urlSmile,
                data: reqSmileData,
                success: _.bind(this._on_Payment_Success, this),
                error: _.bind(this._on_Payment_Error, this)
            });
        },

        _on_Payment_Success: function (data) {
            this._Content_Loader.fadeOut();
            if (data.responseCode === 0) {

                var paymentData = JSON.parse(localStorage.getItem('BillPayments'));
                this._Payment_Collection.reset(paymentData);

                if (this._airtimeFlag) {
                    this._Smile_Product = 'AIRTIME';
                }

                var payment = {
                    date: new Date().format(),
                    text: 'SMILE' + ': ' + this._Smile_Product + '(' + this._customerId.trim().split(' ').join('').replace('+', '') + ') - ' + data.statusMessage

                };
                this._Payment_Collection.push(payment);
                localStorage.setItem('BillPayments', JSON.stringify(this._Payment_Collection));


                AppData.Get_Error = true;
                if (!this._Bills_Success_View) {
                    this._Bills_Success_View = new Bills_Success_View({
                        width: this._Width
                    });
                }

                this.trigger('Update_Accounts', true);
                this.trigger('View_Change_Requested', this._Bills_Success_View);

                Countly.event([{
                    key: 'Bill Payment',
                    count: 1,
                    sum: parseFloat(this._Confirm.find('.Amount').val()),
                    segmentation: {
                        Status: 'Success',
                        Biller: 'Smile',
                        Product: this._Smile_Product
                    }
                }]);

                Countly.event([{
                    key: 'iap',
                    count: 1,
                    sum: parseFloat(this._Confirm.find('.Amount').val()),
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
                        Biller: 'Smile',
                        Product: this._Smile_Product
                    }
                }]);
            }

        },

        _on_Payment_Error: function (data) {
            this._Content_Loader.fadeOut();
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


        _on_Btn_Close_Tap: function () {

            this.$el.find('input').blur();
            //this.clearInputs();
            if (this._currentViewIndex > 0) {
                if (this._airtimeFlag && this._viewArr[this._currentViewIndex] == 'Accounts') {
                    this._currentViewIndex -= 2;
                } else {
                    this._currentViewIndex--;
                }
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
                this.clear();
            }
        },

        clear: function () {
            this._currentViewIndex = 0;
            this._Screens.hide();
            this.$el.find('.ProductType').show();
            this._Data = {};
            this.$el.find('input').val('');
        }
    });

    return Smile_View;

});