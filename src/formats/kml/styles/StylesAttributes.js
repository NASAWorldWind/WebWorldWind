/**
 * Created by jbalhar on 14. 3. 2016.
 */
define([
    '../../../util/Promise'
], function(
    Promise
){
    /**
     * This class should work for StyleAttributes. Therefore when it resolves it returns already prepared Attributes.
     * It is used during the rendering phase but the rendering phase is synchronous while the styles retrieval is at
     * least often asynchronous. This object must provide flag to see whether it was already resolved.
     * @param styles {Styles} Style representation for current element. Based on this representation ths class resolves
     *   the attributes.
     * @constructor
     */
    var StyleAttributes = function(styles) {
        this._isResolved = false;
        this._styles = styles;
    };

    Object.defineProperties(StyleAttributes.prototype, {
        isResolved: {
            get: function() {
                return this._isResolved;
            }
        }
    });

    /**
     * It returns promise of style to be delivered. Promise will be resolved with object containing following object.
     * {
     *   normal: {
     *     text: TextAttributes,
     *     shape: ShapeAttributes,
     *     annotation: AnnotationAttributes,
     *     placemark: PlacemarkAttributes
     *   },
     *   highlighted: {
     *     text: TextAttributes,
     *     shape: ShapeAttributes,
     *     annotation: AnnotationAttributes,
     *     placemark: PlacemarkAttributes
     *   }
     * }
     * Would this suffice? Am I capable of understanding enough of the attributes?
     * @returns {Promise}
     */
    StyleAttributes.prototype.styles = function() {
        var self = this;
        self._styles.
        return new Promise(function(resolve, reject) {
            var promiseOfStyles = self._styles.resolve();
            promiseOfStyles.then(function(styles){
                self._isResolved = true;
                resolve();
            });
        });
    };

    // We must add cached StyleAttributes, which stores the computed value. We can then 
    
    return StyleAttributes;
});