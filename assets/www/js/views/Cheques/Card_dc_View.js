define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Cheques/Card_dc_View.html'),
        template_Card_Item = require('text!html/Cheques/Card_View_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Card_dc_View = Base_Page_View.extend({

        id: "Card_dc",

        template: _.template(template),
        template_Card_Item: _.template(template_Card_Item),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap',
            'tap .Main .v-list-item': '_on_Select_Card_Item_Tap',
            //'tap .PIN .Btn_Continue': '_on_PIN_Continue_Tap',
            'tap .Confirm .Btn_Continue': '_on_Confirm_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;

            Card_dc_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Card_dc_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');
            this._confirmScreen = this._Screens.filter('.Confirm');
            this._Loader = this.$el.find('.v-loader');

            this._AccountNo = null;
            this._MaskPan = null;
            this._Pin = null;
            this._CardAction = false; //false = disable the card

            this._Cards_Collection = new Backbone.Collection();

            this._currentViewIndex = 0;
            this._viewArr = ['Main', 'Confirm'];
        },

        fetch_Card_Details: function () {

            this._Loader.fadeIn();
            this.$el.find('.Main .v-list').html('');

            $.ajax({
                type: 'GET',
                url: AppData.Service.getDebitCards,
                data: {
                    sessionId: AppData.Session_Id
                },
                success: _.bind(this._on_fetch_Card_Details_Success, this),
                error: _.bind(this._on_fetch_Card_Details_Error, this)
            });
        },

        _on_fetch_Card_Details_Success: function (data) {
            Log.write("_on_fetch_Card_Details_Success = " + JSON.stringify(data));
            this._Loader.fadeOut();

            if (parseInt(data.responseCode) === 0) {

                var domStr = '',
                    i = 0;

                if (data.cardsInfos && data.cardsInfos.length > 0) {

                    this._Cards_Collection.reset(data.cardsInfos);

                    for (i = 0; i < data.cardsInfos.length; i++) {
                        domStr = domStr + this.template_Card_Item({
                            account: data.cardsInfos[i].accountNo,
                            status: data.cardsInfos[i].cardStatus,
                            cardNum: data.cardsInfos[i].maskedCardNumber,
                            cardType: data.cardsInfos[i].cardType,
                            modelId: i
                        });
                    }
                } else {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'No cards found.'
                    }));
                }

                this.$el.find('.Main .v-list').html(domStr);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },


        _on_fetch_Card_Details_Error: function (data) {
            Log.write("_on_fetch_Card_Details_Error = " + JSON.stringify(data));
            this._Loader.fadeOut();
        },

        _change_Screen: function (screenName) {
            this.blur_Inputs();

            this._invisible();
            this._Screens.fadeOut();
            this.$el.find('.' + screenName).fadeIn();

            setTimeout(_.bind(this._invisible, this), 400);

        },
        
        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },

        //Save Card Mask Number & Display PIN screen
        _on_Select_Card_Item_Tap: function (event) {
            this._Cards_Model = this._Cards_Collection.models[$(event.currentTarget).data('model-id')];

            this._confirmScreen.find('.Name_Val').val(this._Cards_Model.get('embossedname'));
            this._confirmScreen.find('.CardNumber_Val').val(this._Cards_Model.get('maskedCardNumber'));

            this._AccountNo = this._Cards_Model.get('accountNo');
            this._MaskPan = this._Cards_Model.get('maskedCardNumber');

            if (this._Cards_Model.get('cardStatus') === "Disabled") {
                this._CardAction = true; //true = enable the card
                this._confirmScreen.find('.CardStatus_Val').val("Enable Card");
            } else {
                this._CardAction = false; //false = disable the card
                this._confirmScreen.find('.CardStatus_Val').val("Disable Card");
            }

            this._currentViewIndex = 1;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Save the PIN & Display Confirm Screen
        _on_PIN_Continue_Tap: function () {
            this._Pin = this._Screens.filter('.PIN').find('.PIN_Val').val().trim();
            this._confirmScreen.find('.PIN_Val').val(this._Pin);

            if (this._Pin === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            this._currentViewIndex = 2;
            this._change_Screen(this._viewArr[this._currentViewIndex]);
        },

        //Finally call the API
        _on_Confirm_Tap: function () {
            this._Pin = this._Screens.filter('.Confirm').find('.PIN_Val').val().trim();
            this._confirmScreen.find('.PIN_Val').val(this._Pin);

            if (this._Pin === "") {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            var reqData = {
                accountNo: this._AccountNo,
                maskedCard: this._MaskPan,
                pin: this._Pin,
                sessionId: AppData.Session_Id,
            };

            if (this._CardAction) {
                //true = enable the card
                this._enableCard(reqData);
            } else {
                //false = disable the card
                this._disableCard(reqData);
            }
            return;

        },

        _enableCard: function (data) {

            Log.write("url = " + AppData.Service.enableDebitCard);
            Log.write("reqData = " + JSON.stringify(data));
            
            this._Loader.fadeIn();

            $.ajax({
                type: 'POST',
                url: AppData.Service.enableDebitCard,
                data: data,
                success: _.bind(this._on_enableDebitCard_Success, this),
                error: _.bind(this._on_enableDebitCard_Error, this)
            });
        },

        _on_enableDebitCard_Success: function (data) {
            Log.write("_on_enableDebitCard_Success = " + JSON.stringify(data));
            this._Loader.fadeOut();

            if (parseInt(data.responseCode) === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Request submitted successfully.'
                }));
                this.trigger('Card_Success', {message: 'Card enabled successfully.'});
                this._clear();

                Countly.event([{
                    key: 'Cards',
                    count: 1,
                    segmentation: {
                        Type: 'Enable Card',
                        Status: 'Success'
                    }
                }]);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'Cards',
                    count: 1,
                    segmentation: {
                        Type: 'Enable Card',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_enableDebitCard_Error: function (data) {
            Log.write("_on_enableDebitCard_Error = " + JSON.stringify(data));
            this._Loader.fadeOut();
            
            Countly.event([{
                key: 'Cards',
                count: 1,
                segmentation: {
                    Type: 'Enable Card',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        _disableCard: function (data) {

            Log.write("url = " + AppData.Service.disableDebitCard);
            Log.write("reqData = " + JSON.stringify(data));

            this._Loader.fadeIn();

            $.ajax({
                type: 'POST',
                url: AppData.Service.disableDebitCard,
                data: data,
                success: _.bind(this._on_disableDebitCard_Success, this),
                error: _.bind(this._on_disableDebitCard_Error, this)
            });
            
            
        },

        _on_disableDebitCard_Success: function (data) {
            Log.write("_on_disableDebitCard_Success = " + JSON.stringify(data));
            this._Loader.fadeOut();

            if (parseInt(data.responseCode) === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Request submitted successfully.'
                }));
                this.trigger('Card_Success', {message: 'Card disabled successfully.'});
                this._clear();

                Countly.event([{
                    key: 'Cards',
                    count: 1,
                    segmentation: {
                        Type: 'Disable Card',
                        Status: 'Success'
                    }
                }]);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                Countly.event([{
                    key: 'Cards',
                    count: 1,
                    segmentation: {
                        Type: 'Disable Card',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_disableDebitCard_Error: function (data) {
            Log.write("_on_disableDebitCard_Error = " + JSON.stringify(data));
            this._Loader.fadeOut();

            Countly.event([{
                key: 'Cards',
                count: 1,
                segmentation: {
                    Type: 'Disable Card',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        _on_Btn_Bck_Tap: function () {

            this.$el.find('input').blur();

            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
                this._clear();
            }
        },

        _clear: function () {
            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this.$el.find('input').val("");
            this._AccountNo = null;
            this._MaskPan = null;
            this._Pin = null;
            this._CardAction = false;

            this.scrollTop();
            this._Loader.hide();
        }
    });

    return Card_dc_View;

});