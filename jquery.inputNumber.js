/**
 * @author Nikolay Kostyurin <jilizart@gmail.com>
 * @version 0.1.3 HTML5 Like enumerable input
 */

// Uses CommonJS, AMD or browser globals to create a jQuery plugin.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var InputNumber = function InputNumber(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    InputNumber.prototype = {
        el: null, // input element
        $el: null, // input element
        $wrap: null, //div wrapper element
        $up: null,
        $down: null,

        options: null,
        defaults: {
            min: -Infinity,
            max: Infinity,
            negative: true,
            positive: true,
            decimal: null,
            wrapClass: 'ranged-input',
            inputClass: 'ranged-input__input',
            upClass: 'ranged-input__up',
            upTitle: 'Incrase',
            downClass: 'ranged-input__down',
            downTitle: 'Decrace'
        },

        init: function() {
            var opts = this.options;

            this.$up = $('<button type="button" />', {'class':opts.upClass, 'title':opts.upTitle});
            this.$down = $('<button type="button" />', {'class':opts.downClass, 'title':opts.downTitle});
            
            this.$el.wrap($('<div />', {'class':opts.wrapClass}));
            this.$el.after(this.$up, this.$down);
            this.$el.addClass(opts.inputClass);
            this.$wrap = this.$el.parent('.'+opts.wrapClass);

            this.bindEvents();

            this.setValueTo(this.valueFrom(this.el), this.el);
        },

        bindEvents: function() {
            var opts = this.options,
                $el = this.$el,
                self = this;

            this.$wrap
                .delegate('button.' + opts.downClass, 'click', function(e) {
                    self.down();
                    e.preventDefault();
                })
                .delegate('button.' + opts.upClass, 'click', function(e) {
                    self.up();
                    e.preventDefault();
                });

            $el
                .on('change.inputNumber', function(e) {
                    self.setValueTo(self.valueFrom(e.currentTarget), e.currentTarget);
                })
                .on('keypress.inputNumber', function(e) {
                    var keyCode = window.event ? e.keyCode : e.which;

                    //codes for 0-9
                    if (keyCode < 48 || keyCode > 57) {
                        //codes for backspace, delete, enter
                        if (keyCode !== 0 && keyCode !== 8 && keyCode !== 13 && keyCode !== 45 && !e.ctrlKey) {
                            e.preventDefault();
                        }
                    }
                })
                .bind('mousewheel.inputNumber', function(e, delta) {
                    self.setValueTo(self.parseValue(self.valueFrom(e.currentTarget) + delta), e.currentTarget);
                });
        },

        parseValue: function(value) {
            return this.options.decimal !== null ? 
                parseFloat(parseFloat(value).toFixed(this.options.decimal)) : 
                parseFloat(value);
        },

        valueFrom: function(target = this.el) {
            var val = this.parseValue(target.value);

            if (isNaN(val)) {
                return 0;
            }

            return val;
        },

        value: function() {
            return this.valueFrom(this.el);
        },

        incValue: function() {
            var val = this.value();
            return ++ val;
        },

        decValue: function() {
            var val = this.value();
            return -- val;
        },

        setValueTo: function(value, el) {
            var opts = this.options;

            this.$up.attr('disabled', !isNaN(opts.max) && value >= opts.max);
            this.$down.attr('disabled', !isNaN(opts.min) && value <= opts.min);

            if (value < opts.min) {
                el.value = opts.min;
                return;
            }

            if (value > opts.max) {
                el.value = opts.max;
                return;
            }

            if (opts.positive && opts.negative) {
                el.value = value;
                return;
            }

            if (opts.positive && value < 0) {
                el.value = 0;
                return;
            }

            if (opts.negative && value > 0) {
                el.value = 0;
                return;
            }

            el.value = value;

            return;
        },

        up: function() {
            var value = this.incValue();

            this.setValueTo(value, this.el);
        },

        down: function() {
            var value = this.decValue();

            this.setValueTo(value, this.el);
        }

    };

    $.fn.inputNumber = function(options) {
        return this.each(function() {
            if (!$.data(this, 'inputNumber')) {
                $.data(this, 'inputNumber', new InputNumber(this, options));
            }
        });
    };
}));
