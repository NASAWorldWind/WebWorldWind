(define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
    'GoToAnimatorNodeFactory'],function(ww, GoToAnimatorNodeFactory) {

    'use strict';


    function GoToAnimatorQueue(animator, jumpUpHeight, jumpDownHeight) {

        var jumpUpHeight = jumpUpHeight || 1000000;
        var jumpDownHeight = jumpDownHeight ||10000;

        this._animator = animator;
        this.queue = [];
        this.factory = new GoToAnimatorNodeFactory();
        this._intervals = [16000, 8000, 4000, 2000, 1000];
        this._speedMarker = 2;
        this._interval = this._intervals[this._speedMarker];
        this._frozen = true;
        this._queueIndex = 0;
        this._animationID = null;

    }

    GoToAnimatorQueue.prototype.fastFoward = function() {
        if(this._speedMarker > 0) {
            this._speedMarker -= 1;
        }
    }

    GoToAnimatorQueue.prototype.slowDown = function() {
        if(this._speedMarker < this._intervals.length) {
            this._speedMarker += 1;
        }

    }

    GoToAnimatorQueue.prototype.clear = function() {
        this.queue = [];
    }

    GoToAnimatorQueue.prototype.isEmpty = function() {
        return this.queue.length === 0;
    }

    GoToAnimatorQueue.prototype.isQueueFinished = function() {
        return this._queueIndex >= this.queue.length;
    }

    GoToAnimatorQueue.prototype.enqueue = function(fromLatitude, toLatitude, fromLongitude, toLongitude) {
        var nodes = this.factory.manufactureNode(fromLatitude, toLatitude, fromLongitude, toLongitude);
        nodes.forEach(function(node) {
            this.queue.push(node);
        });
    }

    GoToAnimatorQueue.prototype.dequeue = function() {
        if(this._queueIndex >= this.queue.length ) {
            this._queueIndex -= this.queue.length;
        }
        var elem = this.queue[this._queueIndex];
        this._queueIndex += 1;
        return elem;
    }

    GoToAnimatorQueue.prototype.reset = function() {
        this._queueIndex = 0;
    }

    GoToAnimatorQueue.prototype.freezeQueue = function() {
        this._frozen = true;
        if(this._animationID) {
            window.clearInterval(this._animationID);
        }
    }

    GoToAnimatorQueue.getAnimationSpeed = function() {
        return this._intervals[this._speedMarker];
    }

    GoToAnimatorQueue.prototype.unFreezeQueue = function() {
        this._frozen = false;

        function handleAnimation() {
            var elem = this.dequeue();
            this._animator.goTo(elem.position);
            if(this._animationID) {
                clearInterval(this._animationID);
            }
            this._animationID = setInterval(handleAnimation, this.getAnimationSpeed());
        };

        var speed = this._intervals[this._speedMarker];
        setInterval(handleAnimation, speed);

    }



    Object.defineProperties(GoToAnimatorNodeFactory.prototype, {
       interval: {
           get: function() {
               return this._interval;
           },

           set: function(interval) {
               this._interval = interval;
           }
       }
    });


    return GoToAnimatorQueue;




}))
