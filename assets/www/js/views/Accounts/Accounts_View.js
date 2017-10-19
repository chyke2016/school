/*global $, define, document, _ , window , setTimeout , Backbone , Chart */
define(function (require) {

    'use strict';


    var Base_Page_View = require('base/js/Base_Page_View'),
        Base_Carousel_View = require('base/js/Base_Carousel_View'),

        Transaction_Details_View = require('js/views/Accounts/Transaction_Details_View'),
        Statement_View = require('js/views/Accounts/Statement_View'),

        template = require('text!html/Accounts/Accounts_View.html'),
        account_Template = require('text!html/Accounts/Accounts_View_Account.html'),
        history_Item_Template = require('text!html/Accounts/Accounts_View_History_Item.html'),
        account_Overview_Template = require('text!html/Accounts/Account_Overview_View.html'),
        account_Trends_Template = require('text!html/Accounts/Account_Trends_View.html'),
        account_list_Template = require('text!html/Accounts/Account_list_View.html'),

        AppData = require('js/appData'),
        curCode = require('plugins/currencyCodes'),
        core = require('plugins/core'),
        xml2json = require('plugins/xml2json');

    require('plugins/Chart');

    var Accounts_View = Base_Page_View.extend({

        id: "Accounts",

        _currentSelectedAccount: 0,

        template: _.template(template),
        account_Template: _.template(account_Template),
        history_Item_Template: _.template(history_Item_Template),
        account_Overview_Template: _.template(account_Overview_Template),
        account_Trends_Template: _.template(account_Trends_Template),
        account_list_Template: _.template(account_list_Template),

        events: {
            'tap .v-segmented-control-item': '_on_Segmented_Control_Item_Tap',
            'tap .Account-AccountType .previous': '_swipe_PaneChange_Previous',
            'tap .Account-AccountType .next': '_swipe_PaneChange_Next',
            'tap .AccountHistory .v-list-item': '_on_History_Item_Tap',
            'tap .AccountList .v-list-item': '_on_Account_list_Item_Tap',
            'tap .Btn_Statement': '_on_Btn_Statement_Tap',
            'tap .Btn_Continue': '_on_Btn_Continue_Tap'
        },

        initialize: function (config) {
            this._Accounts_Collection = config.accounts_Collection;
            this._Accounts_Collection_Nairra = config.accounts_Collection_Nairra;
            this._Accounts_Collection_WithoutTD = config.accounts_Collection_WithoutTD;

            this._colors = ['#a8c839', '#2da0a4', '#e83e2a', '#f39221', '#F7464A', '#46BFBD', '#FDB45C'];

            Accounts_View.__super__.initialize.apply(this, [config]);

            this.Chart = Chart;
            this._currentSelectedAccount = 0;
            this._tabbedBarSelected = "activity";
            this._Account_Transactions_Collection = new Backbone.Collection();
            this._Account_Trends = [];
            this._Btn_Continue = this.$el.find('.Btn_Continue');

            this.$el.find('.noDrag').hammer({
                drag_lock_to_axis: true
            }).on("touch dragleft dragright dragend", _.bind(this._handle_Drag, this));
        },

        _render: function () {
            Accounts_View.__super__._render.apply(this);

            this._Loader = this.$el.find('.AccountsPageContentLoader');
            this._specialLoader = this.$el.find('.Account_In_Loader');
            this.Mask = this.$el.find('.v-page-mask');
            this._History = this.$el.find('.AccountHistory');
            this._AccountList = this.$el.find('.AccountList');

            this._inAppAd();

            if (this._Accounts_Collection !== undefined && this._Accounts_Collection.models.length > 0) {
                this.render_Accounts();
            }
        },

        //display the available accounts in Carousel_View
        render_Accounts: function () {
            if (!this._Accounts_Collection.models.length) {
                return;
            }

            //            if (isBBQLike) {
            //                this.$el.find('.Account_List').hide();
            //                this.$el.find('.AccountList').css('top', '70px');
            //            }

            var accountHolder = AppData.Customer_Name.split(' ');
            var domStr = '';
            for (var i = 0; i < this._Accounts_Collection.models.length; i++) {

                var model = this._Accounts_Collection.models[i];
                domStr = domStr + this.account_Template({
                    account: model.get('accountNumber'),
                    accounttype: model.get('accountType'),
                    availablebalance: model.get('availableBalance').substr(0, model.get('availableBalance').length - 3).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    availablebalanceDecimal: model.get('availableBalance').substr(model.get('availableBalance').length - 3),
                    currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                    modelId: i,
                    customerName: accountHolder[0] + ' ' + accountHolder[accountHolder.length - 1].substr(0, 1) + '.',
                    billionaire: model.get('availableBalance') >= 1000000000 ? ' billionaire' : ''
                });
            }

            this._Page.find('.Accounts-carousel').html(domStr);

            this._Accoutns_Carousel = new Base_Carousel_View({
                $el: this._Page.find('.Accounts-carousel'),
                paneWidth: this._Width
            });
            this.listenTo(this._Accoutns_Carousel, 'PaneChange', _.bind(this._on_Account_Change, this));
            this._currentSelectedAccount = 0;
            this.fetch_Activity(this._Accounts_Collection.models[this._currentSelectedAccount].get('accountNumber'));
        },

        _handle_Drag: function (ev) {
            ev.stopPropagation();
            ev.gesture.stopPropagation();
        },

        //fetch the available accounts from webservice and store in _Accounts_Collection
        fetch_Accounts: function (clbk) {
            if (AppData.Get_Error) {
                this._specialLoader.fadeOut();
            } else {
                this._specialLoader.fadeIn();
            }

            this._Btn_Continue.hide();

            $.ajax({
                type: 'GET',
                url: AppData.Service.getAccounts,
                data: {
                    sessionId: AppData.Session_Id
                },
                success: _.bind(this._on_Fetch_Accounts_Success, this),
                error: _.bind(this._on_Fetch_Accounts_Error, this)
            });
        },

        _on_Btn_Continue_Tap: function () {
            this._specialLoader.fadeOut();
        },

        _inAppAd: function () {
            this.$el.find('.v-adds-block-regular').hide();
            this.$el.find('.Account_In_Loader').hammer({
                drag_lock_to_axis: true
            }).on("touch dragleft dragright dragend", _.bind(this._handle_Drag, this));
            this.$el.find('.v-adds-block-regular').html('');

            $.ajax({
                type: 'GET',
                url: AppData.Service.adUrl,
                data: {
                    zoneid: 5
                },
                dataType: 'xml',
                success: _.bind(this._on_Get_Adds_Success, this),
                error: _.bind(this._on_Get_Adds_Error, this)
            });
        },

        _on_Get_Adds_Success: function (data) {
            data = xml2json(data);

            if (data.creativeUrl) {
                this.$el.find('.v-adds-block-regular').show();
                this._adUrl = data.clickUrl;

                this.$el.find('.v-adds-block-regular').html('<img style="display: block; margin: 0 auto;" src="' + data.creativeUrl + '"/>')
            }
        },

        _on_Get_Adds_Error: function (data) {},

        _on_Fetch_Accounts_Success: function (data) {
            if (data.responseCode === 0 && data.accounts && data.accounts.length > 0) {

                var Accounts = {};
                Accounts.accounts = [];
                Accounts.accountsNairra = [];
                Accounts.accountsWithoutTD = [];
                Accounts.swipeAccounts = [];

                $.each(data.accounts, function (i, account) {
                    if (account.availableBalance) {
                        account.availableBalance = parseFloat(account.availableBalance, 10).toFixed(2).toString();
                    }
                    if (account.currencyCode === 566) {
                        //if(Accounts.availableBalance)
                        Accounts.accounts.push(account);
                        Accounts.accountsNairra.push(account);
                    }

                });
                $.each(data.accounts, function (i, account) {
                    if (account.availableBalance) {
                        account.availableBalance = parseFloat(account.availableBalance, 10).toFixed(2).toString();
                    }
                    if (account.currencyCode !== 566) {
                        Accounts.accounts.push(account);
                    }
                });
                $.each(data.accounts, function (i, account) {
                    if (account.availableBalance) {
                        account.availableBalance = parseFloat(account.availableBalance, 10).toFixed(2).toString();
                    }
                    if (account.productCode.indexOf("TD") == -1) {
                        Accounts.accountsWithoutTD.push(account);
                    }
                });
                Accounts.accounts.sort(function sortByValue(a, b) {
                    return b.accountType < a.accountType ? 1 : b.accountType > a.accountType ? -1 : 0;
                });
                Accounts.accountsNairra.sort(function sortByValue(a, b) {
                    return b.accountType < a.accountType ? 1 : b.accountType > a.accountType ? -1 : 0;
                });
                $.each(Accounts.accountsNairra, function (i, account) {
                    Accounts.swipeAccounts.push(account);
                });
                $.each(Accounts.accounts, function (i, account) {
                    if (account.currencyCode !== 566) {
                        Accounts.swipeAccounts.push(account);
                    }
                });
                $.each(Accounts.accountsWithoutTD, function (i, account) {
                    Accounts.swipeAccounts.push(account);
                });

                this._Accounts_Collection.reset(Accounts.accounts);
                this._Accounts_Collection_Nairra.reset(Accounts.accountsNairra);
                this._Accounts_Collection_WithoutTD.reset(Accounts.accountsWithoutTD);
                this.render_Accounts();

                this._Btn_Continue.css({
                    background: '#b4d431'
                });

                this._Btn_Continue.fadeIn();


                if (Accounts.accounts.length > 1) {
                    $('#overview').show();
                    $('#accounts').hide();

                    var domStr = '';
                    for (var i = 0; i < this._Accounts_Collection.models.length; i++) {

                        var model = this._Accounts_Collection.models[i];
                        domStr = domStr + this.account_list_Template({
                            //account: model.get('accountNumber'),
                            accounttype: model.get('accountType'),
                            //availablebalance: model.get('availableBalance'),
                            availablebalance: core.formatBalance(model.get('availableBalance'), 2, '.', ','),
                            //availablebalanceDecimal: model.get('availableBalance').toFixed(2).substr(model.get('availableBalance').toFixed(2).length - 3),
                            currencyAlias: curCode.formatCurrencyCode(model.get('currencyCode')),
                            modelId: i,
                            billionaire: model.get('availableBalance') >= 1000000000 ? ' billionaire' : ''
                        });
                    }

                    //this._HistoryList.find('.Account_List').html(domStr);
                    this._AccountList.filter('.AccountList').find('.v-list').html(domStr);

                    var multipal_account_chart_data = [];

                    for (var i = 0; i < this._Accounts_Collection_Nairra.models.length; i++) {

                        multipal_account_chart_data.push({
                            value: parseFloat(this._Accounts_Collection_Nairra.models[i].get("availableBalance")),
                            color: this._colors[i]
                        })

                        // Set color to account list
                        this.$el.find('.accList').eq(i).children('span.account_bullet').css('background', this._colors[i])
                    }

                    var totalAmountNGN = this.totalAmountNGN();

                    $('#multiple_account_chart').attr('width', '170px');
                    $('#multiple_account_chart').attr('height', '170px');

                    new this.Chart(document.getElementById('multiple_account_chart').getContext("2d")).Doughnut(multipal_account_chart_data, {
                        segmentShowStroke: true,
                        segmentStrokeColor: "#fff",
                        segmentStrokeWidth: 2,
                        percentageInnerCutout: 50,
                        animationSteps: 100,
                        animationEasing: "easeOutSine",
                        animateRotate: true,
                        animateScale: false,
                        barDatasetSpacing: 15,
                        onAnimationBefore: function () {},
                        onAnimationComplete: function () {
                            var c, ctx;
                            c = $('#multiple_account_chart')[0];
                            ctx = c.getContext('2d');
                            ctx.beginPath();
                            ctx.arc($('#multiple_account_chart').width() / 2 + 1, $('#multiple_account_chart').height() / 2, ($('#multiple_account_chart').height()) / 5 + 1, 0, 2 * Math.PI);
                            ctx.fillStyle = "#636466";
                            ctx.fill();
                            ctx.font = '18pt Helvetica';
                            ctx.fillStyle = '#ffffff';
                            ctx.fontStyle = 'bold';
                            ctx.textAlign = 'center';
                            ctx.fillText("₦" + totalAmountNGN,
                                $('#multiple_account_chart').width() / 2,
                                $('#multiple_account_chart').height() * 1.12 / 2);
                        }
                    });
                } else {
                    $('#overview').hide();
                    $('#accounts').show();
                }
            } else {
                document.dispatchEvent(new CustomEvent('alert', {
                    'detail': 'No accounts found.'
                }));
                this.trigger('Account_Null');
            }
        },

        totalAmountNGN: function () {

            var amount = 0;
            $.each(this._Accounts_Collection_Nairra.models, function (i, account) {
                amount += parseFloat(account.get("availableBalance"));

            });

            if (amount < 1000000) {
                amount = parseInt(amount / 1000, 10) + 'K';
            } else if (amount < 1000000000) {
                amount = parseInt(amount / 1000000, 10) + 'M+';
            } else {
                amount = parseInt(amount / 1000000000, 10) + 'B+';
            }
            return amount;
        },

        _on_Fetch_Accounts_Error: function (data) {
            this._specialLoader.fadeOut();
        },

        //fetch the Activity made in a specfic accounts from webservice and store in _Account_Transactions_Collection
        fetch_Activity: function (accountNumber) {
            this._Loader.fadeIn();

            $.ajax({
                type: 'GET',
                url: AppData.Service.getStatement,
                data: {
                    sessionId: AppData.Session_Id,
                    accountNumber: accountNumber
                },
                success: _.bind(this._on_fetch_Activity_Success, this),
                error: _.bind(this._on_fetch_Activity_Error, this)
            });
        },

        _on_fetch_Activity_Success: function (data) {
            this._Loader.fadeOut();

            if (data.responseCode === 0 && data.statement && data.statement.length > 0) {
                this._Account_Transactions_Collection.reset(data.statement);
                this._render_History();
            } else {
                this._Account_Transactions_Collection = new Backbone.Collection();
                this._History.html("<p style='text-align:center; text-align:center; margin: 30px 10px; font-family: HelveticaNeue-Light; font-size: 20px; color: #777;'>No account activity available</p>");
            }
        },

        _on_fetch_Activity_Error: function (data) {
            this._Loader.fadeOut();
        },

        //display the Activity made for a specfic accounts in list view
        _render_History: function () {
            this._History.html('');
            this._History[0].scrollTop = 0;
            if (!this._Account_Transactions_Collection.models.length || !this._Accounts_Collection.models.length) {
                return;
            }

            var domStr = '<div style="background: #f0f0f0;height: 100%; -webkit-transform: translate3d(0,0,0);border-top: 1px solid #ddd;"><ul class="v-list">';

            for (var i = 0; i < this._Account_Transactions_Collection.models.length; i++) {
                var date = new Date(this._Account_Transactions_Collection.models[i].get('date'));

                domStr = domStr + this.history_Item_Template({
                    accAmount: (this._Account_Transactions_Collection.models[i].get('transactionType') === 'D' ? '-' : '') + this._Account_Transactions_Collection.models[i].get('amount'),
                    accDate: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear(),
                    accDes: this._Account_Transactions_Collection.models[i].get('narration'),
                    transactionType: this._Account_Transactions_Collection.models[i].get('transactionType'),
                    currencyAlias: curCode.formatCurrencyCode(this._Accounts_Collection.models[this._currentSelectedAccount].get('currencyCode')),
                    modelId: i
                });
            }

            domStr = domStr + '</ul></div>';

            this._History.html(domStr);
        },

        //triggered when the account is changed from Carousel_View
        _on_Account_Change: function (accountDom) {

            if (this._currentSelectedAccount === $(accountDom).data('model-id')) {
                return;
            } else if ((this._currentSelectedAccount < this._Accounts_Collection.models.length - 1) || (this._currentSelectedAccount === $(accountDom).data('model-id') + 1)) {
                this._currentSelectedAccount = $(accountDom).data('model-id');
                this._tabbedBarSelected = "activity";
                this.$el.find('.v-segmented-control-item').removeClass('active');
                this.$el.find('.AccountsSegmentedControl span:first-child').addClass('active');
                this._display_Tab_Data();
            } else {
                this._Accoutns_Carousel.set_Active_Pane(this._currentSelectedAccount);
            }
        },

        //triggered when the item is tapped from the tabbedbar
        _on_Segmented_Control_Item_Tap: function (event) {
            if ($(event.currentTarget).data('type-id') === this._tabbedBarSelected) {
                $(event.currentTarget).addClass('active');
                return;
            }

            this.$el.find('.v-segmented-control-item').removeClass('active');
            $(event.currentTarget).addClass('active');
            this._tabbedBarSelected = $(event.currentTarget).data('type-id');

            this._display_Tab_Data();
        },

        //display data according to the selected tabbedbar
        _display_Tab_Data: function () {
            switch (this._tabbedBarSelected) {
            case "activity":
                this.fetch_Activity(this._Accounts_Collection.models[this._currentSelectedAccount].get('accountNumber'));
                break;
            case "overview":
                this._render_Overview();
                break;
            case "trends":
                this._fetch_Trends();
                break;
            default:
                return;
            }
        },

        //display the Overview of a/c
        _render_Overview: function () {
            var currentAccModel = this._Accounts_Collection.models[this._currentSelectedAccount],
                cur_Code = curCode.formatCurrencyCode(currentAccModel.get('currencyCode'));

            this._History.html("<div id='accOverview' class='canvasContainer' style= 'width : 100%'> " + this.account_Overview_Template({
                availableBalance: cur_Code + " " + core.formatBalance(currentAccModel.get('availableBalance'), 2, '.', ','),
                bookBalance: cur_Code + " " + core.formatBalance(currentAccModel.get('bookBalance'), 2, '.', ','),
            }) + "</div>");

            this._Page.find('.accountChart').attr('width', $('#accountChartInfo').width());
            this._Page.find('.accountChart').css('display', 'initial');

            var containerHeight = $('body').height() - 250,
                marginHeight = ($('body').height() - 250) * 0.05;

            this._Page.find('.accountChart').attr('height', (containerHeight - marginHeight - 110));

            var data = {
                labels: [' '],
                datasets: [
                    {
                        data: [currentAccModel.get("availableBalance")],
                        fillColor: '#a8c839',
                        strokeColor: '#a8c839'
                        }, {
                        data: [currentAccModel.get("bookBalance")],
                        fillColor: '#2da0a4',
                        strokeColor: '#2da0a4'
                        }
                    ]
            };

            new this.Chart(document.getElementById('accountChart').getContext("2d")).Bar(data, {
                scaleOverride: true,
                scaleSteps: 5,
                scaleStepWidth: currentAccModel.get("availableBalance") > currentAccModel.get("bookBalance") ? currentAccModel.get("availableBalance") / 5 : currentAccModel.get("bookBalance") / 5,
                scaleStartValue: 0,
                scaleLineColor: "rgba(0,0,0,0)",
                scaleLabel: " ",
                scaleGridLineColor: "rgba(0,0,0,0)",
                barDatasetSpacing: 15,
                onAnimationBefore: function () {},
                onAnimationComplete: function () {}
            });
        },

        //fetch and display the trends
        _fetch_Trends: function () {
            this._specialLoader.fadeOut();
            this._Loader.fadeIn();

            var reqData = {
                accountNumber: this._Accounts_Collection.models[this._currentSelectedAccount].get('accountNumber')
            };

            $.ajax({
                type: 'GET',
                url: AppData.Service.accountTrends,
                data: reqData,
                success: _.bind(this._on_accountTrends_Success, this),
                error: _.bind(this._on_accountTrends_Error, this)
            });
        },

        _on_accountTrends_Success: function (data) {
            this._Loader.fadeOut();

            if (parseInt(data.responseCode) === 0 && (data.accountTrends.length === 3 || data.accountTrends.length === 2)) {
                this._Account_Trends = data.accountTrends;
                this._History.html("<div id='trendsAv' class='canvasContainer'>" + this.account_Trends_Template() + "</div>");

                this._sort_Trends();
            } else {
                this._History.html("<p style='text-align:center; text-align:center; margin: 30px 10px; font-family: HelveticaNeue-Light; font-size: 20px; color: #777;'>No trends available</p>");
            }
        },

        _sort_Trends: function () {
            var now = new Date(),
                date = null,
                max = null;

            $.each(this._Account_Trends, function (i, trend) {
                date = new Date(trend.month + '/01/' + now.getFullYear());
                if (date > now) {
                    trend.month = new Date(trend.month + '/01/' + (now.getFullYear() - 1).toString());
                } else {
                    trend.month = date;
                }
            });

            this._Account_Trends.sort(function sortByValue(a, b) {
                return b.month < a.month ? 1 : b.month > a.month ? -1 : 0;
            });

            this._scale_Trends();
        },

        _scale_Trends: function () {
            var max = this._Account_Trends[0].totalCredit,
                unit = 'K',
                divider = 1000;
            $.each(this._Account_Trends, function (i, trend) {
                if (trend.totalCredit > max) {
                    max = trend.totalCredit;
                }
                if (trend.totalDebit > max) {
                    max = trend.totalDebit;
                }
            });
            if (max <= 10000) {
                max = Math.round((parseFloat((max / 10000).toFixed(1)) + 0.1) * 10000);
            } else if (max < 100000) {
                max = Math.round((parseFloat((max / 100000).toFixed(1)) + 0.1) * 100000);
            } else if (max < 1000000) {
                max = Math.round((parseFloat((max / 1000000).toFixed(1)) + 0.1) * 1000000);
            } else if (max < 1000000000) {
                max = Math.ceil(max / 1000000) * 1000000;
                divider = 1000000;
                unit = 'M';
            } else if (max > 1000000000) {
                max = Math.ceil(max / 1000000000) * 1000000000;
                divider = 1000000000;
                unit = 'B';
            }

            var data = {
                labels: [],
                datasets: [
                    {
                        data: [],
                        fillColor: '#a8c839',
                        strokeColor: '#a8c839'
                    }, {
                        data: [],
                        fillColor: '#e83e2a',
                        strokeColor: '#e83e2a'
                    }
                ]
            };

            $.each(this._Account_Trends, function (i, trend) {
                data.labels.push(trend.month.format('mmm'));

                data.datasets[0].data.push(trend.totalCredit / divider);
                data.datasets[1].data.push(trend.totalDebit / divider);
            });

            this._Page.find('#trendsChart').attr('width', $('#trendsAv .headerDiv').width());
            this._Page.find('#trendsChart').css('display', 'initial');

            var containerHeight = $('body').height() - 250,
                marginHeight = ($('body').height() - 250) * 0.05;

            this._Page.find('#trendsChart').attr('height', (containerHeight - marginHeight - 110));

            new this.Chart(document.getElementById('trendsChart').getContext("2d")).Bar(data, {
                scaleOverride: true,
                scaleSteps: 2,
                scaleStepWidth: max / divider / 2,
                scaleStartValue: 0,
                scaleLineColor: 'rgba(0,0,0,0.5)',
                scaleLabel: '<%=value%>' + unit,
                scaleShowGridLines: false,
                scaleGridLineColor: "rgba(0,0,0,.5)",
                scaleFontStyle: "bold",
                barDatasetSpacing: 15,
                onAnimationBefore: function () {},
                onAnimationComplete: function () {}
            });
        },

        _on_accountTrends_Error: function (data) {
            this._Loader.fadeOut();
            this._History.html('');
            document.dispatchEvent(new CustomEvent('alert', {
                'detail': 'No trends available.'
            }));
        },

        _swipe_PaneChange_Previous: function () {
            if (this._currentSelectedAccount > 0) {
                this._Accoutns_Carousel.set_Active_Pane(this._currentSelectedAccount - 1);
            }
        },

        _swipe_PaneChange_Next: function () {
            if (this._currentSelectedAccount < this._Accounts_Collection.models.length - 1) {
                this._Accoutns_Carousel.set_Active_Pane(this._currentSelectedAccount + 1);
            }
        },

        _swipe_PaneChange_Account: function (id) {
            if (this._currentSelectedAccount < this._Accounts_Collection.models.length - 1) {
                this._Accoutns_Carousel.set_Active_Pane(id);
            }
        },

        clear: function () {
            this._currentSelectedAccount = 0;
            this._Account_Transactions_Collection = new Backbone.Collection();

            this._Accounts_Collection = new Backbone.Collection();
            this._Accounts_Collection_Nairra = new Backbone.Collection();
            this._Accounts_Collection_WithoutTD = new Backbone.Collection();
            this._Account_Trends = [];

            this.$el.find('.v-segmented-control-item').removeClass('active');
            this.$el.find('.AccountsSegmentedControl span:first-child').addClass('active');
        },

        _on_History_Item_Tap: function (event) {
            this.blur_Inputs();

            var model = this._Account_Transactions_Collection.models[$(event.currentTarget).data('model-id')];
            var currency_code = curCode.formatCurrencyCode(this._Accounts_Collection.models[this._currentSelectedAccount].get('currencyCode'));
            if (!this._Transaction_Details_View) {
                this._Transaction_Details_View = new Transaction_Details_View({
                    width: this._Width
                });
            }

            this._Transaction_Details_View.set_Config(model, currency_code);
            this.trigger('View_Change_Requested', this._Transaction_Details_View);
        },

        _on_Account_list_Item_Tap: function (event) {
            $('#overview').hide();
            $('#accounts').show();
            this.$el.find('.AccountsSegmentedControl span:nth-child(2)').addClass('active');
            this.$el.find('.AccountsSegmentedControl span:first-child').removeClass('active');

            this._swipe_PaneChange_Account($(event.currentTarget).data('model-id'));
            this._render_Overview();
        },

        _on_Btn_Statement_Tap: function () {

            if (!this['_Statement_View']) {
                this._Statement_View = new Statement_View({
                    width: this._Width,
                    accounts: this._Accounts_Collection
                });
                var view = this._Statement_View;

            } else {
                var view = this['_Statement_View'];
            }

            view.clear();
            this.trigger('View_Change_Requested', view);
        }
    });

    return Accounts_View;
});