define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Profile/User_Data_View.html'),

        AppData = require('js/appData');

    var User_Data_View = Base_Page_View.extend({

        id: "Profile_User_Data",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back': 'clear'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            User_Data_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            User_Data_View.__super__._render.apply(this);

            this._Loader = this.$el.find('.v-loader');
            this._userName = this.$el.find('.Name');
            this._userEmail = this.$el.find('.Email');
            this._userPhone = this.$el.find('.Phone');
            this._userAddress = this.$el.find('.Address');
        },

        fetchProfile: function () {
            var reqData = {
                sessionId: AppData.Session_Id
            };
            this._Loader.fadeIn();

            $.ajax({
                type: 'GET',
                url: AppData.Service.profileFetchDetail,
                data: reqData,
                success: _.bind(this._on_profileFetchDetail_Success, this),
                error: _.bind(this._on_profileFetchDetail_Error, this)
            });
        },

        _on_profileFetchDetail_Success: function (data) {
            this._Loader.fadeOut();
            if (data.responseCode === 0) {
                this._userName.val(data.profile.firstName);
                this._userEmail.val(data.profile.emailAddress);
                this._userPhone.val(data.profile.phoneNumber);
                this._userAddress.val(data.profile.houseAddress);
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
                this.clear();
            }
        },

        _on_profileFetchDetail_Error: function (data) {
            this._Loader.fadeOut();
        },

        clear: function () {
            this.$el.find('input').val('');
            this._Loader.fadeOut();
        }

    });

    return User_Data_View;

});