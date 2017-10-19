define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Wakanow_Search_View = require('js/views/Life/Wakanow/Wakanow_Search_View'),
        template = require('text!html/Life/Wakanow/Wakanow_Terms_View.html');

    var Wakanow_Terms_View = Base_Page_View.extend({

        id: "Flight_Terms",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap',
            'tap .Btn_agree_Custom': '_on_Btn_agree_Tap',
            'tap .Btn_disagree_Custom': '_on_Btn_Close_Tap',
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            
            Wakanow_Terms_View.__super__.initialize.apply(this, [config]);
            
        },

        _render: function () {
            Wakanow_Terms_View.__super__._render.apply(this);
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        },

        _on_Btn_agree_Tap: function (event) {
            
            if (!this['_Wakanow_Search_View']) {
                this._Wakanow_Search_View = new Wakanow_Search_View({
                    width: this._Width,
                    accounts_Collection: this._Accounts_Collection,
                    accounts_Collection_Nairra: this._Accounts_Collection_Nairra
                });
            }
            var view = this._Wakanow_Search_View;

            this.trigger('View_Change_Requested', view);
   
        },


    });

    return Wakanow_Terms_View;

});