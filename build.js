({
    baseUrl: 'src',
        name: '../tools/almond',
    include: ['WorldWind'],
    out: 'worldwind.js',
    wrap: {
        startFile: 'tools/wrap.start',
        endFile: 'tools/wrap.end'
    }
})