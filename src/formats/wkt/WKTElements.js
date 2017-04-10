define([], function () {
    //noinspection UnnecessaryLocalVariableJS
    /**
     * Map representing the available elements. Basically this is a way to overcome circular dependencies issues. They
     * might happen when there are inter dependencies among objects. It shouldn't happen in case of WKT.
     */
    var WKTElements = {
    };

    return WKTElements;
});