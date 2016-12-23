define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
    'Tour'], function(ww, Tour) {

    'use strict';

    function TourManager(tour, animator) {

        this.tourName = tour.tourName;

        this.tour = tour;
        this.animator = animator;
        this.speeds = ['16000', '8000', '4000', '2000', '1000'];
        this.speedIndex = 2;
        this.tourTimer = null;
        //console.log('set tour ,', tour);
        this.tourRun = false;
        this.move = true;
        this.callBacks =[];

    }

    TourManager.prototype.addStopCallback

    TourManager.prototype.addCallback = function(callback) {
        this.callBacks.push(callback);
    }

    TourManager.prototype.indicateTourFinished = function() {
        var self = this;
        this.callBacks.forEach(function(callback){
            callback(self)
        });
        //bootbox.bootbox.alert(self.tourName + ' is finished', function() {
        //   'not needed callback';
        //});
    }

    TourManager.prototype.stopTour = function() {
        this.tourRun = false;
        if(this.tourTimer !== null) {
            clearInterval(this.tourTimer);
        }
    }

    TourManager.prototype.startTour = function() {
        //console.log('tour started');
        this.tourRun = true;
        var self = this
        //console.log('tour of ', this.tour);
        this.tourTimer = setInterval(function() {
            //console.log('checking');
            //var tourStop = self.move();
            var tourStop = self.tour.goForward();
            //if(this.move === true) {
            //    tourStop = this.tour.goForward();
            //} else {
            //    tourStop = this.tour.goBack();
            //}
            if(tourStop !== null) {
                //console.log('going to ', tourStop);
                self.animator.goTo(tourStop);
            } else {
                clearInterval(self.tourTimer);
                self.indicateTourFinished();
            }
        }, this.speeds[this.speedIndex]);
    }

    TourManager.prototype.resetTourTimer = function() {
        clearInterval(this.tourTimer);
        this.startTour();
    }


    TourManager.prototype.increaseSpeed = function() {
        if(this.speedIndex < this.speeds.length - 1 && this.tourTimer !== null) {
            this.speedIndex += 1;
            this.resetTourTimer();
        }
    }

    TourManager.prototype.decreaseSpeed = function() {
        if(this.speedIndex > 0 && this.tourTimer !== null) {
            this.speedIndex -= 1;
            this.resetTourTimer();
        }
    }


    return TourManager;
});
