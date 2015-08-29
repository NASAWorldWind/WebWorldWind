/**
 * Created by Matthew on 7/27/2015.
 */

define(['jquery'],function($){

    /*
     * Removes all special characters from a string
     *
     * @param str: any string
     *
     * @return: the input string with special characters ommitted.
     */
    function removeSpecials(str) {
        var lower = str.toLowerCase();
        var upper = str.toUpperCase();

        var res = "";
        for(var i=0; i<lower.length; ++i) {
            if(lower[i] != upper[i] || lower[i].trim() === '')
                res += str[i];
        }
        return res;
    }

    /*
    * Creates a css class and calls the function to build an html div and button. The name of the css class
    *   is the id.
    *
    * @param id: Name of the html and css id.
    * @param screenLoc: The array of location on the screen to place the div. [x,y]
    * @param selectorToAppendTo: The html div to append the div to. Saved in parentNode.
    */
    var Hud = function (id, screenLoc, selectorToAppendTo) {
        var self = this;
        this.ParentNode = (selectorToAppendTo) ? $(selectorToAppendTo) : $('body');
        //console.log(id)
        this.ID = removeSpecials(id).split(' ').join('');
        //console.log(this.ID)
        this.NAME = id;
        //console.log(this.ParentNode);
        this.StyleSheet =
            $("<style>")
            .prop("type", "text/css")
                .html("\ ." + self.ID + " {\
                        font-family: 'Ubuntu', sans-serif;\
                        font-size:28px;\
                        font-weight:300;\
                        position: fixed;\
                        background-color: #e5e5e5;\
                        border-radius: 10px;\
                        z-index: 25;\
                        left:" + screenLoc[0] + "px;\
                        top:" + screenLoc[1] + "px;\
                        color:#555;\
                        padding:10px;\
                        margin:0 20px;\
                        overflow:hidden;\
                        height:130;\
                        width:520;\
                        float:left;\
                        border:1px solid #ccc;\
                        box-shadow:0 0 10px 0 #aaa;\
                        -webkit-transition: all 0.7s ease-in-out;\
                        -moz-transition: all 0.7s ease-in-out;\
                        -ms-transition: all 0.7s ease-in-out;\
                        -o-transition: all 0.7s ease-in-out;\
                        transition: all 0.7s ease-in-out;\
                    }\
                    ." + self.ID + "hover{\
                        float:left;\
                        background:#fff;\
                        border:1px solid #aaa;\
                        box-shadow:0 0 10px 0 #777;\
                    }\
                    ." + self.ID + " h3 {\
                        text-align:center;\
                    }\
                    ." + self.ID + "info > p {\
                        text-align:center;\
                        padding:0 0 10px 0;\
                    }\
                    .read {\
                        text-align:center;\
                        font-size:16px;\
                        font-weight:800;\
                        color:#555;\
                        background:#444;\
                        padding:5px;\
                        border:1px solid #999;\
                        -webkit-border-radius: 5px 5px 5px 5px;\
                        border-radius: 5px 5px 5px 5px;\
                    }\
                    .read a {\
                        text-align:center;\
                        font-size:16px;\
                        font-weight:800;\
                        color:#fff;\
                        text-decoration:none;\
                    }\
                    .read:hover{\
                        background:#0099ff;\
                        text-align:center;\
                        font-size:16px;\
                        font-weight:800;\
                        color:#fff;\
                        text-decoration:none;\
                    }"
        );

        this.StyleSheet.appendTo("head");

        this.buildDiv();
        return this
    };

    /*
    * Utilizes JQuery to build a div and a button. Appends the div to the parentnode
    */
    Hud.prototype.buildDiv = function () {
        var self = this;
        this.DIV = $('<div>');
        this.DIV.attr('class',this.ID);
        // this.DIV.draggable();
        this.DIV.css('background-color','white');
        this.closeButtonAndTitleDiv = $('<h3>');
        this.closeButtonAndTitleDiv.append(this.NAME);
        this.closeButton = $('<img>');
        this.closeButton.attr('src','img/load.png');
        this.closeButton.attr('width','20');
        this.closeButton.attr('height','20');
        this.closeButton.attr('alt','Pin');
        this.closeButton.attr('longdesc','img/load.png');
        this.closeButton.on('click', function (o){
            self.DIV.remove();
            self.StyleSheet.remove();
        });
        this.closeButtonAndTitleDiv.append(this.closeButton);
        this.DIV.append(this.closeButtonAndTitleDiv);
        this.ParentNode.append(this.DIV)

    };

    /*
    *  Removes all div objects and css selectors associated with the Hud
    */
    Hud.prototype.close = function (ev) {
        var self = this;
        if (self.HUDManager){
            self.HUDManager.unsubscribeHUD(self)
        }
        self.DIV.remove();
        self.StyleSheet.remove();
    };

    /*
    * Builds the basic display. This should only be called once. Use addAnchor and build your own jquery object on that.
    *
    * @param buttonfunction: The function to call when the button is clicked.
    */
    Hud.prototype.assembleDisplay = function (bodyText, buttonText, buttonFunction){
        if (!this.DIV){
            this.buildDiv()
        }

        this.boxText = $('<p>');
        this.boxText.css('padding', 10);
        this.boxText.css('font-size', 18);
        this.boxText.append(bodyText);
        this.DIV.append(this.boxText);
        if (buttonText) {
            this.buttons = $('<div>');
            this.buttons.attr('class','read');
            this.buttonClick = $('<a>');
            this.buttonClick.attr('href','#');
            this.buttonClick.append(buttonText);
            this.buttonClick.on('click', buttonFunction);
            this.buttons.append(this.buttonClick);
            this.DIV.append(this.buttons);
        }

    };

    /*
    *  Appends a jquery object to the main div.
    *
    *  @param anchor: Jquery object
     */
    Hud.prototype.addAnchor = function (anchor) {
        this.DIV.append(anchor)
    };

    /*
    * Assigns a callback function for when the hud is closed.
    *
    * @param callback: Function to call when the hud is closed.
     */
    Hud.prototype.addCloseEvent = function (callback) {
        this.closeButton.on('click', callback)
    };

    /*
    * Assigns itself to a hudmanager.
    *
    * @param hudmanager: hudmanager to subscribe self to.
     */
    Hud.prototype.assignHUDManager = function (hudmanager) {
        var self = this;

        self.HUDManager = hudmanager;

        self.HUDManager.subscribeHUD(self)
    };

    return Hud
});