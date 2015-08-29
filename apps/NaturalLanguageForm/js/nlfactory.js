/**
 * Created by Matthew on 7/31/2015.
 */

define(
    function () {

        function nlform ( formBase ) {
            var self = this;
            this.el = formBase.el.clone();
            this.application = formBase.application;
        }

        nlform.prototype.getForm = function () {
            return this.el
        };

        function NaturalLanguageFactory(form){}

        NaturalLanguageFactory.prototype.createForm = function ( form ) {
            return new nlform( form )
        };

        return NaturalLanguageFactory
    }

)