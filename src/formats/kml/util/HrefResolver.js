define([], function(){
    // TODO: Understand the limitation of the approach.

    /**
     * It can handle the format in which is the URL present in the file and transform it to the URL available
     * for the relevant other concepts.
     * @param url {String} Representation of the url of the resource.
     * @constructor
     */
    var HrefResolver = function(url) {
        /**
         * The url to be resolved. The result will be an URL again. It is possible to load any binary data into
         * readable URL.
         */
        this._url = url;
    };

    /**
     * @return {String} Either external URL or internal URL representing the information.
     */
    HrefResolver.prototype.url = function() {
        return this._url;
    };

    return HrefResolver;
});