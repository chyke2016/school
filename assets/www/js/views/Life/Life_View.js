define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        Afritickets = require('js/views/Life/Afritickets/Afritickets_View'),
        Life_Success_View = require('js/views/Life/Life_Success_View'),
        Tripican_View = require('js/views/Life/Tripican/Ticketing_View'),
        Wakanow_Terms_View = require('js/views/Life/Wakanow/Wakanow_Terms_View'),

        template = require('text!html/Life/Life_View.html');

    var Life_View = Base_Page_View.extend({

        id: "Life",

        template: _.template(template),

        events: {
            'tap .v-list-item': '_on_List_Item_Tap'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            Life_View.__super__.initialize.apply(this, [config]);

        },

        _render: function () {
            Life_View.__super__._render.apply(this);

            this._Page.html(this.template());
            this.Mask = this.$el.find('.v-page-mask');
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link');

            var view;

            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Afritickets':
                    this._Afritickets_View = new Afritickets({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection
                    });
                    view = this._Afritickets_View;
                    break;
                case 'Tripican':
                    this._Tripican_View = new Tripican_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection
                    });
                    view = this._Tripican_View;
                    break;
                case 'Wakanow_Terms':
                    this._Wakanow_Terms_View = new Wakanow_Terms_View({
                        width: this._Width,
                        accounts_Collection: this._Accounts_Collection
                    });
                    view = this._Wakanow_Terms_View;
                    break;
                default:
                    return;
                }
                this.listenTo(view, 'Life_Success', _.bind(this._on_Life_Success, this));
            } else {
                view = this['_' + link + '_View'];
            }

            this.trigger('View_Change_Requested', view);
        },

        _on_Life_Success: function () {
            if (!this._Life_Success_View) {
                this._Life_Success_View = new Life_Success_View({
                    width: this._Width
                });
            }
            this.trigger('View_Change_Requested', this._Transfer_Success_View);
        }

    });

    return Life_View;

});