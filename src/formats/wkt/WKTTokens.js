define([
    './geom/WKTGeometryCollection',
    './geom/WKTLineString',
    './geom/WKTMultiLineString',
    './geom/WKTMultiPoint',
    './geom/WKTMultiPolygon',
    './geom/WKTObject',
    './geom/WKTPoint',
    './geom/WKTPolygon',
    './geom/WKTTriangle',
    './WKTType'
], function (WKTGeometryCollection,
             WKTLineString,
             WKTMultiLineString,
             WKTMultiPoint,
             WKTMultiPolygon,
             WKTObject,
             WKTPoint,
             WKTPolygon,
             WKTTriangle,
             WKTType) {
    /**
     *
     * @constructor
     */
    var WKTTokens = function (sourceText) {
        this.sourceText = sourceText;
    };

    /**
     * It continues character by character through the string. The empty spaces works always as delimiter.
     * It begins with the information about the type. It is one of the WKT types with potential ending with M or Z
     * I have the complete tokens containing the basic information we need.
     * @private
     * @return {String[]}
     */
    WKTTokens.prototype.tokenize = function (textToParse) {
        var tokens = [];
        for (; this.currentPosition < textToParse.length; this.currentPosition++) {
            var c = textToParse.charAt(this.currentPosition);

            if (c == '(') {
                tokens.push({
                    type: WKTType.TokenType.LEFT_PARENTHESIS
                })
            } else if (c == ',') {
                tokens.push({
                    type: WKTType.TokenType.COMMA
                })
            } else if (c == ')') {
                tokens.push({
                    type: WKTType.TokenType.RIGHT_PARENTHESIS
                })
            } else if (this.isAlpha(c)) {
                var text = this.readText(textToParse);
                tokens.push({
                    type: WKTType.TokenType.TEXT,
                    value: text
                })
            } else if (this.isNumeric(c)) {
                var numeric = this.readNumeric(textToParse);
                tokens.push({
                    type: WKTType.TokenType.NUMBER,
                    value: numeric
                })
            } else if (this.isWhiteSpace(c)) {
                continue;
            } else {
                throw new Error('Invalid character: {{', c, '}}');
            }
        }

        return tokens;
    };

    /**
     * It returns correctly initialized objects to render.
     * @return {Array}
     */
    // TODO: Refactor. This is hell.
    WKTTokens.prototype.objects = function () {
        this.currentPosition = 0;

        var tokens = this.tokenize(this.sourceText);
        var objects = [];
        var coordinates = [];
        var currentObject = null;
        var leftParenthesis = 0, rightParenthesis = 0;
        tokens.forEach(function (token) {
            var value = token.value;
            if (token.type === WKTType.TokenType.TEXT) {
                var started = null;
                if (value.indexOf('POINT') === 0) {
                    started = new WKTPoint();
                } else if (value.indexOf('MULTIPOINT') === 0) {
                    started = new WKTMultiPoint();
                } else if (value.indexOf('POLYGON') === 0) {
                    started = new WKTPolygon();
                } else if (value.indexOf('MULTIPOLYGON') === 0) {
                    started = new WKTMultiPolygon();
                } else if (value.indexOf('LINESTRING') === 0) {
                    started = new WKTLineString();
                } else if (value.indexOf('MULTILINESTRING') === 0) {
                    started = new WKTMultiLineString();
                } else if (value.indexOf('TRIANGLE') === 0) {
                    started = new WKTTriangle();
                } else if (value.indexOf('GEOMETRYCOLLECTION') === 0) {
                    started = new WKTGeometryCollection();
                } else if (value.length > 2) {
                    started = new WKTObject(); // Set of the objects we don't support.
                } else {
                    if(value == 'Z') {
                        currentObject.set3d();
                    } else if(value == 'M') {
                        currentObject.setLrs();
                    } else if(value == 'MZ') {
                        currentObject.set3d();
                        currentObject.setLrs();
                    }

                    return;
                }

                if (!currentObject) {
                    currentObject = started;
                } else {
                    currentObject.add(started);
                }
            } else if (token.type === WKTType.TokenType.LEFT_PARENTHESIS) {
                leftParenthesis++;
            } else if (token.type === WKTType.TokenType.RIGHT_PARENTHESIS) {
                if(coordinates) {
                    currentObject.addCoordinates(coordinates);
                    coordinates = null;
                }
                rightParenthesis++;
                if (leftParenthesis === rightParenthesis) {
                    objects.push(currentObject);
                    leftParenthesis = 0;
                    rightParenthesis = 0;
                    currentObject = null;
                }
            } else if (token.type === WKTType.TokenType.NUMBER) {
                if(!coordinates) {
                    coordinates = [];
                }
                coordinates.push(value);
            } else if (token.type === WKTType.TokenType.COMMA ) {
                if(!coordinates) {
                    currentObject.commaWithoutCoordinates();
                } else {
                    currentObject.addCoordinates(coordinates);
                    coordinates = null;
                }
            }
        });
        return objects;
    };


    WKTTokens.prototype.isAlpha = function (c) {
        return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
    };

    WKTTokens.prototype.isNumeric = function (c) {
        return c >= '0' && c <= '9' || c == '.' || c =='-';
    };

    WKTTokens.prototype.isWhiteSpace = function (c) {
        return c == ' ' || c == '\t' || c == '\r' || c == '\n';
    };

    WKTTokens.prototype.readText = function (textToParse) {
        var text = '';
        while (this.isAlpha(textToParse.charAt(this.currentPosition))) {
            text += textToParse.charAt(this.currentPosition);
            this.currentPosition++;
        }
        this.currentPosition--;
        return text;
    };

    WKTTokens.prototype.readNumeric = function (textToParse) {
        var numeric = '';
        while (this.isNumeric(textToParse.charAt(this.currentPosition))) {
            numeric += textToParse.charAt(this.currentPosition);
            this.currentPosition++;
        }
        this.currentPosition--;
        return Number(numeric);
    };

    return WKTTokens;
});