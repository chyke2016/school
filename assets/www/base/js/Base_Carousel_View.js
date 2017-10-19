define(function (require) {

    'use strict';

    var Timeout = require('plugins/timeout');

    var Base_Carousel_View = Backbone.View.extend({

        initialize: function (config) {
            this.setElement(config.$el);

            this._Left = null; // private property. container left position at gesture start
            this.Left = null; // public property. current container left position
            this._Pane_Width = config.paneWidth;

            this.refresh();

            this._add_Event_Listeners();
        },

        _add_Event_Listeners: function () {
            this.$el.hammer({ drag_lock_to_axis: true }).on("touch swipeleft swiperight dragleft dragright dragend", _.bind(this._handle_Hammer, this));
        },

        _handle_Hammer: function (ev) {
            Timeout.update();

            ev.stopPropagation();
            ev.gesture.stopPropagation();

            switch(ev.type) {
                case 'touch':
                    this._Left = this.Left;
                    break;

                case 'swipeleft':
                    this.next();

//                    console.log('swipeleft');
                    ev.gesture.stopDetect();
                    break;

                case 'swiperight':
                    this.prev();

//                    console.log('swiperight');
                    ev.gesture.stopDetect();
                    break;

                case 'dragright':
                case 'dragleft':
//                    console.log('drag');
                    ev.gesture.preventDefault();
                    var left = ev.gesture.deltaX + this._Left;

                    if (left > 0) {
                        left *= 0.4;
                    }

                    if (left < this._Constraint_left1) {
                        left = (left - this._Constraint_left1)*0.4 + this._Constraint_left1;
                    }

                    this.set_Position(left);

                    break;

                case 'dragend':
//                    console.log('dragend');
                    this._Left = ev.gesture.deltaX + this._Left;

                    if (this._Left >= 0) {
                        this.set_Active_Pane(0);
                        return;
                    }

                    if (this._Left <= this._Constraint_left1) {
                        this.set_Active_Pane(this.Panes.length - 1);
                        return;
                    }

                    var ratio = Math.abs(this._Left / this._Pane_Width);
                    var paneIndex = parseInt(ratio);
                    var shift = ratio - paneIndex;

                    if (shift > 0.5) {
                        this.set_Active_Pane(paneIndex + 1);
                    }
                    else {
                        this.set_Active_Pane(paneIndex);
                    }

                    break;
            }

        },

        refresh: function () {
            this.Panes = this.$el.find('> .v-carousel-item');
            this._Width = this.Panes.length * this._Pane_Width;
            this._Current_Pane_Index = 0;
            this._Constraint_left1 = - this._Width + this._Pane_Width; // Left value if the last pane is active

            this.$el.css('width', this._Width);

            for (var i = 0; i < this.Panes.length; i++) {
                $(this.Panes[i]).css('width', this._Pane_Width);
            }

            this.set_Active_Pane(0, true, false);
        },

        set_Position: function (left, animate) {
            this.$el.removeClass("animate");

            if (animate) {
                this.$el.addClass("animate");
            }

            this.Left = left;

            this.$el.css("transform", "translate3d(" + left + "px,0px,0) scale3d(1,1,1)");
        },

        set_Active_Pane: function (paneIndex, silent, animate) {
            if (animate !== false) {
                animate = true;
            }
            this.set_Position( - paneIndex * this._Pane_Width, animate);
            if ( this._Current_Pane_Index !== paneIndex ) {
                this._Current_Pane_Index = paneIndex;

                this.Panes.removeClass('active');
                this.Panes.filter(function( index ) {
                    return index === paneIndex;
                }).addClass('active');

                if (!silent) {
                    this.trigger('PaneChange', this.Panes[paneIndex], paneIndex);
                }
            }
        },

        next: function () {
            if (this._Current_Pane_Index === this.Panes.length - 1) {
                this.set_Active_Pane(this._Current_Pane_Index, true);
            }
            else {
                this.set_Active_Pane(this._Current_Pane_Index + 1);
            }
        },

        prev: function () {
            if (this._Current_Pane_Index === 0) {
                this.set_Active_Pane(this._Current_Pane_Index, true);
            }
            else {
                this.set_Active_Pane(this._Current_Pane_Index - 1);
            }

        }
    });

    return Base_Carousel_View;

});