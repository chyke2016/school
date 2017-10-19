define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),
        template = require('text!html/Share/Share_View.html');


    var Share_View = Base_Page_View.extend({

        id: "Share",

        template: _.template(template),

        events: _.extend({
            'tap .Btn_Back_Custom': '_on_Btn_Close_Tap',
            'tap .v-list-item': '_on_List_Item_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Share_View.__super__.initialize.apply(this, [config]);
        },

        _render: function () {
            Share_View.__super__._render.apply(this);
        },
        
         _on_List_Item_Tap: function (event) {
            var link = $(event.currentTarget).data('link');

            var view;
            switch (link) {
                case 'Email_List':

                     if (mobile) {  
                         var platform = device.platform;
                        
                         if(platform == 'Android') {                             
                             window.plugins.socialsharing.shareViaEmail(
                                  'Hey there!<br><br>I just had an amazing experience with the Diamond Mobile App and I think you should try it.<br><br>To get it, go to your App store, search for ‘Diamond Mobile’, download and register with the 3 simple steps below:<br><br>Step 1: Input your 16digit Diamond Debit card number and any of your account numbers then select submit. Your Diamond Online User ID and registration code will be generated and sent to your registered phone number as a text message.<br><br>Step 2: Input the Diamond Online User ID and registration code sent to your phone number and select submit.<br><br>Step 3: Choose a password (not less than six characters) which you will use to access this service at anytime, reconfirm your password; choose a four digit pin for transactions, reconfirm your pin and select confirm.', 
                                  "Diamond Bank's new mobile app",
                                  null,
                                  null,
                                  null,
                                  null,
                                  function () {Log.write('Fb share success');},
                                  function () {Log.write('Fb share Error');} 
                             );
                         } 
                         if(platform == 'iOS') {

                             $('#email-Link').attr('href',"mailto:?subject=Diamond Bank's new mobile app&body=Hey there!<br><br>I just had an amazing experience with the Diamond Mobile App and I think you should try it.<br><br>To get it, go to your App store, search for ‘Diamond Mobile’, download and register with the 3 simple steps below:<br><br>Step 1: Input your 16digit Diamond Debit card number and any of your account numbers then select submit. Your Diamond Online User ID and registration code will be generated and sent to your registered phone number as a text message.<br><br>Step 2: Input the Diamond Online User ID and registration code sent to your phone number and select submit.<br><br>Step 3: Choose a password (not less than six characters) which you will use to access this service at anytime, reconfirm your password; choose a four digit pin for transactions, reconfirm your pin and select confirm.");
                         }
                        
                     }
                    break;

                case 'FB_List':

                    if (mobile) {
                        
                        var platform = device.platform;
            
                        window.plugins.socialsharing.shareViaFacebook('Hey there! \n\nI just had an amazing experience with the Diamond Mobile App and I think you should try it.\n\nTo get it, go to your App store, search for ‘Diamond Mobile’, download and register with the 3 simple steps below:\n\nStep 1: Input your 16digit Diamond Debit card number and any of your account numbers then select submit. Your Diamond Online User ID and registration code will be generated and sent to your registered phone number as a text message.\n\nStep 2: Input the Diamond Online User ID and registration code sent to your phone number and select submit.\n\nStep 3: Choose a password (not less than six characters) which you will use to access this service at anytime, reconfirm your password; choose a four digit pin for transactions, reconfirm your pin and select confirm.', null /* img */ , 'http://www.diamondbank.com/' /* url */ ,                     function () {
                            Log.write('share ok')
                        }, function () {
                            document.dispatchEvent(new CustomEvent('alert', {
                                'detail': 'An error occured. Please make sure the facebook app is installed.'
                            }));
                        });
                    }
                    break;
                    
                case 'Twitter_List':

                     if (mobile) {  
                         var platform = device.platform;
                        
                         window.plugins.socialsharing.shareViaTwitter('Hi, I just had an amazing experience with the Diamond Mobile App and I think you should too. Go to your App store, download and register!', null /* img */, null,
                        function () {
                            Log.write('share ok')
                        }, function () {
                            document.dispatchEvent(new CustomEvent('alert', {
                                'detail': 'An error occured. Please make sure the twitter app is installed.'
                            }));
                        });
                    }
                    break;
                }

        },

        hide_Back_Butn: function (flag) {
            var backButn = this.$el.find('.Btn_Back_Custom');
            var menuButn = this.$el.find('.Btn_Menu');
            if (flag) {
                menuButn.removeClass("hidden");
                backButn.addClass("hidden");
            } else {
                backButn.removeClass("hidden");
                menuButn.addClass("hidden");
            }
        },

        _on_Btn_Close_Tap: function (event) {
            this.trigger('Close');
        }

    });

    return Share_View;

});