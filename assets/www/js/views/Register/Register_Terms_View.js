define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Register_View = require('js/views/Register/Register_View'),
        template = require('text!html/Register/Register_Terms_View.html');

    var Register_Terms_View = Base_Page_View.extend({

        id: "Register_Terms",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap',
            'tap .Btn_agree_Custom': '_on_Btn_agree_Tap',
            'tap .Btn_disagree_Custom': '_on_Btn_Close_Tap',
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Register_Terms_View.__super__.initialize.apply(this, [config]);
            this._Sign_In_View = config.signin;
        },

        _render: function () {
            Register_Terms_View.__super__._render.apply(this);
        },        
        
        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        },
        
        _on_Btn_agree_Tap: function (event) {
            if (!this['_Register_View']) {
                this._Register_View = new Register_View({
                    width: this._Width,
                    accounts_Collection: this._Accounts_Collection
                });
            }
            var view = this._Register_View;
            // this.listenTo(this._Register_View, 'Complete_Reg', _.bind(this._Sign_In_View._complete_Reg, this));
            this.trigger('View_Change_Requested', view);
        },
    });

    return Register_Terms_View;

});