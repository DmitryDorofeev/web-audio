modules.define('player', ['i-bem__dom'], function (provide, DOM) {

    /**
     * @namespace
     * @name Player
     */
    DOM.decl('player', {

        dragging: 0,
        context: null,
        source: null,
        analyzer: null,

        onSetMod: {
            'js': {
                'inited': function () {

                    if (!window.AudioContext) {
                        this.findBlockInside('message').showError('Не поддерживается Audio API');
                        return;
                    }

                    this.findBlockInside('controls')
                        .on('play', this._onPlay, this)
                        .on('stop', this._onStop, this)
                        .on('open', this._onOpen, this)
                        .on('equalizer', this._toggleEqualizer, this);

                    this.bindTo('dragover', function (event) {
                        event.preventDefault();
                    });

                    this.bindTo('dragenter', function (event) {
                        event.preventDefault();
                        this.setMod('drag');
                        this.dragging++;
                    });

                    this.bindTo('dragleave', function (event) {
                        event.preventDefault();
                        this.dragging--;

                        if (this.dragging === 0) {
                            this.delMod('drag');
                        }
                    });

                    this.bindTo('drop', function (event) {
                        var files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files,
                            file = files[0];

                        event.preventDefault();
                        this.delMod('drag');
                        this.openFile(file);
                    });

                    this.bindTo(this.elem('fileinput'), 'change', function (event) {
                        this.openFile(event.target.files[0]);
                    });

                    this.delMod('loading');
                }
            }
        },

        /**
         * Connecting to sources and playing
         * @private
         */
        _onPlay: function () {

            if(this.source) {
                this.findBlockInside('message').showError('Сначала остановите воспроизведение');
                return;
            }

            if (this.buffer) {

                this.source = this.context.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.loop = false;

                this.analyzer = this.context.createAnalyser();

                this.findBlockInside('equalizer').connect(this.context, this.source, this.analyzer);

                this.findBlockInside('visualization').draw(this.analyzer, 650, 200);

                this.source.start(0);

                this.setMod('playing');
                this.delMod('stopped');
            } else {
                this.findBlockInside('message').showError('Файл не был загружен');
            }
        },

        /**
         * Stopping playing
         * @private
         */
        _onStop: function () {

            if (this.source) {

                this.source.stop(0);
                this.source = null;
                this.findBlockInside('visualization').clear();

                this.setMod('stopped');
                this.delMod('playing');
            }
        },

        /**
         * Opening file if possible
         * @param {File} file
         */
        openFile: function (file) {
            var reader;

            if (!(new Audio()).canPlayType(file.type)) {
                this.findBlockInside('message').showError('Неподдерживаемый формат');
            }

            reader = new FileReader();
            this.context = new AudioContext();

            this.setMod('loading');

            reader.onload = this.decodeAudio.bind(this);
            reader.readAsArrayBuffer(file);

            this.elem('filename').text(file.name);
            this.parseTags(file);
        },

        /**
         * Decode audio data if possible
         */
        decodeAudio: function (event) {
            this.context.decodeAudioData(event.target.result, this._onDecodeDone.bind(this), this._onDecodeFail.bind(this));
        },

        /**
         * action if audio decoding done
         * @param buffer
         * @private
         */
        _onDecodeDone: function (buffer) {
            this.buffer = buffer;
            this.delMod('loading');
        },

        /**
         * action if audio decoding fails
         * @private
         */
        _onDecodeFail: function () {
            this.delMod('loading');
            this.findBlockInside('message').showError('Не могу открыть файл');
        },

        /**
         * Parsing audio tags via ID3 lib
         * @param {File} file
         */
        parseTags: function (file) {
            var src = file.urn || file.name;

            ID3.loadTags(src, function () {

                var arrayToImage = function (array) {
                    var base64String = "";

                    if (!array) {
                        return null;
                    }

                    for (var i = 0; i < array.data.length; i++) {
                        base64String += String.fromCharCode(array.data[i]);
                    }

                    return "data:" + array.format + ";base64," + window.btoa(base64String);
                };

                var meta = ID3.getAllTags(src);

                meta.cover = arrayToImage(meta.picture);

                this.updateMetaInfo(meta);
            }.bind(this), {
                tags: ['title', 'artist', 'picture', 'album'],
                dataReader: FileAPIReader(file)
            });
        },

        /**
         * Display meta data
         * @param meta
         */
        updateMetaInfo: function (meta) {

            this.elem('title').text(meta.title);
            this.elem('artist').text(meta.artist);
            this.elem('cover').prop('src', meta.cover || 'placeholder.jpg');
        },

        /**
         * Show/hide equalizer settings
         * @private
         */
        _toggleEqualizer: function () {
            this.toggleMod('equalizer');
            this.toggleMod(this.elem('equalizer'), 'hidden');
        },

        /**
         * Stow file opening dialog
         * @private
         */
        _onOpen: function () {
            this.elem('fileinput').click();
        }
    });

    provide(DOM);
});
