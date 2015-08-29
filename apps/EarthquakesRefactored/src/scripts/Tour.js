(define(function() {

    function Tour(tourName, dataPoints, positionExtractor, sorter, jumpUpHeight, jumpDownHeight) {

        this.tourName = tourName;

        this.self = this;
        this.callbacks = [];
        this.quakes = dataPoints;

        //this.inSortedOrder = dataPoints.map(function(point) {
        //    return {
        //        position : positionExtractor(point),
        //        data : point
        //    };
        //}).sort(function(point1, point2) {
        //    //console.log(point1)
        //    return sorter(point1['data'], point2['data']);
        //});
        //
        //this.itenarary = this.inSortedOrder.map(function(point) {
        //    point['position']['data'] = point['data']
        //    return point['position'];
        //});
        //
        //this.quakesInOrder = this.inSortedOrder.map(function())


        this.itenarary = dataPoints.map(function(point) {
            return {
                position : positionExtractor(point),
                data : point
            };
        }).sort(function(point1, point2) {
            //console.log(point1)
            return sorter(point1['data'], point2['data']);
        }).map(function(point) {
            point['position']['data'] = point['data']
           return point['position'];
        });

        this.tripIndex = 0;
        this.tripStop = 0;
        this.tripLength = this.itenarary.length;

        this.jumpUpHeight = jumpUpHeight || 1000000;
        this.jumpDownHeight = jumpDownHeight || 50000;

        console.log('itenarary, ', this.itenarary);
        this.hops = [];
        this.hops.push(this.itenarary[0]);
        var lastHop = this.hops[0];
        for(var idx = 1; idx < this.tripLength; idx += 1) {
            var temp1 = new WorldWind.Position(lastHop.latitude, lastHop.longitude, this.jumpUpHeight);
            temp1.data = lastHop.data;
            this.hops.push(temp1);
            var next = this.itenarary[idx];
            var temp2 = new WorldWind.Position(next.latitude, next.longitude, this.jumpUpHeight);
            temp2.data = next.data;
            this.hops.push(temp2);
            var temp3 = new WorldWind.Position(next.latitude, next.longitude, this.jumpDownHeight);
            temp3.data = next.data;
            lastHop = temp3;
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

        //console.log('tour this: ', this);

        this.goForward = function() {
            var self = this;
            self.tripStop = Math.floor((self.tripIndex+2)/3);
            console.log('this is ' , self);
            self.callbacks.forEach(function(callback){
                //console.log(self.itenarary[self.tripStop]['data']);
                //console.log(self.tripStop);
                callback(self.itenarary[self.tripStop]['data'])
            })
            if(self.tripIndex < self.numHops) {
                self.tripIndex += 1;
                return self.hops[self.tripIndex];
            }
            return null;
        }

    }

    Tour.prototype.addStopCallback = function (callback) {
        this.callbacks.push(callback)
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