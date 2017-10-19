define(function (require) {

    'use strict';

    var Spinner = require('plugins/spin'),
        Timeout = require('plugins/timeout');

    var Base_Pull_To_Request_View = Backbone.View.extend({

        initialize: function (config) {
            this._Top = 0; // private property. container left position at gesture start
            this.Top = 0; // public property. current container left position

            this._Request_Height = 80;

            this._IOS = window.device ? device.platform === 'iOS' : false;

            this.setElement(config.$el);

            this._init_Spinner();

            window.ff = this;

            this._add_Event_Listeners();
        },

        _add_Event_Listeners: function () {
            if (this._IOS) {
                this.$el.hammer({ drag_lock_to_axis: true }).on("touch dragup dragdown dragend", _.bind(this._handle_Hammer_IOS, this));
            }
            else {
                this.$el.hammer({ drag_lock_to_axis: true }).on("touch dragup dragdown dragend", _.bind(this._handle_Hammer, this));
            }
        },

        _handle_Hammer: function (ev) {
            Timeout.update();

            switch(ev.type) {
                case 'touch':
                    if (this._Is_Spinning) {
                        ev.gesture.preventDefault();
                        ev.gesture.stopDetect();
                        return;
                    }

                    clearInterval(this._Segments_Interval);
                    this._Top = this.Top;
                    break;

                case 'dragup':
                case 'dragdown':
                    if (this.$el[0].scrollTop > 0) {
                        this._Top = - ev.gesture.deltaY * 0.6;
                        return;
                    }

                    var top = ev.gesture.deltaY * 0.6 + this._Top;

                    if (top < 0 && !this._Is_Spinning) {
                        this._Top = - ev.gesture.deltaY * 0.6;
                        this.set_Position(0);
                        return true;
                    }

                    ev.gesture.preventDefault();

                    if (this._Is_Spinning && top <= this._Request_Height) {
                        this.set_Position(this._Request_Height);
                    }
                    else {
                        this.set_Position(top);
                    }

                    break;

                case 'dragend':
//                    var top = ev.gesture.deltaY * 0.6 + this._Top;
                    if (this._Is_Spinning) {
                        this.set_Position(this._Request_Height - 15, true);
                        this.trigger('Update_Requested');
                    }
                    else {
                        this._fade_Segments();
                        this.set_Position(0, true);
                    }

                    break;
            }
        },

        _handle_Hammer_IOS: function (ev) {
            switch(ev.type) {
                case 'touch':
                    if (this._Is_Spinning) {
                        ev.gesture.preventDefault();
                        ev.gesture.stopDetect();
                        return;
                    }

                    clearInterval(this._Segments_Interval);
                    if (this.$el[0].scrollTop < 0) {
                        this.set_Position(-this.$el[0].scrollTop);
                        this.$el[0].scrollTop = 0;
                        this.$el.css('-webkit-overflow-scrolling', 'auto');
                    }
                    this._Top = this.Top;
                    break;

                case 'dragup':
                case 'dragdown':
                    if (this.$el[0].scrollTop < 0) {
                        this.set_Position(-this.$el[0].scrollTop);
                        this.$el[0].scrollTop = 0;
                        this.$el.css('-webkit-overflow-scrolling', 'auto');
                    }

                    if (this.$el[0].scrollTop > 0) {
                        this._Top = - ev.gesture.deltaY * 0.6;
                        return;
                    }

                    var top = ev.gesture.deltaY * 0.6 + this._Top;

                    if (top <= 0 && !this._Is_Spinning) {
                        this._Top = - ev.gesture.deltaY * 0.6;
                        this.set_Position(0);
                        return true;
                    }

                    ev.gesture.preventDefault();

                    if (this._Is_Spinning && top <= this._Request_Height) {
                        this.set_Position(this._Request_Height);
                    }
                    else {
                        this.set_Position(top);
                    }

                    break;

                case 'dragend':
//                    var top = ev.gesture.deltaY * 0.6 + this._Top;
                    if (this._Is_Spinning) {
                        this.set_Position(this._Request_Height - 15, true);
                        this.trigger('Update_Requested');
                    }
                    else {
                        this._fade_Segments();
                        this.set_Position(0, true);
                    }

                    break;
            }
        },

        set_Updating: function () {
            this._set_Spinning();
            this.set_Position(this._Request_Height - 15);
        },

        _set_Spinning: function () {
            var oldSpinner = this._Spinner;

            var opts = {
                corners: 1,
                direction: 1,
                length: 6,
                lines: 12,
                radius: 5,
                rotate: 0,
                speed: 1,
                trail: 10,
                width: 2,
                zIndex: 1,
                top: this.$el.css('top')
            };

            this._Spinner = new Spinner(opts).spin();
            this._Spinner.$el = $(this._Spinner.el);
            this._Spinner.$el.find('> div').addClass('visible');
            this.$el.before(this._Spinner.$el);

            oldSpinner.stop();
            oldSpinner.$el.remove();

            this._Is_Spinning = true;
        },

        refresh: function () {
            setTimeout(_.bind(this._init_Spinner, this), 400);

            this._fade_Segments();
            this.set_Position(0, true);
        },

        _init_Spinner: function () {
            var oldSpinner = this._Spinner;

            var opts = {
                corners: 1,
                direction: 1,
                length: 6,
                lines: 12,
                radius: 5,
                rotate: 0,
                speed: 0,
                trail: 10,
                width: 2,
                zIndex: 1,
                top: this.$el.css('top')
            };

            this._Spinner = new Spinner(opts).spin();
            this._Spinner.$el = $(this._Spinner.el);
            this.$el.before(this._Spinner.$el);

            this._Is_Spinning = false;

            if (oldSpinner) {
                oldSpinner.stop();
                oldSpinner.$el.remove();
            }
        },

        _fade_Segments: function () {
            var visibleSegments = Math.floor( this.Top * 12 / this._Request_Height );
            var timeDelta = 400 / visibleSegments;
            this._Segments_Interval = setInterval(_.bind(function() {
                var visible = this._Spinner.$el.find('> div.visible');
                if (visible.length) {
                    visible.last().removeClass('visible');
                }
                else {
                    clearInterval(this._Segments_Interval);
                }
            }, this), timeDelta);
        },

        set_Position: function (top, animate, silent) {
            this.$el.removeClass("animate");
            this._Spinner.$el.removeClass("animate");

            if (animate) {
                this.$el.addClass("animate");
                this._Spinner.$el.addClass("animate");
            }

            this.Top = top;

            if (this._IOS && top === 0) {
                this.$el.css('-webkit-overflow-scrolling', 'touch');
            }

            this.$el.css("transform", "translate3d(0," + top + "px,0) scale3d(1,1,1)");

            if (!this._Is_Spinning) {
                if (top <= this._Request_Height) {
                    if (!animate) {
                        var visibleSegments = Math.floor( top * 12 / this._Request_Height );
                        var spinnerDivs = this._Spinner.$el.find('> div');
                        spinnerDivs.removeClass('visible');

                        for (var i = 0; i <= visibleSegments; i++) {
                            $(spinnerDivs[i]).addClass('visible');
                        }
                    }
                }
                else {
                    this._set_Spinning();
                }
            }

            this._Spinner.$el.css("transform", "translate3d(0," + top * 0.5 + "px,0) scale3d(1,1,1)");
        }

    });

    return Base_Pull_To_Request_View;

});