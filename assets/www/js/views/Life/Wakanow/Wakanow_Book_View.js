define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!html/Life/Wakanow/Wakanow_Book_View.html'),
        flight_Screen_Template = require('text!html/Life/Wakanow/Wakanow_Book_View_Flight.html'),
        passenger_Template = require('text!html/Life/Wakanow/Wakanow_Book_View_Passenger.html'),
        account_Item_Template = require('text!html/Controls/Accounts_List_Item.html'),

        Countries = require('data/countries'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),

        core = require('plugins/core');

    var Wakanow_Book_View = Base_Page_View.extend({

        id: "Flight_Book",

        template: _.template(template),
        flight_Screen_Template: _.template(flight_Screen_Template),
        passenger_Template: _.template(passenger_Template),
        account_Item_Template: _.template(account_Item_Template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Back_Tap',
            'tap .Customer .Title .v-list-item': '_on_Customer_Title_Item_Tap',
            'change .Customer input': '_on_Customer_Input_Change',
            'change .Contact input': '_on_Contact_Input_Change',
            'change .Address input': '_on_Address_Input_Change',
            'change .Address select': '_on_Address_Select_Change',
            'tap .Passengers .Title .v-list-item': '_on_Passenger_Title_Item_Tap',
            'change .Passengers input': '_on_Passenger_Input_Change',
            'tap .Accounts .v-list-item': '_on_Accounts_Item_Tap',
            'change .Security input': '_on_Security_Input_Change',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap',
            'tap .Btn_Continue_Passenger': '_on_Passenger_Btn_Continue_Tap',
            'blur .PassportNo': '_on_PassportNo_Input_Blur',
            'tap .Btn_Confirm': '_on_Btn_Confirm_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._departureDate = config.departureDate;

            window.countries = Countries;

            this.clearInputFlag = false;

            Wakanow_Book_View.__super__.initialize.apply(this, [config]);

        },

        set_Flight_Type: function (type) {
            this._Flight_Type = type;

            switch (this._Flight_Type) {

            case 'I':
                this._International = true;
                this.$el.find('.PassportWrapper').show();
                break;
            case 'D':
                this._International = false;
                this.$el.find('.PassportWrapper').hide();
                break;
            }
        },

        set_Flight_Model: function (model) {
            this._Flight_Model = model;

            this.$el.find('.Passengers').hide();

            var data = this._Flight_Model.get('stops')[0];
            data.passengers = this._Flight_Model.get('passengers');
            data.core = core;

            this._Screens.filter('.Flight').html(this.flight_Screen_Template(data));
            this._Screens.filter('.Confirm').html(this.flight_Screen_Template(data));
            this._Screens.filter('.Confirm').find('.Btn_Continue').removeClass('Btn_Continue').addClass('Btn_Confirm');
            this._Screens.filter('.Confirm').find('.v-loaderDynamic').html('<span style="width: 100%;">Confirm</span><span class="confirmLock"></span>');

            this._render_Passengers();
        },

        _render: function () {
            Wakanow_Book_View.__super__._render.apply(this);

            this._Loader = this.$el.find('.v-loader');
            this._currentViewFlag = false;
            this._Screens = this.$el.find('.v-screen');

            this._Address_Carousel_Item = this.$el.find('.v-carousel-item[data-screen="Address"]');
            this._Passengers_Wrapper = this.$el.find('.Passengers');
            this._Passengers_Wrapper.hide();
            this._passportNo = [];
            this._backButton = false;
            this._clearFlag = true;
            this._passengerCount = 0;
            this._backBtnflag = false;

            this._Data = {
                customer: {
                    title: 'Mr.',
                    firstName: '',
                    lastName: '',
                    birthDate: ''
                },
                contact: {
                    number: '',
                    numberAlt: '',
                    email: '',
                    emailConfirm: ''
                },
                address: {
                    address1: '',
                    address2: '',
                    city: '',
                    country: ''
                },
                passengers: [],
                account: '',
                pin: ''
            };
            var date = new Date();
            this.$el.find('.birthDate').attr('max', date.format('yyyy-mm-dd'));

            this._Carousel = new Base_Carousel_View({
                $el: this._Page.find('.v-screen-carousel'),
                paneWidth: parseInt(this._Width / 2)
            });
            this.listenTo(this._Carousel, 'PaneChange', _.bind(this._change_Screen, this));

            this._render_Accounts();
        },

        _render_Passengers: function () {
            this._Carousel.set_Active_Pane(0);

            this.$el.find('.v-screen-carousel-item[data-type="passenger"]').remove();

            var data = this._Flight_Model.get('stops')[0];

            var passengersAmount = data.passengers.adult + data.passengers.child + data.passengers.infant;
            var html = '';
            this._Data.passengers = [];

            for (var i = 1; i <= passengersAmount; i++) {
                html += '<div class="v-screen-carousel-item v-carousel-item" data-type="passenger" data-screen="Passenger' + i + '" data-pindex="' + i + '">Passenger ' + i + '/' + passengersAmount + '</div>';
            }

            this._Address_Carousel_Item.after(html);
            this._Carousel.refresh();

            html = '';

            for (var i = 1; i <= data.passengers.adult; i++) {
                html += this.passenger_Template({
                    type: 'Adult',
                    number: i
                });
                this._Data.passengers.push({
                    title: 'Mr.',
                    firstName: '',
                    lastName: '',
                    birthDate: '',
                    type: 'Adult',
                    passportValidUpTo: '',
                    passportNo: '',
                    passportIssAuthority: '',
                    frequentFlNumber: ''
                });
            }
            for (var k = 1; k <= data.passengers.child; k++) {
                html += this.passenger_Template({
                    type: 'Child',
                    number: i + k - 1
                });
                this._Data.passengers.push({
                    title: 'Mr.',
                    firstName: '',
                    lastName: '',
                    birthDate: '',
                    type: 'Child',
                    passportValidUpTo: '',
                    passportNo: '',
                    passportIssAuthority: '',
                    frequentFlNumber: ''
                });
            }
            for (var l = 1; l <= data.passengers.infant; l++) {
                html += this.passenger_Template({
                    type: 'Infant',
                    number: i + k + l - 2
                });
                this._Data.passengers.push({
                    title: 'Mr.',
                    firstName: '',
                    lastName: '',
                    birthDate: '',
                    type: 'Infant',
                    passportValidUpTo: '',
                    passportNo: '',
                    passportIssAuthority: '',
                    frequentFlNumber: ''
                });
            }

            this._Passengers_Wrapper.html(html);

            this._Screens = this.$el.find('.v-screen');

            this.scrollTop();
        },

        _alert_Msg_Inputs: function () {
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'Please fill all inputs.'
            }));
        },

        _change_Screen: function (el) {
            var pindex = $(el).data('pindex');
            this._Passengers_Wrapper.hide();
            if ($(el).data('screen') == 'Accounts') {
                this.clearInputFlag = true;

            } else {
                this.clearInputFlag = false;
            }

            if ($(el).data('screen').indexOf("Passenger") > -1) {
                this._Passengers_Wrapper.show();

                if (this._backBtnflag && this._passengerCount > 0) {
                    this._passengerCount--;
                }
            }

            this._currentViewFlag = false;

            if ($(el).data('index') > 0) {
                this._currentViewFlag = true;
            }

            if (!pindex) {
                if ((!this._Data.customer.firstName || !this._Data.customer.lastName || !this._Data.customer.birthDate) && $(el).data('index') > 1) {
                    this._Carousel.set_Active_Pane(1, true);
                    this._alert_Msg_Inputs();
                    return;
                }

                if (this._calculate_Age(new Date(this._Data.customer.birthDate)) < 12 && $(el).data('index') > 1) {
                    this._Carousel.set_Active_Pane(1, true);
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'The booking customer must be at least 12 years old.'
                    }));
                    return;
                }

                if ((!this._Data.contact.number || !this._Data.contact.email || !this._Data.contact.emailConfirm) && $(el).data('index') > 2) {
                    this._Carousel.set_Active_Pane(2, true);
                    this._alert_Msg_Inputs();
                    return;
                }

                if (!/\S+@\S+\.\S+/.test(this._Data.contact.email) && $(el).data('index') > 2) {
                    this._Carousel.set_Active_Pane(2, true);
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Please enter a valid email address.'
                    }));
                    return;
                }

                if (this._Data.contact.email != this._Data.contact.emailConfirm && $(el).data('index') > 2) {
                    this._Carousel.set_Active_Pane(2, true);
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Please enter matching email addresses.'
                    }));
                    return;
                }

                if ($(el).data('index') === 4 && (!this._Data.passengers[this._Data.passengers.length - 1].firstName || !this._Data.passengers[this._Data.passengers.length - 1].lastName || !this._Data.passengers[this._Data.passengers.length - 1].birthDate)) {
                    this._Passengers_Wrapper.show();
                    this._Carousel.set_Active_Pane(3 + this._Data.passengers.length, true);
                    this._alert_Msg_Inputs();
                    return;
                }

                if ($(el).data('index') === 4 && this._International && (!this._Data.passengers[this._Data.passengers.length - 1].passportNo || !this._Data.passengers[this._Data.passengers.length - 1].passportIssAuthority || !this._Data.passengers[this._Data.passengers.length - 1].passportValidUpTo)) {
                    this._Passengers_Wrapper.show();
                    this._Carousel.set_Active_Pane(3 + this._Data.passengers.length, true);
                    this._alert_Msg_Inputs();
                    return;
                }

                if (!this._Data.account && $(el).data('index') > 4) {
                    this._Carousel.set_Active_Pane(4 + this._Data.passengers.length, true);
                    this._alert_Msg_Inputs();
                    return;
                }

                if ((!this._Data.pin) && $(el).data('index') > 5) {
                    this._Carousel.set_Active_Pane(5 + this._Data.passengers.length, true);
                    this._alert_Msg_Inputs();
                    return;
                }
            } else {
                this._Data.address.country = this._Page.find('.myDataCountry').val();

                if ((!this._Data.address.address1 || !this._Data.address.city || !this._Data.address.country) && pindex === 1) {
                    this._Carousel.set_Active_Pane(3, true);
                    this._alert_Msg_Inputs();
                    return;
                }

                if (pindex > 1 && (!this._Data.passengers[pindex - 2].firstName || !this._Data.passengers[pindex - 2].lastName || !this._Data.passengers[pindex - 2].birthDate)) {
                    this._Carousel.set_Active_Pane(3 + pindex - 1, true);
                    this._alert_Msg_Inputs();
                    return;
                }

                if (pindex > 1 && this._International && (!this._Data.passengers[pindex - 2].passportNo || !this._Data.passengers[pindex - 2].passportIssAuthority || !this._Data.passengers[pindex - 2].passportValidUpTo)) {
                    this._Carousel.set_Active_Pane(3 + pindex - 1, true);
                    this._alert_Msg_Inputs();
                    return;
                }
            }

            this.blur_Inputs();

            this._invisible();
            this._Screens.fadeOut();
            this._Screens.filter('.' + $(el).data('screen')).fadeIn();

            setTimeout(_.bind(this._invisible, this), 400);

        },

        _invisible: function () {
            if (this.$el.find('.v-loader-invisible')[0].style.display == 'none') {
                this.$el.find('.v-loader-invisible').show();
            } else {
                this.$el.find('.v-loader-invisible').hide();
            }
        },

        _render_Accounts: function () {

            if (!this._Accounts_Collection.models.length) {
                return;
            }

            var domStr = '';
            for (var i = 0; i < this._Accounts_Collection.models.length; i++) {
                var model = this._Accounts_Collection.models[i];
                var currency = model.get('currency');
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

            this._Screens.filter('.Accounts').find('.v-list').html(domStr);
        },

        _on_Customer_Title_Item_Tap: function (event) {
            var $el = $(event.currentTarget);

            this._Data.customer.title = $el.data('type');

            this._Data.passengers[0].title = $el.data('type');
            this.$el.find('.Passengers .v-screen').first().find('.Title .v-list-item').removeClass('active');
            this.$el.find('.Passengers .v-screen').first().find('.Title .v-list-item[data-type="' + $el.data('type') + '"]').addClass('active');

            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');
        },

        _on_Customer_Input_Change: function (event) {
            var $el = $(event.currentTarget);

            this._Data.customer[$el.data('property')] = $el.val();
            this._Data.passengers[0][$el.data('property')] = $el.val();

            this.$el.find('.Passengers .v-screen').first().find('input[data-property="' + $el.data('property') + '"]').val($el.val());
        },

        _on_Contact_Input_Change: function (event) {
            var $el = $(event.currentTarget);

            this._Data.contact[$el.data('property')] = $el.val();


        },

        _on_Address_Input_Change: function (event) {
            var $el = $(event.currentTarget);

            this._Data.address[$el.data('property')] = $el.val();
        },

        _on_Address_Select_Change: function (event) {
            var $el = $(event.currentTarget);

            var selected = $el.find(':selected');

            this._Data.country = {
                id: selected.data('country-id'),
                name: selected.data('country-name')
            };
        },

        _on_Passenger_Title_Item_Tap: function (event) {
            var $el = $(event.currentTarget);
            var index = $el.parents('.v-screen').data('passenger') - 1;

            this._Data.passengers[index].title = $el.data('type');

            if (index === 0) {
                this._Data.customer.title = $el.data('type');
                this.$el.find('.Customer .Title .v-list-item').removeClass('active');
                this.$el.find('.Customer .Title .v-list-item[data-type="' + $el.data('type') + '"]').addClass('active');
            }

            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');
        },

        _on_Passenger_Input_Change: function (event) {
            var $el = $(event.currentTarget);
            var index = $el.parents('.v-screen').data('passenger') - 1;

            this._Data.passengers[index][$el.data('property')] = $el.val();


            this._Data.customer[$el.data('property')] = $el.val();
            this.$el.find('.Customer input[data-property="' + $el.data('property') + '"]').val($el.val());

        },

        _on_Accounts_Item_Tap: function (event) {
            this._Data.account = this._Accounts_Collection.models[$(event.currentTarget).data('model-id')];

            this._Carousel.next();
        },

        _on_Security_Input_Change: function (event) {
            var $el = $(event.currentTarget);

            this._Data[$el.data('property')] = $el.val();
        },

        _on_Btn_Continue_Tap: function () {
            this._backButton = false;
            this.blur_Inputs();
            this._Carousel.next();
        },

        _on_Passenger_Btn_Continue_Tap: function (event) {
            var dob, birthdate, age, tempDate, minDate, validUpTo;
            if (this._passengerCount < this._Data.passengers.length) {
                var type = this._Data.passengers[this._passengerCount].type;
                switch (type) {
                case 'Adult':
                    dob = this._Data.passengers[this._passengerCount].birthDate;
                    birthdate = dob.split("-");
                    age = this._calculate_Age(new Date(birthdate[0], birthdate[1] - 1, birthdate[2]));
                    if (age < 12) {
                        document.dispatchEvent(new CustomEvent('alert', {
                            'detail': 'An adult must be at least 12 years old.'
                        }));
                        return false;
                    }

                    break;

                case 'Child':
                    dob = this._Data.passengers[this._passengerCount].birthDate;
                    birthdate = dob.split("-");
                    age = this._calculate_Age(new Date(birthdate[0], birthdate[1] - 1, birthdate[2]));
                    if (age < 2 || age > 12) {
                        document.dispatchEvent(new CustomEvent('alert', {
                            'detail': 'A childs age must be between 2 and 12 years.'
                        }));
                        return false;
                    }
                    break;

                case 'Infant':
                    var dob = this._Data.passengers[this._passengerCount].birthDate;
                    birthdate = dob.split("-");
                    age = this._calculate_Age(new Date(birthdate[0], birthdate[1] - 1, birthdate[2]));
                    if (age > 2) {
                        document.dispatchEvent(new CustomEvent('alert', {
                            'detail': 'An infant must be less 2 years old.'
                        }));
                        return false;
                    }
                    break;
                }

                tempDate = new Date(this._departureDate.year + "-" + (this._departureDate.month + 1 < 10 ? '0' + this._departureDate.month : this._departureDate.month) + "-" + this._departureDate.day);
                minDate = new Date(tempDate.getTime() + 30 * 86400000);
                validUpTo = new Date(this._Data.passengers[this._passengerCount].passportValidUpTo);

                if (validUpTo < minDate) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Your passport needs to be valid for at least one month after departure.'
                    }));
                    return;
                }

                if (!this._clearFlag) {
                    document.dispatchEvent(new CustomEvent('alert', {
                        'detail': 'Please use Unique passport no.'
                    }));
                    return;
                }

                this._passportNo = [];
                for (var i = 0; i < this._Data.passengers.length; i++) {
                    if (this._Data.passengers[i].passportNo) {
                        this._passportNo.push(this._Data.passengers[i].passportNo);
                    }
                }

                this._passengerCount++;
                this._Carousel.next();
            }

        },

        _calculate_Age: function (birthday) {
            var ageDifMs = Date.now() - birthday.getTime(),
                ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        },

        _on_PassportNo_Input_Blur: function (event) {
            if (!this._backButton && this._passportNo.indexOf($(event.currentTarget).val()) > -1) {
                this._clearFlag = false;
            } else {
                this._clearFlag = true;
            }
        },

        _on_Btn_Confirm_Tap: function () {
            this._Loader.fadeIn();

            var passengers = [];
            for (var i = 0; i < this._Data.passengers.length; i++) {
                passengers.push({
                    "title": this._Data.passengers[i].title,
                    "fname": this._Data.passengers[i].firstName,
                    "lname": this._Data.passengers[i].lastName,
                    "dateOfBirth": this._Data.passengers[i].birthDate,
                    "age": new Date(new Date() - new Date(this._Data.passengers[i].birthDate)).getFullYear() - new Date(0).getFullYear(),
                    "paxtype": this._Data.passengers[i].type,
                    "passportValidUpTo": this._Data.passengers[i].passportValidUpTo ||  '',
                    "passportIssAuthority": this._Data.passengers[i].passportIssAuthority || '',
                    "passportNo": this._Data.passengers[i].passportNo ||  '',
                    "frequentFlNumber": ''
                });
            }

            $.ajax({
                type: 'GET',
                url: AppData.Service.doBookFlight,
                data: {
                    sessionId: AppData.Session_Id,
                    billercode: 'B00002',
                    productCode: 'P00000',
                    sourceAccount: this._Data.account.get('accountNumber'),
                    pin: this._Data.pin,
                    amount: this._Flight_Model.get('stops')[0].fare,
                    tranTime: new Date().getTime().toString(),
                    remarks: '',

                    requestParam: JSON.stringify({
                        "agID": 62313,
                        "chnlID": 1,
                        "frID": 57905,
                        "said": 0,
                        "uid": 62431,
                        "currency": "NGN",
                        "source": "DB",
                        "fareIndex": this._Flight_Model.get('stops')[0].fareIndex,
                        "fareid": this._Flight_Model.get('stops')[0].id,
                        "payM": 1,
                        "discountV": "",
                        "tempTransactionID": "",
                        "farePrice": this._Flight_Model.get('stops')[0].fare,
                        "searchId": AppData._searchID, // todo ask

                        "custInfo": {
                            "title": this._Data.customer.title,
                            "fname": this._Data.customer.firstName,
                            "lname": this._Data.customer.lastName,
                            "age": new Date(new Date() - new Date(this._Data.customer.birthDate)).getFullYear() - new Date(0).getFullYear(),
                            "mno": this._Data.contact.number,
                            "alno": this._Data.contact.numberAlt,
                            "email": this._Data.contact.email,
                            "add1": this._Data.address.address1,
                            "add2": this._Data.address.address2,
                            "ctName": this._Data.address.city,
                            "couID": this._Data.country.id.toString(),
                            "couName": this._Data.country.name
                        },
                        "paxInfo": {
                            "pax": passengers
                        }
                    })
                },
                success: _.bind(this._on_Book_Success, this),
                error: _.bind(this._on_Book_Error, this)
            });

        },

        _on_Book_Success: function (data) {
            this._Loader.fadeOut();

            Log.write(JSON.stringify(data));
            if (data.responseCode === 0) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'The flight has been booked successfully.'
                }));
                AppData.Get_Error = true;
                this.trigger('Update_Accounts', true);
                this.trigger('Success');

                Countly.event([{
                    key: 'Flight Booking',
                    count: 1,
                    sum: parseFloat(this._Flight_Model.get('stops')[0].fare),
                    segmentation: {
                        Type: 'Wakanow',
                        Status: 'Success'
                    }
                }]);

                Countly.event([{
                    key: "iap",
                    count: 1,
                    sum: parseFloat(this._Flight_Model.get('stops')[0].fare),
                    segmentation: {
                        Event: 'Flight Booking',
                        Type: 'Wakanow'
                    }
                }]);

            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));

                Countly.event([{
                    key: 'Flight Booking',
                    count: 1,
                    sum: 0,
                    segmentation: {
                        Type: 'Wakanow',
                        Status: 'Failed',
                        FailedMessage: data.statusMessage
                    }
                }]);
            }

        },

        _on_Book_Error: function (data) {
            this._Loader.fadeOut();
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'Unknown error'
            }));

            Countly.event([{
                key: 'Flight Booking',
                count: 1,
                sum: 0,
                segmentation: {
                    Type: 'Wakanow',
                    Status: 'Failed',
                    FailedMessage: 'Connection error!'
                }
            }]);
            this.trigger('Close_with_Error', {});
        },

        clear: function (proceed) {

        },

        _on_Ticket_Class_Item_Tap: function (event) {
            var $el = $(event.currentTarget);

            switch ($el.data('type')) {

            case 'Economy':
                this._Data.class = 'E';
                break;

            case 'Business':
                this._Data.class = 'B';
                break;

            case 'Premium':
                this._Data.class = 'W';
                break;

            case 'First':
                this._Data.class = 'F';
                break;

            }

            $el.parent().find('.v-list-item').removeClass('active');
            $el.addClass('active');
        },


        _on_Results_Item_Tap: function (event) {
            if (!this._Wakanow_Book_View) {
                this._Wakanow_Book_View = new Wakanow_Book_View({
                    width: this._Width,
                    accounts_Collection: this._Accounts_Collection
                });
            }

            this._Wakanow_Book_View.set_Flight_Model(this._Flights_Collection.get($(event.currentTarget).data('model-id')));

            this.trigger('View_Change_Requested', this._Wakanow_Book_View);
        },

        clearInputs: function () {

            $(this.el).find('input').val('');
        },

        _on_Btn_Back_Tap: function (event) {
            this._backBtnflag = true;
            this._backButton = true;
            this._passportNo = [];
            this.$el.find('input').blur();
            if (this.clearInputFlag) {
                this.clearInputs();
            }


            if (this._currentViewFlag) {
                this._Carousel.prev();
            } else {
                this.trigger('Close', {});
                this.clearInputs();
                this.clear(true);
            }
        },
    });

    return Wakanow_Book_View;

});