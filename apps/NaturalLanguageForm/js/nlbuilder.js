/*
 * Author: Matt Evers
 */
/*
* This module helps you define an nlform. The object created by this module should be passed to the nlfactory before
*   accessing it.
 */
define(
    function(){

        function NLBuilder (id) {
            this.el = $('<form>');
            this.el.attr('id',id);
            this.el.attr('class','nl-form')
        }

        NLBuilder.prototype.addBasicText = function (text) {
            this.el.append(text)
        };

        /*
        * @param placeholder: the word that appears on click and as default
        * @param forex: subline string e.g. "For example: <em>cafe</em> or <em>Fad</em>"
         */
        NLBuilder.prototype.addField = function (id, placeholder, forex) {
            var field = new $('<input>');
                //<input id="amenityField" type="text" value="" placeholder="amenity" data-subline="For example: <em>cafe</em>">
            field.attr('id', id);
            field.attr('type', 'text');
            field.attr('value', '');
            field.attr('placeholder', placeholder);
            field.attr('data-subline', forex);
            this.el.append(field)
        };

        NLBuilder.prototype.getForm = function () {
            return this.el
        };

        /*
        * Stores a reference to the application that will be called upon completion of the form.
         */
        NLBuilder.prototype.setApplication = function (application) {
            this.application = application
        };

        return NLBuilder
    }
);