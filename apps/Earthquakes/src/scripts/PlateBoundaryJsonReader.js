define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
    'JSONReader'], function(ww, JSONReader) {

   'use strict';

    function PlateBoundaryJsonReader() {

        var specs = [
            ['points', 'geometry.coordinates']
        ]
        this._reader = new JSONReader(specs, 'features');
        this.extract = function(data) {
            console.log('feed ', data);
            return this._reader.extract(data);
        }
    }

    return PlateBoundaryJsonReader

});
