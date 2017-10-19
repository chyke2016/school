define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Forgot_Banking_ID/Forgot_Banking_ID_View.html'),
        
        AppData = require('js/appData');

    var Forgot_Banking_ID_View = Base_Page_View.extend({

        id: "Forgot_Banking_ID",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Forgot_Banking_ID_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Forgot_Banking_ID_View.__super__._render.apply(this);

            this._AccountNumber = this.$el.find('.AccountNumber');
            this._CardNumber = this.$el.find('.CardNumber');
            this._Loader = this.$el.find('.v-loader');
        },

        _on_Btn_Continue_Tap: function (event) {

            if (this._AccountNumber.val().trim() === "" || this._CardNumber.val().trim() === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all inputs.'
                }));
            } else if (this._CardNumber.val().trim().length !== 16) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Card number must consist of 16 chars.'
                }));
            } else {
                this._Loader.fadeIn();
                
                var cardNum = this._CardNumber.val().trim();
                var lastFourDigit = cardNum.substr(cardNum.length - 4);
            
                var reqData = {
                    accountNumber: this._AccountNumber.val().trim(),
                    cardNumber: cardNum
                };

                Log.write("url = " + AppData.Service.forgotInternetBankingId);
                Log.write("reqData = " + JSON.stringify(reqData));

                $.ajax({
                    type: 'GET',
                    url: AppData.Service.forgotInternetBankingId,
                    data: reqData,
                    success: _.bind(this._on_forgotInternetBankingId_Success, this),
                    error: _.bind(this._on_forgotInternetBankingId_Error, this)
                });
            }
        },

        _on_forgotInternetBankingId_Success: function (data) {
            Log.write("_on_forgotInternetBankingId_Success = " + JSON.stringify(data));
            this._Loader.fadeOut();
            
            if( data.responseCode === 0 ) {
                this.trigger('TriggerRegisterScreen'); 
                this.clear();
                
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Your internet banking ID has been sent to your registered number.'
                }));
                
                Countly.event([{
                    key: 'Forgot Banking Id',
                    count: 1,
                    segmentation: {
                        Status: 'Success'
                    }
                }]);
                
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                
                Countly.event([{
                    key: 'Forgot Banking Id',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_forgotInternetBankingId_Error: function (data) {
            Log.write("_on_forgotInternetBankingId_Error = " + JSON.stringify(data));
            this._Loader.fadeOut();
            
            Countly.event([{
                key: 'Forgot Banking Id',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
        },

        clear: function () {

            this.$el.find('input').val("");

            this.scrollTop();
            this._Loader.hide();
        },
        
        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
            this.clear();
        }

    });

    return Forgot_Banking_ID_View;

});