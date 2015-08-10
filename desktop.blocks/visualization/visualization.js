modules.define('visualization', ['i-bem__dom'], function (provide, DOM) {

    /**
     * @namespace
     * @name visualization
     */
    DOM.decl('visualization', {

        /**
         * @desc draw spectrum
         * @param analyzer
         */
        draw: function (analyzer, width, height) {

            this.width = width || 500;
            this.height = height || 200;

            this.analyzer = analyzer;
            this.domElem[0].width = this.width;
            this.domElem[0].height = this.height;

            this.analyzer.fftSize = 256;
            this.canvasCtx = this.domElem[0].getContext('2d');

            this.drawFrame();
        },

        drawFrame: function () {

            requestAnimationFrame(this.drawFrame.bind(this));

            this.clear();

            this.bufferLength = this.analyzer.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.analyzer.getByteFrequencyData(this.dataArray);

            var barWidth = (this.width / this.bufferLength) * 2.5;
            var barHeight;
            var x = 0;
            for (var i = 0; i < this.bufferLength; i++) {
                barHeight = this.dataArray[i];


                this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 40) + ',152,219)';
                this.canvasCtx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);

                x += barWidth + 1;
            }
        },

        clear: function () {
            this.canvasCtx.clearRect(0, 0, this.width, this.height);
        }
    });

    provide(DOM);
});
