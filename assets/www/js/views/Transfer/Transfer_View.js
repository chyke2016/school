define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        Transfer_To_Own_Accounts_View = require('js/views/Transfer/Transfer_To_Own_Accounts_View'),
        Transfer_To_DBBank_View = require('js/views/Transfer/Transfer_To_Diamond_Bank_Accounts_View'),
        Transfer_To_Other_Banks_View = require('js/views/Transfer/Transfer_To_Other_Bank_Accounts_View'),
        Yello_Diamond_Transfer_Banks_View = require('js/views/Transfer/Yello_Diamond_Transfer_Banks_View'),
        Diamond_Money_Transfer_View = require('js/views/Transfer/Diamond_Money_Transfer_View'),
        FCY_Transfer_View = require('js/views/Transfer/FCY_Transfer_View'),
        Transfer_Success_View = require('js/views/Transfer/Transfer_Success_View'),

        template = require('text!html/Transfers/Transfers_View.html');

    var Transfers_View = Base_Page_View.extend({

        id: "Transfers",

        template: _.template(template),

        events: {
            'tap .v-list-item': '_on_List_Item_Tap'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Accounts_Collection_Nairra = config.accounts_Collection_Nairra;
            Transfers_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Transfers_View.__super__._render.apply(this);
            this._Page.append(this.template());
            this.Mask = this.$el.find('.v-page-mask');
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link'),
                view;

            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Transfer_To_Own_Accounts':
                    this._Transfer_To_Own_Accounts_View = new Transfer_To_Own_Accounts_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Transfer_To_Own_Accounts_View;
                    break;
                case 'Transfer_To_DBBank':
                    this._Transfer_To_DBBank_View = new Transfer_To_DBBank_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Transfer_To_DBBank_View;
                    break;
                case 'Transfer_To_Other_Banks':
                    this._Transfer_To_Other_Banks_View = new Transfer_To_Other_Banks_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Transfer_To_Other_Banks_View;
                    break;
                case 'Diamond_Money_Transfer':
                    this._Diamond_Money_Transfer_View = new Diamond_Money_Transfer_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Diamond_Money_Transfer_View;
                    break;
                case 'Yello_Diamond_Transfer':
                    this._Yello_Diamond_Transfer_View = new Yello_Diamond_Transfer_Banks_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection
                    });
                    view = this._Yello_Diamond_Transfer_View;
                    break;
                case 'FCY_Transfer':
                    this._FCY_Transfer_View = new FCY_Transfer_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._FCY_Transfer_View;
                    break;
                }
                this.listenTo(view, 'Transfer_Success', _.bind(this._on_Transfer_Success, this));
            } else {
                view = this['_' + link + '_View'];
            }
            view.clear();
            view.render_Accounts();
            this.trigger('View_Change_Requested', view);
        },

        _on_Transfer_Success: function () {
            if (!this._Transfer_Success_View) {
                this._Transfer_Success_View = new Transfer_Success_View({
                    width: this._Width
                });
            }
            this.trigger('Update_Accounts', true);
            this.trigger('View_Change_Requested', this._Transfer_Success_View);
        }
    });
    return Transfers_View;
});