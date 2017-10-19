define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        _Ticket_Payment_View = require('js/views/Life/Tripican/Ticket_Payment_View'),
        template = require('text!html/Life/Tripican/Movie_Details_View.html'),
        details_Template = require('text!html/Life/Tripican/Movie_Details_Item.html'),
        showtimes_Template = require('text!html/Life/Tripican/Movie_Showtimes_Item.html'),

        AppData = require('js/appData'),
        
        trailerURL = "",
        lastSegmentTarget = "",

        core = require('plugins/core');

    var Movie_Details_View = Base_Page_View.extend({

        id: "Movie_Details",

        template: _.template(template),
        details_Template: _.template(details_Template),
        showtimes_Template: _.template(showtimes_Template),

        events: _.extend({
            'tap .v-segmented-control-item': '_on_Segmented_Control_Item_Tap',
            'tap .Purchase_Ticket_Btn': '_on_Purchase_Btn_Tap',
            'tap .Ticket_Cal div': '_on_Cal_Change',
            'tap .Showtimes': '_on_Showtime_Tap',
            'tap .Btn_Back': 'on_Btn_Back_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Movie_Details_View.__super__.initialize.apply(this, [config]);
            this._Movies_Collection = new Backbone.Collection();
            this._Showtimes_Collection = new Backbone.Collection();
            this._Accounts_Collection = config.accounts_Collection;

            this._Ticket_Payment_View = new _Ticket_Payment_View({
                width: this._Width,
                accounts_Collection: this._Accounts_Collection
            });
        },

        _render: function () {
            Movie_Details_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.Movie_View_Details');
            this._Movie_Details_Loader = this.$el.find('.v-loader.Movie_Details-loader');
            this._Showtimes_Array = [];
            this._Current_Index = 0;

            this._Active_Segment_Control = 'Details';
            lastSegmentTarget = this._Active_Segment_Control;

            this.listenTo(this, 'Render_Movie_Details', _.bind(this._get_Movie_Details, this));
        },

        _on_Cal_Change: function (event) {
            this._Current_Index = parseInt(event.target.dataset.index);

            this.$el.find('.Ticket_Cal div.active').removeClass('active');
            event.target.className = 'active';
            var today = new Date();
            switch (this._Current_Index) {
            case 0:
                this._render_Movie_Details(today.format('yyyy-mm-dd'));
                break;
            case 1:
                this._render_Movie_Details(new Date(today.setDate(today.getDate() + 1)).format('yyyy-mm-dd'));
                break;
            case 2:
                this._render_Movie_Details(new Date(today.setDate(today.getDate() + 2)).format('yyyy-mm-dd'));
                break;
            }
        },

        _set_Movie_Collection: function (collection, id) {
            this._Movies_Collection = collection;
            this._Movie_Id = id;
        },

        _get_Movie_Details: function () {
            for (var i = 0; i < this._Movies_Collection.models.length; i++) {
                if (this._Movies_Collection.models[i].id === this._Movie_Id) {
                    this._Movie_Details = this._Movies_Collection.models[i].attributes;
                    trailerURL = this._Movie_Details.trailer_url[0];
                    if (!this._Movie_Details.actor) {
                        this._Movie_Details.actor = [];
                    }
                    if (!this._Movie_Details.director) {
                        this._Movie_Details.director = [];
                    }
                    if (!this._Movie_Details.trailer) {
                        this._Movie_Details.trailer = [];
                    }
                    this._render_Movie_Details(new Date().format('yyyy-mm-dd'));
                    return;
                }
            };
        },

        _render_Movie_Details: function (date) {

            if (!this._Initialized) {

                var domStr = '';
                domStr = domStr + this.details_Template(this._Movie_Details);
                this._Screens.html(domStr);
                this._ScreensSwitch = this.$el.find('.v-screen');
            }
            if (!this._Showtimes_Array[this._Current_Index]) {
                this._Movie_Details_Loader.fadeIn();
                $.ajax({
                    type: 'GET',
                    url: AppData.Service.tripicanShowTimes,
                    data: {
                        billerCode: AppData.Tripican_billercodes,
                        productCode: 'PR0000',
                        requestParam: JSON.stringify({
                            movie_id: this._Movie_Details.id,
                            event_date: '' + date
                        })
                    },
                    success: _.bind(this._on_Get_Ticket_Information_Success, this),
                    error: _.bind(this._on_Get_Ticket_Information_Error, this)
                });
            } else {
                this._on_Get_Ticket_Information_Success(this._Showtimes_Array[this._Current_Index]);
            }
        },

        _on_Get_Ticket_Information_Success: function (data) {
            if (!this._Initialized) {
                var today = new Date(),
                    dates = this.$el.find('.Ticket_Cal div');
                for (var i = 0; i < 3; i++) {
                    if (i === 0) {
                        $(dates[i]).html(today.format('dd mmm'));
                    } else {
                        $(dates[i]).html(new Date(today.setDate(today.getDate() + 1)).format('dd mmm'));
                    }
                }
                this._Initialized = true;
                this._Screens_Sub = this.$el.find('.v-screen-sub');
            }
            if (!this._Showtimes_Array[this._Current_Index]) {
                this._Showtimes_Array[this._Current_Index] = data;
            }
            this._Ticket_Information = JSON.parse(this._Showtimes_Array[this._Current_Index].mbppString).responseData.cinema_movie_showtimes;
            this._Showtimes_Collection.reset();
            this._Showtimes_Collection.add(this._Ticket_Information);
            this._Movie_Details_Loader.fadeOut();
            var domStr = '';
            for (var i = 0; i < this._Showtimes_Collection.models.length; i++) {
                domStr = domStr + this.showtimes_Template(this._Showtimes_Collection.models[i].toJSON());
            }
            this._Screens_Sub.find('.Showtime_Items').html(domStr);
        },

        _on_Get_Ticket_Information_Error: function () {},

        _on_Segmented_Control_Item_Tap: function (event) {
            var target = event.currentTarget.dataset.screen;

            if (target === 'Trailer') {
                setTimeout(function () {
                    var link = (trailerURL.indexOf('&') !== -1 ? trailerURL.slice(trailerURL, trailerURL.indexOf('&')).replace('watch?v=', 'embed/') : trailerURL.replace('watch?v=', 'embed/')) + '?controls=0&showinfo=0';
                    var ref = window.open(link, '_blank', 'location=no,toolbarposition=top,transitionstyle=fliphorizontal,disallowoverscroll=yes');
                }, 300);
            } else {
                this.on_Btn_Back_Tap();
            }

            if (target !== this._Active_Segment_Control && target !== 'Trailer') {
                this._ScreensSwitch.fadeOut();
                this.$el.find('.' + target).fadeIn();
                this._Active_Segment_Control = target;
                lastSegmentTarget = this._Active_Segment_Control;
            }
            this.$el.find('.v-segmented-control-item').removeClass('active');
            $(event.currentTarget).addClass('active');
            if (target == 'Trailer') {
                setTimeout(function () {
                     this.$el.find('.Movie_View_Details .v-segmented-control-item[data-screen]').removeClass("active");
                     this.$el.find('.Movie_View_Details .v-segmented-control-item[data-screen=' + lastSegmentTarget + ']').addClass("active");
                }, 1000);
            }
        },

        _on_Purchase_Btn_Tap: function () {
            this.on_Btn_Back_Tap();

            this.$el.find('.v-segmented-control-item').removeClass('active');
            if (!this.$el.find('.purchaseTab').hasClass('active')) {
                this._ScreensSwitch.fadeOut();
                this.$el.find('.Tickets').fadeIn();
                this._Active_Segment_Control = 'Tickets';
            }
            this.$el.find('.purchaseTab').addClass('active');
        },

        _on_Showtime_Tap: function (event) {
            var showTimes = this._Ticket_Information;
            for (var i = 0; i < showTimes.length; i++) {
                for (var j = 0; j < showTimes[i].movie_showtimes[0].showtimes.length; j++) {
                    if (showTimes[i].movie_showtimes[0].showtimes[j].id == event.currentTarget.id) {
                        this._Ticket_Payment_View._set_Ticket_Item(showTimes[i].movie_showtimes[0].showtimes[j]);
                        this.trigger('View_Change_Requested', this['_Ticket_Payment_View']);
                        return;
                    }
                }
            }
        },

        on_Btn_Back_Tap: function () {
        }
    });

    return Movie_Details_View;

});