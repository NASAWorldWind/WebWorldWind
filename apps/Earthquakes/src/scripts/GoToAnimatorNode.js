define(function() {

   'use strict';


    function GoToAnimatorNode(position) {

        this._position = position;

    }


    Object.defineProperties(GoToAnimatorNode.prototype, {
        position: {
            get: function() {
                return this._position;
            }
        }

    });


});