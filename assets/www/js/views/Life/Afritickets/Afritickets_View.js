define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        Afritickets_Event_View = require('js/views/Life/Afritickets/Afritickets_Event_View'),

        template = require('text!html/Life/Afritickets/Afritickets_View.html'),
        afri_Item_Template = require('text!html/Life/Afritickets/Afritickets_View_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Afritickets_View = Base_Page_View.extend({

        id: "Afritickets_View",

        template: _.template(template),
        _afri_Item_Template: _.template(afri_Item_Template),

        events: {
            'tap .AfriTickets_Events li': '_on_AfriTickets_Item_Tap',
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Life_Collection = new Backbone.Collection();
            Afritickets_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Afritickets_View.__super__._render.apply(this);

            this._Page.append(this.template());
            this.Mask = this.$el.find('.v-page-mask');

            this._Loader = this.$el.find('.Afri_Loader');
            this._fetch_Afritickets();
        },

        _fetch_Afritickets: function () {

            this._Loader.fadeIn();

            $.ajax({
                type: 'GET',
                url: AppData.Service.searchAfriEvents,
                data: {
                    billerCode: 'B00008',
                    productCode: 'PR0000',
                    requestParam: ''
                },
                success: _.bind(this._on_Get_AfriTicketEvents_Success, this),
                error: _.bind(this._on_Get_AfriTicketEvents_Error, this)
            });
        },

        _on_Get_AfriTicketEvents_Success: function (data) {
            //Log.write(JSON.stringify(data));

            this._Loader.fadeOut();
            data = JSON.parse(data.mbppString);
            if (data && data.responseData) {
                Log.write(JSON.stringify(data.responseData));

                this._Life_Collection.reset(data.responseData.Events);

                this._render_Afritickets();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.message
                }));
            }
        },

        _on_Get_AfriTicketEvents_Error: function (data) {
            Log.write(data);
            this._Loader.fadeOut();
        },

        _render_Afritickets: function () {
            var domStr = "";

            if (this._Life_Collection.models.length > 0) {
                for (var i = 0; i < this._Life_Collection.models.length; i++) {
                    this._Life_Collection.models[i].set('id', this._Life_Collection.models[i].cid);
                    var date = this._Life_Collection.models[i].get('Date').split(' ');
                    this._Life_Collection.models[i].set('Date', new Date(new Date(date[0]).format('mmmm dd, yyyy') + ' ' + date[1]).format('dS mmm yyyy hh:MM TT'));
                    this._Life_Collection.models[i].set('streetAddress', this._Life_Collection.models[i].get('street-address'));

                    var data = this._Life_Collection.models[i].toJSON();
                    domStr = domStr + this._afri_Item_Template(data);
                }
            } else {
                domStr = '<div style="text-align: center; padding: 15px 0px; color: #666; margin-left: -12px;">No events available!</div>'
            }
            this.$el.find('.AfriTickets_Events').html(domStr);

        },

        _on_AfriTickets_Item_Tap: function (event) {
            var eventModel = this._Life_Collection.get($(event.currentTarget).data('model-id'));

            if (!this._Afritickets_Event_View) {
                this._Afritickets_Event_View = new Afritickets_Event_View({
                    width: this._Width,
                    accounts_Collection: this._Accounts_Collection
                });
            }

            this._Afritickets_Event_View.set_Model(eventModel);

            this.trigger('View_Change_Requested', this._Afritickets_Event_View);
        },

    });

    return Afritickets_View;

});