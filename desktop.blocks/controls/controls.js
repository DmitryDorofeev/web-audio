modules.define('controls', ['i-bem__dom'], function (provide, DOM) {

    /**
     * @namespace
     * @name Controls
     */
    provide(DOM.decl('controls', {
        onSetMod: {
            'js': {
                'inited': function () {
                    this.findBlocksInside('button').forEach(function (button) {
                        button.on('click', this._onButtonClick, this);
                    }.bind(this));
                }
            }
        },

        _onButtonClick: function (event) {
            var uniqueName = event.target.getName();
            this.emit(uniqueName);
        }

    }));
});
