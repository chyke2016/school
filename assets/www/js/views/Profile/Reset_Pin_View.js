define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Profile/Reset_Pin_View.html'),
        
        AppData = require('js/appData');

    var Reset_Pin_View = Base_Page_View.extend({

        id: "Profile_Reset_Pin",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Change_Pin': '_on_Btn_Change_Pin_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Reset_Pin_View.__super__.initialize.apply(this, [config]);            
        },

        _render: function () {
            Reset_Pin_View.__super__._render.apply(this);
        },
        
        _on_Btn_Change_Pin_Tap: function () {
            this.trigger('Profile_Change_PIN', this._Profile_Change_PIN_View);
        }
    });

    return Reset_Pin_View;

});