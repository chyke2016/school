define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Cheques/Cheque_Request_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Cheque_Request_View = Base_Page_View.extend({

        id: "Cheque_Request",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap',
            'tap .Accounts .v-list-item': '_on_Accounts_Item_Tap',
            'tap .Leaves .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Confirm .Btn_Continue': '_on_Confirm_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;

            Cheque_Request_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Cheque_Request_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');
            this._confirmScreen = this._Screens.filter('.Confirm');
            this._Loader = this.$el.find('.v-loader');

            this._AccountNo = null;
            this._LeavesNo = null;
            this._CollectionBranch = null;

            this._currentViewIndex = 0;
            this._viewArr = ['Accounts', 'Leaves', 'Confirm'];

            this._show_Accounts();
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

        //Display Accounts avaliable
        _show_Accounts: function () {

            if (!this._Accounts_Collection.models.length) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'No accounts avaliable.'
                }));
                return;
            }

            var domStr = '',
                i = 0;

            for (i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];
                domStr = domStr + this.account_Item_Template({
                    account: model.get('accountNumber'),
                    accounttype: model.get('accountType'),
                    availablebalance: model.get('availableBalance'),
                    currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                    modelId: i
                });
            }

            this._Screens.filter('.Accounts').find('.v-list').html(domStr);
        },

        //Save From Account Number & Display Amount Screen
        _on_Accounts_Item_Tap: function (event) {
            this._Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];
            this._AccountNo = this._Account_Model.get('accountNumber');

            this._Screens.filter('.Confirm').find('.Account').html(this.account_Item_Template({
                account: this._Account_Model.get('accountNumber'),
                accounttype: this._Account_Model.get('accountType'),
                availablebalance: this._Account_Model.get('availableBalance'),
                currencyAlias: curCode.formatCurrencyCode(this._Account_Model.get('currencyCode')),
                modelId: this._Account_Model.get('modelId')
            }));

            this._Screens.filter('.Leaves').find('.LeavesList option:first-child').attr('selected', 'selected');

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Save the Leaves & Display Confirm Screen
        _on_Btn_Continue_Tap: function () {
            this._LeavesNo = this._Screens.filter('.Leaves').find('.LeavesList').val().trim();
            this._CollectionBranch = this._Screens.filter('.Leaves').find('.CollectionBranch_Val').val().trim();
            this._PIN = this._Screens.filter('.Leaves').find('.PIN').val().trim();

            if (this._LeavesNo === "" || this._CollectionBranch === "" || this._PIN === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
                return;
            }

            this._confirmScreen.find('.Leaves_Val').val(this._LeavesNo);
            this._confirmScreen.find('.CollectionBranch_Val').val(this._CollectionBranch);

            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Finally call the API
        _on_Confirm_Tap: function () {

            var reqData = {
                accountNo: this._AccountNo,
                noOfLeaves: this._LeavesNo,
                collectionBranch: this._CollectionBranch,
                pin: this._PIN,
                sessionId: AppData.Session_Id
            };

            this._Loader.fadeIn();

            $.ajax({
                type: 'POST',
                url: AppData.Service.chequeBookRequest,
                data: reqData,
                success: _.bind(this._on_chequeBookRequest_Success, this),
                error: _.bind(this._on_chequeBookRequest_Error, this)
            });
        },

        _on_chequeBookRequest_Success: function (data) {
            this._Loader.fadeOut();
            
            if (parseInt(data.responseCode) === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Request submitted successfully.'
                }));
                AppData.Get_Error = true;
                this.trigger('Cheque_Success');
                this._clear();

                Countly.event([{
                    key: 'Cheques',
                    count: 1,
                    segmentation: {
                        Type: 'Book Request',
                        Status: 'Success'
                    }
                }]);

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'Cheques',
                    count: 1,
                    segmentation: {
                        Type: 'Book Request',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_chequeBookRequest_Error: function (data) {
            this._Loader.fadeOut();

            Countly.event([{
                key: 'Cheques',
                count: 1,
                segmentation: {
                    Type: 'Book Request',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        _on_Btn_Bck_Tap: function () {

            this.$el.find('input').blur();
            this._Screens.filter('.Leaves').find('.PIN').val('');
            
            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
                this._clear();
            }
        },

        _clear: function () {
            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this.$el.find('input').val("");
            this._AccountNo = null;
            this._LeavesNo = null;
            this._CollectionBranch = null;

            this.scrollTop();
            this._Loader.hide();
        }
    });

    return Cheque_Request_View;

});