define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        template = require('text!html/Profile/TouchID_View.html'),

        AppData = require('js/appData');

    var Touch_ID_View = Base_Page_View.extend({

        id: "Touch_ID",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back': '_on_Btn_Back_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Touch_ID_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Touch_ID_View.__super__._render.apply(this);

            this._Page_Switcher = new Base_Switcher_View({
                parentNode: this.$el.find('.TouchID-switcher')
            });
            this.listenTo(this._Page_Switcher, 'Change', _.bind(this.TouchID_Change_Requested, this));

            if (!localStorage.getItem('TouchIDOff')) {
                this.$el.find('.TouchID_Switcher_View .v-switcher').css("background", "#b4d431");
                this._Page_Switcher.set_Position(28, false);
            }
        },

        TouchID_Change_Requested: function (position) {
            switch (position) {
            case 'left':
                this.$el.find('.TouchID_Switcher_View .v-switcher').css("background", "#848484");
                localStorage.setItem('TouchIDOff', true);
                break;
            case 'right':
                this.$el.find('.TouchID_Switcher_View .v-switcher').css("background", "#b4d431");
                localStorage.removeItem('TouchIDOff');
                break;
            }
        }
    });
    return Touch_ID_View;
});