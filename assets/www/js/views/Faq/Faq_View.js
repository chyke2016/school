define(function (require) {

    'use strict';

    var Base_Page_View = require('base/js/Base_Page_View'),

        template = require('text!html/Faq/Faq_View.html'),
        template_items = require('text!html/Faq/Faq_Items_View.html'),

        AppData = require('js/appData');

    var Faq_View = Base_Page_View.extend({

        id: "Faq",

        template: _.template(template),
        template_items: _.template(template_items),

        events: _.extend({
            'tap .categoryItems .v-list': '_on_List_Item_Tap',
            'tap .categoryName': '_on_Category_Name_Tap'
        }, Base_Page_View.prototype.events),

        initialize: function (config) {
            Faq_View.__super__.initialize.apply(this, [config]);
            
            this._Loader = this.$el.find('.v-loader');
        },

        _render: function () {
            Faq_View.__super__._render.apply(this);

            var versionNo = '0.2';
            $.ajax({
                type: 'GET',
                url: AppData.Service.getFAQ,
                data: {
                    versionNo: versionNo
                },
                success: _.bind(this._on_Fetch_Faq_Success, this),
                error: _.bind(this._on_Fetch_Faq_Error, this)
            });
        },

        _on_Fetch_Faq_Success: function (data) {
            Log.write(JSON.stringify(data));
            this._Loader.fadeOut();

            var domStr = '',
                i = 0;
            if (data.faqCategoriesList) {
                for (i = 0; i < data.faqCategoriesList.length; i++) {
                    domStr = domStr + this.template_items({
                        categoryName: data.faqCategoriesList[i].categoryName,
                        QNAList: data.faqCategoriesList[i].QNAList
                    });
                }

            } else {
                domStr = "<p style='text-align:center; text-align:center; margin: 30px 10px; font-family: HelveticaNeue-Light; font-size: 20px; color: #777;'>No FAQ available</p>"   
            }
            this._Page.find('.v-page-content').html(domStr);
        },

        _on_Fetch_Faq_Error: function (data) {
            Log.write(data);
            this._Loader.fadeOut();
        },

        _on_Category_Name_Tap: function (event) {
            this.$(event.currentTarget).parent().children('.categoryItems').slideToggle('fast');
        },

        _on_List_Item_Tap: function (event) {
            this.$(event.currentTarget).children('.v-list-item.a').slideToggle('fast');
        }

    });

    return Faq_View;
});