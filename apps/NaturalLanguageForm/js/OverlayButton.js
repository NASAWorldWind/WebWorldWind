/**
 * Created by Matthew on 7/29/2015.
 */


define(function(){

    var OverlayButton = function (id, image,screenLoc, sizeOfImageArray, selectorToAppendTo) {
        var self = this;
        this.ParentNode = (selectorToAppendTo) ? $(selectorToAppendTo) : $('body');
        this.ID = id;
        this.image = image;
        this.sizeArray = sizeOfImageArray;
        this.StyleSheet =
            $("<style>")
                .prop("type", "text/css")
                .html("\ ." + id + " {\
                       	position: fixed;\
                        width:" + self.sizeArray[0] + "px;\
                        height:" + self.sizeArray[1] + "px;\
                        left:" + screenLoc[0] + "px;\
                        top:" + screenLoc[1] + "px;\
                    }"
            );

        this.StyleSheet.appendTo("head");

        this.buildDiv();
        return this
    };

    /*
     * Utilizes JQuery to build a div and a button. Appends the div to the parentnode
     */
    OverlayButton.prototype.buildDiv = function () {
        var self = this;
        this.DIV = $('<div>');
        this.DIV.attr('class',this.ID);
        //this.DIV.css('background-color','white');
        this.HTMLImage = $('<img>');
        this.HTMLImage.attr('src',this.image);
        this.HTMLImage.attr('width',self.sizeArray[0]);
        this.HTMLImage.attr('height',self.sizeArray[1]);
        this.HTMLImage.attr('alt',this.image);
        this.HTMLImage.attr('longdesc',this.image);

        this.DIV.append(this.HTMLImage);
        this.ParentNode.append(this.DIV)

    };

    /*
     *  Removes all div objects and css selectors associated with the Hud
     */
    OverlayButton.prototype.destroySelf = function () {
        var self = this;
        self.DIV.remove();
        self.StyleSheet.remove();
    };

    /*
    * Assigns a callback for when the button is clicked.
    *
    * @param callback: function to call upon click.
     */
    OverlayButton.prototype.addClickEvent = function (callback) {
        this.HTMLImage.on('click', callback)
    };


    return OverlayButton
});