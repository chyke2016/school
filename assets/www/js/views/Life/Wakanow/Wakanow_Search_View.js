define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),
        Base_Calendar_View = require('base/js/Base_Calendar_View'),

        Wakanow_Book_View = require('js/views/Life/Wakanow/Wakanow_Book_View'),

        template = require('text!html/Life/Wakanow/Wakanow_Search_View.html'),
        airport_Item_Template = require('text!html/Controls/Airports_List_Item.html'),
        flight_Item_Template = require('text!html/Controls/Flights_List_Item.html'),

        Airports = require('data/airports'),

        AppData = require('js/appData'),
        core = require('plugins/core');

    var Wakanow_Search_View = Base_Page_View.extend({

        id: "Flight_Search",

        template: _.template(template),
        airport_Item_Template: _.template(airport_Item_Template),
        flight_Item_Template: _.template(flight_Item_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Back_Tap',
            'tap .Route_Options .v-list-item': '_on_Route_Options_Item_Tap',
            'tap .Departure_Airport .v-list-item': '_on_Departure_Airport_Item_Tap',
            'tap .Destination_Airport .v-list-item': '_on_Destination_Airport_Item_Tap',
            'tap .Results .v-list-item': '_on_Results_Item_Tap',
            'release .v-segmented-control-item': '_on_Segmented_Control_Item_Release',
            'tap .Ticket_Class .v-list-item': '_on_Ticket_Class_Item_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Search': '_on_Btn_Search_Tap',
            'keyup .Departure_Airport .v-search-input': '_on_Departure_Airport_Search_Change',
            'keyup .Destination_Airport .v-search-input': '_on_Destination_Airport_Search_Change',
            'tap .Btn_Cancel': '_on_Btn_Cancel_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;

            Wakanow_Search_View.__super__.initialize.apply(this, [config]);
            
        },

        _render: function () {
            Wakanow_Search_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');
            this._currentViewFlag = false;
            this._Loader = this.$el.find('.v-loader');

            this._Domestic_Airports_Collection = new Backbone.Collection(Airports.domestic);
            this._International_Airports_Collection = new Backbone.Collection(Airports.international);
            this._Flights_Collection = new Backbone.Collection();

            this._Departure_Search = this.$el.find('.Departure_Airport .v-search-input');
            this._Departure_List = this.$el.find('.Departure_Airport .v-list');

            this._Destination_Search = this.$el.find('.Destination_Airport .v-search-input');
            this._Destination_List = this.$el.find('.Destination_Airport .v-list');

            this._Departure_Date_Carousel_Item = this.$el.find('.v-carousel-item[data-screen="Departure_Date"]');
            this._Return_Date_Carousel_Item = this.$el.find('.v-carousel-item[data-screen="Return_Date"]');

            this._Data = {
                routeOptions: {
                    searchType: 'I',
                    tripType: 'RT'
                },
                departureDate: null,
                returnDate: null,
                passengers: {
                    adult: 1,
                    child: 0,
                    infant: 0
                },
                class: 'E'
            };

            this._render_Departure_Airports(this._Domestic_Airports_Collection.models);

            this._Carousel = new Base_Carousel_View({
                $el: this._Page.find('.v-screen-carousel'),
                paneWidth: parseInt(this._Width / 2)
            });
            this.listenTo(this._Carousel, 'PaneChange', _.bind(this._change_Screen, this));

            this._Departure_Calendar = new Base_Calendar_View({
                $el: this._Page.find('.Departure_Date .v-calendar'),
                width: this._Width,
                range: {
                    from: 0,
                    to: 5
                }
            });
            this.listenTo(this._Departure_Calendar, 'DayTap', _.bind(this._on_Departure_Calendar_Day_Tap, this));
            var date = new Date();
            var today = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();
            this._Departure_Calendar.set_Active({
                year: year,
                month: month,
                day: today
            });

            this._Return_Calendar = new Base_Calendar_View({
                $el: this._Page.find('.Return_Date .v-calendar'),
                width: this._Width,
                range: {
                    from: 0,
                    to: 5
                }
            });

            this.listenTo(this._Return_Calendar, 'DayTap', _.bind(this._on_Return_Calendar_Day_Tap, this));
        },

        _change_Screen: function (el) {

            this._currentViewFlag = false;

            if ($(el).data('index') > 0) {
                this._currentViewFlag = true;
            }

            if (!this._Data.departureAirport && $(el).data('index') > 1) {
                this._Carousel.set_Active_Pane(1, true);
                return;
            }

            if (!this._Data.destinationAirport && $(el).data('index') > 2) {
                this._Carousel.set_Active_Pane(2, true);
                return;
            }

            if (!this._Data.departureDate && $(el).data('index') > 3) {
                this._Carousel.set_Active_Pane(3, true);
                return;
            }

            if (!this._Data.returnDate && this._Data.routeOptions.tripType === 'RT' && $(el).data('index') > 4) {
                this._Carousel.set_Active_Pane(4, true);
                return;
            }

            if (!this._Flights_Collection.models.length && $(el).data('index') > 6) {
                if (!this._Data.returnDate) {
                    this._Carousel.set_Active_Pane(5, true);
                } else {
                    this._Carousel.set_Active_Pane(6, true);
                }

                return;
            }

            this.blur_Inputs();
            
            this._invisible();
            this._Screens.fadeOut();
            this._Screens.filter('.' + $(el).data('screen')).fadeIn();

            setTimeout(_.bind(this._invisible, this), 400);

        },
        
        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },

        _render_Departure_Airports: function (models) {
            var domStr = '';

            for (var i = 0; i < models.length; i++) {
                domStr = domStr + this.airport_Item_Template({
                    id: i,
                    code: models[i].get('code'),
                    name: models[i].get('name')
                });
            }

            this._Departure_List.html(domStr);
            this.scrollTop();
        },

        _render_Destination_Airports: function (models) {
            var domStr = '';

            switch (this._Data.routeOptions.searchType) {
            case 'I':
                for (var i = 0; i < models.length; i++) {
                    domStr = domStr + this.airport_Item_Template({
                        id: i,
                        code: models[i].get('code'),
                        name: models[i].get('name') + ' - ' + models[i].get('cityName')
                    });
                }
                break;

            case 'D':
                for (var i = 0; i < models.length; i++) {
                    if(this._Data.departureAirport != models[i].get('code')) {
                        domStr = domStr + this.airport_Item_Template({
                            id: i,
                            code: models[i].get('code'),
                            name: models[i].get('name')
                        });
                    }
                    
                }
                break;
            }

            this._Destination_List.html(domStr);
            this.scrollTop();
        },

        _render_Results: function () {
            var domStr = '';
            if(this._Flights_Collection.models.length > 0) {
                for (var i = 0; i < this._Flights_Collection.models.length; i++) {
                    var model = this._Flights_Collection.models[i];
                    var stops = model.get('stops');

                    domStr = domStr + this.flight_Item_Template({
                        airlineName: model.get('name'),
                        route: stops[0].outbound.flights[0].fromAirport.code + ' - ' + stops[0].outbound.flights[stops[0].outbound.flights.length - 1].toAirport.code,
                        fare: core.formatBalance(stops[0].fare, 2, '.', ','),
                        currencyAlias: core.getCurrencyAlias(stops[0].currency),
                        modelId: model.cid
                    });
                }

                this._Screens.filter('.Results').find('.v-list').html(domStr);
            } else {
                this._Screens.filter('.Results').find('.v-list').html("<p style='text-align:center; text-align:center; margin: 30px 10px; font-family: HelveticaNeue-Light; font-size: 20px; color: #777;'>No flight available</p>");
            }
            
        },

        _on_Route_Options_Item_Tap: function (event) {
            var $el = $(event.currentTarget);

            this._Data.departureAirport = null;
            this._Data.destinationAirport = null;

            this._Departure_Search.val('');
            this._Destination_Search.val('');

            this._render_Departure_Airports(this._Domestic_Airports_Collection.models);

            switch ($el.data('type')) {

            case 'International':
                this._Data.routeOptions.searchType = 'I';
                break;

            case 'Domestic':
                this._Data.routeOptions.searchType = 'D';
                break;

            case 'Round_Trip':
                this._Data.routeOptions.tripType = 'RT';

                this._Departure_Date_Carousel_Item.after(this._Return_Date_Carousel_Item);
                this._Carousel.refresh();

                this._Data.returnDate = null;
                break;

            case 'One_Way':
                this._Data.routeOptions.tripType = 'OW';

                this._Return_Date_Carousel_Item.remove();
                this._Carousel.refresh();

                this._Data.returnDate = null;
                break;

            }

            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');
        },

        _on_Departure_Airport_Item_Tap: function (event) {
            this._Data.departureAirport = $(event.currentTarget).data('airport-code');
            
            this._Data.destinationAirport = null;
            this._Destination_Search.val('');

            if (this._Data.routeOptions.searchType === 'I') {
                this._render_Destination_Airports([]);
            } else {
                this._render_Destination_Airports(this._Domestic_Airports_Collection.models);
            }

            this._Carousel.next();
        },

        _on_Destination_Airport_Item_Tap: function (event) {
            this._Data.destinationAirport = $(event.currentTarget).data('airport-code');

            this._Carousel.next();
        },

        _on_Departure_Calendar_Day_Tap: function (date) {
            this._Departure_Calendar.remove_Selected();
            this._Departure_Calendar.set_Selected(date);

            if (this._Data.returnDate) { // clear
                this._Return_Calendar.remove_Selected_Interval();
            }
            this._Return_Calendar.remove_Active();
            this._Return_Calendar.remove_Selected();

            this._Return_Calendar.set_Active(date);
            this._Return_Calendar.set_Selected(date);

            this._Data.departureDate = date;
            this._Data.returnDate = null;

            //            this._Data.departureDate = this._Departure_Date.val();
        },

        _on_Return_Calendar_Day_Tap: function (date) {
            this._Return_Calendar.remove_Selected_Interval();
            this._Return_Calendar.set_Selected_Interval(this._Data.departureDate, date);

            this._Data.returnDate = date;
        },

        _on_Btn_Continue_Tap: function () {
            this.blur_Inputs();
            this._Carousel.next();
        },

        _on_Btn_Search_Tap: function () {
            this._Loader.fadeIn();

            var month, day;

            month = this._Data.departureDate.month + 1;
            day = this._Data.departureDate.day;
            if (month < 10) {
                month = '0' + month;
            }
            if (this._Data.departureDate.day < 10) {
                day = '0' + this._Data.departureDate.day;
            }
            var depDate = this._Data.departureDate.year + '-' + month + '-' + day;

            if (this._Data.returnDate) {
                month = this._Data.returnDate.month + 1;
                day = this._Data.returnDate.day;
                if (month < 10) {
                    month = '0' + month;
                }
                if (this._Data.returnDate.day < 10) {
                    day = '0' + this._Data.returnDate.day;
                }
                var retDate = this._Data.returnDate.year + '-' + month + '-' + day;
            } else {
                var retDate = '';
            }


            $.ajax({
                type: 'GET',
                url: AppData.Service.doSearchFlight,
                data: {
                    //                    sessionId: AppData.Session_Id,
                    billercode: 'B00002',
                    productCode: 'PR0000',
                    requestParam: JSON.stringify({
                        pax: this._Data.passengers,
                        agencyInfo: {
                            "agID": 62313,
                            "agencyName": "Diamond Bank Mobile",
                            "channel": 1,
                            "frID": 57905,
                            "saID": 0,
                            "userID": 62431
                        },
                        currency: "NGN",
                        filter: {
                            "type": "Airline",
                            "value": ""
                        },
                        noOfRec: 0,
                        portal: "DB",
                        reqType: "H",
                        sessionID: "",
                        startIndex: "10",
                        searchType: this._Data.routeOptions.searchType,
                        tripType: this._Data.routeOptions.tripType,
                        fromAirport: this._Data.departureAirport,
                        toAirport: this._Data.destinationAirport,
                        depDate: depDate,
                        retDate: retDate,
                        "clazz": this._Data.class
                    })
                },
                success: _.bind(this._on_Search_Success, this),
                error: _.bind(this._on_Search_Error, this)
            });

        },

        _on_Search_Success: function (data) {
            this._Loader.fadeOut();
            Log.write(data);

            if (data.mbppString) {

                if (JSON.parse(data.mbppString).responseData) {
                    this._Flights_Collection.reset(JSON.parse(data.mbppString).responseData.airlines);
                    
                    AppData._searchID = JSON.parse(data.mbppString).responseData.sessionID;

                    for (var i = 0; i < this._Flights_Collection.models.length; i++) {
                        this._Flights_Collection.models[i].set('passengers', this._Data.passengers);
                    }

                    Log.write(this._Flights_Collection);
                    this._render_Results();

                    this._Carousel.next();

                    Countly.event([{
                        key: 'Flight Search',
                        count: 1,
                        segmentation: {
                            Type: 'Wakanow',
                            Status: 'Success'
                        }
                    }]);

                } else {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': JSON.parse(data.mbppString).message
                    }));

                    Countly.event([{
                        key: 'Flight Search',
                        count: 1,
                        segmentation: {
                            Type: 'Wakanow',
                            Status: 'Failed',
                            FailedMessage: JSON.parse(data.mbppString).message
                        }
                    }]);
                }

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'Flight Search',
                    count: 1,
                    segmentation: {
                        Type: 'Wakanow',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }

            //this._Carousel.next();
        },

        _on_Search_Error: function (data) {
            this._Loader.fadeOut();
            this._Flights_Collection.reset();
            this._render_Results();

            Countly.event([{
                key: 'Flight Search',
                count: 1,
                segmentation: {
                    Type: 'Wakanow',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        clear: function (proceed) {
            if (!proceed) return;

            this._currentViewFlag = false;

            this._Carousel.set_Active_Pane(0);

            this._Flights_Collection.reset();

            this._Data = {
                routeOptions: {
                    searchType: 'I',
                    tripType: 'RT'
                },
                departureDate: null,
                returnDate: null,
                passengers: {
                    adult: 1,
                    child: 0,
                    infant: 0
                },
                class: 'E'
            };
            
            AppData._searchID = null;

            this._Departure_Calendar.remove_Selected(); // clear
            this._Return_Calendar.remove_Active();
            this._Return_Calendar.remove_Selected_Interval();

            this._render_Departure_Airports(this._Domestic_Airports_Collection.models);

            this._Screens.filter('.Route_Options').find('.v-list-item').removeClass('active');
            this._Screens.filter('.Route_Options').find('.v-list-item[data-type="International"]').addClass('active');
            this._Screens.filter('.Route_Options').find('.v-list-item[data-type="Round_Trip"]').addClass('active');

            this._Screens.filter('.Ticket_Class').find('.v-list-item').removeClass('active');
            this._Screens.filter('.Ticket_Class').find('.v-list-item[data-type="Economy"]').addClass('active');

            this._Screens.filter('.Passengers').find('.Counter').html('0');
            this._Screens.filter('.Passengers').find('.Counter').first().html('1');

            this.scrollTop();
        },

        _on_Segmented_Control_Item_Release: function (event) {
            var $el = $(event.currentTarget);
            var $parent = $el.parents('.v-list-item');

            var type = $parent.data('type');

            switch ($el.data('value')) {
            case 'minus':
                this._Data.passengers[type]--;
                break;

            case 'plus':
                this._Data.passengers[type]++;
                break;
            }

            if (type === 'adult' && this._Data.passengers[type] < 1) {
                this._Data.passengers[type] = 1;
            }

            if (this._Data.passengers[type] > 5) this._Data.passengers[type] = 5;
            if (this._Data.passengers[type] < 0) this._Data.passengers[type] = 0;

            $parent.find('.Counter').html(this._Data.passengers[type]);
        },

        _on_Ticket_Class_Item_Tap: function (event) {
            var $el = $(event.currentTarget);

            switch ($el.data('type')) {

            case 'Economy':
                this._Data.class = 'E';
                break;

            case 'Business':
                this._Data.class = 'B';
                break;

            case 'Premium':
                this._Data.class = 'W';
                break;

            case 'First':
                this._Data.class = 'F';
                break;

            }

            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');
        },

        _on_Departure_Airport_Search_Change: function () {
            var modelsToFilter = this._Domestic_Airports_Collection.models;

            var filter = this._Departure_Search.val().toLowerCase();

            if (!filter) {
                var filteredModels = modelsToFilter;
            } else {
                var filteredModels = _.filter(modelsToFilter, function (model) {
                    if (model.get('name').toLowerCase().search(filter) + 1 || model.get('code').toLowerCase().search(filter) + 1) {
                        return 1;
                    }
                }, this);
            }

            this._render_Departure_Airports(filteredModels);
        },

        _on_Destination_Airport_Search_Change: function () {
            var filter = this._Destination_Search.val().toLowerCase();

            switch (this._Data.routeOptions.searchType) {
            case 'I':
                var modelsToFilter = this._International_Airports_Collection.models;

                if (!filter) {
                    var filteredModels = [];
                } else {
                    var filteredModels = _.filter(modelsToFilter, function (model) {
                        if (model.get('name').toLowerCase().search(filter) + 1 || model.get('cityName').toLowerCase().search(filter) + 1 || model.get('code').toLowerCase().search(filter) + 1) {
                            return 1;
                        }
                    }, this);
                }

                break;

            case 'D':
                var modelsToFilter = this._Domestic_Airports_Collection.models;

                if (!filter) {
                    var filteredModels = [];
                } else {
                    var filteredModels = _.filter(modelsToFilter, function (model) {
                        if (model.get('name').toLowerCase().search(filter) + 1 || model.get('code').toLowerCase().search(filter) + 1) {
                            return 1;
                        }
                    }, this);
                }

                break;

            }

            this._render_Destination_Airports(filteredModels);
        },

        _on_Results_Item_Tap: function (event) {
            
            if (!this._Wakanow_Book_View) {
                this._Wakanow_Book_View = new Wakanow_Book_View({
                    width: this._Width,
                    departureDate: this._Data.departureDate,
                    accounts_Collection: this._Accounts_Collection
                });
            }

            this._Wakanow_Book_View.set_Flight_Model(this._Flights_Collection.get($(event.currentTarget).data('model-id')));
            this._Wakanow_Book_View.set_Flight_Type(this._Data.routeOptions.searchType);

            this.trigger('View_Change_Requested', this._Wakanow_Book_View);
        },

        _on_Btn_Back_Tap: function () {

            this.$el.find('input').blur();

            if (this._currentViewFlag) {
                this._Carousel.prev();
            } else {
                this.trigger('Close', {});
                this.clearInputs();
                this.clear(true);
            }
        },

        _on_Btn_Cancel_Tap: function () {
            this.clear(true);
        }

    });

    return Wakanow_Search_View;

});