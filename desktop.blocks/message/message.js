modules.define('message', ['i-bem__dom'], function (provide, DOM) {

    /**
     * @namespace
     * @name message
     */
    DOM.decl('message', {

        /**
         * @param event
         * @param message
         */
        showError: function (message) {
            this.elem('text').text(message);
            this.setMod('visible');

            setTimeout(function () {
                this.delMod('visible');
            }.bind(this), 2000);
        }
    });

    provide(DOM);

});
