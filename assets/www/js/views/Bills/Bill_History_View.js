define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Bills/Bill_History_View.html'),
        payment_history_Template = require('text!html/Bills/Bills_History_list.html');

    var Bill_History_View = Base_Page_View.extend({

        id: "Bill_History",

        template: _.template(template),
        payment_history_Template: _.template(payment_history_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap'

        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Bill_History_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Bill_History_View.__super__._render.apply(this);
            this._update();
        },

        _update: function () {
            var data = JSON.parse(localStorage.getItem('BillPayments'));
            if (!data) {
                this.$el.find('.Bills_history_list .v-list').html("<p style='text-align:center; text-align:center; margin: 30px 10px; font-family: HelveticaNeue-Light; font-size: 20px; color: #777;'>No payment history available</p>")
                return false;
            }

            var domStr = '';
            for (var i = 0; i < data.length; i++) {
                var dateBill = new Date(data[i].date);
                domStr = domStr + this.payment_history_Template({
                    date: dateBill.getDate() + "-" + (dateBill.getMonth() + 1) + "-" + dateBill.getFullYear(),
                    text: data[i].text,
                    modelId: i
                });

                this.$el.find('.Bills_history_list .v-list').html(domStr);
            }
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }


    });

    return Bill_History_View;

});