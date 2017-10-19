define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Transfers/Transfer_Success_View.html'),

        AppData = require('js/appData');

    var Transfer_Success_View = Base_Page_View.extend({

        id: "Transfer_Success",

        template: _.template(template),

        events: {
            'tap .Btn_Close': '_on_Btn_Close_Tap',
            'tap .adserverAds': '_on_Ad_Tap'
        },

        initialize: function (config) {
            Transfer_Success_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Transfer_Success_View.__super__._render.apply(this);

            this._Page.append(this.template());
            this.Mask = this.$el.find('.v-page-mask');

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
        },

        _on_Ad_Tap: function () {
            var ref = window.open(this._adUrl, '_blank', 'location=yes');
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }
    });
    return Transfer_Success_View;
});