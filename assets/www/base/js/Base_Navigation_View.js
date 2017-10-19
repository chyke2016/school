define(function (require) {

    'use strict';

    var AppData = require('js/appData');

    var Base_Navigation_View = Backbone.View.extend({

        tagName: 'div',

        className: 'v-navigation',

        initialize: function (config) {
            this._History = [];
            this._Offset_Base = 48;
            this._Width = config.width;
            this._Menu_Constraint_left2 = this._Width - this._Offset_Base;
        },

        set_Prev_TopMost_View: function (view) {
            if (this._Prev_TopMost_View) {
                this._Prev_TopMost_View.$el.removeClass('v-prev-topmost');
            }
            this._Prev_TopMost_View = view;
            this._Prev_TopMost_View.$el.addClass('v-prev-topmost');
        },

        set_TopMost_View: function (view) {
            if (this._TopMost_View) {
                this.stopListening(this._TopMost_View, 'Moved');
                this.stopListening(this._TopMost_View, 'DragEnd');
                this._TopMost_View.$el.removeClass('v-topmost');
            }

            this._TopMost_View = view;
            this._TopMost_View.$el.addClass('v-topmost');
            this.listenTo(this._TopMost_View, 'Moved', _.bind(this._on_TopMost_View_Moved, this));
            this.listenTo(this._TopMost_View, 'DragEnd', _.bind(this._on_TopMost_View_DragEnd, this));
        },

        _on_TopMost_View_Moved: function (left, animate) {
            if (!this._Prev_TopMost_View ) {
                return;
            }
            if (this._Menu_View && this._Prev_TopMost_View.cid === this._Menu_View.cid) {
                this._Prev_TopMost_View.set_Position( ( left - this._Menu_Constraint_left2 ) / 2, animate);
//                this._Prev_TopMost_View.set_Background_Color(70 + 70 * left / this._Constraint);
            }
            else {
                this._Prev_TopMost_View.set_Position( ( left - this._Width ) / 2, animate);
            }
        },

        _on_TopMost_View_DragEnd: function (left) {
            if (!this._Prev_TopMost_View ) {
                return;
            }
            if (this._Menu_View && this._Prev_TopMost_View.cid === this._Menu_View.cid) {
                if (left < this._Menu_Constraint_left2 / 2 ) {
                    this._TopMost_View.Mask.hide();
                    this._TopMost_View.set_Position(0, true);
                }
                else {
                    this._TopMost_View.Mask.show();
                    this._TopMost_View.set_Position(this._Menu_Constraint_left2, true);
                }
            }
            else {
                if (left < this._Width / 2 ) {
                    this._TopMost_View.set_Position(0, true);
                }
                else {
                    this.pop();
                }
            }
        },

        pop: function () {
            if (AppData.Transaction_Active) {
                return;
            }

            this._TopMost_View.blur_Inputs();
            this._TopMost_View.set_Position(this._Width, true);

            setTimeout(_.bind(function(){
                this._TopMost_View.clear();
                this._History.pop();
                this.set_TopMost_View(this._Prev_TopMost_View);
                if (this._History.length >= 2) {
                    this.set_Prev_TopMost_View(this._History[this._History.length - 2]);
                }
                else {
                    if (this._Menu_View) {
                        this.set_Prev_TopMost_View(this._Menu_View);
                    }
                }
            }, this), 400);
        },

        switch_View: function (view, animate) {
            if (AppData.Transaction_Active) {
                return;
            }

            if (this._TopMost_View) {

                switch (this._TopMost_View.Left) {

                    // full page view
                    case 0:
                        view.set_Position(this._Width, false);
                        this.set_Prev_TopMost_View(this._TopMost_View);
                        break;

                    // collapsed page view
                    case this._Menu_Constraint_left2:
                        view.set_Position(this._Menu_Constraint_left2, false);
                        this.set_Prev_TopMost_View(this._Menu_View);
                        break;
                }

                this.set_TopMost_View(view);
                setTimeout(_.bind(function(){this._TopMost_View.set_Position(0, true);}, this), 1);
            }
            else {
                this.set_TopMost_View(view);
                this._TopMost_View.set_Position(0, false);
            }

            this._History.push(view);
        }

    });

    return Base_Navigation_View;

});