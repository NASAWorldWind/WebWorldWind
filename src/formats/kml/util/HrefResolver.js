define([
    '../../../util/Promise',
    '../../../util/WWUtil'
], function (Promise,
             WWUtil) {
    // TODO: Understand the limitation of the approach.

    /**
     * It can handle the format in which is the URL present in the file and transform it to the URL available
     * for the relevant other concepts.
     * @param url {String} Representation of the url of the resource.
     * @constructor
     */
    var HrefResolver = function (url) {
        /**
         * The url to be resolved. The result will be an URL again. It is possible to load any binary data into
         * readable URL.
         */
        this._url = url;
    };

    /**
     * It must return promise of the string.
     * @return {Promise} Either external URL or internal URL representing the information.
     */
    HrefResolver.prototype.url = function () {
        if (WWUtil.startsWith(this._url, 'http://') || WWUtil.startsWith(this._url, 'https://')) {
            return Promise.resolve(this._url);
        } else {

            // I need to start keeping the context. Hwo do I store the information about the current kmz file? I dont get to the parsing before execution. So in the constructor I will
            // need to keep the file.
            return this._url;
        }
    };

    return HrefResolver;
});