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

    var initDisabledState = function($element, options) {
        var value = parseInt($element.val());
        if (isNaN(value)) {
            value = 0;
        }
        $element.parent().find('.' + options.upClass).attr('disabled', !isNaN(options.max) && value >= options.max);
        $element.parent().find('.' + options.downClass).attr('disabled', !isNaN(options.min) && value <= options.min);
    };

    var filterValue = function($element, options) {
        var value = $element.val();

        if (!isNaN(options.min) && value < options.min) {
            $element.val(options.min);
        }

        if (!isNaN(options.max) && value > options.max) {
            $element.val(options.max);
        }

        initDisabledState($element, options);
    };

    InputNumber.prototype = {

        el: null, // input element
        $el: null, // input element
        $wrap: null, //div wrapper element

        options: null,
        defaults: {
            'wrapClass': 'ranged-input',
            'upClass': 'up',
            'upTitle': 'incrase',
            'downClass': 'down',
            'downTitle': 'decrace',
            'min': NaN,
            'max': NaN
        },

        init: function() {
            var opts = this.options;

            var minValue = parseInt(this.el.min);
            if (!isNaN(minValue)) {
                this.options.min = minValue;
            }

            var maxValue = parseInt(this.el.max);
            if (!isNaN(maxValue)) {
                this.options.max = maxValue;
            }

            this.$el.wrap($('<div />', {'class':opts.wrapClass}));
            this.$el.after(
                $('<button />', {'class':opts.upClass, 'title':opts.upTitle}),
                $('<button />', {'class':opts.downClass, 'title':opts.downTitle})
            );
            this.$wrap = this.$el.parent('.'+opts.wrapClass);

            this.bindEvents();
            initDisabledState(this.$el, opts);
        },

        bindEvents:function() {
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
                .on('change', function(e) {
                    if (e.currentTarget.value === '') e.currentTarget.value = 0;
                    filterValue($el, opts);
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
                    self.setValue(self.defaultElValue() + delta);
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
            this.setValue(value);
        },

        down: function() {
            var value = this.decrementElValue();
            this.setValue(value);
        },
        setValue: function(value) {
            value = parseInt(value);

            if (isNaN(value)) {
                return false;
            }

            if (!isNaN(this.options.min) && value < this.options.min) {
                return false;
            }

            if (!isNaN(this.options.max) && value > this.options.max) {
                return false;
            }

            this.$el.val(value).change();

            return true;
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
