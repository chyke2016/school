define(function (require) {

    'use strict';

    var baseTemplate = require('text!base/html/Base_Switcher_View.html'),
        Timeout = require('plugins/timeout');

    var Base_Switcher_View = Backbone.View.extend({

        tagName: 'div',

        baseTemplate: _.template(baseTemplate),

        className: 'v-switcher',

        initialize: function (config) {
            this._Left = 0; // private property. container left position at gesture start
            this.Left = 0; // public property. current container left position
            this._Width = 60;
            this._Constraint = 28;
            this._Parent_Node = config.parentNode;

            this._render();

            this._Btn = this.$el.find('.v-switcher-btn');

            this._add_Event_Listeners();
        },

        _add_Event_Listeners: function () {
            this.$el.hammer().on("tap", _.bind(this._handle_Hammer, this));
            this._Btn.hammer({ drag_lock_to_axis: true }).on("touch dragleft dragright dragend", _.bind(this._handle_Hammer, this));
        },

        _handle_Hammer: function (ev) {
            Timeout.update();

            ev.stopPropagation();
            ev.gesture.stopPropagation();

            switch(ev.type) {
                case 'touch':
                    this._Left = this.Left;
                    break;

                case 'tap':
                    if (this.Left === 0) {
                        this.set_Position(this._Constraint, true);
                        this.trigger('Change', 'right');
                    }
                    else {
                        this.set_Position(0, true);
                        this.trigger('Change', 'left');
                    }
                    break;

                case 'dragright':
                case 'dragleft':
                    ev.gesture.preventDefault();
                    var left = ev.gesture.deltaX + this._Left;
                    if ( left > 0 && left < this._Constraint ) {
                        this.set_Position(left);
                    }
                    break;

                case 'dragend':
                    var ratio = this.Left / this._Constraint;

                    if (ratio > 0.5) {
                        this.set_Position(this._Constraint, true);
                        if (this._Left !== this.Left) {
                            this.trigger('Change', 'right');
                        }

                    }
                    else {
                        this.set_Position(0, true);
                        if (this._Left !== this.Left) {
                            this.trigger('Change', 'left');
                        }
                    }

                    break;
            }

        },

        _render: function () {
            this.$el.html(this.baseTemplate());
            if (this._Parent_Node) {
                this._Parent_Node.append(this.$el);
            }
        },

        set_Position: function (left, animate) {
            this._Btn.removeClass("animate");

            if (animate) {
                this._Btn.addClass("animate");
            }

            this.Left = left;

            this._Btn.css("transform", "translate3d(" + left + "px,0px,0) scale3d(1,1,1)");
        }

    });

    return Base_Switcher_View;

});