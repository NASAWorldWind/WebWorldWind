/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
// It simply adds XmlParser, which encapsulates the fact that, there are different implementations
define([

    ],
    function(

    ){
        /**
         * Constructor function responsible for abstracting away the complexities in parsing XmlDocuments.
         * @param document String representation of the xml document.
         * @constructor
         */
        var XmlDocument = function(document) {
            /**
             * Retrieved textual representation of the document.
             */
            this._document = document;
        };

        /**
         * This method abstracts parsing of XmlDocument away form users of this class. It should work in all browsers
         * since IE5
         * @returns {Document} Parsed dom.
         */
        XmlDocument.prototype.dom = function() {
            if(DOMParser) {
                var parser = new DOMParser();
                return parser.parseFromString(this._document, "text/xml");
            } else {
                // Support for IE6
                var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async=false;
                xmlDoc.loadXML(text);
                return xmlDoc;
            }
        };

        return XmlDocument;
});