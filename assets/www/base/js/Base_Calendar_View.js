define(function (require) {

    'use strict';

    var Base_Carousel_View = require('base/js/Base_Carousel_View'),

        template = require('text!base/html/Base_Calendar_View.html'),
        item_Template = require('text!base/html/Base_Calendar_View_Item.html');

    var Base_Calendar_View = Backbone.View.extend({

        template: _.template(template),
        item_Template: _.template(item_Template),

        events: {
            'tap .Btn_Calendar_Prev.active': '_on_Btn_Prev_Tap',
            'tap .Btn_Calendar_Next.active': '_on_Btn_Next_Tap',
            'tap .v-calendar-day.active': '_on_Day_Tap'
        },

        initialize: function (config) {
            this.setElement(config.$el);

            this._Range = config.range;

            this._Width = config.width;

            this._render();

            this._Carousel = new Base_Carousel_View({
                $el: this.$el.find('.v-calendar-carousel'),
                paneWidth: this._Width
            });

            this.listenTo(this._Carousel, 'PaneChange', _.bind(this._on_Pane_Change, this));

            this._add_Event_Listeners();
        },

        _add_Event_Listeners: function () {
            this.$el.hammer();
        },

        _on_Pane_Change: function (pane, paneIndex) {
            if (paneIndex === 0) {
                this._Btn_Prev.removeClass('active');
                this._Btn_Prev.find('span').fadeOut();
            }
            else {
                this._Btn_Prev.addClass('active');
                this._Btn_Prev.find('span').fadeIn();
            }

            if (paneIndex === this._Carousel.Panes.length - 1) {
                this._Btn_Next.removeClass('active');
                this._Btn_Next.find('span').fadeOut();
            }
            else {
                this._Btn_Next.addClass('active');
                this._Btn_Next.find('span').fadeIn();
            }
        },

        _on_Day_Tap: function (event) {
            var el = $(event.currentTarget);
            var carouselItem = el.parents('.v-carousel-item');

            this.trigger('DayTap', {
                year: carouselItem.data('year'),
                month: carouselItem.data('month'),
                day: el.data('day')
            });
        },

        _render: function () {
            this.$el.html(this.template());
            this.$el.find('.v-calendar-controls').css('width', this._Width);

            this._Btn_Prev = this.$el.find('.Btn_Calendar_Prev');
            this._Btn_Next = this.$el.find('.Btn_Calendar_Next');

            this._Date = new Date();
            var today = this._Date.getDate();
            var month = this._Date.getMonth();
            var year = this._Date.getFullYear();

            // this._Range.from // from month. current month is 0

            year = year + Math.floor((month + this._Range.from) / 12);
            month = (month + this._Range.from) % 12;

            for (var i = this._Range.from; i <= this._Range.to; i++) {
                this._render_Item(year, month);

                if (month === 11) { // next year
                    month = -1;
                    year = year + 1;
                }

                month = month + 1;
            }
        },

        _render_Item: function (year, month) {
            var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            var title = monthsArray[month] + ' ' + year;
            var skipDaysStart = new Date(year, month, 1).getDay();
            var days = new Date(year, month + 1, 0).getDate();

            var items = [];

            for (var i = 0; i < skipDaysStart; i++) {
                items.push('');
            }

            for (var i = 1; i <= days; i++) {
                items.push(i);
            }

            var skipDaysEnd = 7 - items.length % 7;

            for (var i = 0; i < skipDaysEnd; i++) {
                items.push('');
            }

            this.$el.find('.v-calendar-carousel').append(this.item_Template({
                title: title,
                year: year,
                month: month,
                items: items
            }));

        },

        set_Active: function (dateStart) {
            var panes = this._Carousel.Panes;
            var startPaneId = -1;

            for (var i = 0; i < panes.length; i++) {

                var pane = $(panes[i]);

                if (pane.data('year') === dateStart.year && pane.data('month') === dateStart.month) {
                    startPaneId = i;
                }

                if (startPaneId === i) {
                    var days = pane.find('.v-calendar-item-content-days .v-calendar-day');

                    for (var k = 0; k < days.length; k++) {
                        if ($(days[k]).data('day') >= dateStart.day) {
                            $(days[k]).addClass('active');
                        }
                    }
                }

                if (startPaneId < i && startPaneId > -1) {
                    var days = pane.find('.v-calendar-item-content-days .v-calendar-day');

                    for (var k = 0; k < days.length; k++) {
                        if ($(days[k]).data('day')) {
                            $(days[k]).addClass('active');
                        }
                    }
                }
            }

        },

        set_Selected: function (date) {
            var panes = this._Carousel.Panes;

            for (var i = 0; i < panes.length; i++) {
                var pane = $(panes[i]);
                if (pane.data('year') === date.year && pane.data('month') === date.month) {
                    pane.find('.v-calendar-item-content-days .v-calendar-day[data-day="' + date.day + '"]').addClass('selected');
                    break;
                }
            }

        },

        set_Selected_Interval: function (from, to) {
            var panes = this._Carousel.Panes;
            var startPaneId = -1;
            var endPaneId;

            for (var i = 0; i < panes.length; i++) {
                var pane = $(panes[i]);
                if (startPaneId < 0 && pane.data('year') === from.year && pane.data('month') === from.month) {
                    startPaneId = i;
                }
                if (pane.data('year') === to.year && pane.data('month') === to.month) {
                    endPaneId = i;
                    break;
                }
            }

            for (var i = startPaneId; i <= endPaneId; i++) {
                var days = $(panes[i]).find('.v-calendar-item-content-days .v-calendar-day.active');

                for (var k = 0; k < days.length; k++) {
                    var day = $(days[k]).data('day');

                    if (i === startPaneId) {
                        if (day === from.day) {
                            $(days[k]).addClass('selected').addClass('selected-from');
                        }
                        if (day > from.day) {
                            if (startPaneId !== endPaneId || day < to.day) {
                                $(days[k]).addClass('selected-interval');
                            }
                        }
                    }

                    if (i === endPaneId) {
                        if (day === to.day) {
                            $(days[k]).addClass('selected').addClass('selected-to');
                        }
                        if (day < to.day && startPaneId !== endPaneId) {
                            $(days[k]).addClass('selected-interval');
                        }
                    }

                    if (i > startPaneId && i < endPaneId) {
                        $(days[k]).addClass('selected-interval');
                    }
                }
            }

        },

        remove_Active: function () {
            this.$el.find('.v-calendar-item-content-days .v-calendar-day').removeClass('active');
        },

        remove_Selected: function () {
            this.$el.find('.v-calendar-item-content-days .v-calendar-day').removeClass('selected');
        },

        remove_Selected_Interval: function () {
            this.$el.find('.v-calendar-item-content-days .v-calendar-day').removeClass('selected').removeClass('selected-from').removeClass('selected-to').removeClass('selected-interval');
        },



        _on_Btn_Prev_Tap: function () {
            this._Carousel.prev();
        },

        _on_Btn_Next_Tap: function () {
            this._Carousel.next();
        }

    });

    return Base_Calendar_View;

});