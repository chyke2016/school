define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Contact_Us/Contact_Us_View.html'),
    
        Map_View = require('js/views/Map/Map_View'),
        Branches_View = require('js/views/Branches/Branches_View'),
        Branches_List_View = require('js/views/Branches/Branches_List_View'),
        Branches_ATM_View = require('js/views/Branches/Branches_ATM_View'),

        AppData = require('js/appData');

    var Contact_Us_View = Base_Page_View.extend({

        id: "Contact_Us",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap',
            'tap .v-list-item': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Contact_Us_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Contact_Us_View.__super__._render.apply(this);
            this._check_connection();
        }, 
        
        _check_connection: function () {
            if (AppData.network_connection.trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Maps services are not available'
                }));
            }
        },
        
        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link');
            var view;
            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Branch_List':
                    this._Branch_List_View = new Branches_List_View({
                        width: this._Width
                    });
                    view = this._Branch_List_View;
                    break;

                case 'ATM_List':
                    this._ATM_List_View = new Branches_ATM_View({
                        width: this._Width
                    });
                    view = this._ATM_List_View;
                    break;
                }

                this.listenTo(view, 'DisplayMap', _.bind(this._on_Map_View_Request, this));

            } else {
                view = this['_' + link + '_View'];
            }

            this.trigger('View_Change_Requested', view);
        },

        _on_Map_View_Request: function (data) {
            if (!this._Map_View) {
                this._Map_View = new Map_View({
                    lat: data.lat,
                    long: data.long
                });
            }

            this._Map_View.remove_All_Marker();
            this._Map_View.init_Map(data.lat, data.long);
            this.trigger('View_Change_Requested', this._Map_View);
        },

        hide_Back_Butn: function (flag) {
            var backButn = this.$el.find('.Btn_Back_Custom');
            var menuButn = this.$el.find('.Btn_Menu');
            if (flag) {
                menuButn.removeClass("hidden");
                backButn.addClass("hidden");
            } else {
                backButn.removeClass("hidden");
                menuButn.addClass("hidden");
            }
        },
        
        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }

    });

    return Contact_Us_View;

});