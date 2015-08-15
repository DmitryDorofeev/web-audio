modules.define('equalizer', ['i-bem__dom'], function (provide, DOM) {

    /**
     * @namespace
     * @name equalizer
     */
    DOM.decl('equalizer', {

        bandSplit: [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000],

        modes: {
            pop: [-1.125, 3, 4.5, 4.875, 3.375, -0.75, -1.5, -1.5, -1.125, -1.125],
            rock: [4.875, 3, -3.375, -4.875, -2.25, 2.625, 5.625, 6.75, 6.75, 6.75],
            jazz: [-1.5, -3, -2.625, -0.375, 2.625, 3.75, 5.625, 6, 6.75, 6],
            classic: [0.375, 0.375, 0.375, 0.375, 0.375, 0.375, -4.5, -4.5, -4.5, -6],
            normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },

        onSetMod: {
            'js': {
                'inited': function () {
                    this.findBlockInside('radio-group')
                        .on('change', this._onChange, this);
                }
            }
        },

        /**
         * @param event
         * @private
         */
        _onChange: function (event) {
            var value = event.target.getVal();

            this.filters.forEach(function (filter, index) {
                filter.gain.value = this.modes[value][index];
            }.bind(this));
        },

        /**
         * @desc connecting to equalizer
         * @param {AudioContext} context
         * @param source
         * @param {AudioAnalyser} analyser
         * @public
         */
        connect: function (context, source, analyser) {
            var sum;

            this.filters = this.bandSplit.map(function (frequency) {
                var filter = context.createBiquadFilter();
                filter.type = "peaking";
                filter.frequency.value = frequency;
                filter.Q.value = 1;
                filter.gain.value = 0;

                return filter;
            }.bind(this));

            sum = context.createGain();

            var lastFilter = this.filters.reduce(function (prevFilter, filter) {
                prevFilter.connect(filter);
                return filter;
            });

            source.connect(this.filters[0]);

            lastFilter.connect(sum);


            sum.connect(analyser);
            sum.connect(context.destination);
        }

    });

    provide(DOM);

});
