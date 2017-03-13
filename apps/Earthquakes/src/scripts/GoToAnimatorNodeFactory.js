define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
    'GoToAnimatorNode'],function(ww, GoToAnimatorNode) {

    'use strict';

    function GoToAnimatorNodeFactory(jumpUpHeight, jumpDownHeight) {

        this.jumpUpHeight = jumpUpHeight;
        this.jumpDownHeight = jumpDownHeight;

    }


    GoToAnimatorNodeFactory.prototype.manufactureNode = function(fromLatitude, toLatitude, fromLongitude, toLongitude){
        var position1 = new Position(fromLatitude, fromLongitude, this.jumpUpHeight);
        var position2 = new Position(toLatitude, toLongitude, this.jumpUpHeight);
        var position3 = new Position(toLatitude, toLongitude, this.jumpDownHeight);
        var positions = [position1, position2, position3];
        return positions.map(function(pos) {
           return new GoToAnimatorNode(pos);
        });

    }


});