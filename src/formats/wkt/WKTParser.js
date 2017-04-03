define([
    './WKTTokens'
], function (WKTTokens) {
    /**
     * WKTParser is capable of parsing the text representation of the WKT objects. The explanation of what all is
     * supported is to be found in the README.MD in this directory.
     *
     * The simplest possible usage is:
     * var layer = new WorldWind.RenderableLayer();
     * var parser = new WKTParser('POINT (19 23)');
     * parser.load(null, null, layer);
     * wwd.addLayer(layer);
     * This example adds the WKT into the map
     *
     * The more complex usage allows you to update the attributes of the objects after adding them to the layer. In this example all
     * the shapes will have font color changed to the red:
     * var layer = new WorldWind.RenderableLayer();
     * var parser = new WKTParser('POINT (19 23)');
     * parser.load(function(objects){
     *  objects.forEach(function(object){
     *    var shapeAttributes = new ShapeAttributes(null);
     *    shapeAttributes.fontColor = Color.RED;
     *    object.highlightAttributes = shapeAttributes;
     *  })
     * }, null, layer);
     * wwd.addLayer(layer);
     *
     * The most complex usage is when you want to supply different configuration for object before it is added to the layer.
     * var layer = new WorldWind.RenderableLayer();
     * var parser = new WKTParser('POINT (19 23)');
     * parser.load(null, function(shape) {
     *   if(shape.type == WKTType.SupportedGeometries.POINT) {
     *     var shapeAttributes = new ShapeAttributes(null);
     *     shapeAttributes.fontColor = Color.RED;
     *     return {
     *         attributes: shapeAttributes
     *     };
     *   }
     * }, layer);
     * wwd.addLayer(layer);
     *
     * @param textRepresentation {String} Text representation of WKT objects.
     * @constructor
     */
    var WKTParser = function (textRepresentation) {
        this.objects = null;

        this.textRepresentation = textRepresentation;
    };

    /**
     * It parses the received string and create the Objects, which then can be rendered.
     * @param parserCompletionCallback {Function} An optional function called when the WKT loading is
     *   complete and all the shapes have been added to the layer.
     * @param shapeConfigurationCallback {Function} This function  is called whenever new shape is created. It provides
     *   the current shape as the first argument. In this way it is possible to modify the shape even provide another one.
     *   If any shape is returned it is used in place of the previous one. This function should be synchronous and if
     *   you want to provide custom shape, it has to be synchronous.
     * @param layer {RenderableLayer} Layer to use for adding all the parsed shapes
     * @return {Renderable[]} Array of the Renderables present in the WKT.
     */
    WKTParser.prototype.load = function (parserCompletionCallback, shapeConfigurationCallback, layer) {
        var objects = new WKTTokens(this.textRepresentation).objects();

        shapeConfigurationCallback = shapeConfigurationCallback || function(){};
        parserCompletionCallback = parserCompletionCallback || function(){};

        var shapes = [];
        objects.forEach(function(object){
            object.shapes().forEach(function(shape){
                var configuration = shapeConfigurationCallback(object);
                if(configuration && configuration.attributes) {
                    shape.attributes = configuration.attributes;
                }
                if(configuration && configuration.highlightAttributes) {
                    shape.highlightAttributes = configuration.highlightAttributes;
                }
                if(configuration && configuration.pickDelegate) {
                    shape.pickDelegate = configuration.pickDelegate;
                }
                if(configuration && configuration.userProperties) {
                    shape.userProperties = configuration.userProperties;
                }
                shapes.push(shape);
            });
        });

        layer.addRenderables(shapes);

        parserCompletionCallback(shapes);

        return objects;
    };

    return WKTParser;
});