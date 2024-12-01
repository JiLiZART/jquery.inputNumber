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
            
            this.$el.wrap($('<div />', {'class':opts.wrapClass}));
            this.$el.after(
                $('<a />', {'class':opts.upClass, 'title':opts.upTitle}),
                $('<a />', {'class':opts.downClass, 'title':opts.downTitle})
            );
            this.$el.addClass(opts.inputClass);
            this.$wrap = this.$el.parent('.'+opts.wrapClass);

            this.bindEvents();
        },

        bindEvents: function() {
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
                    var intVal = self.parseValue(e.currentTarget.value);

                    if (e.currentTarget.value === '' || isNaN(intVal)) {
                        e.currentTarget.value = 0;
                    }

                    if (!isNaN(intVal)) {
                        self.setValue(intVal, e.currentTarget);
                    }
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
                    var defVal = self.value(),
                        value = defVal + delta;

                    self.setValue(self.parseValue(value), e.currentTarget);
                });
        },

        parseValue: function(value) {
            return this.options.decimal !== null ? parseFloat(value).toFixed(this.options.decimal) : parseFloat(value);
        },

        value: function() {
            return this.parseValue(this.el.value) || 0;
        },

        incValue: function() {
            var val = this.value();
            return ++ val;
        },

        decValue: function() {
            var val = this.value();
            return -- val;
        },

        setValue: function(value, el) {
            var opts = this.options;

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

            this.setValue(value, this.el);
        },

        down: function() {
            var value = this.decValue();

            this.setValue(value, this.el);
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
