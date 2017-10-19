define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Life/Tripican/Showing_Today_View.html'),
        showing_Today_Template = require('text!html/Life/Tripican/Movies_Item.html'),

        AppData = require('js/appData'),

        core = require('plugins/core');

    var Showing_Today_View = Base_Page_View.extend({

        id: "Showing_Today",

        template: _.template(template),
        showing_Today_Template: _.template(showing_Today_Template),

        events: _.extend({
            'tap .v-list-item': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Showing_Today_View.__super__.initialize.apply(this, [config]);
            this._Showing_Today_Collection = new Backbone.Collection();
            this._Movie_Details_View = config.detailsView;
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link'),
                id = $(event.currentTarget).data('model-id');

            this._Movie_Details_View._set_Movie_Collection(this._Showing_Today_Collection, id);


            this.trigger('View_Change_Requested', this['_' + link + '_View']);
        },

        _render: function () {
            Showing_Today_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');

            this._Showing_Today_Loader = this.$el.find('.v-loader.Showing_Today-loader');
            this._Showing_Today_Loader.fadeIn();

            $.ajax({
                type: 'GET',
                url: AppData.Service.tripicanShowingToday,
                data: {
                    billerCode: AppData.Tripican_billercodes,
                    productCode: 'PR0000',
                    requestParam: ''
                },
                success: _.bind(this._on_Get_ShowingToday_Success, this),
                error: _.bind(this._on_Get_ShowingToday_Error, this)
            });
        },

        _on_Get_ShowingToday_Success: function (data) {
            var mbppString = JSON.parse(data.mbppString);
            this._Showing_Today_Loader.fadeOut();
            if (data.responseCode === 0) {
                this._Showing_Today_Collection.add(mbppString.responseData.movies);
                this._render_Today_Items();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Get_ShowingToday_Error: function () {},

        _render_Today_Items: function () {
            var domStr = '';
            for (var i = 0; i < this._Showing_Today_Collection.models.length; i++) {
                domStr = domStr + this.showing_Today_Template(this._Showing_Today_Collection.models[i].toJSON());
            }
            this._Screens.find('.Showing_Today_Items').html(domStr);
        }
    });

    return Showing_Today_View;

});