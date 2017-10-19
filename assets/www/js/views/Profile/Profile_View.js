define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        Change_Password_View = require('js/views/Profile/Change_Password_View'),
        Change_PIN_View = require('js/views/Profile/Change_Pin_View'),
        Reset_PIN_View = require('js/views/Profile/Reset_Pin_View'),
        User_Data_View = require('js/views/Profile/User_Data_View'),
        Touch_ID_View = require('js/views/Profile/Touch_ID_View'),

        template = require('text!html/Profile/Profile_VIew.html');

    var Profile_View = Base_Page_View.extend({

        id: "Profile",

        template: _.template(template),

        events: _.extend({
            'tap .v-list-item': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            Profile_View.__super__.initialize.apply(this, [config]);

            this._ios = window.device ? (device.platform === 'iOS' ? true : false) : false;
        },

        _render: function () {
            Profile_View.__super__._render.apply(this);

            setTimeout(_.bind(this._check_iOS, this), 0);
        },

        _check_iOS: function () {
            if (this._ios) {
                touchid.checkSupport(function () {}, _.bind(this._no_TouchID, this));
            } else {
                this.$el.find('.ios').hide();
            }
        },

        _no_TouchID: function () {
            this.$el.find('.ios').hide();
        },

        _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link'),
                view = null;

            if (!this['_' + link + '_View']) {
                switch (link) {
                case 'Profile_Change_Pwd':
                    this._Profile_Change_Pwd_View = new Change_Password_View({
                        width: this._Width,
                    });
                    view = this._Profile_Change_Pwd_View;

                    break;
                case 'Profile_Change_PIN':
                    this._Profile_Change_PIN_View = new Change_PIN_View({
                        width: this._Width,
                    });
                    view = this._Profile_Change_PIN_View;

                    break;

                case 'Profile_User_Data':
                    this._Profile_User_Data_View = new User_Data_View({
                        width: this._Width,
                    });
                    view = this._Profile_User_Data_View;

                    break;

                case 'Profile_Reset_PIN':
                    this._Profile_Reset_PIN_View = new Reset_PIN_View({
                        width: this._Width,
                    });
                    view = this._Profile_Reset_PIN_View;

                    this.listenTo(view, 'Profile_Change_PIN', _.bind(this._on_Profile_Change_PIN, this));

                    break;
                case 'Touch_ID':
                    this._Touch_ID_View = new Touch_ID_View({
                        width: this._Width,
                    });
                    view = this._Touch_ID_View;
                    break;

                default:
                    return;
                }
            } else {
                view = this['_' + link + '_View'];
            }

            if (link === "Profile_User_Data") {
                view.fetchProfile();
            }

            this.trigger('View_Change_Requested', view);
        },

        _on_Profile_Change_PIN: function () {
            if (!this._Profile_Change_PIN_View) {
                this._Profile_Change_PIN_View = new Change_PIN_View({
                    width: this._Width
                });
            }

            this.trigger('View_Change_Requested', this._Profile_Change_PIN_View);
        }

    });

    return Profile_View;

});