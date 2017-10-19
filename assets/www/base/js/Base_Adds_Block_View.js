define(function (require) {

    'use strict';

    var base_Template = require('text!base/html/Base_Adds_Block_View.html');

    var Base_Adds_Block_View = Backbone.View.extend({

        tagName: 'div',

        className: 'v-adds-block',

        base_Template: _.template(base_Template),

        initialize: function (config) {
            this._Offset_Base = 20;
            this._Height = 220;
            this._Top = - this._Offset_Base; // private property. container bottom position at gesture start
            this._Constraint = this._Height - this._Offset_Base;

            this._Bar = null;
            this._Content = null;

            this._render();

            this._add_Event_Listeners();
        },

        _add_Event_Listeners: function () {
            this._Bar.hammer({ drag_lock_to_axis: true }).on("dragup dragdown dragend", _.bind(this._handle_Hammer, this));
        },

        _handle_Hammer: function (ev) {
            ev.stopPropagation();
            ev.gesture.stopPropagation();

            switch(ev.type) {
                case 'dragup':
                case 'dragdown':
                    ev.gesture.preventDefault();

                    var top = ev.gesture.deltaY + this._Top;
                    if ( top > 0 && top < this._Constraint ) {
                        this.set_Position(top);
                    }
                    break;

                case 'dragend':
                    this.set_Expanded( Math.abs(ev.gesture.deltaY + this._Top) < this._Constraint / 2, true );

                    break;
            }
        },

        _render: function () {
            this.$el.html(this.base_Template());
            this._Bar = this.$el.find('> .v-adds-block-bar');
            this._Content = this.$el.find('> .v-adds-block-content');
        },

        set_Position: function (bottom, animate) {
            this.$el.removeClass("animate");

            if (animate) {
                this.$el.addClass("animate");
            }

            this.trigger('Moved', bottom, animate);
            this.$el.css("transform", "translate3d(0," + bottom + "px,0) scale3d(1,1,1)");
        },

        set_Expanded: function (state, animate) {
            this.Expanded = state;
            if ( state ) {
                this._Top = 0;
                this.set_Position(0, animate);
            }
            else {
                this._Top = this._Constraint;
                this.set_Position(this._Top, animate);
            }
        }

    });

    return Base_Adds_Block_View;

});