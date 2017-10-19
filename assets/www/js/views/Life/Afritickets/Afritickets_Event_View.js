define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Life/Afritickets/Afritickets_Event_View.html'),
        info_Template = require('text!html/Life/Afritickets/Afritickets_Event_View_Info.html'),
        category_Template = require('text!html/Life/Afritickets/Afritickets_Categories_List_Item.html'),
        account_Item_Template = require('text!html/Controls/Accounts_List_Item.html'),
        event_Template = require('text!html/Life/Afritickets/Afritickets_View_Item.html'),

        AppData = require('js/appData'),

        curCode = require('plugins/currencyCodes'),
        core = require('plugins/core');

    var Afritickets_Event_View = Base_Page_View.extend({

        id: "Afritickets_Event",

        template: _.template(template),
        info_Template: _.template(info_Template),
        category_Template: _.template(category_Template),
        account_Item_Template: _.template(account_Item_Template),
        event_Template: _.template(event_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Bck_Tap',
            'tap .v-segmented-control-item': '_on_Segmented_Control_Item_Tap',
            'tap .AfriticketsTicketCategories .v-list-item': '_on_Categories_Item_Tap',
            'tap .Account .v-list .v-list-item': '_on_Account_Item_Tap',
            'change input': '_on_Input_Change',
            'tap .Btn_Purchase': '_on_Btn_Purchase_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Categories_Collection = new Backbone.Collection();

            Afritickets_Event_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Afritickets_Event_View.__super__._render.apply(this);

            this._Data = {};
            this._currentViewFlag = false;

            this._Purchase_Loader = this.$el.find('.v-loader');

            this._Screens = this.$el.find('.v-event-screen');
            this._Purchase_Screens = this._Screens.filter('.Purchase').find('.v-screen');

            this._Purchase_Carousel = new Base_Carousel_View({
                $el: this._Screens.filter('.Purchase').find('.v-screen-carousel'),
                paneWidth: parseInt(this._Width / 2)
            });
            this.listenTo(this._Purchase_Carousel, 'PaneChange', _.bind(this._on_Purchase_Carousel_Change, this));

            this._render_Accounts();
        },

        set_Model: function (model) {
            this._Model = model;
            this._EventID = this._Model.get('EventID');
            this._Categories_Collection.reset(this._Model.get('TicketCategories'));

            this._Screens.filter('.Info').html(this.info_Template(this._Model.toJSON()));
            this._render_Categories();

            this._Purchase_Screens.filter('.Review').find('.Event').html(this.event_Template(this._Model.toJSON()));
        },

        _render_Categories: function () {
            var domStr = '';

            for (var i = 0; i < this._Categories_Collection.models.length; i++) {
                this._Categories_Collection.models[i].set('id', this._Categories_Collection.models[i].cid);
                domStr += this.category_Template(this._Categories_Collection.models[i].toJSON());
            }

            this._Screens.filter('.Purchase').find('.AfriticketsTicketCategories .v-list').html(domStr);
        },

        _render_Accounts: function () {
            var domStr = '';
            for (var i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];
                if (curCode.formatCurrencyCode(model.get('currencyCode')) == '₦') {
                    domStr = domStr + this.account_Item_Template({
                        account: model.get('accountNumber'),
                        accounttype: model.get('accountType'),
                        availablebalance: core.formatBalance(model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                        currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                        modelId: i
                    });
                }

            }

            this._Purchase_Screens.filter('.Account').find('.v-list').html(domStr);
        },

        _on_Segmented_Control_Item_Tap: function (event) {
            var $el = $(event.currentTarget);

            if ($el.hasClass('active')) {
                return;
            }

            this.clear(false);

            this.$el.find('.v-segmented-control-item').removeClass('active');
            $el.addClass('active');

            this._Screens.fadeOut();
            this._Screens.filter('.' + $el.data('screen')).fadeIn();
        },

        _on_Purchase_Carousel_Change: function (el) {
            this._currentViewFlag = true;
            if ($(el).data('index') == 0) {
                this._currentViewFlag = false;
            }

            if (!this._Data.category) {
                this._Purchase_Carousel.set_Active_Pane(0, true);
                return;
            }

            if (!this._Data.account && $(el).data('index') > 1) {
                this._Purchase_Carousel.set_Active_Pane(1, true);
                return;
            }

            this._Purchase_Screens.fadeOut();
            this._Purchase_Screens.filter('.' + $(el).data('screen')).fadeIn();
        },

        _on_Categories_Item_Tap: function (event) {
            this._Data.category = this._Categories_Collection.get($(event.currentTarget).data('model-id'));

            this._Purchase_Screens.filter('.Review').find('.Category').html(this.category_Template(this._Data.category.toJSON()));

            this._Purchase_Carousel.next();
        },

        _on_Account_Item_Tap: function (event) {
            this._Data.account = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];

            this._Purchase_Carousel.next();

            this._Purchase_Screens.filter('.Review').find('.Account').html(this.account_Item_Template({
                account: this._Data.account.get('accountNumber'),
                accounttype: this._Data.account.get('accountType'),
                availablebalance: core.formatBalance(this._Data.account.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._Data.account.get('currencyCode')),
                modelId: this._Data.account.get('modelId')
            }));
            this._Purchase_Screens.filter('.Review').find('.From .v-list-item-el:last-child').hide();
        },

        _on_Btn_Continue_Tap: function () {
            this._Purchase_Carousel.next();
        },

        _on_Btn_Purchase_Tap: function () {
            this.blur_Inputs();

            if (!this._Data.pin && !this._Data.email) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please fill all details.'
                }));
                return;
            }

            this._Purchase_Loader.fadeIn();

            var reqData = {
                sessionId: AppData.Session_Id,
                sourceAccount: this._Data.account.get('accountNumber'),
                billerCode: 'B00008',
                productCode: 'PR0000',
                billerName: 'Afritickets',
                requestParam: JSON.stringify({
                    username: AppData.Customer_Name,
                    email: this._Data.email,
                    eventID: this._EventID,
                    ticket_id: this._Data.category.get('TicketID'),
                    no_tickets: '1',
                    //amount: parseFloat(this._Data.category.get('Amount').replace(/[\D]/gi, ''), 10)
                    amount: parseFloat(this._Data.category.get('Amount'), 10)
                }),
                amount: this._Data.category.get('Amount'),
                tranTime: new Date().getTime().toString(),
                remarks: this._Data.remarks,
                pin: this._Data.pin
            };

            Log.write("url = " + AppData.Service.postEventBookingAfriTickets);
            Log.write("reqData = " + JSON.stringify(reqData));

            $.ajax({
                type: 'POST',
                url: AppData.Service.postEventBookingAfriTickets,
                data: reqData,
                success: _.bind(this._on_Purchase_Success, this),
                error: _.bind(this._on_Purchase_Error, this)
            });
        },

        _on_Purchase_Success: function (data) {
            this._Purchase_Loader.fadeOut();
            Log.write("_on_Purchase_Success = " + JSON.stringify(data));

            if (parseInt(data.responseCode) === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Booking successful.'
                }));
                this.trigger('Close_And_Success');
                this.clear(true);

                Countly.event([{
                    key: 'Afritickets Event',
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
                    key: 'Afritickets Event',
                    count: 1,
                    segmentation: {
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }
        },

        _on_Purchase_Error: function () {
            this._Purchase_Loader.fadeOut();
            Log.write("_on_Purchase_Success = " + JSON.stringify(data));

            Countly.event([{
                key: 'Afritickets Event',
                count: 1,
                segmentation: {
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        _on_Input_Change: function (event) {
            var $el = $(event.currentTarget);
            this._Data[$el.data('property')] = $el.val();
        },

        _on_Btn_Bck_Tap: function () {
            this.$el.find('input').blur();

            if (this._currentViewFlag) {
                this._Purchase_Carousel.prev();
            } else {
                this.trigger('Close', {});
                this.clear(true);
            }
        },

        clear: function (screenPosFlag) {
            this.$el.find('input').val("");
            this._Data = {};
            this._currentViewFlag = false;
            this._Purchase_Carousel.set_Active_Pane(0, true);

            this._Purchase_Screens.fadeOut();
            this._Purchase_Screens.filter('.AfriticketsTicketCategories').fadeIn();

            if (screenPosFlag) {
                this.$el.find('.v-segmented-control-item').removeClass('active');
                this.$el.find('.v-segmented-control-item:first-child').addClass('active');

                this._Screens.fadeOut();
                this._Screens.filter('.Info').fadeIn();
            }
        }

    });

    return Afritickets_Event_View;

});