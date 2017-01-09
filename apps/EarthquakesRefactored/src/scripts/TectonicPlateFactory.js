define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
'SurfacePolylineShapeFactory', 'HexToWorldWindColor'],
    function(ww, SurfacePolylineShapeFactory, HexToWorldWindColor) {

    'use strict';

    function TectonicPlateFactory() {

        var shapeAttribute = new WorldWind.ShapeAttributes(null);
        //shapeAttribute.outlineColor = WorldWind.Color.BLACK;
        var rust = HexToWorldWindColor('#b7410e');
        var darkBrown = HexToWorldWindColor('#5C1F00');
        shapeAttribute.outlineColor = darkBrown;
        shapeAttribute.enabled = true;
        shapeAttribute.outlineWidth = 0.8;

        this._plateFactory = new SurfacePolylineShapeFactory(shapeAttribute);

    }

    TectonicPlateFactory.prototype.createPlate = function(locations) {
        return this._plateFactory.createSurfacePolylineShape(locations);
    }

    return TectonicPlateFactory;

});
