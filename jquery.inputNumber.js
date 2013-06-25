/**
 * @author Nikolay Kostyurin <jilizart@gmail.com>
 *     HTML5 Like enumerable input
 */
(function($){
    "use strict";

    var InputNumber = function(options, $el) {
        this.$el = $el;
        this.options = $.extend( {}, this.defaults, options );
        this.init();
    };

    InputNumber.prototype = {

        $el: null, // input element
        $wrap: null, //div wrapper element

        options: null,
        defaults: {
            negative: true,
            positive: true,
            wrapClass: 'ranged-input',
            upClass: 'up',
            upTitle: 'Incrase',
            downClass: 'down',
            downTitle: 'Decrace'
        },

        init: function() {
            var opts = this.options;
            
            this.$el.wrap($('<div />', {'class':opts.wrapClass}));
            this.$el.after(
                $('<a />', {'class':opts.upClass, 'title':opts.upTitle}),
                $('<a />', {'class':opts.downClass, 'title':opts.downTitle})
            );
            this.$wrap = this.$el.parent('.'+opts.wrapClass);

            this.bindEvents();
        },

        bindEvents:function() {
            var opts = this.options,
                self = this;

            this.$wrap
            .delegate('a.'+opts.downClass,'click',function(e){
                var defVal = parseInt(self.$el.val()) || 0,
                    curVal = --defVal;

                    console.log(curVal);

                if(!opts.negative) {
                    if(curVal >= 0) self.$el.val(curVal);
                } else {
                    self.$el.val(curVal);
                }
                    
                e.preventDefault();
            })
            .delegate('a.'+opts.upClass,'click',function(e){
                var defVal = parseInt(self.$el.val()) || 0,
                    curVal = ++defVal;

                    console.log(curVal);

                if(!opts.positive) {
                    if(curVal <= 0) self.$el.val(curVal);
                } else {
                    self.$el.val(curVal);
                }
                    
                e.preventDefault();
            });

            this.$el
            .on('change',function(e){
                var $this = $(this),
                    val = $this.val();

               if(val == '') $this.val(0);
            })
            .bind('mousewheel', function(e, delta) {
                var defVal = parseInt(self.$el.val()) || 0,
                    curVal = defVal+delta;

                if(!opts.negative) {
                    if(curVal >= 0) self.$el.val(curVal);
                } else if(!opts.positive) {
                    if(curVal <= 0) self.$el.val(curVal);
                } else {
                    self.$el.val(curVal);
                }
                    
            });

        }

    };

    $.fn.inputNumber = function(options) {

        $(this).each(function(){
            var number = new InputNumber(options, $(this));
        });

    };

})(jQuery);
