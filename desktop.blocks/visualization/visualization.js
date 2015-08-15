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

            this.analyzer.smoothingTimeConstant = 0.7;
            this.analyzer.fftSize = 256;
            this.canvasCtx = this.domElem[0].getContext('2d');
            this.drawing = true;
            this.drawFrame();
        },

        /**
         * @desc display current data
         */
        drawFrame: function () {
            var barWidth,
                barHeight,
                x = 0;

            if (!this.drawing) {
                return;
            }

            requestAnimationFrame(this.drawFrame.bind(this));

            this.clear();

            this.bufferLength = this.analyzer.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.analyzer.getByteFrequencyData(this.dataArray);

            barWidth = (this.width / this.bufferLength) * 2.5;

            for (var i = 0; i < this.bufferLength; i++) {
                barHeight = this.dataArray[i];

                this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 40) + ',152,219)';
                this.canvasCtx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);

                x += barWidth + 1;
            }
        },

        /**
         * Smoothing visualization
         */
        attenuation: function () {
            var barHeight,
                x = 0;

            if (!this.attenuationData) {
                this.attenuationData = this.dataArray;
            }

            this.clear();

            barWidth = (this.width / this.bufferLength) * 2.5;

            this.cleared = true;

            for (var i = 0; i < this.bufferLength; i++) {

                this.attenuationData[i] = this.attenuationData[i] <= 3 ? 0 : this.attenuationData[i] - 3;

                barHeight = this.attenuationData[i];

                if (barHeight !== 0) {
                    this.cleared = false;
                }

                this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 40) + ',152,219)';
                this.canvasCtx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);

                x += barWidth + 1;
            }

            if (!this.cleared) {
                requestAnimationFrame(this.attenuation.bind(this));
            } else {
                this.attenuationData = null;
            }

        },

        /**
         * @desc clear canvas
         */
        clear: function () {
            this.canvasCtx.clearRect(0, 0, this.width, this.height);
        },

        /**
         * @desc stop drawing
         */
        stopDrawing: function () {
            this.drawing = false;
            this.attenuation();
        }
    });

    provide(DOM);
});
