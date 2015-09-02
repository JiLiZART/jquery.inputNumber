/**
 * @author Nikolay Kostyurin <jilizart@gmail.com>
 *     HTML5 Like enumerable input
 */
(function($) {
    'use strict';

    var InputNumber = function(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    InputNumber.prototype = {

        el: null, // input element
        $el: null, // input element
        $wrap: null, //div wrapper element

        options: null,
        defaults: {
            'negative': true,
            'positive': true,
            'wrapClass': 'ranged-input',
            'inputClass': 'ranged-input__input',
            'upClass': 'ranged-input__up',
            'upTitle': 'Incrase',
            'downClass': 'ranged-input__down',
            'downTitle': 'Decrace'
        },

        init: function() {
            var opts = this.options;
            
            this.$el.wrap($('<div />', {'class':opts.wrapClass}));
            this.$el.after(
                $('<a />', {'class':opts.upClass, 'title':opts.upTitle}),
                $('<a />', {'class':opts.downClass, 'title':opts.downTitle})
            );
            this.$el.addClass(opts.inputClass);
            this.$wrap = this.$el.parent('.'+opts.wrapClass);

            this.bindEvents();
        },

        bindEvents:function() {
            var opts = this.options,
                $el = this.$el,
                self = this;

            this.$wrap
                .delegate('a.' + opts.downClass, 'click', function(e) {
                    self.down();
                    e.preventDefault();
                })
                .delegate('a.' + opts.upClass, 'click', function(e) {
                    self.up();
                    e.preventDefault();
                });

            $el
                .on('change', function(e) {
                    if (e.currentTarget.value === '') e.currentTarget.value = 0;
                })
                .on('keypress', function(e) {
                    var keyCode = window.event ? e.keyCode : e.which;

                    //codes for 0-9
                    if (keyCode < 48 || keyCode > 57) {
                        //codes for backspace, delete, enter
                        if (keyCode !== 0 && keyCode !== 8 && keyCode !== 13 && keyCode !== 45 && !e.ctrlKey) {
                            e.preventDefault();
                        }
                    }
                })
                .bind('mousewheel', function(e, delta) {
                    var defVal = self.defaultElValue(),
                        value = defVal + delta;

                    if (! opts.negative) {
                        if (value >= 0) {
                            e.currentTarget.value = value;
                        }
                    } else if (! opts.positive) {
                        if (value <= 0) {
                            e.currentTarget.value = value;
                        }
                    } else {
                        e.currentTarget.value = value;
                    }
                });
        },

        defaultElValue: function() {
            return parseInt(this.el.value) || 0;
        },

        incrementElValue: function() {
            var val = this.defaultElValue();
            return ++ val;
        },

        decrementElValue: function() {
            var val = this.defaultElValue();
            return -- val;
        },

        up: function() {
            var value = this.incrementElValue();

            if (! this.options.positive) {
                if (value <= 0) {
                    this.el.value = value;
                }
            } else {
                this.el.value = value;
            }
        },

        down: function() {
            var value = this.decrementElValue();

            if (! this.options.negative) {
                if (value >= 0) {
                    this.el.value = value;
                }
            } else {
                this.el.value = value;
            }
        }

    };

    $.fn.inputNumber = function(options) {
        return this.each(function() {
            if (! $.data(this, 'inputNumber')) {
                $.data(this, 'inputNumber', new InputNumber(this, options));
            }
        });
    };

})(jQuery);
