define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Life/Life_Success_View.html');

    var Life_Success_View = Base_Page_View.extend({

        id: "Life_Success",

        template: _.template(template),

        events: {
            'tap .Btn_Close': '_on_Btn_Close_Tap'
        },

        initialize: function (config) {
            Life_Success_View.__super__.initialize.apply(this, [config]);
        },

        _add_Event_Listeners: function () {

        },

        _render: function () {
            Life_Success_View.__super__._render.apply(this);

            this._Page.append(this.template());
            this.Mask = this.$el.find('.v-page-mask');
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }

    });

    return Life_Success_View;

});