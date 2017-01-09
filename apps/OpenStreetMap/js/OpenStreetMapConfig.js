
/*
    Provides the configuration for the globe
 */


define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
        'jquery'], function(ww, $) {

    var OpenStreetMapConfig = function() {

        this._canvasName = 'globe';

        this._drawHeightInM = 10000;

        this._drawHeightInKm = this._drawHeightInM * 1000;

        this._drawRadiusInMiles = 20.0;

        this._kmPerMile = 1.60934;

        this._drawRadiusInKm = this._kmPerMile * this._drawRadiusInMiles;

        this._boundBoxHeight = 1.6;

        this._boundBoxWidth = 1.6;

        this._rTreeSize = 100000;

        this._canvasWidthFactor = 0.9;

        this._canvasHeightFactor = 1.0;

        this._canvasWidth = $(document).width() * this._canvasWidthFactor;

        this._canvasHeight = $(document).height() * this._canvasHeightFactor;

        this._overPassAPIBody =
            'http://overpass-api.de/api/interpreter?data=';

        this._OSRMAPIBody = 'http://router.project-osrm.org/';

        this._startPosition =  new WorldWind.Position(42.0362415,-88.3450904, 10000);

        this._temp = 'http://overpass-api.de/api/interpreter?data=node%5B%22amenity%22%7E%22%2E%22%5D%2852%2E5167%2C13%2E3833%2C53%2C14%29%3Bout%20body%3B%0A'

        this._defaultInputSpecification = {
            useCurrentLocationForNavigation : false,
            overpassKey : 'amenity',
            overpassValue : 'cafe'
        };

        this._boundingBoxWidth = 0.75;

        this._boundingBoxHeight = 0.75;

        this._nodeLimit = 100;

        this._mapQuestAPIBase = 'http://www.mapquestapi.com/geocoding/v1/address?key=';
        this._mapQuestAPIKey = 'oa1pl9hIxUNigL3uwrAkERWczhGqDdAk';

    }


    Object.defineProperties(OpenStreetMapConfig.prototype, {


        startPosition: {
            get: function() {
                return this._startPosition;
            }
        },

        canvasName : {
            get: function() {
                return this._canvasName;
            }
        },

        canvasIDString: {
            get: function() {
                return '#' + this._canvasName;
            }
        },

        drawHeight : {
            get: function() {
                return this._drawHeightInM;
            }
        },

        drawRadius : {
            get: function() {
                return this._drawRadiusInKm;
            }
        },

        rTreeSize: {
            get: function() {
                return this._rTreeSize;
            }
        },

        boundBoxHeight: {
            get: function() {
                return this._boundBoxHeight;
            }
        },

        boundBoxWidth: {
            get: function() {
                return this._boundBoxWidth;
            }
        },

        canvasHeightFactor: {
            get: function() {
                return this._canvasHeightFactor;
            }
        },

        canvasWidthFactor: {
            get: function() {
                return this._canvasHeightFactor;
            }
        },

        canvasHeight : {
            get: function() {
                return this._canvasHeight;
            }
        },

        canvasWidth: {
            get: function() {
                return this._canvasWidth;
            }
        },

        overPassAPIBody : {
            get: function() {
                return this._overPassAPIBody;
            }
        },
        OSRMAPIBody : {
            get: function() {
                return this._OSRMAPIBody;
            }
        },

        defaultInputSpecification: {
            get : function() {
                return this._defaultInputSpecification;
            }
        },

        boundingBoxWidth : {
            get: function() {
                return this._boundingBoxWidth;
            }
        },

        boundingBoxHeight : {
            get: function() {
                return this._boundingBoxHeight;
            }
        },

        nodeLimit : {
            get: function() {
                return this._nodeLimit;
            }
        },

        mapQuestAPIBase : {
            get: function() {
                return this._mapQuestAPIBase;
            }
        },

        mapQuestAPIKey : {
            get: function() {
                return this._mapQuestAPIKey;
            }
        }
    });

    return OpenStreetMapConfig;



})
