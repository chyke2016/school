define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Forgot/Forgot_View.html'),

        Forgot_Banking_ID_View = require('js/views/Forgot_Banking_ID/Forgot_Banking_ID_View'),
        Forgot_Pwd_View = require('js/views/Forgot_Pwd/Forgot_Pwd_View');

    var Forgot_View = Base_Page_View.extend({

        id: "Forgot_Login",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back': '_on_Btn_Close_Tap',
            'tap .v-list-item': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Forgot_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Forgot_View.__super__._render.apply(this);
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link');

            var view;

            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Forgot_Banking_ID':
                    this._Forgot_Banking_ID_View = new Forgot_Banking_ID_View({
                        width: this._Width
                    });
                    view = this._Forgot_Banking_ID_View;
                    break;

                case 'Forgot_Pwd':
                    this._Forgot_Pwd_View = new Forgot_Pwd_View({
                        width: this._Width
                    });
                    view = this._Forgot_Pwd_View;
                    break;
                }

            } else {
                view = this['_' + link + '_View'];
            }

            this.trigger('View_Change_Requested', view);
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }

    });

    return Forgot_View;

});