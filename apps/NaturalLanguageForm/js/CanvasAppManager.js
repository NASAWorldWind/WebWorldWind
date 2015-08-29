/**
 * Created by Matthew on 8/10/2015.
 */
/*
* Acts a manager for applications. nlform calls this module. It checks for whether an application is a singleton app or
*   whether an app should be created new for each query. If is should be created new or the app is not already running
*   it creates the app and stores it in an array.
*
* Applications that wish to recieve new queries rather than a new instance should contain a parameter
*   <appinstance>.singletonApplication = true.
 */
define(function(){
    var ApplicationManager = function () {
        var self = this;
        self._applications = {};
    };

    /*
    * Either submits a new query to an application or creates a new application if one does not already exist or if an
    *   application demands a new instance for each query.
    *
    * @param application: The application that is either already running (and will be queried)
    *                       or to be created with the arg array.
    * @param worldwindow: The worldwindow on which the application will apply the layer.
    * @param argumentarray: The array of arguments to be passed to the application as determined by the application.
     */
    ApplicationManager.prototype.callInstance = function (application, worldwindow, argumentarray) {
        var self = this;
        var hasInstance = false;
        for (var key in self._applications) {
            if (self._applications.hasOwnProperty(key)) {
                var obj = self._applications[key][self._applications[key].length-1];
                // console.log('application is', obj);
                if (obj instanceof application){
                    hasInstance = true;
                    if (!obj.singletonApplication){
                        var newApp = new application(worldwindow, argumentarray)
                        self._applications[key].push(newApp)
                        return newApp
                    } else {
                        obj.newCall(worldwindow, argumentarray)
                        return obj
                    }
                }
            }
        }

        if (!hasInstance) {
            var newApp = new application(worldwindow, argumentarray)
            self._applications[application] = [newApp]
            return newApp
        }


    };

    ApplicationManager.prototype.unFocusAll = function () {
        var self = this;
        console.log('unfocus called')
        for (var key in self._applications) {
            if (self._applications.hasOwnProperty(key)) {
                var appEquivalenceClass = self._applications[key];
                // console.log('application is', obj);
                appEquivalenceClass.forEach(function(app){
                    if (app.isNotFocussed) {
                        app.isNotFocussed()
                    }
                })
            }
        }
    };

    ApplicationManager.prototype.focusAll = function () {
        var self = this;
        //console.log('focus Called')
        for (var key in self._applications) {
            if (self._applications.hasOwnProperty(key)) {
                var appEquivalenceClass = self._applications[key];
                // console.log('application is', obj);
                appEquivalenceClass.forEach(function(app){
                    if (app.isFocussed) {
                        app.isFocussed()
                    }
                })
            }
        }
    };

    return ApplicationManager
});