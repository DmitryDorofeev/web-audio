module.exports = {
    block: 'page',
    title: 'Web audio player',
    head: [
        {elem: 'meta', attrs: {name: 'description', content: ''}},
        {elem: 'meta', attrs: {name: 'viewport', content: 'width=device-width, initial-scale=1'}},
        {elem: 'css', url: 'index.css'}
    ],
    scripts: [
        {elem: 'js', url: 'id3.js'},
        {elem: 'js', url: 'index.js'}
    ],
    content: {
        block: 'player',
        controls: [
            {
                block: 'button',
                content: '',
                name: 'play',
                mods: {'play': true}
            },
            {
                block: 'button',
                content: '',
                name: 'stop',
                mods: {'stop': true}
            },
            {
                block: 'button',
                content: '',
                name: 'equalizer',
                mods: {'equalizer': true}
            },
            {
                block: 'button',
                content: '',
                name: 'open',
                mods: {'open': true}
            }
        ],
        mods: {
            loading: true
        }
    }
};
