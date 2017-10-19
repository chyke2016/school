define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Branches/Branches_ATM_View.html'),
        item_Template = require('text!html/Branches/Branches_List_Item_View.html'),

        Map_View = require('js/views/Map/Map_View'),

        AppData = require('js/appData');

    var Branches_ATM_View = Base_Page_View.extend({

        id: "Branches_ATM",

        template: _.template(template),
        item_Template: _.template(item_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap',
            'tap .v-list-item': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Branches_ATM_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Branches_ATM_View.__super__._render.apply(this);
        },

        _update: function () {
            var item_Template = this.item_Template;

            navigator.geolocation.getCurrentPosition(function (position) {
                $('.Branches_ATM_Loader').fadeIn();

                $.ajax({
                    type: 'GET',
                    url: AppData.Service.branchesList + "sql?q=select ST_X(ST_Centroid(the_geom)) as longitude,ST_Y(ST_Centroid(the_geom)) as latitude,bankname, bankaddress,ST_Distance(the_geom::geography, ST_PointFromText('POINT(" + position.coords.longitude + " " + position.coords.latitude + ")', 4326)::geography) as distance from diamondbank ORDER BY distance ASC LIMIT 10",
                    data: null,
                    success: function (data, status, xhr) {
                        Log.write(JSON.stringify(data));

                        if (data.total_rows && data.total_rows > 0) {

                            var domStr = '';
                            for (var i = 0; i < data.rows.length; i++) {
                                domStr = domStr + item_Template({
                                    dataVal: data.rows[i].bankname,
                                    long: data.rows[i].longitude,
                                    lat: data.rows[i].latitude
                                });
                            }

                            $('.Branches_ATM_Data').html(domStr);
                        } else {
                            document.dispatchEvent(new CustomEvent('alert', {
                                'detail': 'Not able to fetch ATM list'
                            }));
                        }
                    },
                    error: function (err) {
                        $('.Branches_ATM_Loader').fadeOut();
                        document.dispatchEvent(new CustomEvent('alert', {
                            'detail': err.message
                        }));

                    },
                    complete: function () {
                        $('.Branches_ATM_Loader').fadeOut();
                    }
                });
            }, function (error) {
                $('.Branches_ATM_Loader').fadeOut();
                Log.write(error);
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Unable to determine location.'
                }));

            });
        },

        _on_List_Item_Tap: function (event) {
            this.trigger('DisplayMap', {
                lat: $(event.currentTarget).data('lat-id'),
                long: $(event.currentTarget).data('long-id')
            });
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }

    });

    return Branches_ATM_View;
});