/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function(){
    var CatchTest = function(test) {
        return function(queue) {
            try {
                test(queue);
            } catch (e) {
                if (e.name == "AssertError") {
                    throw e;
                }
                console.error(e.stack);
                fail('Error in the application.');
            }
        };
    };

    return CatchTest;
});