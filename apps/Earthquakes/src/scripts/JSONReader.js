define(function() {

    function JSONReader(specs, entry) {

        var self = this;
        this.extractors = specs.map(function(spec) {
            var name = spec[0];
            var loc = spec[1].split('.');
            var locator = function(obj) {
                var temp = obj;
                loc.forEach(function(prop) {
                    temp = temp[prop];
                });
                return temp;
            };

            var res = {
                propName : name,
                locatorFun : locator
            };

            console.log('pair := ', res);

            return res;
        });

        console.log('extractors --=> ', this.extractors);

        this.peeker = null;

        if(entry) {
            console.log('entry : ', entry);
            var loc = entry.split('.');
            console.log('loc : ', loc);
            this.peeker = function(obj) {
                console.log('checking ', obj);
                console.log('loc -->', loc);
                var temp = obj;
                loc.forEach(function(prop) {

                    temp = temp[prop];
                    console.log(temp);
                });
                return temp;
            };
            console.log('Created peeker function');
        }

        this.extract = function(data) {
            console.log(data);
            var data = (this.peeker !== null)  ? this.peeker(data) : data;
            console.log(data);
            var res = [];
            res = data.map(function(datum) {
                var obj = {};
                self.extractors.forEach(function(extractor) {
                    console.log(extractor.propName, '------> ', extractor.locatorFun(datum), ' from ', datum);
                   obj[extractor.propName] = extractor.locatorFun(datum);
                });
                return obj;
            });

            return res;
        }




    }


    return JSONReader


})