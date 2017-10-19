define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        // Add_Beneficiary_Airtime_View = require('js/views/Bills/Add_Beneficiary_Airtime_View'),
        Bills_Success_View = require('js/views/Bills/Bills_Success_View'),
        Bill_History_View = require('js/views/Bills/Bill_History_View'),
        Smile_View = require('js/views/Bills/Smile_View'),
        Fuel_Voucher_View = require('js/views/Bills/Fuel_Voucher_View'),

        template = require('text!html/Bills/Bills_View.html'),
        category_Template = require('text!html/Bills/Bills_Category.html'),
        biller_Template = require('text!html/Bills/Bills_Biller.html'),
        product_Template = require('text!html/Bills/Bills_Product.html'),
        account_Item_Template = require('text!html/Controls/Accounts_List_Item.html'),
        beneficiary_Item_Template = require('text!html/Controls/Beneficiaries_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),
        core = require('plugins/core');

    var Bills_View = Base_Page_View.extend({

        id: "Bills",

        template: _.template(template),
        category_Template: _.template(category_Template),
        biller_Template: _.template(biller_Template),
        product_Template: _.template(product_Template),
        account_Item_Template: _.template(account_Item_Template),
        beneficiary_Item_Template: _.template(beneficiary_Item_Template),

        events: _.extend({
            // 'tap .Add_Beneficiary': '_on_Add_Beneficiary_Tap',
            'tap .Categories .v-list-item': '_on_Categories_List_Item_Tap',
            'tap .Billers .v-list-item': '_on_Billers_List_Item_Tap',
            'tap .Products .v-list-item': '_on_Products_List_Item_Tap',
            'tap .Accounts .v-list-item': '_on_Accounts_List_Item_Tap',
            'tap .Beneficiaries .v-list-item': '_on_Beneficiaries_List_Item_Tap',
            'tap .Beneficiaries .Btn_Delete': '_on_Beneficiaries_Delete_Item_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Confirm': '_on_Btn_Review_Confirm_Tap',
            'tap .Confirm .Btn_Confirm': '_on_Btn_Confirm_Tap',
            'tap .v-segmented-control-item': '_on_Segmented_Control_Item_Tap',
            'keyup .ReferenceNumber': '_on_Reference_Number_Change',
            'keyup .Amount': '_on_Amount_Change',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;

            this._Categories_Collection = new Backbone.Collection();
            this._Payment_Collection = new Backbone.Collection();
            this._Billers_Collection = new Backbone.Collection();
            this._Smile_Collection = new Backbone.Collection();
            this._Products_Collection = new Backbone.Collection([], {
                comparator: function (a, b) {
                    return b.get('productGroup') + b.get('productName') < a.get('productGroup') + a.get('productName') ? 1 : b.get('productGroup') + b.get('productName') > a.get('productGroup') + a.get('productName') ? -1 : 0;
                }
            });

            this._Beneficiaries_Collection = new Backbone.Collection();
            this.listenTo(this._Beneficiaries_Collection, 'add', _.bind(this._get_Beneficiaries, this));

            var beneficiariesStr = localStorage.getItem('airtimeBeneficiaries');
            if (beneficiariesStr) {
                this._Beneficiaries_Collection.reset(JSON.parse(beneficiariesStr));
            }

            this._Data = {};
            this._billerName = '';
            this._productName = '';
            this._BillerOptions = {
                'DSTV': {
                    'placeHolder': 'Card Number',
                    'length': '0'
                },
                'MyTV': {
                    'placeHolder': 'Card Number',
                    'length': '0'
                },
                'Star Times': {
                    'placeHolder': 'Card number',
                    'length': '0'
                },
                'DSTV Box Office': {
                    'placeHolder': 'Smart card number',
                    'length': '0'
                },
                'Consat Subscription': {
                    'placeHolder': 'Smart card number',
                    'length': '0'
                },
                'DAARSAT Communications': {
                    'placeHolder': 'Decoder Number',
                    'length': '0'
                },
                'Infinity TV': {
                    'placeHolder': 'Account Number',
                    'length': '0'
                },
                'Montage CableTV': {
                    'placeHolder': 'Smart card ID',
                    'length': '0'
                },
                'TrendTV': {
                    'placeHolder': 'Smart card number',
                    'length': '0'
                },
                'GoTV': {
                    'placeHolder': 'Decoder Number (ICU)',
                    'length': '0'
                },
                'iRoko Partners': {
                    'placeHolder': 'User ID',
                    'length': '0'
                },
                'Do Media - DoBox': {
                    'placeHolder': 'Account Details',
                    'length': '0'
                },
                'LCC': {
                    'placeHolder': 'Account Number',
                    'length': '0'
                },
                'PHCN': {
                    'placeHolder': 'Meter No',
                    'length': '0'
                },
                'SWIFT': {
                    'placeHolder': 'Customer ID',
                    'length': '0'
                },
                'IPNX': {
                    'placeHolder': 'Customer ID',
                    'length': '0'
                },
                'SMILE': {
                    'placeHolder': 'Account Number',
                    'length': '0'
                },
                'Internet Solutions': {
                    'placeHolder': 'Customer ID',
                    'length': '0'
                },
                'Spectranet': {
                    'placeHolder': 'Account ID/User ID',
                    'length': '0'
                },
                'Konga.com': {
                    'placeHolder': 'Konga email address',
                    'type': 'mail',
                    'length': '0'
                },
                'DealDey': {
                    'placeHolder': 'Dealdey email address',
                    'type': 'mail',
                    'length': '0'
                },
                'MTN': {
                    'placeHolder': 'Mobile Number',
                    'length': '13'
                },
                'Etisalat': {
                    'placeHolder': 'Mobile Number',
                    'length': '13'
                },
                'Airtel': {
                    'placeHolder': 'Mobile Number',
                    'length': '13'
                },
                'Glo': {
                    'placeHolder': 'Mobile Number',
                    'length': '13'
                },
                'Starcomms': {
                    'placeHolder': 'Mobile Number',
                    'length': '13'
                },
                'Visafone': {
                    'placeHolder': 'Mobile Number',
                    'length': '13'
                },
                'Multilinks': {
                    'placeHolder': 'Mobile Number',
                    'length': '13'
                },
                'ACTV': {
                    'placeHolder': 'Device Serial Number',
                    'length': '0'
                }
            };
            this._DirectInput = false;
            this._Current_Biller = '';
            this._customerId = '';
            this._productCode = '';
            this._productDSTVCodeFlag = false;
            this._productIPNXCodeFlag = false;
            this._beneficiaryFlag = false;

            Bills_View.__super__.initialize.apply(this, [config]);

            this._Content_Loader.show();

            $('input').val('');

            this._Start_Up_Requests = 0;

            this.billersArr = [];
            this.billersObj = {};
            this.billerNumber = 0;
            this.billers = 0;

            //            this._Saved = false;

            this._on_get_MBPPVersion_Success();

        },

        _on_Get_Special_Success: function (data) {
            this._Start_Up_Requests++;

            if (this._Start_Up_Requests === 2) {
                this._Content_Loader.fadeOut();
            }
            localStorage.setItem('DBSpecialBiller', data.billerCodes);
            this._Special_Codes = localStorage.getItem('DBSpecialBiller');
        },

        _on_Get_Special_Error: function () {
            this._Start_Up_Requests++;

            if (this._Start_Up_Requests === 2) {
                this._Content_Loader.fadeOut();
            }

            this._Special_Codes = [];

        },

        _render: function () {
            Bills_View.__super__._render.apply(this);

            this._currentViewIndex = 0;
            this._Screens = this.$el.find('.v-screen');
            this._SubScreens = this.$el.find('.v-sub-screen');

            this._Btn_Add = this.$el.find('.Add_Beneficiary');
            this._Btn_Back = this.$el.find('.Btn_Back_Custom');
            this._Btn_Menu = this.$el.find('.Btn_Menu');

            this._Btn_Back.hide();
            this._Btn_Menu.show();

            this._Content_Loader = this.$el.find('.v-loader.v-content-loader');
            this._Page_Loader = this.$el.find('.v-loader.v-page-loader');

            this._Phone_Number = this.$el.find('.Phone .Phone_Number');
            this._Review = this.$el.find('.Review');
            this._Confirm = this.$el.find('.Confirm');

            this._Carousel = new Base_Carousel_View({
                $el: this._Page.find('.v-screen-carousel'),
                paneWidth: parseInt(this._Width / 2)
            });
            this._Page_Switcher = new Base_Switcher_View({
                parentNode: this.$el.find('.Save_Beneficiary-switcher')
            });
            this.listenTo(this._Carousel, 'PaneChange', _.bind(this._change_Screen, this));
            this.listenTo(this._Page_Switcher, 'Change', _.bind(this._Save_Beneficiary_Change_Requested, this));

            this._render_Accounts();
            this._get_Beneficiaries();
        },

        _change_Screen: function (el) {
            this._currentViewIndex = $(el).data('index');

            if ($(el).data('index') == 5) {
                this._on_Reference_Number_Change();
                this.lookup();
            }

            if ($(el).data('index') == 6 && (!this._Amount || this._Amount == '')) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter an amount.'
                }));
                this._Carousel.set_Active_Pane(5, true);
                return;
            }

            if (!this._Data.category) {
                this._Carousel.set_Active_Pane(0, true);
                return;
            }

            if (!this._Data.biller && $(el).data('index') > 1) {

                this._Carousel.set_Active_Pane(1, true);
                return;
            }


            if (!this._Data.product && $(el).data('index') > 2) {

                this._Carousel.set_Active_Pane(2, true);
                return;
            }

            if (!this._Data.account && $(el).data('index') > 3) {

                this._Carousel.set_Active_Pane(3, true);
                return;
            }

            if (!this._Data.beneficiary && $(el).data('index') > 4) {
                this._Carousel.set_Active_Pane(4, true);
                return;
            }

            if ($(el).data('screen') === 'Beneficiaries') {
                this._Btn_Add.removeClass('v-invisible');
            } else {
                this._Btn_Add.addClass('v-invisible');
            }
            if ($(el).data('screen') === 'Categories') {
                this._Btn_Back.hide();
                this._Btn_Menu.show();
            } else {
                this._Btn_Back.show();
                this._Btn_Menu.hide();
            }

            this.blur_Inputs();

            this._invisible();
            this._Screens.fadeOut();
            this._Screens.filter('.' + $(el).data('screen')).fadeIn();

            setTimeout(_.bind(this._invisible, this), 400);
        },

        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },


        lookup: function () {

            this._Content_Loader.show();
            $.ajax({
                type: 'GET',
                url: AppData.Service.billNameLookup,
                data: {
                    productCode: this._productCode,
                    customerId: this._customerId
                },
                success: _.bind(this._on_lookup_Success, this),
                error: _.bind(this._on_lookup_Error, this)
            });

        },

        _on_lookup_Success: function (data) {
            this._Content_Loader.hide();
            if (!data.lookupStatus) {
                this.$el.find('.name').hide();
            } else {
                this.$el.find('.name').show();
                this.$el.find('.customerName').html(data.customerFullName);
            }
        },

        _on_lookup_Error: function (data) {
            Log.write('Error = ');
            Log.write(JSON.stringify(data));

        },

        _on_Reference_Number_Change: function () {
            this._DirectInput = this.$el.find('.ReferenceNumber').val().trim().split(' ').join('').replace('+', '');
            if (this._DirectInput) {
                this._customerId = this.$el.find('.ReferenceNumber').val().trim().split(' ').join('').replace('+', '');

                this._Data.beneficiary = this._DirectInput;

                this._Review.find('.Beneficiary').html('<li class="v-list-item"><span class="v-list-item-el">' + this._DirectInput + '</span><span class="v-list-item-el" style="display: none;"></span></li>');
                this._Confirm.find('.Beneficiary').html('<li class="v-list-item"><span class="v-list-item-el">' + this._DirectInput + '</span><span class="v-list-item-el" style="display: none;"></span></li>');
            }
        },

        _render_Categories: function () {
            var domStr = '';

            for (var i = 0; i < this._Categories_Collection.models.length; i++) {
                domStr = domStr + this.category_Template({
                    model: this._Categories_Collection.models[i]
                });
            }
            domStr = domStr + '<li class="v-list-item" id="bill_history"><span class="v-list-item-el-icon-bg"><span class="v-icon-bg"><span class="fa fa-clock-o"></span></span></span><span class="v-list-item-el">History</span><span class="v-list-item-el v-list-item-arrow fa fa-chevron-right"></span></li>';

            this._Screens.filter('.Categories').find('.v-list').html(domStr);


        },

        _render_Billers: function (billersCollection) {
            var domStr = '';

            for (var i = 0; i < billersCollection.models.length; i++) {
                domStr = domStr + this.biller_Template({
                    model: billersCollection.models[i]
                });

            }

            this._Screens.filter('.Billers').find('.v-list').html(domStr);
        },

        _render_Products: function (productsCollection) {
            //            this._Products_Collection.sort();
            var domStr = '';

            for (var i = 0; i < productsCollection.models.length; i++) {
                domStr = domStr + this.product_Template({
                    model: productsCollection.models[i]
                });
            }

            this._Screens.filter('.Products').find('.v-list').html(domStr);
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

            this._Screens.filter('.Accounts').find('.v-list').html(domStr);
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
                            beneficiaryAccountCurrency :'',
                            modelId: model.get('id')
                        };

                        domStr = domStr + this.beneficiary_Item_Template(data);
                    }
                }

                this._Screens.filter('.Beneficiaries').find('.v-list').html(domStr);

            } else {
                this._Screens.filter('.Beneficiaries').find('.v-list').html('');
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

        _render_Beneficiaries: function () {
            if (this._Beneficiaries_Collection.models.length > 0) {
                var domStr = '';
                for (var i = 0; i < this._Beneficiaries_Collection.models.length; i++) {
                    var model = this._Beneficiaries_Collection.models[i];

                    if (model.get('billerCode') == this._Current_Biller) {

                        var data = {
                            beneficiaryName: model.get('beneficiaryName'),
                            beneficiaryAccountNumber: model.get('beneficiaryReferenceNumber'),
                            beneficiaryAccountCurrency :'',
                            modelId: model.get('id')
                        };

                        domStr = domStr + this.beneficiary_Item_Template(data);
                    }
                }

                this._Screens.filter('.Beneficiaries').find('.v-list').html(domStr);
            } else {
                this._Screens.filter('.Beneficiaries').find('.v-list').html('');
            }
        },

        _on_Get_Beneficiary_Error: function (data) {
            Log.write("Error");
            Log.write(data);
        },

        update_Beneficiaries: function () {
            this._get_Beneficiaries_proxy();
        },

        update_Accounts: function () {
            this._render_Accounts();
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

        _on_get_MBPPVersion_Success: function () {
            var mbppVersion = localStorage.getItem('MBPPVersion') || null,
                data = JSON.parse(localStorage.getItem('MBPPCategories'));

            if (mbppVersion != localStorage.getItem('MBPPVersionCheck') || !data || data.length == 0) {
                localStorage.setItem('MBPPVersion', localStorage.getItem('MBPPVersionCheck'));
                this._Content_Loader.fadeIn();
                $.ajax({
                    type: 'GET',
                    url: AppData.Service.getMBPPBillerCategory,
                    success: _.bind(this._on_Get_Categories_Success, this),
                    error: _.bind(this._on_Get_Categories_Error, this)
                });

                $.ajax({
                    type: 'GET',
                    url: AppData.Service.getSpecialBillerCodes,
                    success: _.bind(this._on_Get_Special_Success, this),
                    error: _.bind(this._on_Get_Special_Error, this)
                });
            } else {
                this._Special_Codes = localStorage.getItem('DBSpecialBiller');
                this._Content_Loader.hide();
                this._Start_Up_Requests++;
                this._load_Categories();
            }
        },

        _on_Get_Categories_Success: function (data) {
            this._Start_Up_Requests++;

            if (this._Start_Up_Requests === 2) {
                this._Content_Loader.fadeOut();
            }

            if (data.responseCode == 0) {
                var mbppString = JSON.parse(data.mbppString);

                localStorage.removeItem('billerCategories');
                localStorage.removeItem('MBPPCategories');
                this._Categories_Collection.reset(mbppString.categoryList.category);
                this._save_Categories();

                this._render_Categories();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Get_Categories_Error: function () {
            this._Start_Up_Requests++;

            if (this._Start_Up_Requests === 2) {
                this._Content_Loader.fadeOut();
            }
        },

        _on_Categories_List_Item_Tap: function (event) {
            var billerCode = $(event.currentTarget);
            var listId = billerCode.attr('id');

            if (listId === 'bill_history') {

                if (!this['_Bill_History_View']) {
                    this._Bill_History_View = new Bill_History_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection
                    });
                }
                var view = this._Bill_History_View;
                this.trigger('View_Change_Requested', view);

                return false;
            }

            var categoryModel = this._Categories_Collection.get($(event.currentTarget).data('model-id'));
            var categoryId = categoryModel.get('categoryId');
            this.$el.find('.Bill_Payment_Fee').hide();
            this.$el.find('.chargeBiller').show();
            this.$el.find('#refNumber').attr('type', 'text');
            if (categoryId == 2) {
                this.$el.find('.Bill_Payment_Fee').hide();
                this.$el.find('.chargeBiller').hide();
            }

            this.scrollTop();

            this._Data = {
                category: categoryModel
            };

            if (!categoryModel.get('billers')) {
                this._Content_Loader.fadeIn();
                $.ajax({
                    type: 'GET',
                    url: AppData.Service.getMBPPBillers,
                    data: {
                        requestParam: JSON.stringify({
                            categoryId: categoryId
                        })
                    },
                    success: _.bind(this._on_Get_Billers_Success, this, categoryModel),
                    error: _.bind(this._on_Get_Billers_Error, this)
                });
            } else {
                this._render_Billers(categoryModel.get('billers'));

            }

            this._Carousel.next();
        },

        _on_Get_Billers_Success: function (categoryModel, data) {
            this.scrollTop();
            var categoryId = categoryModel.get('categoryId');
            var mbppString = JSON.parse(data.mbppString);

            var categoryName = JSON.stringify(categoryModel);

            if (mbppString.success) {
                if (mbppString.billerList.category[0] == undefined) {
                    this._Content_Loader.fadeOut();
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'No biller available.'
                    }));
                    return false;
                }
                var billerCode = mbppString.billerList.category[0].biller.billerCode;

                if (this._is_Special(billerCode)) {
                    this.billerNumber = mbppString.billerList.category.length;

                    for (var i = 0; i < mbppString.billerList.category.length; i++) {

                        if (mbppString.success) {
                            var billerCode = mbppString.billerList.category[i].biller.billerCode;

                            $.ajax({
                                type: 'GET',
                                url: AppData.Service.getMBPPbillerproducts,
                                data: {
                                    billerCode: billerCode
                                },
                                success: _.bind(this._on_Get_Products_Special_Success, this, categoryModel, null, billerCode),
                                error: _.bind(this._on_Get_Products_Error, this)
                            });
                        } else {
                            this._Content_Loader.fadeOut();
                            this._render_Billers(new Backbone.Collection());
                        }

                    }
                } else {
                    this._Content_Loader.fadeOut();

                    var billersArr = [];
                    for (var i = 0; i < mbppString.billerList.category.length; i++) {
                        billersArr.push(mbppString.billerList.category[i].biller);
                    }

                    categoryModel.set('billers', new Backbone.Collection(billersArr));
                    this._render_Billers(categoryModel.get('billers'));
                    this._save_Categories();
                }

            } else {
                this._Content_Loader.fadeOut();
                this._render_Billers(new Backbone.Collection());
            }

        },

        _on_Get_Billers_Error: function () {
            this._Content_Loader.fadeOut();
            this._render_Billers(new Backbone.Collection());
        },

        _on_Billers_List_Item_Tap: function (event) {
            var billerCode = $(event.currentTarget).data('biller-code');
            this._Current_Biller = $(event.currentTarget).data('biller-code');
            this._billerName = this._Data.category.get('billers').get($(event.currentTarget).data('model-id')).attributes.billerName;
            
            this._billerCharge = this._Data.category.get('billers').get($(event.currentTarget).data('model-id')).attributes.billerCharge;

            if (this._billerName.toUpperCase() == 'SMILE') {
                if (!this['_Smile_View']) {
                    this._Smile_View = new Smile_View({
                        width: this._Width,
                        currentBiller: this._Current_Biller,
                        billerCharge: this._billerCharge, 
                        accounts_Collection: this._Accounts_Collection
                    });
                }
                var view = this._Smile_View;
                view.clear();
                this.trigger('View_Change_Requested', view);

            } else if (this._billerName.toUpperCase() == 'FUEL VOUCHER') {
                if (!this['_Fuel_Voucher_View']) {
                    this._Fuel_Voucher_View = new Fuel_Voucher_View({
                        width: this._Width,
                        billerCharge: this._billerCharge, 
                        accounts_Collection: this._Accounts_Collection
                    });
                }
                var view = this._Fuel_Voucher_View;
                view.clear();
                this.trigger('View_Change_Requested', view);
            } else {

                if (this._billerName == 'DSTV') {
                    this._productDSTVCodeFlag = true;
                } else if (this._billerName == 'IPNX') {
                    this._productIPNXCodeFlag = true;
                } else {
                    this._productDSTVCodeFlag = false;
                    this._productIPNXCodeFlag = false;
                }

                if (this._billerName != 'DSTV' && this._billerName != 'PHCN' && this._billerName != 'LCC' && this._billerName != 'IPNX') {
                    this.$el.find('.name').hide();
                } else {
                    this.$el.find('.name').show();
                }
                if (this._BillerOptions[this._billerName] == undefined) {
                    this.$el.find('#refNumber').attr('placeholder', 'Reference Number');
                } else {
                    this.$el.find('#refNumber').attr('placeholder', this._BillerOptions[this._billerName].placeHolder);
                    this.$el.find('#refNumber').attr('type', this._BillerOptions[this._billerName].type || 'tel');
                    if (this._BillerOptions[this._billerName].length != 0) {
                        this.$el.find('#refNumber').attr('maxLength', this._BillerOptions[this._billerName].length);
                    }
                }


                this._Data = {
                    category: this._Data.category,
                    biller: this._Data.category.get('billers').get($(event.currentTarget).data('model-id'))
                };

                if (!this._Data.biller.get('products')) {
                    this._Content_Loader.fadeIn();

                    $.ajax({
                        type: 'GET',
                        url: AppData.Service.getMBPPbillerproducts,
                        data: {
                            billerCode: billerCode
                        },
                        success: _.bind(this._on_Get_Products_Success, this, this._Data.category, this._Data.biller, billerCode),
                        error: _.bind(this._on_Get_Products_Error, this)
                    });

                } else {
                    this._render_Products(this._Data.biller.get('products'));
                }

                this._Review.find('.To_Biller').html(this.biller_Template({
                    model: this._Data.biller
                }));

                this._Review.find('.To_Biller .v-list-item-el:last-child').hide();

                this._Confirm.find('.To_Biller').html(this.biller_Template({
                    model: this._Data.biller
                }));

                this._Confirm.find('.To_Biller .v-list-item-el:last-child').hide();

                this._render_Beneficiaries();

                this._Carousel.next();
            }
        },

        _on_Get_Products_Success: function (categoryModel, billerModel, billerCode, data) {
            this._Content_Loader.fadeOut();

            var mbppString = JSON.parse(data.mbppString);

            if (mbppString.success) {

                if (this._is_Special(billerCode)) {

                    var billersArr = [];
                    var billersObj = {};

                    for (var i = 0; i < mbppString.productList.product.length; i++) {
                        if (!billersObj[mbppString.productList.product[i].productGroup]) {
                            billersObj[mbppString.productList.product[i].productGroup] = [];
                        }
                        billersObj[mbppString.productList.product[i].productGroup].push(mbppString.productList.product[i]);
                    }

                    for (var property in billersObj) {
                        if (billersObj.hasOwnProperty(property)) {
                            billersArr.push({
                                billerName: property,
                                billerCode: billerCode,
                                products: new Backbone.Collection(billersObj[property])
                            });
                        }
                    }

                    categoryModel.set('billers', new Backbone.Collection(billersArr));
                    this._save_Categories();
                    this._render_Billers(categoryModel.get('billers'));
                } else {
                    billerModel.set('products', new Backbone.Collection(mbppString.productList.product));
                    this._save_Categories();
                    this._render_Products(billerModel.get('products'));
                }
            } else {
                this._render_Products(new Backbone.Collection());
            }
        },

        _on_Get_Products_Special_Success: function (categoryModel, billerModel, billerCode, data) {
            this._Content_Loader.fadeOut();

            var mbppString = JSON.parse(data.mbppString);

            if (mbppString.success) {
                this.billers++;

                //var billersArr = [];
                var billersObj = {};

                for (var i = 0; i < mbppString.productList.product.length; i++) {
                    if (!billersObj[mbppString.productList.product[i].productGroup]) {
                        billersObj[mbppString.productList.product[i].productGroup] = [];
                    }
                    billersObj[mbppString.productList.product[i].productGroup].push(mbppString.productList.product[i]);
                }

                for (var property in billersObj) {
                    if (billersObj.hasOwnProperty(property)) {
                        this.billersArr.push({
                            billerName: property,
                            billerCode: billerCode,
                            products: new Backbone.Collection(billersObj[property])
                        });
                    }
                }

                categoryModel.set('billers', new Backbone.Collection(this.billersArr));
                this._save_Categories();

                if (this.billerNumber == this.billers) {
                    this._render_Billers(categoryModel.get('billers'));
                }
            } else {
                this._render_Products(new Backbone.Collection());
            }
        },

        _on_Get_Products_Error: function () {
            this._render_Products(new Backbone.Collection());
            this._Content_Loader.fadeOut();
        },

        _on_Products_List_Item_Tap: function (event) {
            this._Data.product = this._Data.biller.get('products').get($(event.currentTarget).data('model-id'));
            this._productName = this._Data.product.get('productName');
            
            if (this._productDSTVCodeFlag) {
                this._productCode = 'PR00030';
            } else if (this._productIPNXCodeFlag) {
                this._productCode = 'PR00060';
            } else {
                this._productCode = this._Data.product.get('productCode');
            }

            this._Review.find('.To_Product').html(this.product_Template({
                model: this._Data.product
            }));
            this._Review.find('.To_Product .v-list-item-el:last-child').hide();
            this._Confirm.find('.To_Product').html(this.product_Template({
                model: this._Data.product
            }));
            this._Confirm.find('.To_Product .v-list-item-el:last-child').hide();

            this._Review.find('.FixedAmount').hide();
            this._Review.find('.Amount').show();
            this._Review.find('.Amount').val(core.formatBalance(this._Data.product.get('minAmount'), 0, '.', ','));
            this._Review.find('.Amount')[0].disabled = false;
            this._Confirm.find('.FixedAmount').hide();
            this._Confirm.find('.Amount').show();
            this._Confirm.find('.Amount').val(core.formatBalance(this._Data.product.get('minAmount'), 0, '.', ','));
            
            this._Review.find('.BillerCharge').val(this._Data.biller.get('billerCharge'));
            this._Confirm.find('.BillerCharge').val(this._Data.biller.get('billerCharge'));
            this._Amount = this._Data.product.get('minAmount');
            if ((this._Data.category.get('categoryId') == 2 || this._Data.category.get('categoryId') == 1005) && this._Data.product.get('minAmount') != this._Data.product.get('maxAmount')) {
                this._Review.find('.Amount').val('');
                this._Confirm.find('.Amount').val('');
                this._Amount = '';
            }

            //            }

            this._Carousel.next();
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

            this._Carousel.next();
        },

        _on_Beneficiaries_List_Item_Tap: function (event) {
            this._Data.beneficiary = this._Beneficiaries_Collection.get($(event.currentTarget).data('model-id'));

            this._DirectInput = false;
            this.$el.find('.ReferenceNumber').val('');
            this._customerId = this._Data.beneficiary.get('beneficiaryReferenceNumber');

            var data = {
                beneficiaryName: this._Data.beneficiary.get('beneficiaryName'),
                beneficiaryAccountNumber: this._Data.beneficiary.get('beneficiaryReferenceNumber'),
                beneficiaryAccountCurrency :'',
                modelId: this._Data.beneficiary.id
            };

            this._Review.find('.Beneficiary').html(this.beneficiary_Item_Template(data));
            this._Review.find('.Beneficiary .v-list-item-el:last-child').hide();
            this._Review.find('.Beneficiary .v-list-item-el:first-child').hide();
            this._Confirm.find('.Beneficiary').html(this.beneficiary_Item_Template(data));
            this._Confirm.find('.Beneficiary .v-list-item-el:last-child').hide();
            this._Confirm.find('.Beneficiary .v-list-item-el:first-child').hide();

            this._Carousel.next();
        },

        _on_Beneficiaries_Delete_Item_Tap: function (event) {
            event.stopPropagation();

            var beneficiary_Model = this._Beneficiaries_Collection.get($(event.currentTarget).parent().data('model-id'));

            if (!window.device) {
                var con = confirm("Do you really want to delete this beneficiary? ");
                if (con) {

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
            if (data.responseCode === 0) {
                this.update_Beneficiaries();
                this._Content_Loader.fadeOut();
            } else {
                this._Content_Loader.fadeOut();
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

        _on_Btn_Continue_Tap: function () {
            this.blur_Inputs();
            this._beneficiaryFlag = false;
            var alias = this.$el.find('.ReferenceAlias').val();

            if (this._DirectInput === '' || !this._DirectInput) {
                this._DirectInput = this.$el.find('.ReferenceNumber').val();
            }

            if (this._currentViewIndex === 4 && this._Save_Beneficiary_Bool) {

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

                this._Carousel.next();
            }
        },

        _on_createBeneficiary_Success: function (data) {
            this.update_Beneficiaries();
            if (!data.responseCode === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }

            setTimeout(_.bind(function () {
                this.clearInputs();
            }, this), 400);

            this._Carousel.next();
        },

        _on_createBeneficiary_Error: function (data) {
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));

            setTimeout(_.bind(function () {
                this.clearInputs();
            }, this), 400);

            this._Carousel.next();
        },

        _on_Amount_Change: function () {
            //this._Amount = this._Review.find('.Amount').val().replace(/,/g, '').trim();
            this._Amount = this.$el.find('.Amount').val().replace(/\,/g, '').trim();
            this.$el.find('.Amount').val(core.formatBalance(this.$el.find('.Amount').val().replace(/\,/g, ''), 0, '.', ','));
        },


        _on_Btn_Review_Confirm_Tap: function () {
            this.blur_Inputs();
            if (!this._Amount || this._Amount == '') {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter an amount.'
                }));
                this._Carousel.set_Active_Pane(5, true);
                return;
            }

            if (!this.$el.find('.Review .PIN').val().trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            //this._Page_Loader.fadeIn();
            this._Carousel.next();

        },

        _on_Btn_Confirm_Tap: function () {
            this.blur_Inputs();
            this._Content_Loader.fadeIn();
            var reqData = {
                sessionId: AppData.Session_Id,
                sourceAccount: this._Data.account.get('accountNumber'),
                billerCode: this._Data.biller.get('billerCode'),
                billerName: this._billerName,
                productCode: this._Data.product.get('productCode'),
                amount: parseInt(this._Amount),
                pin: this.$el.find('.Review .PIN').val().trim(),
                remarks: '',
                tranTime: new Date().getTime().toString(),
                requestParam: JSON.stringify({
                    destMsisdn: this._customerId.trim().split(' ').join('').replace('+', ''),
                    amount: parseFloat(this._Amount)
                })
            };

            $.ajax({
                type: 'POST',
                url: AppData.Service.payBill,
                data: reqData,
                success: _.bind(this._on_Payment_Success, this),
                error: _.bind(this._on_Payment_Error, this)
            });

        },

        _on_Payment_Success: function (data) {
            this._Content_Loader.fadeOut();
            this.$el.find('.Review .PIN').val('');
            if (parseInt(data.responseCode) === 0) {

                var paymentData = JSON.parse(localStorage.getItem('BillPayments'));
                this._Payment_Collection.reset(paymentData);

                var payment = {
                    date: new Date().format(),
                    text: this._billerName + ': ' + this._productName + '(' + this._customerId.trim().split(' ').join('').replace('+', '') + ') - ' + data.statusMessage

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
                    sum: parseFloat(this._Amount),
                    segmentation: {
                        Status: 'Success',
                        Biller: this._billerName,
                        Product: this._productName
                    }
                }]);

                Countly.event([{
                    key: 'iap',
                    count: 1,
                    sum: parseFloat(this._Amount),
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
                    key: 'Bill Payment',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Status: 'Failure',
                        FailMessage: data.statusMessage,
                        Biller: this._billerName,
                        Product: this._productName
                    }
                }]);
            }
        },

        _on_Payment_Error: function (data) {
            this._Page_Loader.fadeOut();
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No internet/data service detected. Please contact your network provider for further information.'
            }));
            this.trigger('Close_with_Error', {});
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
            this._Carousel.set_Active_Pane(0, false);

            this._Data = {};
            this._currentViewIndex = 0;
            this._DirectInput = false;

            this._Page_Switcher.set_Position(0, true);
            this.$el.find('.Save_Beneficiary_Switcher_View .v-switcher').css("background", "#848484");
            this._Save_Beneficiary_Bool = false;
            this.$el.find('.Save_Beneficiary_Wrapper').hide();

            this._Review.find('input').val('');
            this._Confirm.find('input').val('');
            this.$el.find('.Confirm .PIN').val('');

            this.scrollTop();

            this._Page_Loader.hide();
        },

        _is_Special: function (billerCode) {
            var ret = false;
            $.each(this._Special_Codes.split(','), function (i, code) {
                if (code == billerCode) {
                    ret = true;
                }
            });
            return ret;
        },

        _load_Categories: function () {
            var data = JSON.parse(localStorage.getItem('MBPPCategories'));
            this._Categories_Collection.reset(data);

            for (var i = 0; i < this._Categories_Collection.models.length; i++) {
                if (this._Categories_Collection.models[i].get('billers')) {
                    this._Categories_Collection.models[i].set('billers', new Backbone.Collection(this._Categories_Collection.models[i].get('billers')));
                    for (var k = 0; k < this._Categories_Collection.models[i].get('billers').models.length; k++) {
                        if (this._Categories_Collection.models[i].get('billers').models[k].get('products')) {
                            this._Categories_Collection.models[i].get('billers').models[k].set('products', new Backbone.Collection(this._Categories_Collection.models[i].get('billers').models[k].get('products')));
                        }
                    }
                }
            }
            setTimeout(_.bind(this._render_Categories, this), 0);
        },

        _save_Categories: function () {
            var data = this._Categories_Collection.toJSON();
            for (var i = 0; i < data.length; i++) {
                if (data[i].billers) {
                    data[i].billers = data[i].billers.toJSON();
                    for (var k = 0; k < data[i].billers.length; k++) {
                        if (data[i].billers[k].products) {
                            data[i].billers[k].products = data[i].billers[k].products.toJSON();
                        }
                    }
                }
            }

            localStorage.setItem('MBPPCategories', JSON.stringify(data));
        },

        _on_Btn_Bck_Tap: function () {
            this.$el.find('input').blur();
            if (this._currentViewIndex == 6) {
                this._Review.find('.Amount').val('');
                this._Confirm.find('.Amount').val('');
                this._Review.find('.PIN').val('');
                this._Confirm.find('.PIN').val('');
            }
            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._Carousel.prev();
            } else {
                this.trigger('ShowMenu', {});
                this.clear();
            }
        },

        clearInputs: function () {
            $(this.el).find('input').val('');
        }
    });

    return Bills_View;

});