define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Accounts/Transaction_Details_View.html'),
        content_Template = require('text!html/Accounts/Transaction_Details_View_Content.html'),

        core = require('plugins/core');

    var Transaction_Details_View = Base_Page_View.extend({

        id: "Transaction_Details",

        template: _.template(template),
        content_Template: _.template(content_Template),

        events: _.extend({

        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Transaction_Details_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Transaction_Details_View.__super__._render.apply(this);

            this._Content = this._Page.find('.v-page-content');
        },

        set_Config: function (model, currency_alias) {
            this.Currency_Alias = currency_alias;
            this._Model = model;
            this._render_Content();
        },

        _render_Content: function () {
            var modelData = this._Model.toJSON();
            modelData.currencyAlias = this.Currency_Alias;
            modelData.transAmount = modelData.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            modelData.transRemark = modelData.narration;
            modelData.transStatus = modelData.transactionType;
            modelData.beneficiary = null;
            modelData.channel = null;
            modelData.transBranch = null;
            modelData.transDate = new Date(modelData.date).format('dS mmm yyyy');

            this._Content.html(this.content_Template(modelData));
        }
    });

    return Transaction_Details_View;

});