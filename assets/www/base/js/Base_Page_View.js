define(function (require) {

    'use strict';

    var AppData = require('js/appData'),
        Timeout = require('plugins/timeout'),

        baseTemplate = require('text!base/html/Base_Page_View.html');

    var Base_Page_View = Backbone.View.extend({

        tagName: 'div',

        baseTemplate: _.template(baseTemplate),

        className: 'v-page-wrapper',

        events: {
            'focus input': '_input_Focus',
            'blur input': '_input_Blur'
        },

        initialize: function (config) {
            this._Offset_Base = 48;
            this._Width = config.width;
            this._Left = 0; // private property. container left position at gesture start
            this.Left = 0; // public property. current container left position

            this.Constraint = {
                left1: 0,
                left2: this._Width - this._Offset_Base
            };

            this._render();

            this._add_Event_Listeners();
        },

        _input_Focus: function (event) {
            this.Input_Focused = $(event.currentTarget);
        },

        _input_Blur: function (event) {
            this.Input_Focused = false;
        },

        _add_Event_Listeners: function () {
            this._Page.hammer({ drag_lock_to_axis: true }).on("touch dragleft dragright dragend", _.bind(this._handle_Page, this));
            this._Page.find('.v-segmented-control-item').hammer({ drag_lock_to_axis: true }).on("touch dragleft dragright dragend release", _.bind(this._handle_Segmented, this));
        },

        _handle_Segmented: function (ev) {
            Timeout.update();
            if (ev.gesture.startEvent.srcEvent.currentTarget !== ev.currentTarget) {
                return;
            }

            var $el = $(ev.currentTarget);

            switch(ev.type) {
                case 'touch':
                    ev.gesture.stopPropagation();
                    ev.stopPropagation();
                    $(ev.currentTarget).addClass('active');
                    break;

                case 'dragright':
                case 'dragleft':
                    ev.gesture.stopPropagation();
                    ev.stopPropagation();
                    ev.gesture.preventDefault();
                    if (ev.gesture.target !== ev.currentTarget) {
                        $(ev.currentTarget).removeClass('active');
                    }
                    break;

                case 'dragend':
                    ev.gesture.stopPropagation();
                    ev.stopPropagation();
                    break;

                case 'release':
                    $(ev.currentTarget).removeClass('active');
                    break;
            }
        },

        _handle_Page: function (ev) {
            Timeout.update();
            if (AppData.Transaction_Active) {
                return;
            }

            ev.stopPropagation();
            ev.gesture.stopPropagation();

            switch(ev.type) {
                case 'touch':
                    this._Left = this.Left;
                    break;

                case 'dragright':
                case 'dragleft':
                    ev.gesture.preventDefault();

                    if (this.Input_Focused) {
                        return;
                    }

                    var left = ev.gesture.deltaX + this._Left;

                    if (left >= this.Constraint.left1 && left <= this.Constraint.left2 ) {
                        this.set_Position(left);
                        return;
                    }

                    if (left < this.Constraint.left1 ) {
                        this.set_Position(this.Constraint.left1);
                        return;
                    }

                    if (left > this.Constraint.left2) {
                        this.set_Position(this.Constraint.left2);
                        return;
                    }

                    break;

                case 'dragend':
                    if (this.Input_Focused) {
                        return;
                    }

                    var left = ev.gesture.deltaX + this._Left;

                    if (left >= this.Constraint.left1 && left <= this.Constraint.left2 ) {
                        this.trigger('DragEnd', left);
                        return;
                    }

                    if (left < this.Constraint.left1 ) {
                        this.trigger('DragEnd', this.Constraint.left1);
                        return;
                    }

                    if (left > this.Constraint.left2) {
                        this.trigger('DragEnd', this.Constraint.left2);
                        return;
                    }

                    break;
            }
        },

        _render: function () {
            this.$el.html(this.baseTemplate());
            this.Mask = this.$el.find('.v-page-mask');
            this._Page = this.$el.find('> .v-page');
            this._Page.append(this.template());

            this._Scrolls = this._Page.find('.v-scrollable');
        },

        set_Position: function (left, animate, silent) {
            this._Page.removeClass("animate");

            if (animate) {
                this._Page.addClass("animate");
                AppData.Transaction_Active = true;
                setTimeout(_.bind(function(){AppData.Transaction_Active = false;}, this), 400);
            }

            this.Left = left;
            if (!silent) {
                this.trigger('Moved', left, animate);
            }
            this._Page.css("transform", "translate3d(" + left + "px,0,0) scale3d(1,1,1)");

        },

        set_Background_Color: function (value) {
            var value = Math.round(value);
            this._Page.css('background-color', 'rgb(' + value + ',' + value + ',' + value + ')');
        },

        clear: function () {},

        scrollTop: function () {
            for (var i = 0; i < this._Scrolls.length; i++) {
                this._Scrolls[i].scrollTop = 0;
            }
        },

        blur_Inputs: function () {
            if (this.Input_Focused) {
                this.Input_Focused.blur();
            }
        }

//        remove: function () {
//
//        }

    });

    return Base_Page_View;

});


