define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Bills/Add_Beneficiary_Airtime_View.html'),
        beneficiary_Item_Template = require('text!html/Bills/Bill_Beneficiary_Phone_No.html'),

        AppData = require('js/appData');

    var Add_Beneficiary_Airtime_View = Base_Page_View.extend({

        id: "Add_Beneficiary_Bills",

        template: _.template(template),
        beneficiary_Item_Template: _.template(beneficiary_Item_Template),

        events: _.extend({
            'change input': '_on_Input_Change',
            'tap .Btn_Save': '_on_Btn_Save_Tap',
            'tap #Btn_Contacts': '_on_Btn_Contact_Tap',
            'tap .Beneficiaries .Accounts_List_Item_Account' : '_on_PhoneNo_List_Item_Tap',
            'tap .Beneficiaries .backContact' : '_on_Button_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            this._Beneficiaries_Collection = config.beneficiaries_Collection;
            this._Bills_View = config.billsView;
            this._Data = { };

            Add_Beneficiary_Airtime_View.__super__.initialize.apply(this, [config]);
            
        },

        _render: function () {
            Add_Beneficiary_Airtime_View.__super__._render.apply(this);
            this._Screens = this.$el.find('.v-screen');
            this._Value = this.$el.find('.v-page-content');
            this._Loader = this.$el.find('.v-loader');
        },
        
        _set_Current_Biller: function (billerCode, billerReference) {
            this._Biller = billerCode;
            this._Placeholder = billerReference;
            
            if (this._Placeholder) {
                this.$el.find('#phone_no').attr('placeholder', this._Placeholder);
            }
            else {
                this.$el.find('#phone_no').attr('placeholder', 'Mobile Number');
            }
        },

        _on_Input_Change: function (event) {
            var $el = $(event.currentTarget);

            this._Data[$el.data('property')] = $el.val();
        },

        _on_Btn_Save_Tap: function () {
            Log.write('_Data = ' + JSON.stringify(this._Data));
            Log.write('beneficiaryName = ' + this._Data.alias);
            this.blur_Inputs();

            if (!this._Data.number) {
                return;
            }
            
            /* if (this._Beneficiaries_Collection.findWhere({ beneficiaryReferenceNumber: this._Data.number}) && this._Beneficiaries_Collection.findWhere({ billerCode: this._Biller})) {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'Beneficiary already exists'
                }));
                return;
            } */
            
            if (!this._Data.alias) {
                this._Data.alias = '';
            }
            
            var data = {
                sessionId: AppData.Session_Id,
                beneficiaryName:  this._Data.alias,
                beneficiaryRefNumber: this._Data.number,
                billerCode: this._Biller
            };
            
            this._Loader.fadeIn();
            
            $.ajax({
                type: 'POST',
                url: AppData.Service.createBillBeneficiary,
                data: data,
                success: _.bind(this._on_createBeneficiar_Success, this),
                error: _.bind(this._on_createBeneficiar_Error, this)
            });
            
            var beneficiariesStr = localStorage.getItem('airtimeBeneficiaries');
            var beneficiariesArr = [];

            if (beneficiariesStr) {
                beneficiariesArr = JSON.parse(beneficiariesStr);
            }

            beneficiariesArr.push(this._Data);
            localStorage.setItem('airtimeBeneficiaries', JSON.stringify(beneficiariesArr));

            this._Beneficiaries_Collection.add(new Backbone.Model(this._Data));
        },
        
        _on_createBeneficiar_Success: function (data) {
            Log.write("Success");
            Log.write(data);
            
            if (data.responseCode === 0) {
                this._Bills_View.update_Beneficiaries();
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': data.statusMessage
                }));
            }
            
            this._Loader.fadeOut();
            this.trigger('Close');
        },
        
        _on_createBeneficiar_Error: function (data) {
            Log.write("Error"); 
            Log.write(data);
        },
        
        _on_Btn_Contact_Tap: function () {
            this._Loader.fadeIn();
            var fields = ["phoneNumbers"];
            navigator.contacts.find(fields,  _.bind(this._onSuccess, this) , _.bind(this._onError, this));
        },
        
        _onSuccess: function (contacts) {
            this._Loader.fadeOut();
            this._Loader.hide();
            var domStr = '';
            
            for (var i = 0; i < contacts.length; i++) {          
                if(contacts[i].phoneNumbers)
                {
                    var phoneNo = [];
                   
                    var data = {
                        beneficiaryName: contacts[i].name.formatted,
                        beneficiaryPhoneNumber:  contacts[i].phoneNumbers,
                        modelId: i
                    };

                    domStr = domStr + this.beneficiary_Item_Template(data);
                }
                
                this.$el.find('.Beneficiaries').removeClass('v-screen');
                this.$el.find('.Beneficiaries').addClass('v-screen-phone');
                
                this._Screens.filter('.Beneficiaries').find('.v-list').html(domStr);
                
            }
            
        },

        // onError: Failed to get the contacts

        _onError: function (contactError) {
            this._Loader.fadeOut();
            Log.write('onError!');
           
        },
        
        _on_PhoneNo_List_Item_Tap: function (event) {
            
             this.$el.find('.Beneficiaries').removeClass('v-screen-phone');
             this.$el.find('.Beneficiaries').addClass('v-screen');
           
             this._Value.find('#phone_no').val($(event.currentTarget).text().trim());
            
        },
        
        _on_Button_Tap: function (event) {
            this.$el.find('.Beneficiaries').removeClass('v-screen-phone');
            this.$el.find('.Beneficiaries').addClass('v-screen'); 
        },

        clear: function () {
            this.$el.find('input').val('');

            this._Data = { };

            this.scrollTop();
        }

    });

    return Add_Beneficiary_Airtime_View;

});