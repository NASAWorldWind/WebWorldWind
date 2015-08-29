/**
 * Created by Matthew on 8/4/2015.
 */

define(['WorldWindBase', 'EarthquakeApp', 'LayerManager'],
    function(WorldWindBase, EarthquakeApp, LayerManager){
        var worldWind = new WorldWindBase();
        new EarthquakeApp(worldWind, 'Earthquakes');
        new LayerManager(worldWind);
    }
);