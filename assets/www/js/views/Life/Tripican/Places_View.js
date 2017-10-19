define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Life/Tripican/Places_View.html'),
        places_Template = require('text!html/Life/Tripican/Places_Item.html'),

        AppData = require('js/appData'),

        core = require('plugins/core');

    var Places_View = Base_Page_View.extend({

        id: "Places",

        template: _.template(template),
        places_Template: _.template(places_Template),

        events: _.extend({}, Base_Page_View.prototype.events),

        initialize: function (config) {
            Places_View.__super__.initialize.apply(this, [config]);
            this._Places_Collection = new Backbone.Collection();
        },

        _render: function () {
            Places_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-page-content');

            this._Places_Loader = this.$el.find('.v-loader.Places-loader');
            this._Places_Loader.fadeIn();

            $.ajax({
                type: 'GET',
                url: AppData.Service.tripicanPlaces,
                data: {
                    billercode: 'B00024',
                    productCode: 'PR0000',
                    requestParam: ''
                },
                success: _.bind(this._on_Get_Places_Success, this),
                error: _.bind(this._on_Get_Places_Error, this)
            });
        },

        _on_Get_Places_Success: function (data) {
            var mbppString = JSON.parse(data.mbppString);
            Log.write(mbppString);
            this._Places_Loader.fadeOut();
            return;
            if (data.responseCode === 0) {
                this._Places_Collection.add(mbppString.responseData.places);
                this._render_Places();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Get_Places_Error: function () {},

        _render_Places: function () {
            
        }

    });

    return Places_View;

});