define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        Showing_Today_View = require('js/views/Life/Tripican/Showing_Today_View'),
        Places_View = require('js/views/Life/Tripican/Places_View'),
        Movie_Details_View = require('js/views/Life/Tripican/Movie_Details_View'),

        template = require('text!html/Life/Tripican/Ticketing_View.html'),
        top_Box_Template = require('text!html/Life/Tripican/Top_Box_Item.html'),
        movies_Template = require('text!html/Life/Tripican/Movies_Item.html'),

        AppData = require('js/appData'),

        core = require('plugins/core');

    var Ticketing_View = Base_Page_View.extend({

        id: "Ticketing",

        template: _.template(template),
        top_Box_Template: _.template(top_Box_Template),
        movies_Template: _.template(movies_Template),

        events: _.extend({
            'tap .v-list-item': '_on_List_Item_Tap',
            'tap .v-segmented-control-item': '_on_Segmented_Control_Item_Tap',
            'tap ._Top_Box_Img': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Ticketing_View.__super__.initialize.apply(this, [config]);
            this._Accounts_Collection = config.accounts_Collection;
            this._Top_Box_Collection = new Backbone.Collection();
            this._Movies_Collection = new Backbone.Collection();

            this._Movie_Details_View = new Movie_Details_View({
                width: this._Width,
                accounts_Collection: this._Accounts_Collection
            });
        },

        _render: function () {
            Ticketing_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');
            this._Active_Segment_Control = 'Spotlight';

            this._Top_Box_Office_Loader = this.$el.find('.v-loader.Top_Box_Office-loader');
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link');

            // temp
            if (link !== 'Showing_Today' && link !== 'Movie_Details' && link !== 'Top_Box_Details') {
                return
            };

            var view, id;

            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Showing_Today':
                    this._Showing_Today_View = new Showing_Today_View({
                        width: this._Width,
                        detailsView: this._Movie_Details_View
                    });
                    view = this._Showing_Today_View;
                    break;
                case 'Places':
                    this._Places_View = new Places_View({
                        width: this._Width
                    });
                    view = this._Places_View;
                    break;
                }
            } else {
                view = this['_' + link + '_View'];
            }

            if (link === 'Movie_Details') {
                id = $(event.currentTarget).data('model-id');
                this._Movie_Details_View._set_Movie_Collection(this._Movies_Collection, id);
            }
            if (link === 'Top_Box_Details') {
                id = $(event.currentTarget).data('model-id');
                this._Movie_Details_View._set_Movie_Collection(this._Top_Box_Collection, id);
                view = this['_Movie_Details_View'];
            }

            this.trigger('View_Change_Requested', view);
        },

        _handle_Top_Box: function (ev) {
            ev.stopPropagation();
            ev.gesture.stopPropagation();
        },

        _on_Get_TopBoxOffice_Success: function (data) {
            var mbppString = JSON.parse(data.mbppString);
            this._Top_Box_Office_Loader.fadeOut();

            if (data.responseCode === 0) {
                this._Top_Box_Collection.add(mbppString.responseData.movies);
                this._render_Top_Box_Images();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }

        },

        _on_Get_TopBoxOffice_Error: function () {
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'Error while retrieving movies.'
            }));
        },

        _on_Get_Movies_Success: function (data) {
            var mbppString = JSON.parse(data.mbppString);

            if (data.responseCode === 0) {
                this._Movies_Collection.add(mbppString.responseData.movies);
                this._render_Movie_Items();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Get_Movies_Error: function () {
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'Error while retrieving movies.'
            }));
        },

        _render_Top_Box_Images: function () {
            var domStr = '';
            for (var i = 0; i < this._Top_Box_Collection.models.length; i++) {
                domStr = domStr + this.top_Box_Template(this._Top_Box_Collection.models[i].toJSON());
            }

            $('.noDrag').hammer({
                drag_lock_to_axis: true
            }).on("touch dragleft dragright dragend", _.bind(this._handle_Top_Box, this));

            this._Screens.find('.Top_Box_Images').html(domStr);
        },

        _render_Movie_Items: function () {
            var domStr = '';
            for (var i = 0; i < this._Movies_Collection.models.length; i++) {
                domStr = domStr + this.movies_Template(this._Movies_Collection.models[i].toJSON());
            }
            this._Screens.find('.Movie_Items').html(domStr);
        },

        _on_Segmented_Control_Item_Tap: function (event) {
            var target = event.currentTarget.dataset.screen;

            if (target !== this._Active_Segment_Control) {
                this._Screens.fadeOut();
                this.$el.find('.' + target).fadeIn();
                this._Active_Segment_Control = target;
            }
            this.$el.find('.v-segmented-control-item').removeClass('active');
            $(event.currentTarget).addClass('active');
        },

        _update: function () {

            this._Screens.fadeOut();
            this.$el.find('.v-segmented-control-item').removeClass('active');
            this.$el.find('.v-segmented-control-item').first().addClass('active');
            this.$el.find('.Spotlight').fadeIn();

            this._Active_Segment_Control = 'Spotlight';

            this._Top_Box_Office_Loader.fadeIn();

            $.ajax({
                type: 'GET',
                url: AppData.Service.tripicanTopBoxOffice,
                data: {
                    billerCode: AppData.Tripican_billercodes,
                    productCode: 'PR0000',
                    requestParam: ''
                },
                success: _.bind(this._on_Get_TopBoxOffice_Success, this),
                error: _.bind(this._on_Get_TopBoxOffice_Error, this)
            });

            $.ajax({
                type: 'GET',
                url: AppData.Service.tripicanInCinemas,
                data: {
                    billerCode: AppData.Tripican_billercodes,
                    productCode: 'PR0000',
                    requestParam: ''
                },
                success: _.bind(this._on_Get_Movies_Success, this),
                error: _.bind(this._on_Get_Movies_Error, this)
            });

            this.$el.find('.Top_Box_Images')[0].scrollLeft = 0;

        }

    });

    return Ticketing_View;

});