/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display text at geographic positions.
 *
 * @version $Id: GeographicText.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Added imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }


        // A list of prominent peaks in the U.S.
        // This list was mined from https://en.wikipedia.org/wiki/List_of_Ultras_of_the_United_States
        var peaks =
            [
                {
                    'name': "Mount McKinley\n(Denali)", // Mount McKinley
                    'state': "Alaska",
                    'elevation': 6194,
                    'latitude': 63.0690,
                    'longitude': -151.0063
                },
                {
                    'name': "Mauna\nKea",
                    'state': "Hawaii",
                    'elevation': 4205,
                    'latitude': 19.8207,
                    'longitude': -155.4680
                },
                {
                    'name': "Mount\nRainier",
                    'state': "Washington",
                    'elevation': 4394,
                    'latitude': 46.8529,
                    'longitude': -121.7604
                },
                {
                    'name': "Mount Fairweather (Fairweather Mountain)",
                    'state': "Alaska",
                    'elevation': 4663,
                    'latitude': 58.9064,
                    'longitude': -137.5267
                },
                {
                    'name': "Mount Blackburn",
                    'state': "Alaska",
                    'elevation': 4996,
                    'latitude': 61.7305,
                    'longitude': -143.4031
                },
                {
                    'name': "Mount Hayes",
                    'state': "Alaska",
                    'elevation': 4216,
                    'latitude': 63.6203,
                    'longitude': -146.7178
                },
                {
                    'name': "Mount Saint Elias",
                    'state': "Alaska",
                    'elevation': 5489,
                    'latitude': 60.2931,
                    'longitude': -140.9264
                },
                {
                    'name': "Mount Marcus Baker",
                    'state': "Alaska",
                    'elevation': 4016,
                    'latitude': 61.4374,
                    'longitude': -147.7525
                },
                {
                    'name': "Mount\nWhitney",
                    'state': "California",
                    'elevation': 4421,
                    'latitude': 36.5786,
                    'longitude': -118.2920
                },
                {
                    'name': "Haleakalā",
                    'state': "Hawaii",
                    'elevation': 3055,
                    'latitude': 20.7097,
                    'longitude': -156.2533
                },
                {
                    'name': "Mount Shasta",
                    'state': "California",
                    'elevation': 4322,
                    'latitude': 41.4092,
                    'longitude': -122.1949
                },
                {
                    'name': "Shishaldin Volcano",
                    'state': "Alaska",
                    'elevation': 2869,
                    'latitude': 54.7554,
                    'longitude': -163.9709
                },
                {
                    'name': "Redoubt Volcano",
                    'state': "Alaska",
                    'elevation': 3108,
                    'latitude': 60.4854,
                    'longitude': -152.7442
                },
                {
                    'name': "Mount Elbert",
                    'state': "Colorado",
                    'elevation': 4401,
                    'latitude': 39.1178,
                    'longitude': -106.4454
                },
                {
                    'name': "Mount Baker",
                    'state': "Washington",
                    'elevation': 3287,
                    'latitude': 48.7768,
                    'longitude': -121.8145
                },
                {
                    'name': "Mount Torbert",
                    'state': "Alaska",
                    'elevation': 3479,
                    'latitude': 61.4086,
                    'longitude': -152.4125
                },
                {
                    'name': "San Jacinto Peak",
                    'state': "California",
                    'elevation': 3302,
                    'latitude': 33.8147,
                    'longitude': -116.6794
                },
                {
                    'name': "San Gorgonio Mountain",
                    'state': "California",
                    'elevation': 3506,
                    'latitude': 34.0992,
                    'longitude': -116.8249
                },
                {
                    'name': "Charleston Peak", // Mount Charleston
                    'state': "Nevada",
                    'elevation': 3632,
                    'latitude': 36.2716,
                    'longitude': -115.6956
                },
                {
                    'name': "Pavlof Volcano",
                    'state': "Alaska",
                    'elevation': 2515,
                    'latitude': 55.4173,
                    'longitude': -161.8932
                },
                {
                    'name': "Mount Veniaminof",
                    'state': "Alaska",
                    'elevation': 2507,
                    'latitude': 56.2194,
                    'longitude': -159.2975
                },
                {
                    'name': "Mount Adams",
                    'state': "Washington",
                    'elevation': 3743,
                    'latitude': 46.2024,
                    'longitude': -121.4909
                },
                {
                    'name': "Mount Hubbard",
                    'state': "Alaska",
                    'elevation': 4577,
                    'latitude': 60.3192,
                    'longitude': -139.0714
                },
                {
                    'name': "Mount Chamberlin",
                    'state': "Alaska",
                    'elevation': 2749,
                    'latitude': 69.2775,
                    'longitude': -144.9107
                },
                {
                    'name': "Iliamna Volcano",
                    'state': "Alaska",
                    'elevation': 3053,
                    'latitude': 60.0321,
                    'longitude': -153.0915
                },
                {
                    'name': "Mount Olympus",
                    'state': "Washington",
                    'elevation': 2432,
                    'latitude': 47.8013,
                    'longitude': -123.7108
                },
                {
                    'name': "Mount Cook",
                    'state': "Alaska",
                    'elevation': 4194,
                    'latitude': 60.1819,
                    'longitude': -139.9808
                },
                {
                    'name': "Mount\nHood",
                    'state': "Oregon",
                    'elevation': 3429,
                    'latitude': 45.3735,
                    'longitude': -121.6959
                },
                {
                    'name': "Mount Sanford",
                    'state': "Alaska",
                    'elevation': 4949,
                    'latitude': 62.2132,
                    'longitude': -144.1292
                },
                {
                    'name': "Mount Tom White",
                    'state': "Alaska",
                    'elevation': 3411,
                    'latitude': 60.6518,
                    'longitude': -143.6972
                },
                {
                    'name': "Wheeler Peak",
                    'state': "Nevada",
                    'elevation': 3982,
                    'latitude': 38.9858,
                    'longitude': -114.3139
                },
                {
                    'name': "Glacier Peak",
                    'state': "Washington",
                    'elevation': 3214,
                    'latitude': 48.1125,
                    'longitude': -121.1138
                },
                {
                    'name': "Mount Kimball",
                    'state': "Alaska",
                    'elevation': 3155,
                    'latitude': 63.2390,
                    'longitude': -144.6419
                },
                {
                    'name': "Mount Griggs",
                    'state': "Alaska",
                    'elevation': 2332,
                    'latitude': 58.3534,
                    'longitude': -155.0958
                },
                {
                    'name': "Mount Foraker",
                    'state': "Alaska",
                    'elevation': 5304,
                    'latitude': 62.9604,
                    'longitude': -151.3998
                },
                {
                    'name': "White Mountain Peak",
                    'state': "California",
                    'elevation': 4344,
                    'latitude': 37.6341,
                    'longitude': -118.2557
                },
                {
                    'name': "Mount Crillon",
                    'state': "Alaska",
                    'elevation': 3879,
                    'latitude': 58.6625,
                    'longitude': -137.1712
                },
                {
                    'name': "Mauna Loa",
                    'state': "Hawaii",
                    'elevation': 4169,
                    'latitude': 19.4756,
                    'longitude': -155.6054
                },
                {
                    'name': "Cloud Peak",
                    'state': "Wyoming",
                    'elevation': 4013,
                    'latitude': 44.3821,
                    'longitude': -107.1739
                },
                {
                    'name': "Gannett Peak",
                    'state': "Wyoming",
                    'elevation': 4209,
                    'latitude': 43.1842,
                    'longitude': -109.6542
                },
                {
                    'name': "Mount Vsevidof",
                    'state': "Alaska",
                    'elevation': 2149,
                    'latitude': 53.1256,
                    'longitude': -168.6938
                },
                {
                    'name': "Mount Hesperus",
                    'state': "Alaska",
                    'elevation': 2996,
                    'latitude': 61.8036,
                    'longitude': -154.1469
                },
                {
                    'name': "Mount Bona",
                    'state': "Alaska",
                    'elevation': 5044,
                    'latitude': 61.3856,
                    'longitude': -141.7495
                },
                {
                    'name': "Mount Drum",
                    'state': "Alaska",
                    'elevation': 3661,
                    'latitude': 62.1159,
                    'longitude': -144.6394
                },
                {
                    'name': "Mount Chiginagak",
                    'state': "Alaska",
                    'elevation': 2111,
                    'latitude': 57.1334,
                    'longitude': -156.9912
                },
                {
                    'name': "Grand Teton",
                    'state': "Wyoming",
                    'elevation': 4199,
                    'latitude': 43.7412,
                    'longitude': -110.8024
                },
                {
                    'name': "Sacajawea Peak",
                    'state': "Oregon",
                    'elevation': 3000,
                    'latitude': 45.2450,
                    'longitude': -117.2929
                },
                {
                    'name': "Mount Neacola",
                    'state': "Alaska",
                    'elevation': 2873,
                    'latitude': 60.7981,
                    'longitude': -153.3959
                },
                {
                    'name': "Kings Peak",
                    'state': "Utah",
                    'elevation': 4125,
                    'latitude': 40.7763,
                    'longitude': -110.3729
                },
                {
                    'name': "Mount Graham",
                    'state': "Arizona",
                    'elevation': 3269,
                    'latitude': 32.7017,
                    'longitude': -109.8714
                },
                {
                    'name': "Mount Douglas",
                    'state': "Alaska",
                    'elevation': 2149,
                    'latitude': 58.8598,
                    'longitude': -153.5353
                },
                {
                    'name': "Mount San Antonio",
                    'state': "California",
                    'elevation': 3069,
                    'latitude': 34.2891,
                    'longitude': -117.6463
                },
                {
                    'name': "Kichatna Spire",
                    'state': "Alaska",
                    'elevation': 2739,
                    'latitude': 62.4231,
                    'longitude': -152.7231
                },
                {
                    'name': "De Long Peak",
                    'state': "Alaska",
                    'elevation': 2464,
                    'latitude': 60.8299,
                    'longitude': -145.1335
                },
                {
                    'name': "Telescope Peak",
                    'state': "California",
                    'elevation': 3366,
                    'latitude': 36.1698,
                    'longitude': -117.0892
                },
                {
                    'name': "Mount Peale",
                    'state': "Utah",
                    'elevation': 3879,
                    'latitude': 38.4385,
                    'longitude': -109.2292
                },
                {
                    'name': "Pogromni Volcano",
                    'state': "Alaska",
                    'elevation': 1991,
                    'latitude': 54.5705,
                    'longitude': -164.6926
                },
                {
                    'name': "Peak 8010",
                    'state': "Alaska",
                    'elevation': 2441,
                    'latitude': 61.1605,
                    'longitude': -144.8129
                },
                {
                    'name': "Mount Washington",
                    'state': "New Hampshire",
                    'elevation': 1917,
                    'latitude': 44.2705,
                    'longitude': -71.3032
                },
                {
                    'name': "Mount Igikpak",
                    'state': "Alaska",
                    'elevation': 2523,
                    'latitude': 67.4129,
                    'longitude': -154.9656
                },
                {
                    'name': "Snow Tower",
                    'state': "Alaska",
                    'elevation': 2003,
                    'latitude': 58.1724,
                    'longitude': -133.4009
                },
                {
                    'name': "Mount Mitchell",
                    'state': "North Carolina",
                    'elevation': 2037,
                    'latitude': 35.7650,
                    'longitude': -82.2652
                },
                {
                    'name': "Truuli Peak",
                    'state': "Alaska",
                    'elevation': 2015,
                    'latitude': 59.9129,
                    'longitude': -150.4348
                },
                {
                    'name': "Humphreys Peak",
                    'state': "Arizona",
                    'elevation': 3852,
                    'latitude': 35.3464,
                    'longitude': -111.6780
                },
                {
                    'name': "Borah Peak",
                    'state': "Idaho",
                    'elevation': 3861,
                    'latitude': 44.1374,
                    'longitude': -113.7811
                },
                {
                    'name': "Mount Natazhat",
                    'state': "Alaska",
                    'elevation': 4095,
                    'latitude': 61.5217,
                    'longitude': -141.1030
                },
                {
                    'name': "Hanagita Peak",
                    'state': "Alaska",
                    'elevation': 2592,
                    'latitude': 61.0670,
                    'longitude': -143.7075
                },
                {
                    'name': "Tanaga Volcano",
                    'state': "Alaska",
                    'elevation': 1806,
                    'latitude': 51.8839,
                    'longitude': -178.1414
                },
                {
                    'name': "Makushin Volcano",
                    'state': "Alaska",
                    'elevation': 1800,
                    'latitude': 53.8782,
                    'longitude': -166.9299
                },
                {
                    'name': "Sovereign Mountain",
                    'state': "Alaska",
                    'elevation': 2697,
                    'latitude': 62.1311,
                    'longitude': -148.6044
                },
                {
                    'name': "Mount Jefferson",
                    'state': "Nevada",
                    'elevation': 3641,
                    'latitude': 38.7519,
                    'longitude': -116.9267
                },
                {
                    'name': "Mount Ellen",
                    'state': "Utah",
                    'elevation': 3513,
                    'latitude': 38.1089,
                    'longitude': -110.8136
                },
                {
                    'name': "Isanotski Peaks",
                    'state': "Alaska",
                    'elevation': 2471,
                    'latitude': 54.7680,
                    'longitude': -163.7291
                },
                {
                    'name': "Deseret Peak",
                    'state': "Utah",
                    'elevation': 3364,
                    'latitude': 40.4595,
                    'longitude': -112.6263
                },
                {
                    'name': "Mount Jefferson",
                    'state': "Oregon",
                    'elevation': 3201,
                    'latitude': 44.6743,
                    'longitude': -121.7996
                },
                {
                    'name': "Isthmus Peak",
                    'state': "Alaska",
                    'elevation': 1991,
                    'latitude': 60.5772,
                    'longitude': -148.8915
                },
                {
                    'name': "Frosty Peak",
                    'state': "Alaska",
                    'elevation': 1769,
                    'latitude': 55.0672,
                    'longitude': -162.8351
                },
                {
                    'name': "Pilot Peak",
                    'state': "Nevada",
                    'elevation': 3268,
                    'latitude': 41.0211,
                    'longitude': -114.0774
                },
                {
                    'name': "Crazy Peak",
                    'state': "Montana",
                    'elevation': 3418,
                    'latitude': 46.0183,
                    'longitude': -110.2766
                },
                {
                    'name': "Great Sitkin Volcano",
                    'state': "Alaska",
                    'elevation': 1740,
                    'latitude': 52.0765,
                    'longitude': -176.1109
                },
                {
                    'name': "Puʻu Kukui",
                    'state': "Hawaii",
                    'elevation': 1764,
                    'latitude': 20.8904,
                    'longitude': -156.5863
                },
                {
                    'name': "Mount Cleveland",
                    'state': "Alaska",
                    'elevation': 1730,
                    'latitude': 52.8230,
                    'longitude': -169.9465
                },
                {
                    'name': "McDonald Peak",
                    'state': "Montana",
                    'elevation': 2994,
                    'latitude': 47.3826,
                    'longitude': -113.9191
                },
                {
                    'name': "Mount Wrangell",
                    'state': "Alaska",
                    'elevation': 4317,
                    'latitude': 62.0059,
                    'longitude': -144.0187
                },
                {
                    'name': "South Sister",
                    'state': "Oregon",
                    'elevation': 3159,
                    'latitude': 44.1035,
                    'longitude': -121.7693
                },
                {
                    'name': "Devils Paw",
                    'state': "Alaska",
                    'elevation': 2593,
                    'latitude': 58.7289,
                    'longitude': -133.8403
                },
                {
                    'name': "Mount Seattle",
                    'state': "Alaska",
                    'elevation': 3155,
                    'latitude': 60.0680,
                    'longitude': -139.1893
                },
                {
                    'name': "Sierra Blanca Peak",
                    'state': "New Mexico",
                    'elevation': 3652,
                    'latitude': 33.3743,
                    'longitude': -105.8087
                },
                {
                    'name': "Pikes Peak",
                    'state': "Colorado",
                    'elevation': 4302,
                    'latitude': 38.8405,
                    'longitude': -105.0442
                },
                {
                    'name': "Mount Russell",
                    'state': "Alaska",
                    'elevation': 3557,
                    'latitude': 62.7984,
                    'longitude': -151.8845
                },
                {
                    'name': "Mount Nebo",
                    'state': "Utah",
                    'elevation': 3637,
                    'latitude': 39.8219,
                    'longitude': -111.7603
                },
                {
                    'name': "Snowshoe Peak",
                    'state': "Montana",
                    'elevation': 2665,
                    'latitude': 48.2231,
                    'longitude': -115.6890
                },
                {
                    'name': "North Schell Peak",
                    'state': "Nevada",
                    'elevation': 3626,
                    'latitude': 39.4132,
                    'longitude': -114.5997
                },
                {
                    'name': "Hayford Peak",
                    'state': "Nevada",
                    'elevation': 3025,
                    'latitude': 36.6577,
                    'longitude': -115.2008
                },
                {
                    'name': "Mount Foresta",
                    'state': "Alaska",
                    'elevation': 3368,
                    'latitude': 60.1912,
                    'longitude': -139.4323
                },
                {
                    'name': "Star Peak",
                    'state': "Nevada",
                    'elevation': 2999,
                    'latitude': 40.5224,
                    'longitude': -118.1708
                },
                {
                    'name': "Veniaminof Peak",
                    'state': "Alaska",
                    'elevation': 1643,
                    'latitude': 57.0151,
                    'longitude': -134.9882
                },
                {
                    'name': "Diamond Peak",
                    'state': "Idaho",
                    'elevation': 3719,
                    'latitude': 44.1414,
                    'longitude': -113.0827
                },
                {
                    'name': "Flat Top Mountain",
                    'state': "Utah",
                    'elevation': 3238,
                    'latitude': 40.3724,
                    'longitude': -112.1888
                },
                {
                    'name': "Bearhole Peak",
                    'state': "Alaska",
                    'elevation': 2596,
                    'latitude': 60.9283,
                    'longitude': -142.5237
                },
                {
                    'name': "Mount Steller",
                    'state': "Alaska",
                    'elevation': 3205,
                    'latitude': 60.5199,
                    'longitude': -143.0932
                },
                {
                    'name': "Mount Stuart",
                    'state': "Washington",
                    'elevation': 2871,
                    'latitude': 47.4751,
                    'longitude': -120.9024
                },
                {
                    'name': "Blanca Peak",
                    'state': "Colorado",
                    'elevation': 4376,
                    'latitude': 37.5775,
                    'longitude': -105.4856
                },
                {
                    'name': "Mount Miller",
                    'state': "Alaska",
                    'elevation': 3277,
                    'latitude': 60.4605,
                    'longitude': -142.3012
                },
                {
                    'name': "Carlisle Volcano",
                    'state': "Alaska",
                    'elevation': 1610,
                    'latitude': 52.8913,
                    'longitude': -170.0580
                },
                {
                    'name': "Mount Timpanogos",
                    'state': "Utah",
                    'elevation': 3582,
                    'latitude': 40.3908,
                    'longitude': -111.6459
                },
                {
                    'name': "Bashful Peak",
                    'state': "Alaska",
                    'elevation': 2440,
                    'latitude': 61.3076,
                    'longitude': -148.8697
                },
                {
                    'name': "Ibapah Peak",
                    'state': "Utah",
                    'elevation': 3686,
                    'latitude': 39.8282,
                    'longitude': -113.9200
                },
                {
                    'name': "Mount Cleveland",
                    'state': "Montana",
                    'elevation': 3194,
                    'latitude': 48.9249,
                    'longitude': -113.8482
                },
                {
                    'name': "Kawaikini",
                    'state': "Hawaii",
                    'elevation': 1598,
                    'latitude': 22.0586,
                    'longitude': -159.4973
                },
                {
                    'name': "He Devil",
                    'state': "Idaho",
                    'elevation': 2873,
                    'latitude': 45.3241,
                    'longitude': -116.5484
                },
                {
                    'name': "Tetlin Peak",
                    'state': "Alaska",
                    'elevation': 2550,
                    'latitude': 62.6215,
                    'longitude': -143.1084
                },
                {
                    'name': "Arc Dome",
                    'state': "Nevada",
                    'elevation': 3590,
                    'latitude': 38.8327,
                    'longitude': -117.3531
                },
                {
                    'name': "Lassen Peak",
                    'state': "California",
                    'elevation': 3189,
                    'latitude': 40.4882,
                    'longitude': -121.5050
                },
                {
                    'name': "Mount Deborah",
                    'state': "Alaska",
                    'elevation': 3761,
                    'latitude': 63.6377,
                    'longitude': -147.2384
                },
                {
                    'name': "Necous Peak",
                    'state': "Alaska",
                    'elevation': 2541,
                    'latitude': 61.1125,
                    'longitude': -153.4690
                },
                {
                    'name': "Abercrombie Mountain",
                    'state': "Washington",
                    'elevation': 2229,
                    'latitude': 48.9284,
                    'longitude': -117.4600
                },
                {
                    'name': "Mount Lemmon",
                    'state': "Arizona",
                    'elevation': 2792,
                    'latitude': 32.4430,
                    'longitude': -110.7885
                },
                {
                    'name': "Gareloi Volcano",
                    'state': "Alaska",
                    'elevation': 1573,
                    'latitude': 51.7880,
                    'longitude': -178.7940
                },
                {
                    'name': "Mount Eddy",
                    'state': "California",
                    'elevation': 2755,
                    'latitude': 41.3196,
                    'longitude': -122.4790
                },
                {
                    'name': "Chiricahua Peak",
                    'state': "Arizona",
                    'elevation': 2976,
                    'latitude': 31.8465,
                    'longitude': -109.2910
                },
                {
                    'name': "Peak 8488",
                    'state': "Alaska",
                    'elevation': 2587,
                    'latitude': 61.4950,
                    'longitude': -153.6224
                },
                {
                    'name': "Mount Augusta",
                    'state': "Alaska",
                    'elevation': 4289,
                    'latitude': 60.3078,
                    'longitude': -140.4586
                },
                {
                    'name': "Peak 6915",
                    'state': "Alaska",
                    'elevation': 2108,
                    'latitude': 61.3297,
                    'longitude': -144.9599
                },
                {
                    'name': "Mount Bear",
                    'state': "Alaska",
                    'elevation': 4520,
                    'latitude': 61.2834,
                    'longitude': -141.1433
                },
                {
                    'name': "Korovin Volcano",
                    'state': "Alaska",
                    'elevation': 1533,
                    'latitude': 52.3817,
                    'longitude': -174.1658
                },
                {
                    'name': "Miller Peak",
                    'state': "Arizona",
                    'elevation': 2886,
                    'latitude': 31.3928,
                    'longitude': -110.2930
                },
                {
                    'name': "Kamakou",
                    'state': "Hawaii",
                    'elevation': 1512,
                    'latitude': 21.1065,
                    'longitude': -156.8682
                }
            ];

        var text,
            textAttributes = new WorldWind.TextAttributes(null),
            textLayer = new WorldWind.RenderableLayer("U.S.A. Peaks");

        // Set up the common text attributes.
        textAttributes.color = WorldWind.Color.CYAN;

        // Set the depth test property such that the terrain does not obscure the text.
        textAttributes.depthTest = false;

        // For each peak, create a text shape.
        for (var i = 0, len = peaks.length; i < len; i++) {
            var peak = peaks[i],
                peakPosition = new WorldWind.Position(peak.latitude, peak.longitude, peak.elevation);

            text = new WorldWind.GeographicText(peakPosition, peak.name + "\n" + peak.state);

            // Set the text attributes for this shape.
            text.attributes = textAttributes;

            // Add the text to the layer.
            textLayer.addRenderable(text);
        }

        // Add the text layer to the World Window's layer list.
        wwd.addLayer(textLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });