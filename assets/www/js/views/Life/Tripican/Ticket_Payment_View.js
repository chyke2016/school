define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),
        Transfer_Success_View = require('js/views/Transfer/Transfer_Success_View'),

        template = require('text!html/Life/Tripican/Ticket_Payment_View.html'),
        ticket_Amount_Template = require('text!html/Life/Tripican/Ticket_Amount_Item.html'),
        account_Item_Template = require('text!html/Controls/Accounts_List_Item.html'),
        ticket_Confirm_Template = require('text!html/Life/Tripican/Ticket_Confirm_Item.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Ticket_Payment_View = Base_Page_View.extend({

        id: "Ticket_Payment",

        template: _.template(template),
        account_Item_Template: _.template(account_Item_Template),
        ticket_Amount_Template: _.template(ticket_Amount_Template),
        ticket_Confirm_Template: _.template(ticket_Confirm_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Back_Tap',
            'tap .From_Account .v-list-item': '_on_From_Account_Item_Tap',
            'change .Customer input': '_on_Customer_Change',
            'release .v-segmented-control-item': '_on_Segmented_Control_Item_Release',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Showtime_Collection = new Backbone.Collection();

            Ticket_Payment_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Ticket_Payment_View.__super__._render.apply(this);

            this._Screens = this.$el.find('.v-screen');

            this._Loader = this.$el.find('.Ticket_Payment-loader');

            this._Ticket_Selection = false;

            this._Review = this._Page.find('.Review');
            this._FirstName = this._Page.find('.Customer .FirstName');
            this._LastName = this._Page.find('.Customer .LastName');
            this._Number = this._Page.find('.Customer .Number');
            this._Mail = this._Page.find('.Customer .Mail');

            this._Carousel = new Base_Carousel_View({
                $el: this._Page.find('.v-screen-carousel'),
                paneWidth: parseInt(this._Width / 2)
            });
            this.listenTo(this._Carousel, 'PaneChange', _.bind(this._change_Screen, this));

            this._currentViewIndex = 0;
            this._viewArr = ['Tickets', 'Customer', 'From_Account', 'Review', 'Confirm'];

            this._render_Accounts();
        },

        _change_Screen: function (screenName) {
            if (!this._Ticket_Selection) {
                this._Carousel.set_Active_Pane(0, true);
                return;
            }

            if (this._currentViewIndex > 1 && (!this._FirstName.val().trim() || !this._LastName.val().trim() || !this._Number.val().trim() || !this._Mail.val().trim())) {
                this._Carousel.set_Active_Pane(1, true);
                return;
            }

            if (!this._From_Account_Model && this._currentViewIndex > 2) {
                this._Carousel.set_Active_Pane(2, true);
                return;
            }
            if (this._currentViewIndex === 3) {
                var domStr = '',
                    amount = 0;
                for (var i = 0; i < this._Showtime_Collection.models.length; i++) {
                    domStr = domStr + this.ticket_Confirm_Template(this._Showtime_Collection.models[i].toJSON());
                    amount += this._Showtime_Collection.models[i].attributes.counter * this._Showtime_Collection.models[i].attributes.price_amount;
                }
                this._Screens.find('.Confirm_Tickets').html(domStr);
                this._Screens.find('.Confirm_Amount').val(core.formatBalance(amount, 0, '.', ','));
            }

            this.blur_Inputs();

            this._invisible();
            this._Screens.fadeOut();
            this._Screens.filter('.' + screenName).fadeIn();

            setTimeout(_.bind(this._invisible, this), 400);

        },

        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },

        _on_Carousel_Next: function () {

            if (this._currentViewIndex < this._viewArr.length) {
                this._currentViewIndex++;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            }
        },

        _render_Accounts: function () {
            if (!this._Accounts_Collection.models.length) {
                return;
            }

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

            this._Screens.filter('.From_Account').find('.v-list').html(domStr);
        },

        _on_From_Account_Item_Tap: function (event) {
            this._From_Account_Model = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];
            this._on_Carousel_Next();

            var currencyAlias = curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode'));
            this._Review.find('.CurrencyAlias').html(currencyAlias);

            this._Review.find('.From').html(this.account_Item_Template({
                account: this._From_Account_Model.get('accountNumber'),
                accounttype: this._From_Account_Model.get('accountType'),
                availablebalance: core.formatBalance(this._From_Account_Model.get('availableBalance').toString().replace('.', '') / 100, 2, '.', ','),
                currencyAlias: curCode.formatCurrencyCode(this._From_Account_Model.get('currencyCode')),
                modelId: this._From_Account_Model.get('modelId')
            }));
            this._Review.find('.From .v-list-item-el:last-child').hide();
        },

        _on_Customer_Change: function (event) {
            var el = $(event.currentTarget);

            if (el.hasClass('FirstName')) {
                if (!el.val().trim()) {
                    this._FirstName.val('');
                    this._Review.find('.FirstName').val('');
                } else {
                    this._Review.find('.FirstName').val(this._FirstName.val());
                }
                return;
            }

            if (el.hasClass('LastName')) {
                if (!el.val().trim()) {
                    this._LastName.val('');
                    this._Review.find('.LastName').val('');
                } else {
                    this._Review.find('.LastName').val(this._LastName.val());
                }
                return;
            }

            if (el.hasClass('Number')) {
                if (!el.val().trim() || isNaN(el.val().trim())) {
                    this._Number.val('');
                    this._Review.find('.Number').val('');
                } else {
                    this._Review.find('.Number').val(this._Number.val());
                }
                return;
            }

            if (el.hasClass('Mail')) {
                if (!el.val().trim()) {
                    this._Mail.val('');
                    this._Review.find('.Mail').val('');
                } else {
                    this._Review.find('.Mail').val(this._Mail.val());
                }
                return;
            }
        },

        _on_Btn_Continue_Tap: function () {
            this.blur_Inputs();
            this._on_Carousel_Next();

        },

        _on_Btn_Confirm_Tap: function () {
            this.blur_Inputs();

            if (!this.$el.find('.Review .Token').val().trim()) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Please enter your PIN.'
                }));
                return;
            }

            this._Loader.fadeIn();

            $.ajax({
                type: 'POST',
                url: AppData.Service.tripicanPayment,
                data: {
                    billerCode: AppData.Tripican_billercodes,
                    productCode: 'PR0000',
                    requestParam: this._Build_RequestParam(),
                    sessionId: AppData.Session_Id,
                    billerName: 'Tripican',
                    sourceAccount: this._From_Account_Model.get('accountNumber'),
                    remarks: this.$el.find('.Review .Remarks').val().trim(),
                    pin: this.$el.find('.Review .Token').val().trim(),
                    amount: this.$el.find('.Review .Confirm_Amount').val().replace(/\,/g, '').trim(),
                    tranTime: new Date().getTime().toString()
                },
                success: _.bind(this._on_Ticket_Purchase_Success, this),
                error: _.bind(this._on_Ticket_Purchase_Error, this)
            });
        },

        _on_Ticket_Purchase_Success: function (data) {
            if (data.repsonseCode === 0) {
                this._on_Transfer_Success();
                setTimeout(_.bind(this.clear, this), 400);
            } else {
                this._Loader.fadeOut();
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
        },

        _on_Ticket_Purchase_Error: function (data) {
            this._Loader.fadeOut();
        },

        _Build_RequestParam: function () {
            var count23 = 0,
                count24 = 0,
                count25 = 0;

            for (var i = 0; i < this._Showtime_Collection.models.length; i++) {
                switch (this._Showtime_Collection.models[i].attributes.category.id) {
                case 23:
                    count23 = this._Showtime_Collection.models[i].attributes.counter;
                    break;
                case 24:
                    count24 = this._Showtime_Collection.models[i].attributes.counter;
                    break;
                case 25:
                    count25 = this._Showtime_Collection.models[i].attributes.counter;
                    break;
                }
            }

            var data = {
                id: this._Ticket_Item.id,
                email: this.$el.find('.Review .Mail').val().trim(),
                phone: this.$el.find('.Review .Number').val().trim(),
                firstname: this.$el.find('.Review .FirstName').val().trim(),
                lastname: this.$el.find('.Review .LastName').val().trim(),
                tickets_23: count23,
                tickets_24: count24,
                tickets_25: count25,
                payment_method: 'api',
                amount: parseInt(this.$el.find('.Review .Confirm_Amount').val().replace(/\,/g, '').trim()),
            }

            return JSON.stringify(data);
        },

        _set_Ticket_Item: function (item) {
            this._Ticket_Item = item;
            this._Showtime_Collection.reset();
            this._Showtime_Collection.add(this._Ticket_Item.ticket_prices);
            var domStr = '';
            for (var i = 0; i < this._Showtime_Collection.models.length; i++) {
                this._Showtime_Collection.models[i].attributes.counter = 0;
                domStr = domStr + this.ticket_Amount_Template(this._Showtime_Collection.models[i].toJSON());
            }
            this._Screens.find('.Ticket_Amounts').html(domStr);
        },

        _on_Segmented_Control_Item_Release: function (event) {
            var $el = $(event.currentTarget);
            var $parent = $el.parents('.v-list-item');

            var ticketTypeID = $parent.data('id');

            for (var i = 0; i < this._Showtime_Collection.models.length; i++) {
                if (this._Showtime_Collection.models[i].attributes.category.id == ticketTypeID) {
                    switch ($el.data('value')) {
                    case 'minus':
                        this._Showtime_Collection.models[i].attributes.counter -= 1;
                        break;

                    case 'plus':
                        this._Showtime_Collection.models[i].attributes.counter += 1;
                        break;
                    }
                    if (this._Showtime_Collection.models[i].attributes.counter > 10) this._Showtime_Collection.models[i].attributes.counter = 10;
                    if (this._Showtime_Collection.models[i].attributes.counter < 0) this._Showtime_Collection.models[i].attributes.counter = 0;

                    $parent.find('.Counter').html(this._Showtime_Collection.models[i].attributes.counter);

                    for (var i = 0; i < this._Showtime_Collection.models.length; i++) {
                        if (this._Showtime_Collection.models[i].attributes.counter != 0) {
                            this._Ticket_Selection = true;
                            break;
                        }
                        this._Ticket_Selection = false;
                    }
                    return;
                }
            }
        },

        _on_Transfer_Success: function () {
            if (!this._Transfer_Success_View) {
                this._Transfer_Success_View = new Transfer_Success_View({
                    width: this._Width
                });
            }
            this.trigger('Update_Accounts', true);
            this.trigger('View_Change_Requested', this._Transfer_Success_View);
        },

        _on_Btn_Back_Tap: function () {

            this.$el.find('input').blur();

            if (this._currentViewIndex > 0) {
                this._currentViewIndex--;
                this._change_Screen(this._viewArr[this._currentViewIndex]);
            } else {
                this.trigger('Close', {});
                this.clear();
            }
        },

        clear: function () {
            this._currentViewIndex = 0;
            this._change_Screen(this._viewArr[this._currentViewIndex]);

            this._From_Account_Model = null;
            this._Review.find('input').val('');
            this._FirstName.val('');
            this._LastName.val('');
            this._Number.val('');
            this._Mail.val('');

            this.scrollTop();

            this._Loader.hide();
        }

    });

    return Ticket_Payment_View;

});