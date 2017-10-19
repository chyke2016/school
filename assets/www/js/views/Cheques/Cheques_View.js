define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        Cheque_Confirm_View = require('js/views/Cheques/Cheque_Confirm_View'),
        Cheque_Stop_View = require('js/views/Cheques/Cheque_Stop_View'),
        Cheque_Request_View = require('js/views/Cheques/Cheque_Request_View'),
        Cheque_Success_View = require('js/views/Cheques/Cheque_Success_View'),
        Card_cc_View = require('js/views/Cheques/Card_cc_View'),
        Card_dc_View = require('js/views/Cheques/Card_dc_View'),
        Card_Success_View = require('js/views/Cheques/Card_Success_View'),

        template = require('text!html/Cheques/Cheques_View.html');

    var Cheques_View = Base_Page_View.extend({

        id: "Cheques",

        template: _.template(template),

        events: _.extend({
            'tap .v-list-item': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Accounts_Collection_Nairra = config.accounts_Collection_Nairra;
            Cheques_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Cheques_View.__super__._render.apply(this);
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link');

            var view;

            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Cheque_Confirm':
                    this._Cheque_Confirm_View = new Cheque_Confirm_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Cheque_Confirm_View;
                    break;

                case 'Cheque_Stop':
                    this._Cheque_Stop_View = new Cheque_Stop_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Cheque_Stop_View;
                    break;

                case 'Cheque_Request':
                    this._Cheque_Request_View = new Cheque_Request_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Cheque_Request_View;
                    break;

                case 'Card_cc':
                    this._Card_cc_View = new Card_cc_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Card_cc_View;
                    break;

                case 'Card_dc':
                    this._Card_dc_View = new Card_dc_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection,
                        accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                    });
                    view = this._Card_dc_View;
                    break;

                default:
                    return;
                }
                this.listenTo(view, 'Cheque_Success', _.bind(this._on_Cheque_Success, this));
                this.listenTo(view, 'Card_Success', _.bind(this._on_Card_Success, this));
            } else {
                view = this['_' + link + '_View'];
            }

            if (link === "Card_cc" || link === "Card_dc") {
                view.fetch_Card_Details();
            }

            this.trigger('View_Change_Requested', view);
        },

        _on_Card_Success: function(param) {
            if (!this._Card_Success_View) {
                this._Card_Success_View = new Card_Success_View({
                    width: this._Width
                });
            }
            this._Card_Success_View.Card_Success(param.message);
            this.trigger('View_Change_Requested', this._Card_Success_View);
        },

        _on_Cheque_Success: function () {
            if (!this._Cheque_Success_View) {
                this._Cheque_Success_View = new Cheque_Success_View({
                    width: this._Width
                });
            }
            
            this.trigger('Update_Accounts',true);
            this.trigger('View_Change_Requested', this._Cheque_Success_View);
        }

    });

    return Cheques_View;

});