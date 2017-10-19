define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        
        map = require('plugins/maps'),
        template = require('text!html/Map/Map_View.html');

    var Map_View = Base_Page_View.extend({

        id: "Map",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._lat = config.lat;
            this._long = config.long;
            this._markerArr = [];

            Map_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Map_View.__super__._render.apply(this);

            if (google === undefined || google.maps === undefined) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Map unavailble.'
                }));
                return;
            }

            var map_canvas = this.$el.find('.map-canvas')[0];

            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(this._lat, this._long),
                streetViewControl: false,
                mapTypeControl: false,
                rotateControl: false,
                panControl: false,
                zoomControl: false
            };

            this._mapObj = new google.maps.Map(map_canvas, mapOptions);
        },

        init_Map: function (lat, long) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, long),
                title: ""
            });

            this._mapObj.setZoom(8);
            this._mapObj.setCenter(new google.maps.LatLng(lat, long));
            marker.setMap(this._mapObj);

            this._markerArr.push(marker);
        },

        remove_All_Marker: function () {
            for (var i = 0; i < this._markerArr.length; i++) {
                this._markerArr[i].setMap(null); //Remove the marker from the map
            }
            this._markerArr = [];
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }

    });

    return Map_View;

});