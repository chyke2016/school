/*global $, define, document, _ , window , setTimeout , Backbone */
define(function (require) {

    'use strict';

    var Base_Navigation_View = require('base/js/Base_Navigation_View'),

        Menu_View = require('js/views/Menu_View'),
        Sign_In_View = require('js/views/Sign_In_View'),
        Register_Terms_View = require('js/views/Register/Register_Terms_View'),
        //Register_View = require('js/views/Register/Register_View'),
        Accounts_View = require('js/views/Accounts/Accounts_View'),
        Transfer_View = require('js/views/Transfer/Transfer_View'),
        Life_View = require('js/views/Life/Life_View'),
        Bills_View = require('js/views/Bills/Bills_View'),
        Cheques_View = require('js/views/Cheques/Cheques_View'),
        Profile_View = require('js/views/Profile/Profile_View'),

        Timeout = require('plugins/timeout'),
        core = require('plugins/core'),

        AppData = require('js/appData'),

        expired_Template = require('text!html/Expired_View.html');

    var App_Navigation_View = Base_Navigation_View.extend({

        expired_Template: _.template(expired_Template),

        events: {
            'tap .Btn_Menu': '_on_Btn_Menu_Tap',
            'tap .Btn_Back': '_on_Btn_Back_Tap',
            'tap': '_on_Tap'
        },

        _on_Tap: function () {
            Timeout.update();
        },

        initialize: function (config) {
            App_Navigation_View.__super__.initialize.apply(this, [config]);

            document.addEventListener('Timeout', _.bind(this._on_Sign_Out, this), false);

            window.app = this; // temp            

            this._render();

            this._View_Instances_Ids = [];

            if (new Date() > new Date('01/01/2050') && mobile) {
                this._expired();
                return;
            }

            if (mobile && navigator.connection.type !== 'none') {
                core.checkKillSwitch({
                    appid: 1,
                    version: AppData.Version,
                    fail: _.bind(this._expired, this),
                    success: _.bind(this._startApp, this)
                });
            } else {
                this._startApp();
            }
        },

        _startApp: function () {
            if (window.device) {
                var networkState = navigator.connection.type;
                if (networkState == 'none') {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'No internet/data service detected. Please contact your network provider for further information.'
                    }));
                }
            }

            this._Accounts_Collection = new Backbone.Collection();
            this._Accounts_Collection_Nairra = new Backbone.Collection();
            this._Accounts_Collection_WithoutTD = new Backbone.Collection();

            this._Sign_In_View = new Sign_In_View({
                width: this._Width
            });
            this.$el.append(this._Sign_In_View.$el);
            this.listenTo(this._Sign_In_View, 'Signed_In_Banking', _.bind(this._on_Signed_In_Banking, this));
            this.listenTo(this._Sign_In_View, 'View_Change_Requested', _.bind(this._on_View_Change_Requested, this));
            this.switch_View(this._Sign_In_View, false);
        },

        _expired: function () {
            this.$el.append(this.expired_Template());
        },

        _on_Account_Null: function (data) {
            this.switch_View(this._Sign_In_View, true);
            AppData.Session_Id = null;
        },

        _on_Signed_In_Banking: function (data) {
            for (var i = 0; i < this._View_Instances_Ids.length; i++) {
                var view = this['_' + this._View_Instances_Ids[i] + '_View'];
                this.stopListening(view);
                view.remove();
                this['_' + this._View_Instances_Ids[i] + '_View'] = null;
            }
            this._View_Instances_Ids = [];
            if (!this._Accounts_View) {
                this._Accounts_View = new Accounts_View({
                    width: this._Width,
                    accounts_Collection: this._Accounts_Collection,
                    accounts_Collection_Nairra: this._Accounts_Collection_Nairra,
                    accounts_Collection_WithoutTD: this._Accounts_Collection_WithoutTD,
                    error_flag: false
                });
                this.$el.append(this._Accounts_View.$el);
                this._View_Instances_Ids.push('Accounts');
                this.listenTo(this._Accounts_View, 'View_Change_Requested', _.bind(this._on_View_Change_Requested, this));
                this.listenTo(this._Accounts_View, 'Account_Null', _.bind(this._on_Account_Null, this));
            }

            if (!this._Menu_View) {
                this._Menu_View = new Menu_View({
                    width: this._Width
                });

                this.listenTo(this._Menu_View, 'Sign_Out', _.bind(this._on_Sign_Out, this));
                this.listenTo(this._Menu_View, 'List_Item_Tap', _.bind(this._on_Menu_Item_Tap, this));
                this.$el.append(this._Menu_View.$el);
                this._View_Instances_Ids.push('Menu');
            }

            AppData.Customer_Name = data;
            $('#Accounts .uzomaContent').html(data);

            this.$el.find('.Sign_In_Loader').fadeOut();
            this._Accounts_View.fetch_Accounts();
            this._History = [];
            this.switch_View(this._Accounts_View, true);

            setTimeout(_.bind(function () {
                this.set_Prev_TopMost_View(this._Menu_View);
            }, this), 400);
        },

        check_Top_View: function () {
            return this.$el.find('.v-topmost')[0].id;
        },

        _on_Sign_Out: function () {
            this._on_Logout_Success();
            $.ajax({
                type: 'POST',
                url: AppData.Service.logout,
                data: {
                    sessionId: AppData.Session_Id
                },
                success: function () {},
                error: function () {}
            });
        },

        _on_Logout_Success: function (data) {
            if (this.$el.find('.v-topmost')[0].id !== 'Sign_In') {

                this._TopMost_View.Mask.hide();

                AppData.Session_Id = null;
                AppData.Customer_Name = null;
                AppData.Get_Error = false;

                if (this._Accounts_View) {
                    this._Accounts_View.clear();
                }

                if (this._Profile_User_Data_View) {
                    this._Profile_User_Data_View.clear();
                }

                if (this._Menu_View) {
                    this._Menu_View.clear();
                }

                if (window.device && device.platform !== "blackberry10") {
                    $("#Sign_In_Banking-DefaultHeader").show();
                    $("#Sign_In_Banking-SignInView").hide();
                    $("#Sign_In_Banking-Button").addClass('non-active');
                    $(".Sign_In_Save").hide();
                }

                setTimeout(_.bind(function () {
                    // remove views
                    for (var i = 0; i < this._View_Instances_Ids.length; i++) {
                        var view = this['_' + this._View_Instances_Ids[i] + '_View'];
                        this.stopListening(view);
                        view.remove();
                        this['_' + this._View_Instances_Ids[i] + '_View'] = null;
                    }
                    this._View_Instances_Ids = [];
                    this._Prev_TopMost_View = null;

                }, this), 400);

                this._Accounts_Collection.reset();
                this.on_Hide_Trailer_View();

                this.switch_View(this._Sign_In_View, false);

                if (AppData.Store.data && AppData.Store.data.bankingId) {
                    this._Sign_In_View.$el.find('.Sign_In_Save_BankingId').addClass('active');
                    this._Sign_In_View.$el.find('#Sign_In_Banking-inputId').val(AppData.Store.data.bankingId);
                }
            }
        },

        _on_Btn_Menu_Tap: function (event) {
            this._TopMost_View.blur_Inputs();

            if (this._TopMost_View.Left === 0) {
                this._TopMost_View.Mask.show();
                this._TopMost_View.set_Position(this._Menu_Constraint_left2, true);
            } else {
                this._TopMost_View.Mask.hide();
                this._TopMost_View.set_Position(0, true);
            }
        },

        _on_Btn_Back_Tap: function () {
            this.pop();
        },

        _on_Close_with_Error: function () {
            AppData.Get_Error = true;
            this._Accounts_View.fetch_Accounts();
            this._History = [];
            this.switch_View(this._Accounts_View, true);

            setTimeout(_.bind(function () {
                this.set_Prev_TopMost_View(this._Menu_View);
            }, this), 400);
        },

        on_Hide_Trailer_View: function () {
            if (this._Movie_Details_View) {
                this._Movie_Details_View.on_Btn_Back_Tap();
            }
        },

        //if closeFlag = true means dont pop
        _update_Account_Data: function (closeFlag) {
            closeFlag = closeFlag ? false : true;
            if (closeFlag) {
                this.pop();
            }
            if (this._Accounts_View) {
                this._Accounts_View.fetch_Accounts();
            }
        },

        _on_Menu_Item_Tap: function (link) {
            Log.write("link = " + link);

            if (this._TopMost_View === this['_' + link + '_View']) {
                this._TopMost_View.set_Position(0, true);
                setTimeout(_.bind(function () {
                    this._TopMost_View.Mask.hide();
                }, this), 400);
            } else {
                this._History = [];
                var view = this['_' + link + '_View'];

                if (!view) {
                    switch (link) {
                    case 'Transfers':
                        view = new Transfer_View({
                            width: this._Width,
                            accounts_Collection: this._Accounts_Collection_WithoutTD,
                            accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                        });
                        break;
                    case 'Life':
                        view = new Life_View({
                            width: this._Width,
                            accounts_Collection: this._Accounts_Collection_WithoutTD,
                        });
                        break;
                    case 'Bills':
                        view = new Bills_View({
                            width: this._Width,
                            accounts_Collection: this._Accounts_Collection_WithoutTD,
                            accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                        });
                        break;
                    case 'Cheques':
                        view = new Cheques_View({
                            width: this._Width,
                            accounts_Collection: this._Accounts_Collection_WithoutTD,
                            accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                        });
                        break;
                    case 'Find_Us':
                        view = this._Sign_In_View.renderBranches();
                        view.hide_Back_Butn(true);
                        break;
                    case 'Share':
                        view = this._Sign_In_View.renderShare();
                        view.hide_Back_Butn(true);
                        break;
                    case 'Profile':
                        view = new Profile_View({
                            width: this._Width,
                        });
                        break;
                    case 'Notifications':
                        view = this._Sign_In_View.renderNotifications();
                        break;
                    default:
                        return;
                    }
                }

                if (link === 'Notifications') {
                    view.hide_Back_Butn(true);
                }

                if (link === 'Bills') {
                    view.clear();
                    view._Accounts_Collection = this._Accounts_Collection_WithoutTD;
                    view.update_Beneficiaries();
                    view.update_Accounts();
                }
                this.switch_View(view);
            }
        },

        _on_View_Change_Requested: function (view) {
            if (this._TopMost_View !== view) {
                this.switch_View(view, true);
            }
        },

        _on_Trigger_Register_Screen: function () {
            this.pop();
            setTimeout(_.bind(function () {
                this._Sign_In_View.renderRegister();
            }, this), 400);
        },

        _render: function () {
            this.$el.hammer();
        },

        _on_Add_FX_Beneficiary_Success: function (data) {
            if (data) {
                this._FCY_Transfer_View._Continue = false;
                this._FCY_Transfer_View._single_Beneficiary_Collection_FX.reset([data]);
                this._FCY_Transfer_View._on_Beneficiaries_Item_Tap(null, data);
            } else {
                this._FCY_Transfer_View._Continue = true;
            }
            this._FCY_Transfer_View._update();
            this.pop();
        },

        switch_View: function (view, animate) {
            if (!this['_' + view.id + '_View']) {
                this['_' + view.id + '_View'] = view;
                this.$el.append(view.$el);
                this.listenTo(view, 'View_Change_Requested', _.bind(this._on_View_Change_Requested, this));
                this._View_Instances_Ids.push(view.id);

                switch (view.id) {
                case 'Add_Beneficiary_Bills':
                case 'Bill_History':
                case 'Branches':
                case 'Branches_ATM':
                case 'Branches_List':
                case 'Contact_Us':
                case 'Flight_Terms':
                case 'Forgot_Pwd':
                case 'Fuel_Voucher':
                case 'Map':
                case 'Notifications':
                case 'Register_Terms':
                case 'Share':
                case 'Statement':
                case 'Smile':
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    break;
                case 'Card_cc':
                case 'Card_dc':
                case 'Cheque_Confirm':
                case 'Cheque_Request':
                case 'Cheque_Stop':
                case 'Diamond_Money_Transfer':
                case 'FCY_Transfer':
                case 'Flight_Search':
                case 'Transfer_To_Diamond_Bank_Accounts':
                case 'Transfer_To_Other_Bank_Account':
                case 'Transfer_To_Own_Accounts':
                case 'Yello_Diamond_Transfer_Banks':
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    this.listenTo(view, 'Close_with_Error', _.bind(this._on_Close_with_Error, this));
                    break;
                case 'Bills_Success':
                case 'Card_Success':
                case 'Cheque_Success':
                case 'Transfer_Success':
                    this.listenTo(view, 'Close', _.bind(this._on_Success_View_Close, this));
                    break;
                case 'Cheques':
                case 'Transfers':
                    this.listenTo(view, 'Update_Accounts', _.bind(this._update_Account_Data, this));
                    break;
                case 'Flight_Book':
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    this.listenTo(view, 'Success', _.bind(this._on_Success_View_Close, this));
                    this.listenTo(view, 'Update_Accounts', _.bind(this._update_Account_Data, this));
                    this.listenTo(view, 'Close_with_Error', _.bind(this._on_Close_with_Error, this));
                    break;
                case 'Bills':
                    this.listenTo(view, 'ShowMenu', _.bind(this._on_Btn_Menu_Tap, this));
                    this.listenTo(view, 'Update_Accounts', _.bind(this._update_Account_Data, this));
                    this.listenTo(view, 'Close_with_Error', _.bind(this._on_Close_with_Error, this));
                    break;
                case 'Afritickets_Event':
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    this.listenTo(view, 'Close_And_Success', _.bind(this._update_Account_Data, this));
                    this.listenTo(view, 'Close_with_Error', _.bind(this._on_Close_with_Error, this));
                    break;
                case 'Forgot_Banking_ID':
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    this.listenTo(view, 'TriggerRegisterScreen', _.bind(this._on_Trigger_Register_Screen, this));
                    break;
                case 'Ticket_Payment':
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    this.listenTo(view, 'Update_Accounts', _.bind(this._update_Account_Data, this));
                    break;
                case 'Register':
                case 'ReRegister':
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    this.listenTo(view, 'Signed_In_Banking', _.bind(this._on_Signed_In_Banking, this));
                    break;
                case 'Forgot_Pwd_Success':
                    this.listenTo(view, 'Close', _.bind(this._on_Pwd_Success_View_Close, this));
                    break;
                case 'Add_Beneficiary_FX_Transactions':
                    this.listenTo(view, 'Add_Success', _.bind(this._on_Add_FX_Beneficiary_Success, this));
                    this.listenTo(view, 'Close', _.bind(this._on_Btn_Back_Tap, this));
                    break;
                }
            }
            switch (view.id) {
            case 'Bill_History':
            case 'Branches_ATM':
            case 'Branches_List':
            case 'Ticketing':
            case 'FCY_Transfer':
                view._update();
                break
            case 'Movie_Details':
                view._Current_Index = 0;
                view._Showtimes_Array = [];
                view._Carousel = null;
                view._Initialized = false;
                view.trigger('Render_Movie_Details');
                break
            case 'Notifications':
                view._fill_Screen();
                view._update();
                break
            }

            App_Navigation_View.__super__.switch_View.apply(this, [view, animate]);
            setTimeout(_.bind(function () {
                this._TopMost_View.Mask.hide();
            }, this), 400);
        },

        _on_Notification_Update: function () {
            this['_Notifications_View']._update();
        },

        _on_Success_View_Close: function () {
            this._Menu_View.$el.find('.v-list-menu-item').removeClass('active');
            this._Menu_View.$el.find('.v-list-menu-item[data-link="Accounts"]').addClass('active');
            this._History = [];
            this.switch_View(this._Accounts_View, true);
            setTimeout(_.bind(function () {
                this.set_Prev_TopMost_View(this._Menu_View);
            }, this), 400);
        },

        _on_Pwd_Success_View_Close: function () {
            this.switch_View(this._Sign_In_View, false);
        }
    });

    return App_Navigation_View;
});