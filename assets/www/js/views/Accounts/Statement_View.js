define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Accounts/Statement_View.html'),
        account_Item_Template = require('text!html/Accounts_List_Item.html'),

        curCode = require('plugins/currencyCodes'),

        AppData = require('js/appData'),
        core = require('plugins/core');

    var Statement_View = Base_Page_View.extend({

        id: "Statement",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),

        events: {
            'tap .Account .v-list-item': '_on_Account_Item_Tap',
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap',
            'tap .Btn_Statement': '_on_Btn_Request_Statement_Tap'
        },

        initialize: function (config) {

            this._Accounts_Collection = config.accounts;

            Statement_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Statement_View.__super__._render.apply(this);

            this._Page.html(this.template());
            this.Mask = this.$el.find('.v-page-mask');
            this._Loader = this.$el.find('.Statement_Request-loader');

            this._currentViewIndex = 0;
            this._viewArr = ['Account', 'Range'];

            this._render_Accounts();
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

        _render_Accounts: function () {
            if (!this._Accounts_Collection.models.length) {
                return;
            }

            var domStr = '';
            for (var i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];
                domStr = domStr + this.account_Item_Template({
                    account: model.get('accountNumber'),
                    accounttype: model.get('accountType'),
                    availablebalance: model.get('availableBalance'),
                    currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                    modelId: i
                });
            }

            this.$el.find('.Account .v-list').html(domStr);
        },

        _on_Account_Item_Tap: function (event) {

            this._Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            var currencyAlias = curCode.formatCurrencyCode(this._Account_Model.get('currencyCode'));
        },

        _on_Btn_Request_Statement_Tap: function () {
            this.$el.find('input').blur();

            var startDate = new Date(this.$el.find('.Start_Input').val()),
                endDate = new Date(this.$el.find('.End_Input').val());

            if (startDate > endDate) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Your end date cannot be greater than your start date.'
                }));
                return;
            }
            
            if (endDate > new Date()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Your end date cannot be greater than the current date.'
                }));
                return;
            }

            var data = {
                accountNumber: this._Account_Model.get('accountNumber'),
                startDate: startDate.format('dd/mm/yyyy'),
                endDate: endDate.format('dd/mm/yyyy'),
                sessionId: AppData.Session_Id
            };

            this._Loader.fadeIn();

            $.ajax({
                type: 'POST',
                url: AppData.Service.requestStatement,
                data: data,
                success: _.bind(this._on_Statement_Request_Success, this),
                error: _.bind(this._on_Statement_Request_Error, this)
            });
        },

        _on_Statement_Request_Success: function (data) {
            this._Loader.fadeOut();

            document.dispatchEvent(new CustomEvent('alert', {
                'detail': data.statusMessage
            }));

            if (data.responseCode === 0) {
                this.trigger('Close', {});
            }
        },

        _on_Statement_Request_Error: function (data) {
            this._Loader.fadeOut();
        },


        _on_Btn_Bck_Tap: function () {
            this.$el.find('input').blur();

            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
                this.clear();
            }
        },

        clear: function () {
            this._Account_Model = null;

            this.$el.find('.Screen').hide();
            this.$el.find('.Account').show();
            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this.$el.find('input').val('');
            this.$el.find('.Statement_Request-loader').hide();
        }
    });

    return Statement_View;
});