define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Cheques/Cheque_Success_View.html'),

        AppData = require('js/appData');

    var Cheque_Success_View = Base_Page_View.extend({

        id: "Cheque_Success",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Close': '_on_Btn_Close_Tap',
            'tap .adserverAds': '_on_Ad_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Cheque_Success_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Cheque_Success_View.__super__._render.apply(this);

            $.ajax({
                type: 'GET',
                url: AppData.Service.adUrl,
                data: {
                    zoneid: 4
                },
                dataType: "xml",
                success: _.bind(this._on_adFetch_Success, this),
                error: _.bind(this._on_adFetch_Error, this)
            });
        },

        _on_adFetch_Success: function (data) {

            var $xml = $(data),
                $clickUrl = $xml.find("clickUrl"),
                $creativeUrl = $xml.find("creativeUrl");

            this._adUrl = $clickUrl.text();
            $(".adserverAds img").attr("src", $creativeUrl.text());
        },

        _on_adFetch_Error: function (data) {
            Log.write(data);
        },

        _on_Ad_Tap: function () {
            var ref = window.open(this._adUrl, '_blank', 'location=yes');
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }

    });

    return Cheque_Success_View;

});