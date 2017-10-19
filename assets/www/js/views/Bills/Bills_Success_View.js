define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Switcher_View = require('base/js/Base_Switcher_View'),

        template = require('text!html/Bills/Bills_Success_View.html'),

        AppData = require('js/appData'),
        xml2json = require('plugins/xml2json');

    var Bills_Success_View = Base_Page_View.extend({

        id: "Bills_Success",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Close': '_on_Btn_Close_Tap',
            'tap .FB_Share': '_on_Btn_FB_Share_Tap',
            'tap .v-adds-block-regular': '_on_Ad_Tap',
            'keyup .Beneficiary_Alias': '_on_Beneficiary_Alias_Change',

        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Bills_Success_View.__super__.initialize.apply(this, [config]);
        },

        _add_Event_Listeners: function () {

        },

        _render: function () {
            Bills_Success_View.__super__._render.apply(this);
            this.update();
            this._Page_Loader = this.$el.find('.v-loader.v-page-loader');
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        },


        update: function () {
            this.$el.find('.v-adds-block-regular').html('');

            $.ajax({
                type: 'GET',
                url: AppData.Service.adUrl,
                data: {
                    zoneid: 4
                },
                dataType: 'xml',
                success: _.bind(this._on_Get_Adds_Success, this),
                error: _.bind(this._on_Get_Adds_Error, this)
            });
        },

        _on_Get_Adds_Success: function (data) {

            data = xml2json(data);

            this._adUrl = data.clickUrl;

            this.$el.find('.v-adds-block-regular').html('<img style="display: block; margin: 0 auto;" src="' + data.creativeUrl + '"/>')
        },

        _on_Get_Adds_Error: function (data) {

        },

        _on_Ad_Tap: function () {
            var ref = window.open(this._adUrl, '_blank', 'location=yes');
        },

        _on_Btn_FB_Share_Tap: function () {
            if (mobile) {
                window.plugins.socialsharing.shareViaFacebook('Message via Facebook', null /* img */ , 'http://www.diamondbank.com' /* url */ , function () {

                }, function (errormsg) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': errormsg
                    }));
                });
            }
        }
    });

    return Bills_Success_View;

});