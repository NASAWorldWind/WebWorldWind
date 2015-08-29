define(function() {

    function DrainageBasinLayer() {
        this._displayName = 'Drainage Basins';
        this._layer = new WorldWind.RenderableLayer(this._displayName);
        //this._uri = 'http://worldwindserver.net/webworldwind/data/shapefiles/naturalearth/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp';
        this._uri = 'https://github.com/InzamamRahaman/DrainageBasinShapeFiles/blob/master/basins/na_bas_30s_beta.shp';
        this._enabled = false;
        this._contentsLoaded = false;
    }


    DrainageBasinLayer.prototype.loadContents = function() {

        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 0.025;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";


        var attributeCallback = function(attributes, record) {
            var configuration = {};
            configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

            if (record.isPointType()) {
                configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                if (attributes.values.pop_max) {
                    var population = attributes.values.pop_max;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
            } else if (record.isPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.

                var blue = WorldWind.Color.BLUE;

                configuration.attributes.interiorColor = new WorldWind.Color(
                    blue.red, blue.green, blue.blue, 0.0
                );

                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    0.5);
            }

            return configuration;
        };

        var shapeFile = new WorldWind.Shapefile(this._uri);
        shapeFile.load(null, attributeCallback, this._layer);
        this._contentsLoaded = true;

    }

    DrainageBasinLayer.prototype.render = function(dc) {
        if(this._contentsLoaded === false) {
            this.loadContents();
        }
        this._layer.render(dc);
    }

    Object.defineProperties(DrainageBasinLayer.prototype, {

        displayName : {
            get: function() {
                return this._displayName;
            }
        },

        renderables: {
            get: function() {
                return this._layer.renderables;
            }
        },

        enabled : {
            get: function() {
                return this._enabled;
            },

            set: function(value) {
                this._enabled = value;
            }
        }

    });

    return DrainageBasinLayer;



});