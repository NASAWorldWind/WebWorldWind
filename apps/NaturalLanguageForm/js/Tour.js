(define(function() {

    function Tour(tourName, dataPoints, positionExtractor, sorter, jumpUpHeight, jumpDownHeight) {

        this.tourName = tourName;

        this.self = this;

        this.itenarary = dataPoints.map(function(point) {
            return {
                position : positionExtractor(point),
                data : point
            };
        }).sort(function(point1, point2) {
            return sorter(point1['data'], point2['data']);
        }).map(function(point) {
           return  point['position'];
        });

        this.tripIndex = 0;

        this.tripLength = this.itenarary.length;

        this.jumpUpHeight = jumpUpHeight || 1000000;
        this.jumpDownHeight = jumpDownHeight || 50000;

        console.log('itenarary, ', this.itenarary);
        this.hops = [];
        this.hops.push(this.itenarary[0]);
        var lastHop = this.hops[0];
        for(var idx = 1; idx < this.tripLength; idx += 1) {
            this.hops.push(new WorldWind.Position(lastHop.latitude, lastHop.longitude, this.jumpUpHeight));
            var next = this.itenarary[idx];
            this.hops.push(new WorldWind.Position(next.latitude, next.longitude, this.jumpUpHeight));
            lastHop = new WorldWind.Position(next.latitude, next.longitude, this.jumpDownHeight);
            this.hops.push(lastHop);
        }

        this.hops.filter(function(hop) {
            return hop !== undefined && hop !== null;
        });

        this.numHops = this.hops.length - 1;
        this.places = this.hops;

        var self = this;


        this.goBack = function() {
            if(self.tripIndex > 0) {
                self.tripIndex -= 1;
                return self.hops[self.tripIndex];
            }
            return null;
        }

        console.log('tour this: ', this);

        this.goForward = function() {
            var self = this;
            console.log('this is ' , self);
            if(self.tripIndex < self.numHops) {
                self.tripIndex += 1;
                return self.hops[self.tripIndex];
            }
            return null;
        }

    }

    //Tour.prototype.goBack = function() {
    //    if(this.tripIndex > 0) {
    //        this.tripIndex -= 1;
    //        return this.hops[this.tripIndex];
    //    }
    //    return null;
    //}
    //
    //Tour.prototype.goForward = function() {
    //    var self = this;
    //    console.log('this is ' , self);
    //    if(this.tripIndex < this.numHops) {
    //        this.tripIndex += 1;
    //        return this.hops[this.tripIndex];
    //    }
    //    return null;
    //}




    return Tour;


}));