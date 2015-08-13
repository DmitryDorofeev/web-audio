modules.define('equalizer', ['i-bem__dom'], function (provide, DOM) {

    /**
     * @namespace
     * @name equalizer
     */
    DOM.decl('equalizer', {

        gainDb: -40.0,
        bandSplit: [32, 500, 16000],

        modes: {
            pop: [0.4, 0.8, 0.5],
            rock: [0.8, 0.5, 0.8],
            jazz: [0.7, 0.4, 0.7],
            classic: [0.6, 0.4, 0.6],
            normal: [0.5, 0.5, 0.5]
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

            this.lGain.gain.value = this.modes[value][0];
            this.mGain.gain.value = this.modes[value][1];
            this.hGain.gain.value = this.modes[value][2];
        },

        /**
         * @desc connecting to equalizer
         * @param {AudioContext} context
         * @param source
         * @param {AudioAnalyser} analyser
         * @public
         */
        connect: function (context, source, analyser) {

            var hBand = context.createBiquadFilter();
            hBand.type = "lowshelf";
            hBand.frequency.value = this.bandSplit[0];
            hBand.gain.value = this.gainDb;

            var mBand = context.createBiquadFilter();
            mBand.frequency.value = this.bandSplit[1];
            mBand.gain.value = this.gainDb;

            var lBand = context.createBiquadFilter();
            lBand.type = "highshelf";
            lBand.frequency.value = this.bandSplit[2];
            lBand.gain.value = this.gainDb;

            source.connect(lBand);
            source.connect(mBand);
            source.connect(hBand);

            this.lGain = context.createGain();
            this.mGain = context.createGain();
            this.hGain = context.createGain();

            lBand.connect(this.lGain);
            mBand.connect(this.mGain);
            hBand.connect(this.hGain);

            var sum = context.createGain();
            this.lGain.connect(sum);
            this.mGain.connect(sum);
            this.hGain.connect(sum);

            sum.connect(analyser);
            sum.connect(context.destination);
        }

    });

    provide(DOM);

});
