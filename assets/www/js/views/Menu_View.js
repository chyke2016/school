define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Menu_View.html'),

        AppData = require('js/appData');

    var Menu_View = Base_Page_View.extend({

        id: "Menu",

        template: _.template(template),

        events: {
            'tap .BtnLogout': '_on_Btn_Logout_Tap',
            'tap .v-list-menu-item': '_on_List_Item_Tap'
        },

        initialize: function (config) {
            Menu_View.__super__.initialize.apply(this, [config]);
        },

        _add_Event_Listeners: function () {

        },

        _on_Btn_Logout_Tap: function () {
            this.trigger('Sign_Out');
            this.clear();
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link');

            if (link === "Logout" || link === "Icon") {
                return;
            }

            this.trigger('List_Item_Tap', link);
            this.$el.find('.v-list-menu-item').removeClass('active');
            $(event.currentTarget).addClass('active');
            $(event.currentTarget).data('link');
            
        },

        _render: function () {
            Menu_View.__super__._render.apply(this);

            this._Page.html(this.template({
                customerName: AppData.Customer_Name
            }));
        },
        
        clear : function () {
            this.$el.find('.v-list-menu-item').removeClass('active');
            this.$el.find('.v-list-menu-item:eq(1)').addClass('active');
        }
    });

    return Menu_View;

});