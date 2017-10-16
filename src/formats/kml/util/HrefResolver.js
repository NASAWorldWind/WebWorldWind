define([
    '../../../util/Promise',
    '../../../util/WWUtil'
], function (Promise,
             WWUtil) {
    /**
     * It can handle the format in which is the URL present in the file and transform it to the URL available
     * for the relevant other concepts.
     * @param url {String} Representation of the url of the resource.
     * @param fileCache {KmlFileCache} Cache representing potential links loaded by current KML file.
     * @constructor
     */
    var HrefResolver = function (url, fileCache) {
        /**
         * The url to be resolved. The result will be an URL again. It is possible to load any binary data into
         * readable URL.
         */
        this._url = url;

        /**
         * File cache used to retrieve the links URL.
         */
        this._fileCache = fileCache;
    };

    /**
     * It returns relevant string. Either the url directly or retrieved from cache. It means that the cache needs
     * to resolve the URLs upfront.
     * @private
     * @return {String} Either external URL or internal URL representing the information.
     */
    HrefResolver.prototype.url = function () {
        if (WWUtil.startsWith(this._url, 'http://') || WWUtil.startsWith(this._url, 'https://')) {
            return this._url;
        } else {
            var retrieved = this._fileCache.retrieve('kmz;' + this._url);
            if(!retrieved) {
                retrieved = this._fileCache.retrieve('href;' + this._url);
                // Probably relative path.
                if(!retrieved) {
                    return this._url;
                } else {
                    return retrieved;
                }
            } else {
                return retrieved;
            }
        }
    };

    return HrefResolver;
});