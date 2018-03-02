define(['../../util/QuadTree'], function(QuadTree){
    // This QudTree implementation correctly works with IntensityPoints and Geographical coordinates.
    /**
     * @augments QuadTree
     * @param options {Object}
     * @param options.maxObjects {Number} Amount of the objects that can be store in one level of the tree.
     * @param options.maxLevels {Number} Amount of the levels in which the tree can be split at most.
     * @constructor
     */
    var GeographicQuadTree = function(options) {
        QuadTree.call(this, {
            bounds: {
                x: 0,
                y: 0,
                width: '360',
                height: '180'
            },
            maxObjects: options.maxObjects,
            maxLevels: options.maxLevels
        });
    };

    GeographicQuadTree.prototype = Object.create(QuadTree.prototype);

    GeographicQuadTree.prototype.insert = function(intensityLocation) {

    };

    GeographicQuadTree.prototype.retrieve = function(bounds) {

    };

    return GeographicQuadTree;
});