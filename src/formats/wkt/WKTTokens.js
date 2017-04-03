define([
    './WKTElements',
    './geom/WKTObject',
    './WKTType'
], function (WKTElements,
             WKTObject,
             WKTType) {
    /**
     * Tokenizer, which parses the source texts into the meaningful tokens and then transforms them to the objects.
     * Intended for the internal use only.
     * @private
     * @constructor
     */
    var WKTTokens = function (sourceText) {
        this.sourceText = sourceText;
    };

    /**
     * It returns correctly initialized objects. It is possible to retrieve relevant shapes from all WKT Objects.
     * @return {WKTObject[]}
     */
    WKTTokens.prototype.objects = function () {
        var options = {
            objects: [],
            coordinates: [],
            leftParenthesis: 0,
            rightParenthesis: 0,
            currentObject: null
        };

        this.tokenize(this.sourceText).forEach(function (token) {
            var value = token.value;
            if (token.type === WKTType.TokenType.TEXT) {
                this.text(options, value);
            } else if (token.type === WKTType.TokenType.LEFT_PARENTHESIS) {
                options.leftParenthesis++;
            } else if (token.type === WKTType.TokenType.RIGHT_PARENTHESIS) {
                options.rightParenthesis++;

                this.rightParenthesis(options);
            } else if (token.type === WKTType.TokenType.NUMBER) {
                this.number(options, value);
            } else if (token.type === WKTType.TokenType.COMMA) {
                this.comma(options);
            }
        }.bind(this));
        return options.objects;
    };

    /**
     * It continues character by character through the string. The empty spaces works always as delimiter.
     * It begins with the information about the type. It is one of the WKT types with potential ending with M or Z
     * I have the complete tokens containing the basic information we need.
     * @private
     * @return {String[]}
     */
    WKTTokens.prototype.tokenize = function (textToParse) {
        this.currentPosition = 0;

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
     * It returns true if the character is letter, regardless of whether uppercase or lowercase.
     * @private
     * @param c {String} character to test
     * @return {boolean} True if it is lowercase or uppercase
     */
    WKTTokens.prototype.isAlpha = function (c) {
        return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
    };

    /**
     * It returns true if the character is part of the number. It has certain limitations such as -1- is considered as
     * a number
     * @private
     * @param c {String} character to test
     * @return {boolean} True if it is either Number or - or .
     */
    WKTTokens.prototype.isNumeric = function (c) {
        return c >= '0' && c <= '9' || c == '.' || c == '-';
    };

    /**
     * It returns true if the character represents whitespace. It is mainly relevant as whitespaces are one of the
     * delimiters
     * @private
     * @param c {String} character to test
     * @return {boolean} True if it is any type of white space.
     */
    WKTTokens.prototype.isWhiteSpace = function (c) {
        return c == ' ' || c == '\t' || c == '\r' || c == '\n';
    };

    /**
     * It returns the next chunk of the String, which represents the text. Non alpha characters end the text.
     * @private
     * @param textToParse {String} The text to use in parsing.
     * @return {string} The full chunk of text
     */
    WKTTokens.prototype.readText = function (textToParse) {
        var text = '';
        while (this.isAlpha(textToParse.charAt(this.currentPosition))) {
            text += textToParse.charAt(this.currentPosition);
            this.currentPosition++;
        }
        this.currentPosition--;
        return text;
    };

    /**
     * It returns the next chunk of the String, which represents the number. Non numeric characters end the text.
     * @private
     * @param textToParse {String} The text to use in parsing.
     * @return {Number} The full chunk of number
     */
    WKTTokens.prototype.readNumeric = function (textToParse) {
        var numeric = '';
        while (this.isNumeric(textToParse.charAt(this.currentPosition))) {
            numeric += textToParse.charAt(this.currentPosition);
            this.currentPosition++;
        }
        this.currentPosition--;
        return Number(numeric);
    };

    /**
     * There are basically three types of tokens in the Text line. The name of the type for the next shape, Empty
     * representing the empty shape and M or Z or MZ expressing whether it is in 3D or whether Linear Referencing System
     * should be used.
     * @private
     * @param options {}
     * @param value {String} Value to use for distinguishing among options.
     */
    WKTTokens.prototype.text = function(options, value) {
        value = value.toUpperCase();
        var started = null;
        if (value.length <= 2) {
            this.setOptions(value, options.currentObject);

            return;
        } else if (value.indexOf('EMPTY') === 0) {
            this.nextObject(options);
        } else {
            var founded = value.match('[M]?[Z]?$');
            if(founded && founded.length > 0 && founded[0] != '') { // It contains either null or M or Z or MZ
                this.setOptions(founded, started);
                value = value.substring(0, value.length - founded.length);
            }

            started = WKTElements[value] && new WKTElements[value]();
            if(!started) {
                started = new WKTObject();
            }
        }

        if (!options.currentObject) {
            options.currentObject = started;
        } else {
            options.currentObject.add(started);
        }
    };

    /**
     * Right parenthesis either end coordinates for an object or ends current shape.
     * @private
     * @param options
     */
    WKTTokens.prototype.rightParenthesis = function(options) {
        if (options.coordinates) {
            options.currentObject.addCoordinates(options.coordinates);
            options.coordinates = null;
        }
        if (options.leftParenthesis === options.rightParenthesis) {
            options.objects.push(options.currentObject); // Shapes must be called later.
            this.nextObject(options);
        }
    };

    /**
     * Comma either means another set of coordinates, or for certain shapes for example another shape or just another
     * boundary
     * @private
     * @param options
     */
    WKTTokens.prototype.comma = function(options) {
        if (!options.coordinates) {
            options.currentObject.commaWithoutCoordinates();
        } else {
            options.currentObject.addCoordinates(options.coordinates);
            options.coordinates = null;
        }
    };

    /**
     * Handle Number by adding it among coordinates in the current object.
     * @private
     * @param options
     * @param value {Number}
     */
    WKTTokens.prototype.number = function(options, value) {
        options.coordinates = options.coordinates || [];
        options.coordinates.push(value);
    };

    /**
     * Update options when previous WKT object ended.
     * @private
     * @param options
     */
    WKTTokens.prototype.nextObject = function(options) {
        options.leftParenthesis = 0;
        options.rightParenthesis = 0;
        options.currentObject = null;
    };

    /**
     * It sets the options of the current object. This means setting up the 3D and the linear space.
     * @param text
     * @param currentObject
     */
    WKTTokens.prototype.setOptions = function(text, currentObject) {
        if (text == 'Z') {
            currentObject.set3d();
        } else if (text == 'M') {
            currentObject.setLrs();
        } else if (text == 'MZ') {
            currentObject.set3d();
            currentObject.setLrs();
        }
    };

    return WKTTokens;
});