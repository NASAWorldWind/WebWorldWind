/**
 * Created by Florin on 12/18/2016.
 */

define(['src/geom/Location', 'src/util/HashMap'], function (Location, HashMap) {
    'use strict';

    function transformOutputData(rawContours) {
        return rawContours.map(function (contour) {
            var polygons = contour.polygons.map(function (polygon) {
                return polygon.map(function (point) {
                    return new Location(point.latitude, point.longitude);
                });
            });
            var iMap = contour.iMap.map(function (im) {
                var entries = im._entries;
                var iMap = new HashMap();
                Object.keys(entries).forEach(function (key) {
                    iMap.set(key, entries[key]);
                });
                return iMap;
            });
            return {
                polygons: polygons,
                iMap: iMap,
                pole: contour.pole,
                poleIndex: contour.poleIndex
            };
        });
    }

    function transformInputData(rawContours) {
        return rawContours.map(function (contour) {
            return contour.map(function (point) {
                return new Location(point.latitude, point.longitude);
            });
        });
    }

    var simpleSquareInput = [
        [
            new Location(30, 170),
            new Location(33.11, 179.94),
            new Location(30, -170),
            new Location(33.10, -178.86),
            new Location(20, -170),
            new Location(25.57, -179.64),
            new Location(25.60, 178.99),
            new Location(20, 170)
        ]
    ];
    var simpleSquareRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": 33.09145129224652,
                        "longitude": -180
                    },
                    {
                        "latitude": 30,
                        "longitude": -170
                    },
                    {
                        "latitude": 33.1,
                        "longitude": -178.86
                    },
                    {
                        "latitude": 20,
                        "longitude": -170
                    },
                    {
                        "latitude": 25.57,
                        "longitude": -179.64
                    },
                    {
                        "latitude": 25.577883211678834,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": 25.577883211678834,
                        "longitude": 180
                    },
                    {
                        "latitude": 25.6,
                        "longitude": 178.99
                    },
                    {
                        "latitude": 20,
                        "longitude": 170
                    },
                    {
                        "latitude": 30,
                        "longitude": 170
                    },
                    {
                        "latitude": 33.11,
                        "longitude": 179.94
                    },
                    {
                        "latitude": 33.09145129224652,
                        "longitude": 180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 3,
                            "linkTo": 8
                        },
                        "5": {
                            "visited": false,
                            "forPole": false,
                            "index": 8,
                            "linkTo": 3
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 9,
                            "linkTo": 2
                        },
                        "5": {
                            "visited": false,
                            "forPole": false,
                            "index": 2,
                            "linkTo": 9
                        }
                    }
                }
            ]
        }
    ];
    var simpleSquareOutput = transformOutputData(simpleSquareRawOutput);

    var spiralPolyRawInput = [
        [
            {
                "latitude": 35.11187152238888,
                "longitude": 148.2857832205469,
                "altitude": -5993.11713182145
            },
            {
                "latitude": 34.18929760090233,
                "longitude": 148.64643011144784
            },
            {
                "latitude": 33.24759539912641,
                "longitude": 149.0061017356133
            },
            {
                "latitude": 32.28662633762085,
                "longitude": 149.36483975943324
            },
            {
                "latitude": 31.306285631448528,
                "longitude": 149.72268578842773
            },
            {
                "latitude": 30.306505718147555,
                "longitude": 150.07968137120935
            },
            {
                "latitude": 29.287259769580093,
                "longitude": 150.43586800176047
            },
            {
                "latitude": 28.248565257111995,
                "longitude": 150.7912871198608
            },
            {
                "latitude": 27.190487533998088,
                "longitude": 151.14598010950976
            },
            {
                "latitude": 26.113143393115433,
                "longitude": 151.49998829520163
            },
            {
                "latitude": 25.016704552445375,
                "longitude": 151.85335293592942
            },
            {
                "latitude": 23.901401015126762,
                "longitude": 152.2061152168196
            },
            {
                "latitude": 22.7675242456913,
                "longitude": 152.5583162383285
            },
            {
                "latitude": 21.61543009948048,
                "longitude": 152.90999700297172
            },
            {
                "latitude": 20.44554143848829,
                "longitude": 153.26119839959856
            },
            {
                "latitude": 19.25835036424524,
                "longitude": 153.61196118527675
            },
            {
                "latitude": 18.05441999713743,
                "longitude": 153.96232596490708
            },
            {
                "latitude": 16.83438573200732,
                "longitude": 154.31233316874756
            },
            {
                "latitude": 15.598955902259519,
                "longitude": 154.66202302809282
            },
            {
                "latitude": 14.348911789202742,
                "longitude": 155.01143554941785
            },
            {
                "latitude": 13.085106920145122,
                "longitude": 155.36061048736184
            },
            {
                "latitude": 11.808465607896583,
                "longitude": 155.7095873169904
            },
            {
                "latitude": 10.51998069579445,
                "longitude": 156.05840520583067
            },
            {
                "latitude": 9.220710486025611,
                "longitude": 156.40710298622423
            },
            {
                "latitude": 8.462467126604933,
                "longitude": 156.60935140923232,
                "altitude": -5098.728762014921
            },
            {
                "latitude": 8.476949522968773,
                "longitude": 157.99904423711416
            },
            {
                "latitude": 8.486516876780708,
                "longitude": 159.38872908112282
            },
            {
                "latitude": 8.491164373210426,
                "longitude": 160.77840257305846
            },
            {
                "latitude": 8.49088976276751,
                "longitude": 162.16806137043002
            },
            {
                "latitude": 8.485693360222081,
                "longitude": 163.55770216433433
            },
            {
                "latitude": 8.475578043662491,
                "longitude": 164.9473216872649
            },
            {
                "latitude": 8.460549253693937,
                "longitude": 166.33691672083154
            },
            {
                "latitude": 8.440614992773995,
                "longitude": 167.72648410337203
            },
            {
                "latitude": 8.415785824673598,
                "longitude": 169.1160207374377
            },
            {
                "latitude": 8.386074874044215,
                "longitude": 170.50552359713453
            },
            {
                "latitude": 8.35149782606448,
                "longitude": 171.89498973530215
            },
            {
                "latitude": 8.312072926132128,
                "longitude": 173.284416290513
            },
            {
                "latitude": 8.267820979559724,
                "longitude": 174.6738004938746
            },
            {
                "latitude": 8.218765351225652,
                "longitude": 176.0631396756182
            },
            {
                "latitude": 8.164931965124754,
                "longitude": 177.4524312714573
            },
            {
                "latitude": 8.10634930375651,
                "longitude": 178.84167282870087
            },
            {
                "latitude": 8.043048407282045,
                "longitude": -179.76913798789465
            },
            {
                "latitude": 7.975062872375213,
                "longitude": -178.38000339054864
            },
            {
                "latitude": 7.902428850687171,
                "longitude": -176.99092546316896
            },
            {
                "latitude": 7.825185046838351,
                "longitude": -175.60190615636736
            },
            {
                "latitude": 7.743372715846718,
                "longitude": -174.2129472827899
            },
            {
                "latitude": 7.657035659896461,
                "longitude": -172.8240505127746
            },
            {
                "latitude": 7.5662202243471075,
                "longitude": -171.4352173703466
            },
            {
                "latitude": 7.47097529287925,
                "longitude": -170.04644922956192
            },
            {
                "latitude": 7.371352281669783,
                "longitude": -168.65774731120823
            },
            {
                "latitude": 7.267405132486886,
                "longitude": -167.2691126798715
            },
            {
                "latitude": 7.1591903045927685,
                "longitude": -165.88054624137612
            },
            {
                "latitude": 7.046766765340576,
                "longitude": -164.49204874060464
            },
            {
                "latitude": 6.930195979350839,
                "longitude": -163.1036207597032
            },
            {
                "latitude": 6.809541896152531,
                "longitude": -161.71526271667696
            },
            {
                "latitude": 6.684870936173994,
                "longitude": -160.32697486437928
            },
            {
                "latitude": 6.556251974969905,
                "longitude": -158.9387572898976
            },
            {
                "latitude": 6.423756325572118,
                "longitude": -157.55060991433706
            },
            {
                "latitude": 6.345751246016385,
                "longitude": -156.75150945016225,
                "altitude": -4733.65019228649
            },
            {
                "latitude": 7.696761697138037,
                "longitude": -156.79566432687312
            },
            {
                "latitude": 9.040662418734035,
                "longitude": -156.83986704083773
            },
            {
                "latitude": 10.376169231181114,
                "longitude": -156.88412186727606
            },
            {
                "latitude": 11.702047056203783,
                "longitude": -156.92843304319905
            },
            {
                "latitude": 13.017116370626237,
                "longitude": -156.97280477307115
            },
            {
                "latitude": 14.320258875696567,
                "longitude": -157.01724123489606
            },
            {
                "latitude": 15.610422328108958,
                "longitude": -157.06174658664608
            },
            {
                "latitude": 16.886624499391605,
                "longitude": -157.1063249729521
            },
            {
                "latitude": 18.14795625053869,
                "longitude": -157.15098053197204
            },
            {
                "latitude": 19.393583727948666,
                "longitude": -157.19571740235585
            },
            {
                "latitude": 20.62274970429682,
                "longitude": -157.24053973023058
            },
            {
                "latitude": 21.834774103450847,
                "longitude": -157.28545167613447
            },
            {
                "latitude": 23.029053761603308,
                "longitude": -157.3304574218364
            },
            {
                "latitude": 24.205061487251143,
                "longitude": -157.3755611769854
            },
            {
                "latitude": 25.362344490438637,
                "longitude": -157.42076718554466
            },
            {
                "latitude": 26.500522256848832,
                "longitude": -157.46607973197283
            },
            {
                "latitude": 27.619283945033793,
                "longitude": -157.5115031471259
            },
            {
                "latitude": 28.718385385543932,
                "longitude": -157.55704181386113
            },
            {
                "latitude": 29.569537078511622,
                "longitude": -157.59296910730853,
                "altitude": -5804.5285850405635
            },
            {
                "latitude": 29.8995325261894,
                "longitude": -158.81358778116908
            },
            {
                "latitude": 30.21640433325893,
                "longitude": -160.03503917613082
            },
            {
                "latitude": 30.520191948624944,
                "longitude": -161.25729814033866
            },
            {
                "latitude": 30.81093711513811,
                "longitude": -162.48033801988348
            },
            {
                "latitude": 31.088683373020512,
                "longitude": -163.7041306935448
            },
            {
                "latitude": 31.353475592500057,
                "longitude": -164.92864661101265
            },
            {
                "latitude": 31.605359535070477,
                "longitude": -166.15385483458581
            },
            {
                "latitude": 31.844381442689826,
                "longitude": -167.37972308433092
            },
            {
                "latitude": 32.07058765414796,
                "longitude": -168.60621778666868
            },
            {
                "latitude": 32.284024247770965,
                "longitude": -169.83330412633921
            },
            {
                "latitude": 32.484736709586315,
                "longitude": -171.0609461016834
            },
            {
                "latitude": 32.67276962604407,
                "longitude": -172.2891065831608
            },
            {
                "latitude": 32.848166400375774,
                "longitude": -173.517747375011
            },
            {
                "latitude": 33.010968991671824,
                "longitude": -174.74682927995045
            },
            {
                "latitude": 33.16121767576868,
                "longitude": -175.97631216678192
            },
            {
                "latitude": 33.29895082705777,
                "longitude": -177.2061550407821
            },
            {
                "latitude": 33.4242047203572,
                "longitude": -178.4363161167182
            },
            {
                "latitude": 33.537013352024346,
                "longitude": -179.6667528943335
            },
            {
                "latitude": 33.637408279530874,
                "longitude": 179.10257776387022
            },
            {
                "latitude": 33.72541847877029,
                "longitude": 177.87171955273564
            },
            {
                "latitude": 33.8010702184226,
                "longitude": 176.6407166426305
            },
            {
                "latitude": 33.86438695075766,
                "longitude": 175.4096135959069
            },
            {
                "latitude": 33.915389218320094,
                "longitude": 174.17845528184736
            },
            {
                "latitude": 33.95409457600258,
                "longitude": 172.9472867903145
            },
            {
                "latitude": 33.98051752807997,
                "longitude": 171.716153344324
            },
            {
                "latitude": 33.994669479844454,
                "longitude": 170.48510021176855
            },
            {
                "latitude": 33.99655870355083,
                "longitude": 169.25417261652146
            },
            {
                "latitude": 33.98619031845135,
                "longitude": 168.02341564915258
            },
            {
                "latitude": 33.96356628476916,
                "longitude": 166.7928741774909
            },
            {
                "latitude": 33.92868541153118,
                "longitude": 165.56259275726694
            },
            {
                "latitude": 33.88154337825138,
                "longitude": 164.33261554307026
            },
            {
                "latitude": 33.86509965195299,
                "longitude": 163.96564982268964,
                "altitude": -6125.851219442929
            },
            {
                "latitude": 32.855464691005636,
                "longitude": 164.11949677267822
            },
            {
                "latitude": 31.82494052197923,
                "longitude": 164.27292919939413
            },
            {
                "latitude": 30.7734363033792,
                "longitude": 164.42596761960533
            },
            {
                "latitude": 29.700908206179953,
                "longitude": 164.57863245444204
            },
            {
                "latitude": 28.6073637669608,
                "longitude": 164.73094403390186
            },
            {
                "latitude": 27.49286627216411,
                "longitude": 164.88292260010468
            },
            {
                "latitude": 26.357539119202023,
                "longitude": 165.03458830922455
            },
            {
                "latitude": 25.20157009219132,
                "longitude": 165.18596123203707
            },
            {
                "latitude": 24.02521548234982,
                "longitude": 165.33706135303373
            },
            {
                "latitude": 22.828803975841744,
                "longitude": 165.4879085680723
            },
            {
                "latitude": 21.61274022546055,
                "longitude": 165.6385226805553
            },
            {
                "latitude": 20.377508017366605,
                "longitude": 165.7889233961532
            },
            {
                "latitude": 19.12367294056331,
                "longitude": 165.93913031611888
            },
            {
                "latitude": 17.851884465312743,
                "longitude": 166.08916292927333
            },
            {
                "latitude": 16.965877346904538,
                "longitude": 166.19240676657813,
                "altitude": -5104.186551451863
            },
            {
                "latitude": 16.903600850353282,
                "longitude": 167.51568717516096
            },
            {
                "latitude": 16.83278342855099,
                "longitude": 168.8388231683296
            },
            {
                "latitude": 16.75344738436909,
                "longitude": 170.16180433494642
            },
            {
                "latitude": 16.66561775138944,
                "longitude": 171.4846205884203
            },
            {
                "latitude": 16.569322348789928,
                "longitude": 172.80726218913273
            },
            {
                "latitude": 16.464591841928797,
                "longitude": 174.12971976614244
            },
            {
                "latitude": 16.35145980839767,
                "longitude": 175.4519843381156
            },
            {
                "latitude": 16.229962809287432,
                "longitude": 176.7740473334287
            },
            {
                "latitude": 16.100140465385167,
                "longitude": 178.09590060939388
            },
            {
                "latitude": 15.962035537993282,
                "longitude": 179.4175364705586
            },
            {
                "latitude": 15.815694014034893,
                "longitude": -179.26105231396704
            },
            {
                "latitude": 15.661165195081487,
                "longitude": -177.93987249419922
            },
            {
                "latitude": 15.498501789910533,
                "longitude": -176.61893032402747
            },
            {
                "latitude": 15.327760010172172,
                "longitude": -175.29823154705858
            },
            {
                "latitude": 15.148999668714922,
                "longitude": -173.97778138359448
            },
            {
                "latitude": 14.96228428009153,
                "longitude": -172.65758451877755
            },
            {
                "latitude": 14.767681162736789,
                "longitude": -171.33764509193455
            },
            {
                "latitude": 14.565261542280599,
                "longitude": -170.01796668714684
            },
            {
                "latitude": 14.355100655431004,
                "longitude": -168.6985523250725
            },
            {
                "latitude": 14.284161127203653,
                "longitude": -168.2638069993666,
                "altitude": -3677.652783984377
            },
            {
                "latitude": 15.56425174407275,
                "longitude": -168.31708538365217
            },
            {
                "latitude": 16.830632490009123,
                "longitude": -168.37045013043988
            },
            {
                "latitude": 18.08241343741947,
                "longitude": -168.42390611881848
            },
            {
                "latitude": 19.318777495350613,
                "longitude": -168.47745822827807
            },
            {
                "latitude": 20.538981729855056,
                "longitude": -168.5311113467539
            },
            {
                "latitude": 21.742357904945543,
                "longitude": -168.58487037861494
            },
            {
                "latitude": 22.92831229293157,
                "longitude": -168.63874025252537
            },
            {
                "latitude": 24.096324812861813,
                "longitude": -168.69272592911534
            },
            {
                "latitude": 25.245947563242968,
                "longitude": -168.74683240840884
            },
            {
                "latitude": 26.37680282021232,
                "longitude": -168.80106473696603
            },
            {
                "latitude": 27.488580575043102,
                "longitude": -168.8554280147091
            },
            {
                "latitude": 27.834128969558243,
                "longitude": -168.87254711699043,
                "altitude": -4546.174694366518
            },
            {
                "latitude": 27.97708861057533,
                "longitude": -170.1568784924255
            },
            {
                "latitude": 28.107797962400156,
                "longitude": -171.44145916706702
            },
            {
                "latitude": 28.22626824983042,
                "longitude": -172.72625669983313
            },
            {
                "latitude": 28.332510614379252,
                "longitude": -174.01123813582743
            },
            {
                "latitude": 28.426535935215426,
                "longitude": -175.29637007101928
            },
            {
                "latitude": 28.50835466875312,
                "longitude": -176.58161871846386
            },
            {
                "latitude": 28.577976706618553,
                "longitude": -177.86694997590922
            },
            {
                "latitude": 28.635411251731806,
                "longitude": -179.15232949463103
            },
            {
                "latitude": 28.68066671225873,
                "longitude": 179.56227725067055
            },
            {
                "latitude": 28.713750613208404,
                "longitude": 178.27690489108323
            },
            {
                "latitude": 28.734669525476786,
                "longitude": 176.9915880919792
            },
            {
                "latitude": 28.743429012165034,
                "longitude": 175.70636148097606
            },
            {
                "latitude": 28.740033592031352,
                "longitude": 174.42125957554424
            },
            {
                "latitude": 28.727435196021545,
                "longitude": 173.31881150891854,
                "altitude": -5738.043347551754
            },
            {
                "latitude": 27.534498490393503,
                "longitude": 173.60106673958276
            },
            {
                "latitude": 26.31722040292075,
                "longitude": 173.88270199438574
            },
            {
                "latitude": 25.07582762590946,
                "longitude": 174.1637604409024
            },
            {
                "latitude": 23.81063931254013,
                "longitude": 174.44428510730197
            },
            {
                "latitude": 22.52207280721919,
                "longitude": 174.72431887115255
            },
            {
                "latitude": 21.210648880644115,
                "longitude": 175.00390444406426
            },
            {
                "latitude": 21.16854429715947,
                "longitude": 175.01279535217998,
                "altitude": -2665.335190733621
            },
            {
                "latitude": 21.301537413572415,
                "longitude": 176.2244084246686
            },
            {
                "latitude": 21.42564971063074,
                "longitude": 177.43618119716598
            },
            {
                "latitude": 21.540864354728598,
                "longitude": 178.64809880015207
            },
            {
                "latitude": 21.647166301727776,
                "longitude": 179.8601460864515
            },
            {
                "latitude": 21.744542195938877,
                "longitude": -178.9276923427228
            },
            {
                "latitude": 21.80672671961027,
                "longitude": -178.088367106668,
                "altitude": -5567.100495583176
            },
            {
                "latitude": 22.663379911941213,
                "longitude": -179.04858163356764
            },
            {
                "latitude": 23.50500844935077,
                "longitude": 179.9898316787872
            },
            {
                "latitude": 24.33138746779072,
                "longitude": 179.02683873460916
            },
            {
                "latitude": 25.142327512733587,
                "longitude": 178.06240659355117
            },
            {
                "latitude": 25.675243814396175,
                "longitude": 177.4174848077732,
                "altitude": -5789.777232018369
            },
            {
                "latitude": 25.755680689181577,
                "longitude": 178.73924725439346
            },
            {
                "latitude": 25.824093838378,
                "longitude": -179.9389250768508
            },
            {
                "latitude": 25.880485219269108,
                "longitude": -178.6170619882057
            },
            {
                "latitude": 25.924857183401915,
                "longitude": -177.29519341931618
            },
            {
                "latitude": 25.95721238526119,
                "longitude": -175.9733493829428
            },
            {
                "latitude": 25.977553708706644,
                "longitude": -174.6515599000897
            },
            {
                "latitude": 25.985884211102448,
                "longitude": -173.32985493470528
            },
            {
                "latitude": 25.986087106469242,
                "longitude": -172.99304849122382,
                "altitude": -4479.190324812391
            },
            {
                "latitude": 24.76085447537714,
                "longitude": -173.03809515740335
            },
            {
                "latitude": 23.513266012368007,
                "longitude": -173.08305937755458
            },
            {
                "latitude": 22.24373768365635,
                "longitude": -173.12794776305168
            },
            {
                "latitude": 20.952779717443626,
                "longitude": -173.1727668902841
            },
            {
                "latitude": 19.64100038253327,
                "longitude": -173.2175232984937
            },
            {
                "latitude": 18.56452103700815,
                "longitude": -173.25370638038987,
                "altitude": -2950.9178526285878
            },
            {
                "latitude": 18.7429085310069,
                "longitude": -174.56573712146707
            },
            {
                "latitude": 18.911824250778217,
                "longitude": -175.87798460457094
            },
            {
                "latitude": 19.071226663182173,
                "longitude": -177.19043482747418
            },
            {
                "latitude": 19.221077643727014,
                "longitude": -178.50307335202942
            },
            {
                "latitude": 19.36134232148362,
                "longitude": -179.8158853324578
            },
            {
                "latitude": 19.491988930986903,
                "longitude": 178.8711444553605
            },
            {
                "latitude": 19.61298867157118,
                "longitude": 177.55803158364503
            },
            {
                "latitude": 19.724315574542803,
                "longitude": 176.24479194157672
            },
            {
                "latitude": 19.825946378552104,
                "longitude": 174.93144170332152
            },
            {
                "latitude": 19.917860413487766,
                "longitude": 173.61799729527675
            },
            {
                "latitude": 20.000039493180324,
                "longitude": 172.30447536260436
            },
            {
                "latitude": 20.07246781716704,
                "longitude": 170.9908927351197
            },
            {
                "latitude": 20.13513188173882,
                "longitude": 169.67726639260513
            },
            {
                "latitude": 20.154471819594743,
                "longitude": 169.22433889941647,
                "altitude": -5521.174532901868
            },
            {
                "latitude": 21.39518039788843,
                "longitude": 169.15142752254135
            },
            {
                "latitude": 22.617699216771744,
                "longitude": 169.07836303852466
            },
            {
                "latitude": 23.821442266481252,
                "longitude": 169.00513840034932
            },
            {
                "latitude": 25.005904284974857,
                "longitude": 168.93174650668246
            },
            {
                "latitude": 26.170658628591248,
                "longitude": 168.85818019082112
            },
            {
                "latitude": 27.315354580485636,
                "longitude": 168.78443221013347
            },
            {
                "latitude": 28.4397141864923,
                "longitude": 168.71049523603443
            },
            {
                "latitude": 29.543528707039133,
                "longitude": 168.63636184451872
            },
            {
                "latitude": 30.6266547706618,
                "longitude": 168.56202450726008
            },
            {
                "latitude": 31.27956509015401,
                "longitude": 168.51640648994385,
                "altitude": -5838.367010486065
            },
            {
                "latitude": 31.304652689612404,
                "longitude": 169.7775970460784
            },
            {
                "latitude": 31.317407480695977,
                "longitude": 171.03870364264532
            },
            {
                "latitude": 31.31783593963445,
                "longitude": 172.29968638456344
            },
            {
                "latitude": 31.30594239605638,
                "longitude": 173.5605055323848
            },
            {
                "latitude": 31.281729026499235,
                "longitude": 174.82112158393218
            },
            {
                "latitude": 31.245195863987952,
                "longitude": 176.08149535581316
            },
            {
                "latitude": 31.196340823672767,
                "longitude": 177.3415880645998
            },
            {
                "latitude": 31.13515974457277,
                "longitude": 178.60136140746167
            },
            {
                "latitude": 31.061646447525515,
                "longitude": 179.86077764204353
            },
            {
                "latitude": 30.975792809496856,
                "longitude": -178.88020033461905
            },
            {
                "latitude": 30.877588854456135,
                "longitude": -177.6216089083488
            },
            {
                "latitude": 30.767022861071403,
                "longitude": -176.363483671439
            },
            {
                "latitude": 30.644081487525455,
                "longitude": -175.10585934782233
            },
            {
                "latitude": 30.508749913796656,
                "longitude": -173.84876971998364
            },
            {
                "latitude": 30.361012001787703,
                "longitude": -172.59224755779817
            },
            {
                "latitude": 30.20085047371939,
                "longitude": -171.33632454946923
            },
            {
                "latitude": 30.028247109236354,
                "longitude": -170.08103123473236
            },
            {
                "latitude": 29.843182961693902,
                "longitude": -168.8263969404856
            },
            {
                "latitude": 29.645638594111908,
                "longitude": -167.57244971899615
            },
            {
                "latitude": 29.435594335289764,
                "longitude": -166.31921628882702
            },
            {
                "latitude": 29.21303055657631,
                "longitude": -165.0667219786172
            },
            {
                "latitude": 28.97792796977873,
                "longitude": -163.81499067384115
            },
            {
                "latitude": 28.730267946673862,
                "longitude": -162.56404476666373
            },
            {
                "latitude": 28.592859813399315,
                "longitude": -161.89632888829084,
                "altitude": -4902.403522185761
            },
            {
                "latitude": 27.486482301020434,
                "longitude": -161.93374034640144
            },
            {
                "latitude": 26.359741237448468,
                "longitude": -161.97107537664334
            },
            {
                "latitude": 25.212821099464723,
                "longitude": -162.00833884505954
            },
            {
                "latitude": 24.045972165486166,
                "longitude": -162.04553559446668
            },
            {
                "latitude": 22.859514187643406,
                "longitude": -162.08267044407643
            },
            {
                "latitude": 21.653839764397887,
                "longitude": -162.11974818877007
            },
            {
                "latitude": 20.429417331232106,
                "longitude": -162.15677359803195
            },
            {
                "latitude": 19.18679368375277,
                "longitude": -162.1937514145522
            },
            {
                "latitude": 17.926595946224847,
                "longitude": -162.23068635251815
            },
            {
                "latitude": 16.649532899464866,
                "longitude": -162.26758309562106
            },
            {
                "latitude": 15.356395585492484,
                "longitude": -162.30444629481335
            },
            {
                "latitude": 14.048057112635707,
                "longitude": -162.34128056586118
            },
            {
                "latitude": 12.725471594088763,
                "longitude": -162.3780904867445
            },
            {
                "latitude": 11.389672165299368,
                "longitude": -162.41488059496595
            },
            {
                "latitude": 10.426680795879362,
                "longitude": -162.4411869186669,
                "altitude": -4985.432992634216
            },
            {
                "latitude": 10.57275524988961,
                "longitude": -163.8369795419321
            },
            {
                "latitude": 10.712573977140535,
                "longitude": -165.23287661598837
            },
            {
                "latitude": 10.846067595876255,
                "longitude": -166.62887312346578
            },
            {
                "latitude": 10.973170368599817,
                "longitude": -168.02496381138516
            },
            {
                "latitude": 11.093820172890648,
                "longitude": -169.42114320317927
            },
            {
                "latitude": 11.20795847129894,
                "longitude": -170.81740561125156
            },
            {
                "latitude": 11.315530280649048,
                "longitude": -172.2137451500468
            },
            {
                "latitude": 11.416484141072395,
                "longitude": -173.61015574960632
            },
            {
                "latitude": 11.510772085077692,
                "longitude": -175.00663116957867
            },
            {
                "latitude": 11.598349606952393,
                "longitude": -176.40316501365646
            },
            {
                "latitude": 11.679175632774818,
                "longitude": -177.79975074440733
            },
            {
                "latitude": 11.753212491300733,
                "longitude": -179.19638169846732
            },
            {
                "latitude": 11.82042588597207,
                "longitude": 179.40694889793753
            },
            {
                "latitude": 11.880784868278564,
                "longitude": 178.01024791317573
            },
            {
                "latitude": 11.934261812685717,
                "longitude": 176.61352229413663
            },
            {
                "latitude": 11.980832393324619,
                "longitude": 175.2167790499353
            },
            {
                "latitude": 12.020475562620852,
                "longitude": 173.82002523543338
            },
            {
                "latitude": 12.053173532021138,
                "longitude": 172.42326793461407
            },
            {
                "latitude": 12.078911754957359,
                "longitude": 171.0265142438503
            },
            {
                "latitude": 12.09767891216855,
                "longitude": 169.6297712551056
            },
            {
                "latitude": 12.109466899482078,
                "longitude": 168.23304603910756
            },
            {
                "latitude": 12.114270818135656,
                "longitude": 166.8363456285347
            },
            {
                "latitude": 12.112088967702405,
                "longitude": 165.43967700125665
            },
            {
                "latitude": 12.102922841661345,
                "longitude": 164.04304706366955
            },
            {
                "latitude": 12.088447741007394,
                "longitude": 162.76715013973183,
                "altitude": -2778.657529667758
            },
            {
                "latitude": 13.428989083635203,
                "longitude": 162.40956383204602
            },
            {
                "latitude": 14.756236144253702,
                "longitude": 162.0514308794397
            },
            {
                "latitude": 16.06905292360898,
                "longitude": 161.69271688117877
            },
            {
                "latitude": 17.36638531411116,
                "longitude": 161.3333876185039
            },
            {
                "latitude": 18.647264258552095,
                "longitude": 160.97340899706802
            },
            {
                "latitude": 19.910807842712483,
                "longitude": 160.6127469890199
            },
            {
                "latitude": 21.156222361819434,
                "longitude": 160.25136757551255
            },
            {
                "latitude": 22.382802419566595,
                "longitude": 159.88923669034494
            },
            {
                "latitude": 23.589930133722817,
                "longitude": 159.5263201653617
            },
            {
                "latitude": 24.7770735340617,
                "longitude": 159.1625836781419
            },
            {
                "latitude": 25.943784246450896,
                "longitude": 158.79799270241074
            },
            {
                "latitude": 27.089694561610976,
                "longitude": 158.43251246150837
            },
            {
                "latitude": 28.21451398857391,
                "longitude": 158.06610788515547
            },
            {
                "latitude": 29.31802539161711,
                "longitude": 157.69874356966403
            },
            {
                "latitude": 30.400080805851957,
                "longitude": 157.33038374165963
            },
            {
                "latitude": 31.460597021163547,
                "longitude": 156.96099222530887
            },
            {
                "latitude": 32.49955101728771,
                "longitude": 156.59053241298318
            },
            {
                "latitude": 33.516975324907534,
                "longitude": 156.21896723923757
            },
            {
                "latitude": 34.512953379150254,
                "longitude": 155.84625915794277
            },
            {
                "latitude": 35.487614923116034,
                "longitude": 155.4723701223776
            },
            {
                "latitude": 35.69112541140628,
                "longitude": 155.393104431554,
                "altitude": -5427.900043536215
            },
            {
                "latitude": 35.62099139650826,
                "longitude": 154.15932725337075
            },
            {
                "latitude": 35.53816691787288,
                "longitude": 152.92602773647678
            },
            {
                "latitude": 35.44263102817807,
                "longitude": 151.69325431018484
            },
            {
                "latitude": 35.33435900878943,
                "longitude": 150.46105447516112
            },
            {
                "latitude": 35.21332247317649,
                "longitude": 149.22947470626264
            },
            {
                "latitude": 35.11187152238888,
                "longitude": 148.2857832205469,
                "altitude": -5993.11713182145
            }
        ]
    ];
    var spiralPolyInput = transformInputData(spiralPolyRawInput);
    var spiralPolyRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": 33.56419881759084,
                        "longitude": 180
                    },
                    {
                        "latitude": 33.637408279530874,
                        "longitude": 179.10257776387022
                    },
                    {
                        "latitude": 33.72541847877029,
                        "longitude": 177.87171955273564
                    },
                    {
                        "latitude": 33.8010702184226,
                        "longitude": 176.6407166426305
                    },
                    {
                        "latitude": 33.86438695075766,
                        "longitude": 175.4096135959069
                    },
                    {
                        "latitude": 33.915389218320094,
                        "longitude": 174.17845528184736
                    },
                    {
                        "latitude": 33.95409457600258,
                        "longitude": 172.9472867903145
                    },
                    {
                        "latitude": 33.98051752807997,
                        "longitude": 171.716153344324
                    },
                    {
                        "latitude": 33.994669479844454,
                        "longitude": 170.48510021176855
                    },
                    {
                        "latitude": 33.99655870355083,
                        "longitude": 169.25417261652146
                    },
                    {
                        "latitude": 33.98619031845135,
                        "longitude": 168.02341564915258
                    },
                    {
                        "latitude": 33.96356628476916,
                        "longitude": 166.7928741774909
                    },
                    {
                        "latitude": 33.92868541153118,
                        "longitude": 165.56259275726694
                    },
                    {
                        "latitude": 33.88154337825138,
                        "longitude": 164.33261554307026
                    },
                    {
                        "latitude": 33.86509965195299,
                        "longitude": 163.96564982268964,
                        "altitude": -6125.851219442929
                    },
                    {
                        "latitude": 32.855464691005636,
                        "longitude": 164.11949677267822
                    },
                    {
                        "latitude": 31.82494052197923,
                        "longitude": 164.27292919939413
                    },
                    {
                        "latitude": 30.7734363033792,
                        "longitude": 164.42596761960533
                    },
                    {
                        "latitude": 29.700908206179953,
                        "longitude": 164.57863245444204
                    },
                    {
                        "latitude": 28.6073637669608,
                        "longitude": 164.73094403390186
                    },
                    {
                        "latitude": 27.49286627216411,
                        "longitude": 164.88292260010468
                    },
                    {
                        "latitude": 26.357539119202023,
                        "longitude": 165.03458830922455
                    },
                    {
                        "latitude": 25.20157009219132,
                        "longitude": 165.18596123203707
                    },
                    {
                        "latitude": 24.02521548234982,
                        "longitude": 165.33706135303373
                    },
                    {
                        "latitude": 22.828803975841744,
                        "longitude": 165.4879085680723
                    },
                    {
                        "latitude": 21.61274022546055,
                        "longitude": 165.6385226805553
                    },
                    {
                        "latitude": 20.377508017366605,
                        "longitude": 165.7889233961532
                    },
                    {
                        "latitude": 19.12367294056331,
                        "longitude": 165.93913031611888
                    },
                    {
                        "latitude": 17.851884465312743,
                        "longitude": 166.08916292927333
                    },
                    {
                        "latitude": 16.965877346904538,
                        "longitude": 166.19240676657813,
                        "altitude": -5104.186551451863
                    },
                    {
                        "latitude": 16.903600850353282,
                        "longitude": 167.51568717516096
                    },
                    {
                        "latitude": 16.83278342855099,
                        "longitude": 168.8388231683296
                    },
                    {
                        "latitude": 16.75344738436909,
                        "longitude": 170.16180433494642
                    },
                    {
                        "latitude": 16.66561775138944,
                        "longitude": 171.4846205884203
                    },
                    {
                        "latitude": 16.569322348789928,
                        "longitude": 172.80726218913273
                    },
                    {
                        "latitude": 16.464591841928797,
                        "longitude": 174.12971976614244
                    },
                    {
                        "latitude": 16.35145980839767,
                        "longitude": 175.4519843381156
                    },
                    {
                        "latitude": 16.229962809287432,
                        "longitude": 176.7740473334287
                    },
                    {
                        "latitude": 16.100140465385167,
                        "longitude": 178.09590060939388
                    },
                    {
                        "latitude": 15.962035537993282,
                        "longitude": 179.4175364705586
                    },
                    {
                        "latitude": 15.897529803858099,
                        "longitude": 180
                    },
                    {
                        "latitude": 19.379662582561167,
                        "longitude": 180
                    },
                    {
                        "latitude": 19.491988930986903,
                        "longitude": 178.8711444553605
                    },
                    {
                        "latitude": 19.61298867157118,
                        "longitude": 177.55803158364503
                    },
                    {
                        "latitude": 19.724315574542803,
                        "longitude": 176.24479194157672
                    },
                    {
                        "latitude": 19.825946378552104,
                        "longitude": 174.93144170332152
                    },
                    {
                        "latitude": 19.917860413487766,
                        "longitude": 173.61799729527675
                    },
                    {
                        "latitude": 20.000039493180324,
                        "longitude": 172.30447536260436
                    },
                    {
                        "latitude": 20.07246781716704,
                        "longitude": 170.9908927351197
                    },
                    {
                        "latitude": 20.13513188173882,
                        "longitude": 169.67726639260513
                    },
                    {
                        "latitude": 20.154471819594743,
                        "longitude": 169.22433889941647,
                        "altitude": -5521.174532901868
                    },
                    {
                        "latitude": 21.39518039788843,
                        "longitude": 169.15142752254135
                    },
                    {
                        "latitude": 22.617699216771744,
                        "longitude": 169.07836303852466
                    },
                    {
                        "latitude": 23.821442266481252,
                        "longitude": 169.00513840034932
                    },
                    {
                        "latitude": 25.005904284974857,
                        "longitude": 168.93174650668246
                    },
                    {
                        "latitude": 26.170658628591248,
                        "longitude": 168.85818019082112
                    },
                    {
                        "latitude": 27.315354580485636,
                        "longitude": 168.78443221013347
                    },
                    {
                        "latitude": 28.4397141864923,
                        "longitude": 168.71049523603443
                    },
                    {
                        "latitude": 29.543528707039133,
                        "longitude": 168.63636184451872
                    },
                    {
                        "latitude": 30.6266547706618,
                        "longitude": 168.56202450726008
                    },
                    {
                        "latitude": 31.27956509015401,
                        "longitude": 168.51640648994385,
                        "altitude": -5838.367010486065
                    },
                    {
                        "latitude": 31.304652689612404,
                        "longitude": 169.7775970460784
                    },
                    {
                        "latitude": 31.317407480695977,
                        "longitude": 171.03870364264532
                    },
                    {
                        "latitude": 31.31783593963445,
                        "longitude": 172.29968638456344
                    },
                    {
                        "latitude": 31.30594239605638,
                        "longitude": 173.5605055323848
                    },
                    {
                        "latitude": 31.281729026499235,
                        "longitude": 174.82112158393218
                    },
                    {
                        "latitude": 31.245195863987952,
                        "longitude": 176.08149535581316
                    },
                    {
                        "latitude": 31.196340823672767,
                        "longitude": 177.3415880645998
                    },
                    {
                        "latitude": 31.13515974457277,
                        "longitude": 178.60136140746167
                    },
                    {
                        "latitude": 31.061646447525515,
                        "longitude": 179.86077764204353
                    },
                    {
                        "latitude": 31.052152772511153,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": 31.052152772511153,
                        "longitude": -180
                    },
                    {
                        "latitude": 30.975792809496856,
                        "longitude": -178.88020033461905
                    },
                    {
                        "latitude": 30.877588854456135,
                        "longitude": -177.6216089083488
                    },
                    {
                        "latitude": 30.767022861071403,
                        "longitude": -176.363483671439
                    },
                    {
                        "latitude": 30.644081487525455,
                        "longitude": -175.10585934782233
                    },
                    {
                        "latitude": 30.508749913796656,
                        "longitude": -173.84876971998364
                    },
                    {
                        "latitude": 30.361012001787703,
                        "longitude": -172.59224755779817
                    },
                    {
                        "latitude": 30.20085047371939,
                        "longitude": -171.33632454946923
                    },
                    {
                        "latitude": 30.028247109236354,
                        "longitude": -170.08103123473236
                    },
                    {
                        "latitude": 29.843182961693902,
                        "longitude": -168.8263969404856
                    },
                    {
                        "latitude": 29.645638594111908,
                        "longitude": -167.57244971899615
                    },
                    {
                        "latitude": 29.435594335289764,
                        "longitude": -166.31921628882702
                    },
                    {
                        "latitude": 29.21303055657631,
                        "longitude": -165.0667219786172
                    },
                    {
                        "latitude": 28.97792796977873,
                        "longitude": -163.81499067384115
                    },
                    {
                        "latitude": 28.730267946673862,
                        "longitude": -162.56404476666373
                    },
                    {
                        "latitude": 28.592859813399315,
                        "longitude": -161.89632888829084,
                        "altitude": -4902.403522185761
                    },
                    {
                        "latitude": 27.486482301020434,
                        "longitude": -161.93374034640144
                    },
                    {
                        "latitude": 26.359741237448468,
                        "longitude": -161.97107537664334
                    },
                    {
                        "latitude": 25.212821099464723,
                        "longitude": -162.00833884505954
                    },
                    {
                        "latitude": 24.045972165486166,
                        "longitude": -162.04553559446668
                    },
                    {
                        "latitude": 22.859514187643406,
                        "longitude": -162.08267044407643
                    },
                    {
                        "latitude": 21.653839764397887,
                        "longitude": -162.11974818877007
                    },
                    {
                        "latitude": 20.429417331232106,
                        "longitude": -162.15677359803195
                    },
                    {
                        "latitude": 19.18679368375277,
                        "longitude": -162.1937514145522
                    },
                    {
                        "latitude": 17.926595946224847,
                        "longitude": -162.23068635251815
                    },
                    {
                        "latitude": 16.649532899464866,
                        "longitude": -162.26758309562106
                    },
                    {
                        "latitude": 15.356395585492484,
                        "longitude": -162.30444629481335
                    },
                    {
                        "latitude": 14.048057112635707,
                        "longitude": -162.34128056586118
                    },
                    {
                        "latitude": 12.725471594088763,
                        "longitude": -162.3780904867445
                    },
                    {
                        "latitude": 11.389672165299368,
                        "longitude": -162.41488059496595
                    },
                    {
                        "latitude": 10.426680795879362,
                        "longitude": -162.4411869186669,
                        "altitude": -4985.432992634216
                    },
                    {
                        "latitude": 10.57275524988961,
                        "longitude": -163.8369795419321
                    },
                    {
                        "latitude": 10.712573977140535,
                        "longitude": -165.23287661598837
                    },
                    {
                        "latitude": 10.846067595876255,
                        "longitude": -166.62887312346578
                    },
                    {
                        "latitude": 10.973170368599817,
                        "longitude": -168.02496381138516
                    },
                    {
                        "latitude": 11.093820172890648,
                        "longitude": -169.42114320317927
                    },
                    {
                        "latitude": 11.20795847129894,
                        "longitude": -170.81740561125156
                    },
                    {
                        "latitude": 11.315530280649048,
                        "longitude": -172.2137451500468
                    },
                    {
                        "latitude": 11.416484141072395,
                        "longitude": -173.61015574960632
                    },
                    {
                        "latitude": 11.510772085077692,
                        "longitude": -175.00663116957867
                    },
                    {
                        "latitude": 11.598349606952393,
                        "longitude": -176.40316501365646
                    },
                    {
                        "latitude": 11.679175632774818,
                        "longitude": -177.79975074440733
                    },
                    {
                        "latitude": 11.753212491300733,
                        "longitude": -179.19638169846732
                    },
                    {
                        "latitude": 11.791885862341143,
                        "longitude": -180
                    },
                    {
                        "latitude": 8.053568048885037,
                        "longitude": -180
                    },
                    {
                        "latitude": 8.043048407282045,
                        "longitude": -179.76913798789465
                    },
                    {
                        "latitude": 7.975062872375213,
                        "longitude": -178.38000339054864
                    },
                    {
                        "latitude": 7.902428850687171,
                        "longitude": -176.99092546316896
                    },
                    {
                        "latitude": 7.825185046838351,
                        "longitude": -175.60190615636736
                    },
                    {
                        "latitude": 7.743372715846718,
                        "longitude": -174.2129472827899
                    },
                    {
                        "latitude": 7.657035659896461,
                        "longitude": -172.8240505127746
                    },
                    {
                        "latitude": 7.5662202243471075,
                        "longitude": -171.4352173703466
                    },
                    {
                        "latitude": 7.47097529287925,
                        "longitude": -170.04644922956192
                    },
                    {
                        "latitude": 7.371352281669783,
                        "longitude": -168.65774731120823
                    },
                    {
                        "latitude": 7.267405132486886,
                        "longitude": -167.2691126798715
                    },
                    {
                        "latitude": 7.1591903045927685,
                        "longitude": -165.88054624137612
                    },
                    {
                        "latitude": 7.046766765340576,
                        "longitude": -164.49204874060464
                    },
                    {
                        "latitude": 6.930195979350839,
                        "longitude": -163.1036207597032
                    },
                    {
                        "latitude": 6.809541896152531,
                        "longitude": -161.71526271667696
                    },
                    {
                        "latitude": 6.684870936173994,
                        "longitude": -160.32697486437928
                    },
                    {
                        "latitude": 6.556251974969905,
                        "longitude": -158.9387572898976
                    },
                    {
                        "latitude": 6.423756325572118,
                        "longitude": -157.55060991433706
                    },
                    {
                        "latitude": 6.345751246016385,
                        "longitude": -156.75150945016225,
                        "altitude": -4733.65019228649
                    },
                    {
                        "latitude": 7.696761697138037,
                        "longitude": -156.79566432687312
                    },
                    {
                        "latitude": 9.040662418734035,
                        "longitude": -156.83986704083773
                    },
                    {
                        "latitude": 10.376169231181114,
                        "longitude": -156.88412186727606
                    },
                    {
                        "latitude": 11.702047056203783,
                        "longitude": -156.92843304319905
                    },
                    {
                        "latitude": 13.017116370626237,
                        "longitude": -156.97280477307115
                    },
                    {
                        "latitude": 14.320258875696567,
                        "longitude": -157.01724123489606
                    },
                    {
                        "latitude": 15.610422328108958,
                        "longitude": -157.06174658664608
                    },
                    {
                        "latitude": 16.886624499391605,
                        "longitude": -157.1063249729521
                    },
                    {
                        "latitude": 18.14795625053869,
                        "longitude": -157.15098053197204
                    },
                    {
                        "latitude": 19.393583727948666,
                        "longitude": -157.19571740235585
                    },
                    {
                        "latitude": 20.62274970429682,
                        "longitude": -157.24053973023058
                    },
                    {
                        "latitude": 21.834774103450847,
                        "longitude": -157.28545167613447
                    },
                    {
                        "latitude": 23.029053761603308,
                        "longitude": -157.3304574218364
                    },
                    {
                        "latitude": 24.205061487251143,
                        "longitude": -157.3755611769854
                    },
                    {
                        "latitude": 25.362344490438637,
                        "longitude": -157.42076718554466
                    },
                    {
                        "latitude": 26.500522256848832,
                        "longitude": -157.46607973197283
                    },
                    {
                        "latitude": 27.619283945033793,
                        "longitude": -157.5115031471259
                    },
                    {
                        "latitude": 28.718385385543932,
                        "longitude": -157.55704181386113
                    },
                    {
                        "latitude": 29.569537078511622,
                        "longitude": -157.59296910730853,
                        "altitude": -5804.5285850405635
                    },
                    {
                        "latitude": 29.8995325261894,
                        "longitude": -158.81358778116908
                    },
                    {
                        "latitude": 30.21640433325893,
                        "longitude": -160.03503917613082
                    },
                    {
                        "latitude": 30.520191948624944,
                        "longitude": -161.25729814033866
                    },
                    {
                        "latitude": 30.81093711513811,
                        "longitude": -162.48033801988348
                    },
                    {
                        "latitude": 31.088683373020512,
                        "longitude": -163.7041306935448
                    },
                    {
                        "latitude": 31.353475592500057,
                        "longitude": -164.92864661101265
                    },
                    {
                        "latitude": 31.605359535070477,
                        "longitude": -166.15385483458581
                    },
                    {
                        "latitude": 31.844381442689826,
                        "longitude": -167.37972308433092
                    },
                    {
                        "latitude": 32.07058765414796,
                        "longitude": -168.60621778666868
                    },
                    {
                        "latitude": 32.284024247770965,
                        "longitude": -169.83330412633921
                    },
                    {
                        "latitude": 32.484736709586315,
                        "longitude": -171.0609461016834
                    },
                    {
                        "latitude": 32.67276962604407,
                        "longitude": -172.2891065831608
                    },
                    {
                        "latitude": 32.848166400375774,
                        "longitude": -173.517747375011
                    },
                    {
                        "latitude": 33.010968991671824,
                        "longitude": -174.74682927995045
                    },
                    {
                        "latitude": 33.16121767576868,
                        "longitude": -175.97631216678192
                    },
                    {
                        "latitude": 33.29895082705777,
                        "longitude": -177.2061550407821
                    },
                    {
                        "latitude": 33.4242047203572,
                        "longitude": -178.4363161167182
                    },
                    {
                        "latitude": 33.537013352024346,
                        "longitude": -179.6667528943335
                    },
                    {
                        "latitude": 33.56419881759084,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": 28.665255596219644,
                        "longitude": 180
                    },
                    {
                        "latitude": 28.68066671225873,
                        "longitude": 179.56227725067055
                    },
                    {
                        "latitude": 28.713750613208404,
                        "longitude": 178.27690489108323
                    },
                    {
                        "latitude": 28.734669525476786,
                        "longitude": 176.9915880919792
                    },
                    {
                        "latitude": 28.743429012165034,
                        "longitude": 175.70636148097606
                    },
                    {
                        "latitude": 28.740033592031352,
                        "longitude": 174.42125957554424
                    },
                    {
                        "latitude": 28.727435196021545,
                        "longitude": 173.31881150891854,
                        "altitude": -5738.043347551754
                    },
                    {
                        "latitude": 27.534498490393503,
                        "longitude": 173.60106673958276
                    },
                    {
                        "latitude": 26.31722040292075,
                        "longitude": 173.88270199438574
                    },
                    {
                        "latitude": 25.07582762590946,
                        "longitude": 174.1637604409024
                    },
                    {
                        "latitude": 23.81063931254013,
                        "longitude": 174.44428510730197
                    },
                    {
                        "latitude": 22.52207280721919,
                        "longitude": 174.72431887115255
                    },
                    {
                        "latitude": 21.210648880644115,
                        "longitude": 175.00390444406426
                    },
                    {
                        "latitude": 21.16854429715947,
                        "longitude": 175.01279535217998,
                        "altitude": -2665.335190733621
                    },
                    {
                        "latitude": 21.301537413572415,
                        "longitude": 176.2244084246686
                    },
                    {
                        "latitude": 21.42564971063074,
                        "longitude": 177.43618119716598
                    },
                    {
                        "latitude": 21.540864354728598,
                        "longitude": 178.64809880015207
                    },
                    {
                        "latitude": 21.647166301727776,
                        "longitude": 179.8601460864515
                    },
                    {
                        "latitude": 21.658401107564288,
                        "longitude": 180
                    },
                    {
                        "latitude": 23.496108628439977,
                        "longitude": 180
                    },
                    {
                        "latitude": 23.50500844935077,
                        "longitude": 179.9898316787872
                    },
                    {
                        "latitude": 24.33138746779072,
                        "longitude": 179.02683873460916
                    },
                    {
                        "latitude": 25.142327512733587,
                        "longitude": 178.06240659355117
                    },
                    {
                        "latitude": 25.675243814396175,
                        "longitude": 177.4174848077732,
                        "altitude": -5789.777232018369
                    },
                    {
                        "latitude": 25.755680689181577,
                        "longitude": 178.73924725439346
                    },
                    {
                        "latitude": 25.820932815251968,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": 25.820932815251968,
                        "longitude": -180
                    },
                    {
                        "latitude": 25.824093838378,
                        "longitude": -179.9389250768508
                    },
                    {
                        "latitude": 25.880485219269108,
                        "longitude": -178.6170619882057
                    },
                    {
                        "latitude": 25.924857183401915,
                        "longitude": -177.29519341931618
                    },
                    {
                        "latitude": 25.95721238526119,
                        "longitude": -175.9733493829428
                    },
                    {
                        "latitude": 25.977553708706644,
                        "longitude": -174.6515599000897
                    },
                    {
                        "latitude": 25.985884211102448,
                        "longitude": -173.32985493470528
                    },
                    {
                        "latitude": 25.986087106469242,
                        "longitude": -172.99304849122382,
                        "altitude": -4479.190324812391
                    },
                    {
                        "latitude": 24.76085447537714,
                        "longitude": -173.03809515740335
                    },
                    {
                        "latitude": 23.513266012368007,
                        "longitude": -173.08305937755458
                    },
                    {
                        "latitude": 22.24373768365635,
                        "longitude": -173.12794776305168
                    },
                    {
                        "latitude": 20.952779717443626,
                        "longitude": -173.1727668902841
                    },
                    {
                        "latitude": 19.64100038253327,
                        "longitude": -173.2175232984937
                    },
                    {
                        "latitude": 18.56452103700815,
                        "longitude": -173.25370638038987,
                        "altitude": -2950.9178526285878
                    },
                    {
                        "latitude": 18.7429085310069,
                        "longitude": -174.56573712146707
                    },
                    {
                        "latitude": 18.911824250778217,
                        "longitude": -175.87798460457094
                    },
                    {
                        "latitude": 19.071226663182173,
                        "longitude": -177.19043482747418
                    },
                    {
                        "latitude": 19.221077643727014,
                        "longitude": -178.50307335202942
                    },
                    {
                        "latitude": 19.36134232148362,
                        "longitude": -179.8158853324578
                    },
                    {
                        "latitude": 19.379662582561167,
                        "longitude": -180
                    },
                    {
                        "latitude": 15.897529803858099,
                        "longitude": -180
                    },
                    {
                        "latitude": 15.815694014034893,
                        "longitude": -179.26105231396704
                    },
                    {
                        "latitude": 15.661165195081487,
                        "longitude": -177.93987249419922
                    },
                    {
                        "latitude": 15.498501789910533,
                        "longitude": -176.61893032402747
                    },
                    {
                        "latitude": 15.327760010172172,
                        "longitude": -175.29823154705858
                    },
                    {
                        "latitude": 15.148999668714922,
                        "longitude": -173.97778138359448
                    },
                    {
                        "latitude": 14.96228428009153,
                        "longitude": -172.65758451877755
                    },
                    {
                        "latitude": 14.767681162736789,
                        "longitude": -171.33764509193455
                    },
                    {
                        "latitude": 14.565261542280599,
                        "longitude": -170.01796668714684
                    },
                    {
                        "latitude": 14.355100655431004,
                        "longitude": -168.6985523250725
                    },
                    {
                        "latitude": 14.284161127203653,
                        "longitude": -168.2638069993666,
                        "altitude": -3677.652783984377
                    },
                    {
                        "latitude": 15.56425174407275,
                        "longitude": -168.31708538365217
                    },
                    {
                        "latitude": 16.830632490009123,
                        "longitude": -168.37045013043988
                    },
                    {
                        "latitude": 18.08241343741947,
                        "longitude": -168.42390611881848
                    },
                    {
                        "latitude": 19.318777495350613,
                        "longitude": -168.47745822827807
                    },
                    {
                        "latitude": 20.538981729855056,
                        "longitude": -168.5311113467539
                    },
                    {
                        "latitude": 21.742357904945543,
                        "longitude": -168.58487037861494
                    },
                    {
                        "latitude": 22.92831229293157,
                        "longitude": -168.63874025252537
                    },
                    {
                        "latitude": 24.096324812861813,
                        "longitude": -168.69272592911534
                    },
                    {
                        "latitude": 25.245947563242968,
                        "longitude": -168.74683240840884
                    },
                    {
                        "latitude": 26.37680282021232,
                        "longitude": -168.80106473696603
                    },
                    {
                        "latitude": 27.488580575043102,
                        "longitude": -168.8554280147091
                    },
                    {
                        "latitude": 27.834128969558243,
                        "longitude": -168.87254711699043,
                        "altitude": -4546.174694366518
                    },
                    {
                        "latitude": 27.97708861057533,
                        "longitude": -170.1568784924255
                    },
                    {
                        "latitude": 28.107797962400156,
                        "longitude": -171.44145916706702
                    },
                    {
                        "latitude": 28.22626824983042,
                        "longitude": -172.72625669983313
                    },
                    {
                        "latitude": 28.332510614379252,
                        "longitude": -174.01123813582743
                    },
                    {
                        "latitude": 28.426535935215426,
                        "longitude": -175.29637007101928
                    },
                    {
                        "latitude": 28.50835466875312,
                        "longitude": -176.58161871846386
                    },
                    {
                        "latitude": 28.577976706618553,
                        "longitude": -177.86694997590922
                    },
                    {
                        "latitude": 28.635411251731806,
                        "longitude": -179.15232949463103
                    },
                    {
                        "latitude": 28.665255596219644,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": 21.658401107564288,
                        "longitude": -180
                    },
                    {
                        "latitude": 21.744542195938877,
                        "longitude": -178.9276923427228
                    },
                    {
                        "latitude": 21.80672671961027,
                        "longitude": -178.088367106668,
                        "altitude": -5567.100495583176
                    },
                    {
                        "latitude": 22.663379911941213,
                        "longitude": -179.04858163356764
                    },
                    {
                        "latitude": 23.496108628439977,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": 11.791885862341143,
                        "longitude": 180
                    },
                    {
                        "latitude": 11.82042588597207,
                        "longitude": 179.40694889793753
                    },
                    {
                        "latitude": 11.880784868278564,
                        "longitude": 178.01024791317573
                    },
                    {
                        "latitude": 11.934261812685717,
                        "longitude": 176.61352229413663
                    },
                    {
                        "latitude": 11.980832393324619,
                        "longitude": 175.2167790499353
                    },
                    {
                        "latitude": 12.020475562620852,
                        "longitude": 173.82002523543338
                    },
                    {
                        "latitude": 12.053173532021138,
                        "longitude": 172.42326793461407
                    },
                    {
                        "latitude": 12.078911754957359,
                        "longitude": 171.0265142438503
                    },
                    {
                        "latitude": 12.09767891216855,
                        "longitude": 169.6297712551056
                    },
                    {
                        "latitude": 12.109466899482078,
                        "longitude": 168.23304603910756
                    },
                    {
                        "latitude": 12.114270818135656,
                        "longitude": 166.8363456285347
                    },
                    {
                        "latitude": 12.112088967702405,
                        "longitude": 165.43967700125665
                    },
                    {
                        "latitude": 12.102922841661345,
                        "longitude": 164.04304706366955
                    },
                    {
                        "latitude": 12.088447741007394,
                        "longitude": 162.76715013973183,
                        "altitude": -2778.657529667758
                    },
                    {
                        "latitude": 13.428989083635203,
                        "longitude": 162.40956383204602
                    },
                    {
                        "latitude": 14.756236144253702,
                        "longitude": 162.0514308794397
                    },
                    {
                        "latitude": 16.06905292360898,
                        "longitude": 161.69271688117877
                    },
                    {
                        "latitude": 17.36638531411116,
                        "longitude": 161.3333876185039
                    },
                    {
                        "latitude": 18.647264258552095,
                        "longitude": 160.97340899706802
                    },
                    {
                        "latitude": 19.910807842712483,
                        "longitude": 160.6127469890199
                    },
                    {
                        "latitude": 21.156222361819434,
                        "longitude": 160.25136757551255
                    },
                    {
                        "latitude": 22.382802419566595,
                        "longitude": 159.88923669034494
                    },
                    {
                        "latitude": 23.589930133722817,
                        "longitude": 159.5263201653617
                    },
                    {
                        "latitude": 24.7770735340617,
                        "longitude": 159.1625836781419
                    },
                    {
                        "latitude": 25.943784246450896,
                        "longitude": 158.79799270241074
                    },
                    {
                        "latitude": 27.089694561610976,
                        "longitude": 158.43251246150837
                    },
                    {
                        "latitude": 28.21451398857391,
                        "longitude": 158.06610788515547
                    },
                    {
                        "latitude": 29.31802539161711,
                        "longitude": 157.69874356966403
                    },
                    {
                        "latitude": 30.400080805851957,
                        "longitude": 157.33038374165963
                    },
                    {
                        "latitude": 31.460597021163547,
                        "longitude": 156.96099222530887
                    },
                    {
                        "latitude": 32.49955101728771,
                        "longitude": 156.59053241298318
                    },
                    {
                        "latitude": 33.516975324907534,
                        "longitude": 156.21896723923757
                    },
                    {
                        "latitude": 34.512953379150254,
                        "longitude": 155.84625915794277
                    },
                    {
                        "latitude": 35.487614923116034,
                        "longitude": 155.4723701223776
                    },
                    {
                        "latitude": 35.69112541140628,
                        "longitude": 155.393104431554,
                        "altitude": -5427.900043536215
                    },
                    {
                        "latitude": 35.62099139650826,
                        "longitude": 154.15932725337075
                    },
                    {
                        "latitude": 35.53816691787288,
                        "longitude": 152.92602773647678
                    },
                    {
                        "latitude": 35.44263102817807,
                        "longitude": 151.69325431018484
                    },
                    {
                        "latitude": 35.33435900878943,
                        "longitude": 150.46105447516112
                    },
                    {
                        "latitude": 35.21332247317649,
                        "longitude": 149.22947470626264
                    },
                    {
                        "latitude": 35.11187152238888,
                        "longitude": 148.2857832205469,
                        "altitude": -5993.11713182145
                    },
                    {
                        "latitude": 35.11187152238888,
                        "longitude": 148.2857832205469,
                        "altitude": -5993.11713182145
                    },
                    {
                        "latitude": 34.18929760090233,
                        "longitude": 148.64643011144784
                    },
                    {
                        "latitude": 33.24759539912641,
                        "longitude": 149.0061017356133
                    },
                    {
                        "latitude": 32.28662633762085,
                        "longitude": 149.36483975943324
                    },
                    {
                        "latitude": 31.306285631448528,
                        "longitude": 149.72268578842773
                    },
                    {
                        "latitude": 30.306505718147555,
                        "longitude": 150.07968137120935
                    },
                    {
                        "latitude": 29.287259769580093,
                        "longitude": 150.43586800176047
                    },
                    {
                        "latitude": 28.248565257111995,
                        "longitude": 150.7912871198608
                    },
                    {
                        "latitude": 27.190487533998088,
                        "longitude": 151.14598010950976
                    },
                    {
                        "latitude": 26.113143393115433,
                        "longitude": 151.49998829520163
                    },
                    {
                        "latitude": 25.016704552445375,
                        "longitude": 151.85335293592942
                    },
                    {
                        "latitude": 23.901401015126762,
                        "longitude": 152.2061152168196
                    },
                    {
                        "latitude": 22.7675242456913,
                        "longitude": 152.5583162383285
                    },
                    {
                        "latitude": 21.61543009948048,
                        "longitude": 152.90999700297172
                    },
                    {
                        "latitude": 20.44554143848829,
                        "longitude": 153.26119839959856
                    },
                    {
                        "latitude": 19.25835036424524,
                        "longitude": 153.61196118527675
                    },
                    {
                        "latitude": 18.05441999713743,
                        "longitude": 153.96232596490708
                    },
                    {
                        "latitude": 16.83438573200732,
                        "longitude": 154.31233316874756
                    },
                    {
                        "latitude": 15.598955902259519,
                        "longitude": 154.66202302809282
                    },
                    {
                        "latitude": 14.348911789202742,
                        "longitude": 155.01143554941785
                    },
                    {
                        "latitude": 13.085106920145122,
                        "longitude": 155.36061048736184
                    },
                    {
                        "latitude": 11.808465607896583,
                        "longitude": 155.7095873169904
                    },
                    {
                        "latitude": 10.51998069579445,
                        "longitude": 156.05840520583067
                    },
                    {
                        "latitude": 9.220710486025611,
                        "longitude": 156.40710298622423
                    },
                    {
                        "latitude": 8.462467126604933,
                        "longitude": 156.60935140923232,
                        "altitude": -5098.728762014921
                    },
                    {
                        "latitude": 8.476949522968773,
                        "longitude": 157.99904423711416
                    },
                    {
                        "latitude": 8.486516876780708,
                        "longitude": 159.38872908112282
                    },
                    {
                        "latitude": 8.491164373210426,
                        "longitude": 160.77840257305846
                    },
                    {
                        "latitude": 8.49088976276751,
                        "longitude": 162.16806137043002
                    },
                    {
                        "latitude": 8.485693360222081,
                        "longitude": 163.55770216433433
                    },
                    {
                        "latitude": 8.475578043662491,
                        "longitude": 164.9473216872649
                    },
                    {
                        "latitude": 8.460549253693937,
                        "longitude": 166.33691672083154
                    },
                    {
                        "latitude": 8.440614992773995,
                        "longitude": 167.72648410337203
                    },
                    {
                        "latitude": 8.415785824673598,
                        "longitude": 169.1160207374377
                    },
                    {
                        "latitude": 8.386074874044215,
                        "longitude": 170.50552359713453
                    },
                    {
                        "latitude": 8.35149782606448,
                        "longitude": 171.89498973530215
                    },
                    {
                        "latitude": 8.312072926132128,
                        "longitude": 173.284416290513
                    },
                    {
                        "latitude": 8.267820979559724,
                        "longitude": 174.6738004938746
                    },
                    {
                        "latitude": 8.218765351225652,
                        "longitude": 176.0631396756182
                    },
                    {
                        "latitude": 8.164931965124754,
                        "longitude": 177.4524312714573
                    },
                    {
                        "latitude": 8.10634930375651,
                        "longitude": 178.84167282870087
                    },
                    {
                        "latitude": 8.053568048885037,
                        "longitude": 180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 99,
                            "linkTo": 252
                        },
                        "40": {
                            "visited": true,
                            "forPole": false,
                            "index": 139,
                            "linkTo": 223
                        },
                        "41": {
                            "visited": true,
                            "forPole": false,
                            "index": 223,
                            "linkTo": 139
                        },
                        "70": {
                            "visited": false,
                            "forPole": false,
                            "index": 252,
                            "linkTo": 99
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 253,
                            "linkTo": 98
                        },
                        "43": {
                            "visited": true,
                            "forPole": false,
                            "index": 296,
                            "linkTo": 42
                        },
                        "44": {
                            "visited": true,
                            "forPole": false,
                            "index": 42,
                            "linkTo": 296
                        },
                        "100": {
                            "visited": false,
                            "forPole": false,
                            "index": 98,
                            "linkTo": 253
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 172,
                            "linkTo": 202
                        },
                        "18": {
                            "visited": true,
                            "forPole": false,
                            "index": 190,
                            "linkTo": 196
                        },
                        "19": {
                            "visited": true,
                            "forPole": false,
                            "index": 196,
                            "linkTo": 190
                        },
                        "25": {
                            "visited": false,
                            "forPole": false,
                            "index": 202,
                            "linkTo": 172
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 203,
                            "linkTo": 171
                        },
                        "19": {
                            "visited": true,
                            "forPole": false,
                            "index": 222,
                            "linkTo": 140
                        },
                        "20": {
                            "visited": true,
                            "forPole": false,
                            "index": 140,
                            "linkTo": 222
                        },
                        "51": {
                            "visited": false,
                            "forPole": false,
                            "index": 171,
                            "linkTo": 203
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 191,
                            "linkTo": 195
                        },
                        "4": {
                            "visited": false,
                            "forPole": false,
                            "index": 195,
                            "linkTo": 191
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 297,
                            "linkTo": 41
                        },
                        "82": {
                            "visited": false,
                            "forPole": false,
                            "index": 41,
                            "linkTo": 297
                        }
                    }
                }
            ]
        }
    ];
    var spiralPolyOutput = transformOutputData(spiralPolyRawOutput);

    var polyLineRawInput = [
        [
            {
                "latitude": 90,
                "longitude": -180
            },
            {
                "latitude": 89.87215909090881,
                "longitude": -180
            },
            {
                "latitude": 89.74431181732949,
                "longitude": -180
            },
            {
                "latitude": 89.6164454491398,
                "longitude": -180
            },
            {
                "latitude": 89.48854725089888,
                "longitude": -180
            },
            {
                "latitude": 89.36060447702006,
                "longitude": -180
            },
            {
                "latitude": 89.2326043669483,
                "longitude": -180
            },
            {
                "latitude": 89.10453414032345,
                "longitude": -180
            },
            {
                "latitude": 88.97638099212966,
                "longitude": -180
            },
            {
                "latitude": 88.84813208783008,
                "longitude": -180
            },
            {
                "latitude": 88.71977455847643,
                "longitude": -180
            },
            {
                "latitude": 88.59129549579664,
                "longitude": -180
            },
            {
                "latitude": 88.46268194725344,
                "longitude": -180
            },
            {
                "latitude": 88.33392091106938,
                "longitude": -180
            },
            {
                "latitude": 88.2049993312171,
                "longitude": -180
            },
            {
                "latitude": 88.07590409236822,
                "longitude": -180
            },
            {
                "latitude": 87.94662201479971,
                "longitude": -180
            },
            {
                "latitude": 87.81713984925088,
                "longitude": -180
            },
            {
                "latitude": 87.68744427172963,
                "longitude": -180
            },
            {
                "latitude": 87.5575218782625,
                "longitude": -180
            },
            {
                "latitude": 87.42735917958343,
                "longitude": -180
            },
            {
                "latitude": 87.29694259575992,
                "longitude": -180
            },
            {
                "latitude": 87.1662584507491,
                "longitude": -180
            },
            {
                "latitude": 87.03529296688193,
                "longitude": -180
            },
            {
                "latitude": 86.90403225926869,
                "longitude": -180
            },
            {
                "latitude": 86.77246233012377,
                "longitude": -180
            },
            {
                "latitude": 86.64056906300249,
                "longitude": -180
            },
            {
                "latitude": 86.50833821694759,
                "longitude": -180
            },
            {
                "latitude": 86.37575542053854,
                "longitude": -180
            },
            {
                "latitude": 86.24280616584049,
                "longitude": -180
            },
            {
                "latitude": 86.10947580224548,
                "longitude": -180
            },
            {
                "latitude": 85.97574953020343,
                "longitude": -180
            },
            {
                "latitude": 85.84161239483505,
                "longitude": -180
            },
            {
                "latitude": 85.7070492794228,
                "longitude": -180
            },
            {
                "latitude": 85.57204489877324,
                "longitude": -180
            },
            {
                "latitude": 85.4365837924456,
                "longitude": -180
            },
            {
                "latitude": 85.30065031784005,
                "longitude": -180
            },
            {
                "latitude": 85.16422864313981,
                "longitude": -180
            },
            {
                "latitude": 85.02730274010058,
                "longitude": -180
            },
            {
                "latitude": 84.88985637668107,
                "longitude": -180
            },
            {
                "latitude": 84.7518731095069,
                "longitude": -180
            },
            {
                "latitude": 84.61333627616263,
                "longitude": -180
            },
            {
                "latitude": 84.47422898730257,
                "longitude": -180
            },
            {
                "latitude": 84.33453411857462,
                "longitude": -180
            },
            {
                "latitude": 84.19423430234929,
                "longitude": -180
            },
            {
                "latitude": 84.05331191924462,
                "longitude": -180
            },
            {
                "latitude": 83.91174908944046,
                "longitude": -180
            },
            {
                "latitude": 83.76952766377306,
                "longitude": -180
            },
            {
                "latitude": 83.62662921460064,
                "longitude": -180
            },
            {
                "latitude": 83.48303502643166,
                "longitude": -180
            },
            {
                "latitude": 83.33872608630637,
                "longitude": -180
            },
            {
                "latitude": 83.19368307392106,
                "longitude": -180
            },
            {
                "latitude": 83.0478863514866,
                "longitude": -180
            },
            {
                "latitude": 82.90131595330878,
                "longitude": -180
            },
            {
                "latitude": 82.75395157508196,
                "longitude": -180
            },
            {
                "latitude": 82.60577256288295,
                "longitude": -180
            },
            {
                "latitude": 82.45675790185462,
                "longitude": -180
            },
            {
                "latitude": 82.306886204567,
                "longitude": -180
            },
            {
                "latitude": 82.1561356990436,
                "longitude": -180
            },
            {
                "latitude": 82.00448421643958,
                "longitude": -180
            },
            {
                "latitude": 81.85190917835924,
                "longitude": -180
            },
            {
                "latitude": 81.69838758379788,
                "longitude": -180
            },
            {
                "latitude": 81.54389599569521,
                "longitude": -180
            },
            {
                "latitude": 81.38841052708345,
                "longitude": -180
            },
            {
                "latitude": 81.23190682681651,
                "longitude": -180
            },
            {
                "latitude": 81.0743600648631,
                "longitude": -180
            },
            {
                "latitude": 80.91574491714731,
                "longitude": -180
            },
            {
                "latitude": 80.7560355499196,
                "longitude": -180
            },
            {
                "latitude": 80.59520560364027,
                "longitude": -180
            },
            {
                "latitude": 80.43322817635615,
                "longitude": -180
            },
            {
                "latitude": 80.27007580655234,
                "longitude": -180
            },
            {
                "latitude": 80.10572045545752,
                "longitude": -180
            },
            {
                "latitude": 79.94013348878327,
                "longitude": -180
            },
            {
                "latitude": 79.77328565787472,
                "longitude": -180
            },
            {
                "latitude": 79.60514708025077,
                "longitude": -180
            },
            {
                "latitude": 79.43568721951023,
                "longitude": -180
            },
            {
                "latitude": 79.26487486457944,
                "longitude": -180
            },
            {
                "latitude": 79.09267810827666,
                "longitude": -180
            },
            {
                "latitude": 78.91906432516674,
                "longitude": -180
            },
            {
                "latitude": 78.74400014867915,
                "longitude": -180
            },
            {
                "latitude": 78.56745144746101,
                "longitude": -180
            },
            {
                "latitude": 78.3893833009359,
                "longitude": -180
            },
            {
                "latitude": 78.20975997403845,
                "longitude": -180
            },
            {
                "latitude": 78.0285448910927,
                "longitude": -180
            },
            {
                "latitude": 77.84570060880169,
                "longitude": -180
            },
            {
                "latitude": 77.66118878831477,
                "longitude": -180
            },
            {
                "latitude": 77.47497016633683,
                "longitude": -180
            },
            {
                "latitude": 77.2870045252433,
                "longitude": -180
            },
            {
                "latitude": 77.09725066216313,
                "longitude": -180
            },
            {
                "latitude": 76.9056663569904,
                "longitude": -180
            },
            {
                "latitude": 76.71220833928372,
                "longitude": -180
            },
            {
                "latitude": 76.51683225401193,
                "longitude": -180
            },
            {
                "latitude": 76.31949262610165,
                "longitude": -180
            },
            {
                "latitude": 76.12014282374227,
                "longitude": -180
            },
            {
                "latitude": 75.91873502040113,
                "longitude": -180
            },
            {
                "latitude": 75.71522015550102,
                "longitude": -180
            },
            {
                "latitude": 75.50954789370948,
                "longitude": -180
            },
            {
                "latitude": 75.30166658278891,
                "longitude": -180
            },
            {
                "latitude": 75.09152320995382,
                "longitude": -180
            },
            {
                "latitude": 74.87906335668025,
                "longitude": -180
            },
            {
                "latitude": 74.66423115191074,
                "longitude": -180
            },
            {
                "latitude": 74.44696922359661,
                "longitude": -180
            },
            {
                "latitude": 74.22721864851722,
                "longitude": -180
            },
            {
                "latitude": 74.00491890031441,
                "longitude": -180
            },
            {
                "latitude": 73.78000779567883,
                "longitude": -180
            },
            {
                "latitude": 73.55242143862316,
                "longitude": -180
            },
            {
                "latitude": 73.32209416277513,
                "longitude": -180
            },
            {
                "latitude": 73.0889584716226,
                "longitude": -180
            },
            {
                "latitude": 72.85294497664098,
                "longitude": -180
            },
            {
                "latitude": 72.61398233323177,
                "longitude": -180
            },
            {
                "latitude": 72.37199717440069,
                "longitude": -180
            },
            {
                "latitude": 72.12691404210162,
                "longitude": -180
            },
            {
                "latitude": 71.8786553161727,
                "longitude": -180
            },
            {
                "latitude": 71.62714114079004,
                "longitude": -180
            },
            {
                "latitude": 71.3722893483636,
                "longitude": -180
            },
            {
                "latitude": 71.11401538080054,
                "longitude": -180
            },
            {
                "latitude": 70.85223220806122,
                "longitude": -180
            },
            {
                "latitude": 70.58685024393353,
                "longitude": -180
            },
            {
                "latitude": 70.3177772589527,
                "longitude": -180
            },
            {
                "latitude": 70.04491829039551,
                "longitude": -180
            },
            {
                "latitude": 69.76817554927966,
                "longitude": -180
            },
            {
                "latitude": 69.4874483243026,
                "longitude": -180
            },
            {
                "latitude": 69.2026328826575,
                "longitude": -180
            },
            {
                "latitude": 68.91362236766926,
                "longitude": -180
            },
            {
                "latitude": 68.62030669319854,
                "longitude": -180
            },
            {
                "latitude": 68.3225724347693,
                "longitude": -180
            },
            {
                "latitude": 68.02030271738332,
                "longitude": -180
            },
            {
                "latitude": 67.71337709999462,
                "longitude": -180
            },
            {
                "latitude": 67.40167145662869,
                "longitude": -180
            },
            {
                "latitude": 67.08505785414408,
                "longitude": -180
            },
            {
                "latitude": 66.7634044266493,
                "longitude": -180
            },
            {
                "latitude": 66.436575246606,
                "longitude": -180
            },
            {
                "latitude": 66.10443019266958,
                "longitude": -180
            },
            {
                "latitude": 65.76682481434122,
                "longitude": -180
            },
            {
                "latitude": 65.42361019353231,
                "longitude": -180
            },
            {
                "latitude": 65.0746328031723,
                "longitude": -180
            },
            {
                "latitude": 64.71973436302504,
                "longitude": -180
            },
            {
                "latitude": 64.35875169291738,
                "longitude": -180
            },
            {
                "latitude": 63.991516563628146,
                "longitude": -180
            },
            {
                "latitude": 63.61785554573361,
                "longitude": -180
            },
            {
                "latitude": 63.23758985676242,
                "longitude": -180
            },
            {
                "latitude": 62.85053520707411,
                "longitude": -180
            },
            {
                "latitude": 62.4565016449452,
                "longitude": -180
            },
            {
                "latitude": 62.05529340142515,
                "longitude": -180
            },
            {
                "latitude": 61.646708735610844,
                "longitude": -180
            },
            {
                "latitude": 61.23053978108492,
                "longitude": -180
            },
            {
                "latitude": 60.806572394372054,
                "longitude": -180
            },
            {
                "latitude": 60.37458600638521,
                "longitude": -180
            },
            {
                "latitude": 59.93435347796726,
                "longitude": -180
            },
            {
                "latitude": 59.48564096077986,
                "longitude": -180
            },
            {
                "latitude": 59.02820776495211,
                "longitude": -180
            },
            {
                "latitude": 58.56180623508028,
                "longitude": -180
            },
            {
                "latitude": 58.086181636365154,
                "longitude": -180
            },
            {
                "latitude": 57.60107205288721,
                "longitude": -180
            },
            {
                "latitude": 57.10620830025539,
                "longitude": -180
            },
            {
                "latitude": 56.60131385511945,
                "longitude": -180
            },
            {
                "latitude": 56.086104804314836,
                "longitude": -180
            },
            {
                "latitude": 55.56028981670963,
                "longitude": -180
            },
            {
                "latitude": 55.023570141149015,
                "longitude": -180
            },
            {
                "latitude": 54.47563963424276,
                "longitude": -180
            },
            {
                "latitude": 53.91618482211631,
                "longitude": -180
            },
            {
                "latitude": 53.344885000647025,
                "longitude": -180
            },
            {
                "latitude": 52.76141237913118,
                "longitude": -180
            },
            {
                "latitude": 52.1654322727752,
                "longitude": -180
            },
            {
                "latitude": 51.556603349873875,
                "longitude": -180
            },
            {
                "latitude": 50.93457794002456,
                "longitude": -180
            },
            {
                "latitude": 50.2990024102275,
                "longitude": -180
            },
            {
                "latitude": 49.649517616231584,
                "longitude": -180
            },
            {
                "latitude": 48.98575943699499,
                "longitude": -180
            },
            {
                "latitude": 48.30735940063275,
                "longitude": -180
            },
            {
                "latitude": 47.61394541070731,
                "longitude": -180
            },
            {
                "latitude": 46.9051425821681,
                "longitude": -180
            },
            {
                "latitude": 46.18057419664904,
                "longitude": -180
            },
            {
                "latitude": 45.43986278716493,
                "longitude": -180
            },
            {
                "latitude": 44.68263136248978,
                "longitude": -180
            },
            {
                "latitude": 43.9085047816228,
                "longitude": -180
            },
            {
                "latitude": 43.11711128872247,
                "longitude": -180
            },
            {
                "latitude": 42.30808421867937,
                "longitude": -180
            },
            {
                "latitude": 41.48106388306879,
                "longitude": -180
            },
            {
                "latitude": 40.63569964552826,
                "longitude": -180
            },
            {
                "latitude": 39.77165219460131,
                "longitude": -180
            },
            {
                "latitude": 38.88859602072614,
                "longitude": -180
            },
            {
                "latitude": 37.98622210227708,
                "longitude": -180
            },
            {
                "latitude": 37.064240803337775,
                "longitude": -180
            },
            {
                "latitude": 36.12238498314887,
                "longitude": -180
            },
            {
                "latitude": 35.1604133138854,
                "longitude": -180
            },
            {
                "latitude": 34.17811379954219,
                "longitude": -180
            },
            {
                "latitude": 33.17530748421366,
                "longitude": -180
            },
            {
                "latitude": 32.15185233293454,
                "longitude": -180
            },
            {
                "latitude": 31.10764726250962,
                "longitude": -180
            },
            {
                "latitude": 30.042636293435397,
                "longitude": -180
            },
            {
                "latitude": 28.95681278716794,
                "longitude": -180
            },
            {
                "latitude": 27.850223725718042,
                "longitude": -180
            },
            {
                "latitude": 26.722973982994613,
                "longitude": -180
            },
            {
                "latitude": 25.575230529653872,
                "longitude": -180
            },
            {
                "latitude": 24.407226505672643,
                "longitude": -180
            },
            {
                "latitude": 23.21926508772611,
                "longitude": -180
            },
            {
                "latitude": 22.01172307203025,
                "longitude": -180
            },
            {
                "latitude": 20.78505408796594,
                "longitude": -180
            },
            {
                "latitude": 19.53979135391726,
                "longitude": -180
            },
            {
                "latitude": 18.276549884728077,
                "longitude": -180
            },
            {
                "latitude": 16.996028060399514,
                "longitude": -180
            },
            {
                "latitude": 15.699008468476416,
                "longitude": -180
            },
            {
                "latitude": 14.386357938308839,
                "longitude": -180
            },
            {
                "latitude": 13.05902669424647,
                "longitude": -180
            },
            {
                "latitude": 11.718046566936918,
                "longitude": -180
            },
            {
                "latitude": 10.364528217222478,
                "longitude": -180
            },
            {
                "latitude": 8.999657345473572,
                "longitude": -180
            },
            {
                "latitude": 7.6246898801941345,
                "longitude": -180
            },
            {
                "latitude": 6.240946162843605,
                "longitude": -180
            },
            {
                "latitude": 4.849804170330018,
                "longitude": -180
            },
            {
                "latitude": 3.452691841683257,
                "longitude": -180
            },
            {
                "latitude": 2.051078600052479,
                "longitude": -180
            },
            {
                "latitude": 0.6464661843600312,
                "longitude": -180
            },
            {
                "latitude": 0,
                "longitude": 180
            },
            {
                "latitude": -1.4062499999999998,
                "longitude": 180
            },
            {
                "latitude": -2.8117300501311466,
                "longitude": 180
            },
            {
                "latitude": -4.214903789184817,
                "longitude": 180
            },
            {
                "latitude": -5.6142479516293715,
                "longitude": 180
            },
            {
                "latitude": -7.008262574416999,
                "longitude": 180
            },
            {
                "latitude": -8.39548084153752,
                "longitude": 180
            },
            {
                "latitude": -9.774478406827953,
                "longitude": 180
            },
            {
                "latitude": -11.143882050926758,
                "longitude": 180
            },
            {
                "latitude": -12.502377547678627,
                "longitude": 180
            },
            {
                "latitude": -13.848716637846202,
                "longitude": 180
            },
            {
                "latitude": -15.181723032651714,
                "longitude": 180
            },
            {
                "latitude": -16.500297395388177,
                "longitude": 180
            },
            {
                "latitude": -17.803421275057232,
                "longitude": 180
            },
            {
                "latitude": -19.090159990736748,
                "longitude": 180
            },
            {
                "latitude": -20.359664488307725,
                "longitude": 180
            },
            {
                "latitude": -21.61117221159208,
                "longitude": 180
            },
            {
                "latitude": -22.8440070473663,
                "longitude": 180
            },
            {
                "latitude": -24.057578417807456,
                "longitude": 180
            },
            {
                "latitude": -25.25137960456655,
                "longitude": 180
            },
            {
                "latitude": -26.424985395884956,
                "longitude": 180
            },
            {
                "latitude": -27.578049152148605,
                "longitude": 180
            },
            {
                "latitude": -28.71029938629927,
                "longitude": 180
            },
            {
                "latitude": -29.821535953958946,
                "longitude": 180
            },
            {
                "latitude": -30.911625944387968,
                "longitude": 180
            },
            {
                "latitude": -31.980499357924945,
                "longitude": 180
            },
            {
                "latitude": -33.02814464878,
                "longitude": 180
            },
            {
                "latitude": -34.05460420437862,
                "longitude": 180
            },
            {
                "latitude": -35.0599698242557,
                "longitude": 180
            },
            {
                "latitude": -36.04437825309925,
                "longitude": 180
            },
            {
                "latitude": -37.008006814215975,
                "longitude": 180
            },
            {
                "latitude": -37.95106918165399,
                "longitude": 180
            },
            {
                "latitude": -38.87381132164073,
                "longitude": 180
            },
            {
                "latitude": -39.776507626995695,
                "longitude": 180
            },
            {
                "latitude": -40.659457261838,
                "longitude": 180
            },
            {
                "latitude": -41.52298072826727,
                "longitude": 180
            },
            {
                "latitude": -42.367416661766946,
                "longitude": 180
            },
            {
                "latitude": -43.193118857847864,
                "longitude": 180
            },
            {
                "latitude": -44.00045352888737,
                "longitude": 180
            },
            {
                "latitude": -44.789796787181125,
                "longitude": 180
            },
            {
                "latitude": -45.561532347859966,
                "longitude": 180
            },
            {
                "latitude": -46.31604944347375,
                "longitude": 180
            },
            {
                "latitude": -47.053740940651956,
                "longitude": 180
            },
            {
                "latitude": -47.77500164825503,
                "longitude": 180
            },
            {
                "latitude": -48.48022680577781,
                "longitude": 180
            },
            {
                "latitude": -49.16981074040109,
                "longitude": 180
            },
            {
                "latitude": -49.84414568096305,
                "longitude": 180
            },
            {
                "latitude": -50.503620717192966,
                "longitude": 180
            },
            {
                "latitude": -51.14862089277689,
                "longitude": 180
            },
            {
                "latitude": -51.779526421174616,
                "longitude": 180
            },
            {
                "latitude": -52.39671201354793,
                "longitude": 180
            },
            {
                "latitude": -53.000546308668575,
                "longitude": 180
            },
            {
                "latitude": -53.59139139522703,
                "longitude": 180
            },
            {
                "latitude": -54.16960241754343,
                "longitude": 180
            },
            {
                "latitude": -54.73552725627457,
                "longitude": 180
            },
            {
                "latitude": -55.289506276304685,
                "longitude": 180
            },
            {
                "latitude": -55.83187213459248,
                "longitude": 180
            },
            {
                "latitude": -56.362949641316476,
                "longitude": 180
            },
            {
                "latitude": -56.883055668208655,
                "longitude": 180
            },
            {
                "latitude": -57.39249909848987,
                "longitude": 180
            },
            {
                "latitude": -57.89158081331605,
                "longitude": 180
            },
            {
                "latitude": -58.38059371011032,
                "longitude": 180
            },
            {
                "latitude": -58.85982274859292,
                "longitude": 180
            },
            {
                "latitude": -59.329545020726485,
                "longitude": 180
            },
            {
                "latitude": -59.79002984117095,
                "longitude": 180
            },
            {
                "latitude": -60.24153885518933,
                "longitude": 180
            },
            {
                "latitude": -60.68432616126537,
                "longitude": 180
            },
            {
                "latitude": -61.11863844598628,
                "longitude": 180
            },
            {
                "latitude": -61.544715129011486,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -61.96278851619163,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -62.37308395912366,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -62.77582001962812,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -63.17120863781629,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -63.55945530257833,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -63.94075922347115,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -64.31531350311691,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -64.68330530934149,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -65.04491604638888,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -65.40032152464211,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -65.74969212836585,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -66.09319298106072,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -66.43098410808692,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -66.76322059627242,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -67.09005275027555,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -67.41162624551488,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -67.72808227752253,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -68.0395577076112,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -68.34618520477618,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -68.64809338378177,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -68.94540693940375,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -69.23824677682111,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -69.52673013816683,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -69.81097072526332,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -70.0910788185806,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -70.3671613924657,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -70.63932222670198,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -70.90766201446321,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -71.17227846673482,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -71.43326641327883,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -71.69071790022284,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -71.94472228435743,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -72.19536632422742,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -72.4427342681048,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -72.68690793893157,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -72.9279668163215,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -73.16598811570925,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -73.40104686473572,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -73.63321597695655,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -73.86256632296084,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -74.08916679898519,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -74.31308439310642,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -74.53438424909601,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -74.75312972801555,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -74.96938246763267,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -75.18320243973339,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -75.39464800540587,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -75.60377596836756,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -75.81064162640689,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -76.01529882100738,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -76.21779998522042,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -76.41819618985114,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -76.61653718801956,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -76.81287145815678,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -77.00724624549444,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -77.19970760210389,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -77.39030042553858,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -77.5790684961328,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -77.76605451300603,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -77.95130012882278,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -78.13484598335407,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -78.31673173588577,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -78.49699609651715,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -78.67567685639239,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -78.85281091690398,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -79.02843431790826,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -79.2025822649893,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -79.37528915580809,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -79.54658860557063,
                "longitude": -179.99999999999997
            },
            {
                "latitude": -79.71651347164926,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -79.88509587738822,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -80.05236723512525,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -80.21835826845782,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -80.38309903378357,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -80.54661894114153,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -80.70894677438075,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -80.87011071068184,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -81.03013833945568,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -81.18905668064275,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -81.34689220243564,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -81.50367083844645,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -81.65941800433997,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -81.81415861395267,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -81.96791709491691,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -82.12071740380895,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -82.27258304083837,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -82.42353706409645,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -82.57360210338032,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -82.72280037360785,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -82.87115368783954,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -83.01868346992228,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -83.16541076676813,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -83.31135626028326,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -83.45654027895901,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -83.60098280913866,
                "longitude": -179.99999999999994
            },
            {
                "latitude": -83.74470350597184,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -83.88772170406841,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -84.03005642786299,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -84.17172640170203,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -84.31275005966268,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -84.45314555511483,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -84.59293077003554,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -84.73212332408599,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -84.87074058345945,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -85.00879966950987,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -85.1463174671689,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -85.28331063316047,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -85.41979560402075,
                "longitude": -179.99999999999991
            },
            {
                "latitude": -85.55578860393071,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -85.69130565236938,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -85.82636257159528,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -85.96097499396214,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -86.09515836907708,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -86.2289279708064,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -86.36229890413695,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -86.49528611189784,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -86.6279043813499,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -86.76016835064766,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -86.89209251518061,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -87.02369123379759,
                "longitude": -179.9999999999999
            },
            {
                "latitude": -87.15497873492309,
                "longitude": -179.99999999999986
            },
            {
                "latitude": -87.28596912256606,
                "longitude": -179.99999999999986
            },
            {
                "latitude": -87.4166763822302,
                "longitude": -179.99999999999986
            },
            {
                "latitude": -87.54711438673014,
                "longitude": -179.99999999999986
            },
            {
                "latitude": -87.67729690191572,
                "longitude": -179.99999999999983
            },
            {
                "latitude": -87.80723759231275,
                "longitude": -179.99999999999983
            },
            {
                "latitude": -87.93695002668275,
                "longitude": -179.9999999999998
            },
            {
                "latitude": -88.06644768350692,
                "longitude": -179.9999999999998
            },
            {
                "latitude": -88.19574395639856,
                "longitude": -179.99999999999977
            },
            {
                "latitude": -88.32485215944817,
                "longitude": -179.99999999999977
            },
            {
                "latitude": -88.45378553250652,
                "longitude": -179.99999999999974
            },
            {
                "latitude": -88.58255724640894,
                "longitude": -179.99999999999972
            },
            {
                "latitude": -88.71118040814574,
                "longitude": -179.9999999999997
            },
            {
                "latitude": -88.83966806598032,
                "longitude": -179.99999999999963
            },
            {
                "latitude": -88.96803321452501,
                "longitude": -179.99999999999963
            },
            {
                "latitude": -89.09628879976941,
                "longitude": -179.99999999999957
            },
            {
                "latitude": -89.22444772407651,
                "longitude": -179.9999999999995
            },
            {
                "latitude": -89.35252285113879,
                "longitude": -179.9999999999994
            },
            {
                "latitude": -89.4805270109061,
                "longitude": -179.99999999999923
            },
            {
                "latitude": -89.60847300448839,
                "longitude": -179.99999999999898
            },
            {
                "latitude": -89.73637360903246,
                "longitude": -179.99999999999847
            },
            {
                "latitude": -89.86424158257789,
                "longitude": -179.99999999999704
            },
            {
                "latitude": -89.99208966888702,
                "longitude": -179.99999999994918
            },
            {
                "latitude": -90,
                "longitude": -180
            }
        ]
    ];
    var polyLineInput = transformInputData(polyLineRawInput);
    var polyLineRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": 0.3232330921800156,
                        "longitude": 180
                    },
                    {
                        "latitude": 0,
                        "longitude": 180
                    },
                    {
                        "latitude": -1.4062499999999998,
                        "longitude": 180
                    },
                    {
                        "latitude": -2.8117300501311466,
                        "longitude": 180
                    },
                    {
                        "latitude": -4.214903789184817,
                        "longitude": 180
                    },
                    {
                        "latitude": -5.6142479516293715,
                        "longitude": 180
                    },
                    {
                        "latitude": -7.008262574416999,
                        "longitude": 180
                    },
                    {
                        "latitude": -8.39548084153752,
                        "longitude": 180
                    },
                    {
                        "latitude": -9.774478406827953,
                        "longitude": 180
                    },
                    {
                        "latitude": -11.143882050926758,
                        "longitude": 180
                    },
                    {
                        "latitude": -12.502377547678627,
                        "longitude": 180
                    },
                    {
                        "latitude": -13.848716637846202,
                        "longitude": 180
                    },
                    {
                        "latitude": -15.181723032651714,
                        "longitude": 180
                    },
                    {
                        "latitude": -16.500297395388177,
                        "longitude": 180
                    },
                    {
                        "latitude": -17.803421275057232,
                        "longitude": 180
                    },
                    {
                        "latitude": -19.090159990736748,
                        "longitude": 180
                    },
                    {
                        "latitude": -20.359664488307725,
                        "longitude": 180
                    },
                    {
                        "latitude": -21.61117221159208,
                        "longitude": 180
                    },
                    {
                        "latitude": -22.8440070473663,
                        "longitude": 180
                    },
                    {
                        "latitude": -24.057578417807456,
                        "longitude": 180
                    },
                    {
                        "latitude": -25.25137960456655,
                        "longitude": 180
                    },
                    {
                        "latitude": -26.424985395884956,
                        "longitude": 180
                    },
                    {
                        "latitude": -27.578049152148605,
                        "longitude": 180
                    },
                    {
                        "latitude": -28.71029938629927,
                        "longitude": 180
                    },
                    {
                        "latitude": -29.821535953958946,
                        "longitude": 180
                    },
                    {
                        "latitude": -30.911625944387968,
                        "longitude": 180
                    },
                    {
                        "latitude": -31.980499357924945,
                        "longitude": 180
                    },
                    {
                        "latitude": -33.02814464878,
                        "longitude": 180
                    },
                    {
                        "latitude": -34.05460420437862,
                        "longitude": 180
                    },
                    {
                        "latitude": -35.0599698242557,
                        "longitude": 180
                    },
                    {
                        "latitude": -36.04437825309925,
                        "longitude": 180
                    },
                    {
                        "latitude": -37.008006814215975,
                        "longitude": 180
                    },
                    {
                        "latitude": -37.95106918165399,
                        "longitude": 180
                    },
                    {
                        "latitude": -38.87381132164073,
                        "longitude": 180
                    },
                    {
                        "latitude": -39.776507626995695,
                        "longitude": 180
                    },
                    {
                        "latitude": -40.659457261838,
                        "longitude": 180
                    },
                    {
                        "latitude": -41.52298072826727,
                        "longitude": 180
                    },
                    {
                        "latitude": -42.367416661766946,
                        "longitude": 180
                    },
                    {
                        "latitude": -43.193118857847864,
                        "longitude": 180
                    },
                    {
                        "latitude": -44.00045352888737,
                        "longitude": 180
                    },
                    {
                        "latitude": -44.789796787181125,
                        "longitude": 180
                    },
                    {
                        "latitude": -45.561532347859966,
                        "longitude": 180
                    },
                    {
                        "latitude": -46.31604944347375,
                        "longitude": 180
                    },
                    {
                        "latitude": -47.053740940651956,
                        "longitude": 180
                    },
                    {
                        "latitude": -47.77500164825503,
                        "longitude": 180
                    },
                    {
                        "latitude": -48.48022680577781,
                        "longitude": 180
                    },
                    {
                        "latitude": -49.16981074040109,
                        "longitude": 180
                    },
                    {
                        "latitude": -49.84414568096305,
                        "longitude": 180
                    },
                    {
                        "latitude": -50.503620717192966,
                        "longitude": 180
                    },
                    {
                        "latitude": -51.14862089277689,
                        "longitude": 180
                    },
                    {
                        "latitude": -51.779526421174616,
                        "longitude": 180
                    },
                    {
                        "latitude": -52.39671201354793,
                        "longitude": 180
                    },
                    {
                        "latitude": -53.000546308668575,
                        "longitude": 180
                    },
                    {
                        "latitude": -53.59139139522703,
                        "longitude": 180
                    },
                    {
                        "latitude": -54.16960241754343,
                        "longitude": 180
                    },
                    {
                        "latitude": -54.73552725627457,
                        "longitude": 180
                    },
                    {
                        "latitude": -55.289506276304685,
                        "longitude": 180
                    },
                    {
                        "latitude": -55.83187213459248,
                        "longitude": 180
                    },
                    {
                        "latitude": -56.362949641316476,
                        "longitude": 180
                    },
                    {
                        "latitude": -56.883055668208655,
                        "longitude": 180
                    },
                    {
                        "latitude": -57.39249909848987,
                        "longitude": 180
                    },
                    {
                        "latitude": -57.89158081331605,
                        "longitude": 180
                    },
                    {
                        "latitude": -58.38059371011032,
                        "longitude": 180
                    },
                    {
                        "latitude": -58.85982274859292,
                        "longitude": 180
                    },
                    {
                        "latitude": -59.329545020726485,
                        "longitude": 180
                    },
                    {
                        "latitude": -59.79002984117095,
                        "longitude": 180
                    },
                    {
                        "latitude": -60.24153885518933,
                        "longitude": 180
                    },
                    {
                        "latitude": -60.68432616126537,
                        "longitude": 180
                    },
                    {
                        "latitude": -61.11863844598628,
                        "longitude": 180
                    },
                    {
                        "latitude": -61.11863844598628,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": -61.11863844598628,
                        "longitude": -180
                    },
                    {
                        "latitude": -61.544715129011486,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -61.96278851619163,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -62.37308395912366,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -62.77582001962812,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -63.17120863781629,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -63.55945530257833,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -63.94075922347115,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -64.31531350311691,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -64.68330530934149,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -65.04491604638888,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -65.40032152464211,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -65.74969212836585,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -66.09319298106072,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -66.43098410808692,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -66.76322059627242,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -67.09005275027555,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -67.41162624551488,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -67.72808227752253,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -68.0395577076112,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -68.34618520477618,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -68.64809338378177,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -68.94540693940375,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -69.23824677682111,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -69.52673013816683,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -69.81097072526332,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -70.0910788185806,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -70.3671613924657,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -70.63932222670198,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -70.90766201446321,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -71.17227846673482,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -71.43326641327883,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -71.69071790022284,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -71.94472228435743,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -72.19536632422742,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -72.4427342681048,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -72.68690793893157,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -72.9279668163215,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -73.16598811570925,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -73.40104686473572,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -73.63321597695655,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -73.86256632296084,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -74.08916679898519,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -74.31308439310642,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -74.53438424909601,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -74.75312972801555,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -74.96938246763267,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -75.18320243973339,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -75.39464800540587,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -75.60377596836756,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -75.81064162640689,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -76.01529882100738,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -76.21779998522042,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -76.41819618985114,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -76.61653718801956,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -76.81287145815678,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -77.00724624549444,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -77.19970760210389,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -77.39030042553858,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -77.5790684961328,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -77.76605451300603,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -77.95130012882278,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -78.13484598335407,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -78.31673173588577,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -78.49699609651715,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -78.67567685639239,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -78.85281091690398,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -79.02843431790826,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -79.2025822649893,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -79.37528915580809,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -79.54658860557063,
                        "longitude": -179.99999999999997
                    },
                    {
                        "latitude": -79.71651347164926,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -79.88509587738822,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -80.05236723512525,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -80.21835826845782,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -80.38309903378357,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -80.54661894114153,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -80.70894677438075,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -80.87011071068184,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -81.03013833945568,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -81.18905668064275,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -81.34689220243564,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -81.50367083844645,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -81.65941800433997,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -81.81415861395267,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -81.96791709491691,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -82.12071740380895,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -82.27258304083837,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -82.42353706409645,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -82.57360210338032,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -82.72280037360785,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -82.87115368783954,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -83.01868346992228,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -83.16541076676813,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -83.31135626028326,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -83.45654027895901,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -83.60098280913866,
                        "longitude": -179.99999999999994
                    },
                    {
                        "latitude": -83.74470350597184,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -83.88772170406841,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -84.03005642786299,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -84.17172640170203,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -84.31275005966268,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -84.45314555511483,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -84.59293077003554,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -84.73212332408599,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -84.87074058345945,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -85.00879966950987,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -85.1463174671689,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -85.28331063316047,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -85.41979560402075,
                        "longitude": -179.99999999999991
                    },
                    {
                        "latitude": -85.55578860393071,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -85.69130565236938,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -85.82636257159528,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -85.96097499396214,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -86.09515836907708,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -86.2289279708064,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -86.36229890413695,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -86.49528611189784,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -86.6279043813499,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -86.76016835064766,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -86.89209251518061,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -87.02369123379759,
                        "longitude": -179.9999999999999
                    },
                    {
                        "latitude": -87.15497873492309,
                        "longitude": -179.99999999999986
                    },
                    {
                        "latitude": -87.28596912256606,
                        "longitude": -179.99999999999986
                    },
                    {
                        "latitude": -87.4166763822302,
                        "longitude": -179.99999999999986
                    },
                    {
                        "latitude": -87.54711438673014,
                        "longitude": -179.99999999999986
                    },
                    {
                        "latitude": -87.67729690191572,
                        "longitude": -179.99999999999983
                    },
                    {
                        "latitude": -87.80723759231275,
                        "longitude": -179.99999999999983
                    },
                    {
                        "latitude": -87.93695002668275,
                        "longitude": -179.9999999999998
                    },
                    {
                        "latitude": -88.06644768350692,
                        "longitude": -179.9999999999998
                    },
                    {
                        "latitude": -88.19574395639856,
                        "longitude": -179.99999999999977
                    },
                    {
                        "latitude": -88.32485215944817,
                        "longitude": -179.99999999999977
                    },
                    {
                        "latitude": -88.45378553250652,
                        "longitude": -179.99999999999974
                    },
                    {
                        "latitude": -88.58255724640894,
                        "longitude": -179.99999999999972
                    },
                    {
                        "latitude": -88.71118040814574,
                        "longitude": -179.9999999999997
                    },
                    {
                        "latitude": -88.83966806598032,
                        "longitude": -179.99999999999963
                    },
                    {
                        "latitude": -88.96803321452501,
                        "longitude": -179.99999999999963
                    },
                    {
                        "latitude": -89.09628879976941,
                        "longitude": -179.99999999999957
                    },
                    {
                        "latitude": -89.22444772407651,
                        "longitude": -179.9999999999995
                    },
                    {
                        "latitude": -89.35252285113879,
                        "longitude": -179.9999999999994
                    },
                    {
                        "latitude": -89.4805270109061,
                        "longitude": -179.99999999999923
                    },
                    {
                        "latitude": -89.60847300448839,
                        "longitude": -179.99999999999898
                    },
                    {
                        "latitude": -89.73637360903246,
                        "longitude": -179.99999999999847
                    },
                    {
                        "latitude": -89.86424158257789,
                        "longitude": -179.99999999999704
                    },
                    {
                        "latitude": -89.99208966888702,
                        "longitude": -179.99999999994918
                    },
                    {
                        "latitude": -90,
                        "longitude": -180
                    },
                    {
                        "latitude": 90,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.87215909090881,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.74431181732949,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.6164454491398,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.48854725089888,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.36060447702006,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.2326043669483,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.10453414032345,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.97638099212966,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.84813208783008,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.71977455847643,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.59129549579664,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.46268194725344,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.33392091106938,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.2049993312171,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.07590409236822,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.94662201479971,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.81713984925088,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.68744427172963,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.5575218782625,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.42735917958343,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.29694259575992,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.1662584507491,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.03529296688193,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.90403225926869,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.77246233012377,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.64056906300249,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.50833821694759,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.37575542053854,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.24280616584049,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.10947580224548,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.97574953020343,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.84161239483505,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.7070492794228,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.57204489877324,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.4365837924456,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.30065031784005,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.16422864313981,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.02730274010058,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.88985637668107,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.7518731095069,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.61333627616263,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.47422898730257,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.33453411857462,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.19423430234929,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.05331191924462,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.91174908944046,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.76952766377306,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.62662921460064,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.48303502643166,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.33872608630637,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.19368307392106,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.0478863514866,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.90131595330878,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.75395157508196,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.60577256288295,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.45675790185462,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.306886204567,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.1561356990436,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.00448421643958,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.85190917835924,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.69838758379788,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.54389599569521,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.38841052708345,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.23190682681651,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.0743600648631,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.91574491714731,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.7560355499196,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.59520560364027,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.43322817635615,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.27007580655234,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.10572045545752,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.94013348878327,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.77328565787472,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.60514708025077,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.43568721951023,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.26487486457944,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.09267810827666,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.91906432516674,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.74400014867915,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.56745144746101,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.3893833009359,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.20975997403845,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.0285448910927,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.84570060880169,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.66118878831477,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.47497016633683,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.2870045252433,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.09725066216313,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.9056663569904,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.71220833928372,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.51683225401193,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.31949262610165,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.12014282374227,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.91873502040113,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.71522015550102,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.50954789370948,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.30166658278891,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.09152320995382,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.87906335668025,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.66423115191074,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.44696922359661,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.22721864851722,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.00491890031441,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.78000779567883,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.55242143862316,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.32209416277513,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.0889584716226,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.85294497664098,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.61398233323177,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.37199717440069,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.12691404210162,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.8786553161727,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.62714114079004,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.3722893483636,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.11401538080054,
                        "longitude": -180
                    },
                    {
                        "latitude": 70.85223220806122,
                        "longitude": -180
                    },
                    {
                        "latitude": 70.58685024393353,
                        "longitude": -180
                    },
                    {
                        "latitude": 70.3177772589527,
                        "longitude": -180
                    },
                    {
                        "latitude": 70.04491829039551,
                        "longitude": -180
                    },
                    {
                        "latitude": 69.76817554927966,
                        "longitude": -180
                    },
                    {
                        "latitude": 69.4874483243026,
                        "longitude": -180
                    },
                    {
                        "latitude": 69.2026328826575,
                        "longitude": -180
                    },
                    {
                        "latitude": 68.91362236766926,
                        "longitude": -180
                    },
                    {
                        "latitude": 68.62030669319854,
                        "longitude": -180
                    },
                    {
                        "latitude": 68.3225724347693,
                        "longitude": -180
                    },
                    {
                        "latitude": 68.02030271738332,
                        "longitude": -180
                    },
                    {
                        "latitude": 67.71337709999462,
                        "longitude": -180
                    },
                    {
                        "latitude": 67.40167145662869,
                        "longitude": -180
                    },
                    {
                        "latitude": 67.08505785414408,
                        "longitude": -180
                    },
                    {
                        "latitude": 66.7634044266493,
                        "longitude": -180
                    },
                    {
                        "latitude": 66.436575246606,
                        "longitude": -180
                    },
                    {
                        "latitude": 66.10443019266958,
                        "longitude": -180
                    },
                    {
                        "latitude": 65.76682481434122,
                        "longitude": -180
                    },
                    {
                        "latitude": 65.42361019353231,
                        "longitude": -180
                    },
                    {
                        "latitude": 65.0746328031723,
                        "longitude": -180
                    },
                    {
                        "latitude": 64.71973436302504,
                        "longitude": -180
                    },
                    {
                        "latitude": 64.35875169291738,
                        "longitude": -180
                    },
                    {
                        "latitude": 63.991516563628146,
                        "longitude": -180
                    },
                    {
                        "latitude": 63.61785554573361,
                        "longitude": -180
                    },
                    {
                        "latitude": 63.23758985676242,
                        "longitude": -180
                    },
                    {
                        "latitude": 62.85053520707411,
                        "longitude": -180
                    },
                    {
                        "latitude": 62.4565016449452,
                        "longitude": -180
                    },
                    {
                        "latitude": 62.05529340142515,
                        "longitude": -180
                    },
                    {
                        "latitude": 61.646708735610844,
                        "longitude": -180
                    },
                    {
                        "latitude": 61.23053978108492,
                        "longitude": -180
                    },
                    {
                        "latitude": 60.806572394372054,
                        "longitude": -180
                    },
                    {
                        "latitude": 60.37458600638521,
                        "longitude": -180
                    },
                    {
                        "latitude": 59.93435347796726,
                        "longitude": -180
                    },
                    {
                        "latitude": 59.48564096077986,
                        "longitude": -180
                    },
                    {
                        "latitude": 59.02820776495211,
                        "longitude": -180
                    },
                    {
                        "latitude": 58.56180623508028,
                        "longitude": -180
                    },
                    {
                        "latitude": 58.086181636365154,
                        "longitude": -180
                    },
                    {
                        "latitude": 57.60107205288721,
                        "longitude": -180
                    },
                    {
                        "latitude": 57.10620830025539,
                        "longitude": -180
                    },
                    {
                        "latitude": 56.60131385511945,
                        "longitude": -180
                    },
                    {
                        "latitude": 56.086104804314836,
                        "longitude": -180
                    },
                    {
                        "latitude": 55.56028981670963,
                        "longitude": -180
                    },
                    {
                        "latitude": 55.023570141149015,
                        "longitude": -180
                    },
                    {
                        "latitude": 54.47563963424276,
                        "longitude": -180
                    },
                    {
                        "latitude": 53.91618482211631,
                        "longitude": -180
                    },
                    {
                        "latitude": 53.344885000647025,
                        "longitude": -180
                    },
                    {
                        "latitude": 52.76141237913118,
                        "longitude": -180
                    },
                    {
                        "latitude": 52.1654322727752,
                        "longitude": -180
                    },
                    {
                        "latitude": 51.556603349873875,
                        "longitude": -180
                    },
                    {
                        "latitude": 50.93457794002456,
                        "longitude": -180
                    },
                    {
                        "latitude": 50.2990024102275,
                        "longitude": -180
                    },
                    {
                        "latitude": 49.649517616231584,
                        "longitude": -180
                    },
                    {
                        "latitude": 48.98575943699499,
                        "longitude": -180
                    },
                    {
                        "latitude": 48.30735940063275,
                        "longitude": -180
                    },
                    {
                        "latitude": 47.61394541070731,
                        "longitude": -180
                    },
                    {
                        "latitude": 46.9051425821681,
                        "longitude": -180
                    },
                    {
                        "latitude": 46.18057419664904,
                        "longitude": -180
                    },
                    {
                        "latitude": 45.43986278716493,
                        "longitude": -180
                    },
                    {
                        "latitude": 44.68263136248978,
                        "longitude": -180
                    },
                    {
                        "latitude": 43.9085047816228,
                        "longitude": -180
                    },
                    {
                        "latitude": 43.11711128872247,
                        "longitude": -180
                    },
                    {
                        "latitude": 42.30808421867937,
                        "longitude": -180
                    },
                    {
                        "latitude": 41.48106388306879,
                        "longitude": -180
                    },
                    {
                        "latitude": 40.63569964552826,
                        "longitude": -180
                    },
                    {
                        "latitude": 39.77165219460131,
                        "longitude": -180
                    },
                    {
                        "latitude": 38.88859602072614,
                        "longitude": -180
                    },
                    {
                        "latitude": 37.98622210227708,
                        "longitude": -180
                    },
                    {
                        "latitude": 37.064240803337775,
                        "longitude": -180
                    },
                    {
                        "latitude": 36.12238498314887,
                        "longitude": -180
                    },
                    {
                        "latitude": 35.1604133138854,
                        "longitude": -180
                    },
                    {
                        "latitude": 34.17811379954219,
                        "longitude": -180
                    },
                    {
                        "latitude": 33.17530748421366,
                        "longitude": -180
                    },
                    {
                        "latitude": 32.15185233293454,
                        "longitude": -180
                    },
                    {
                        "latitude": 31.10764726250962,
                        "longitude": -180
                    },
                    {
                        "latitude": 30.042636293435397,
                        "longitude": -180
                    },
                    {
                        "latitude": 28.95681278716794,
                        "longitude": -180
                    },
                    {
                        "latitude": 27.850223725718042,
                        "longitude": -180
                    },
                    {
                        "latitude": 26.722973982994613,
                        "longitude": -180
                    },
                    {
                        "latitude": 25.575230529653872,
                        "longitude": -180
                    },
                    {
                        "latitude": 24.407226505672643,
                        "longitude": -180
                    },
                    {
                        "latitude": 23.21926508772611,
                        "longitude": -180
                    },
                    {
                        "latitude": 22.01172307203025,
                        "longitude": -180
                    },
                    {
                        "latitude": 20.78505408796594,
                        "longitude": -180
                    },
                    {
                        "latitude": 19.53979135391726,
                        "longitude": -180
                    },
                    {
                        "latitude": 18.276549884728077,
                        "longitude": -180
                    },
                    {
                        "latitude": 16.996028060399514,
                        "longitude": -180
                    },
                    {
                        "latitude": 15.699008468476416,
                        "longitude": -180
                    },
                    {
                        "latitude": 14.386357938308839,
                        "longitude": -180
                    },
                    {
                        "latitude": 13.05902669424647,
                        "longitude": -180
                    },
                    {
                        "latitude": 11.718046566936918,
                        "longitude": -180
                    },
                    {
                        "latitude": 10.364528217222478,
                        "longitude": -180
                    },
                    {
                        "latitude": 8.999657345473572,
                        "longitude": -180
                    },
                    {
                        "latitude": 7.6246898801941345,
                        "longitude": -180
                    },
                    {
                        "latitude": 6.240946162843605,
                        "longitude": -180
                    },
                    {
                        "latitude": 4.849804170330018,
                        "longitude": -180
                    },
                    {
                        "latitude": 3.452691841683257,
                        "longitude": -180
                    },
                    {
                        "latitude": 2.051078600052479,
                        "longitude": -180
                    },
                    {
                        "latitude": 0.6464661843600312,
                        "longitude": -180
                    },
                    {
                        "latitude": 0.3232330921800156,
                        "longitude": -180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 215,
                            "linkTo": 284
                        },
                        "69": {
                            "visited": false,
                            "forPole": false,
                            "index": 284,
                            "linkTo": 215
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 285,
                            "linkTo": 214
                        },
                        "360": {
                            "visited": false,
                            "forPole": false,
                            "index": 214,
                            "linkTo": 285
                        }
                    }
                }
            ]
        }
    ];
    var polyLineOutput = transformOutputData(polyLineRawOutput);

    var polygonOverTheGlobeRawInput = [
        [
            {
                "latitude": 45.05,
                "longitude": 168.79,
                "altitude": 100000
            },
            {
                "latitude": 45.162445984078516,
                "longitude": 169.90852249367853
            },
            {
                "latitude": 45.26361806824381,
                "longitude": 171.02756862793237
            },
            {
                "latitude": 45.35357444528224,
                "longitude": 172.14706806924687
            },
            {
                "latitude": 45.432367533602715,
                "longitude": 173.26694951645248
            },
            {
                "latitude": 45.50004397169657,
                "longitude": 174.38714082241373
            },
            {
                "latitude": 45.556644615373166,
                "longitude": 175.5075691184693
            },
            {
                "latitude": 45.60220453722235,
                "longitude": 176.62816094127672
            },
            {
                "latitude": 45.6367530278342,
                "longitude": 177.74884236170126
            },
            {
                "latitude": 45.660313598382146,
                "longitude": 178.86953911538254
            },
            {
                "latitude": 45.672903984248585,
                "longitude": 179.99017673460273
            },
            {
                "latitude": 45.67453614944354,
                "longitude": -178.88931931892276
            },
            {
                "latitude": 45.66521629163528,
                "longitude": -177.7690235207158
            },
            {
                "latitude": 45.64494484768027,
                "longitude": -176.64901015005094
            },
            {
                "latitude": 45.61371649960556,
                "longitude": -175.52935315669936
            },
            {
                "latitude": 45.57152018106362,
                "longitude": -174.41012602828044
            },
            {
                "latitude": 45.518339084344596,
                "longitude": -173.29140165859704
            },
            {
                "latitude": 45.45415066809756,
                "longitude": -172.17325221732077
            },
            {
                "latitude": 45.37892666597821,
                "longitude": -171.05574902138775
            },
            {
                "latitude": 45.292633096508695,
                "longitude": -169.93896240845103
            },
            {
                "latitude": 45.19523027450345,
                "longitude": -168.82296161272654
            },
            {
                "latitude": 45.08667282448599,
                "longitude": -167.7078146435526
            },
            {
                "latitude": 44.966909696594065,
                "longitude": -166.59358816696925
            },
            {
                "latitude": 44.93,
                "longitude": -166.27,
                "altitude": 100000
            },
            {
                "latitude": 44.905946465903504,
                "longitude": -165.1669661717937
            },
            {
                "latitude": 44.87125770577928,
                "longitude": -164.0642894031634
            },
            {
                "latitude": 44.82592154535681,
                "longitude": -162.9620365316124
            },
            {
                "latitude": 44.769920587292475,
                "longitude": -161.8602738195306
            },
            {
                "latitude": 44.70323222092174,
                "longitude": -160.7590668400568
            },
            {
                "latitude": 44.6258286336366,
                "longitude": -159.65848036448378
            },
            {
                "latitude": 44.5376768241639,
                "longitude": -158.55857825149528
            },
            {
                "latitude": 44.43873861808192,
                "longitude": -157.45942333851212
            },
            {
                "latitude": 44.32897068597499,
                "longitude": -156.36107733541394
            },
            {
                "latitude": 44.2083245646905,
                "longitude": -155.26360072088968
            },
            {
                "latitude": 44.076746682229384,
                "longitude": -154.16705264165532
            },
            {
                "latitude": 43.93417838686923,
                "longitude": -153.07149081476348
            },
            {
                "latitude": 43.78055598119138,
                "longitude": -151.97697143321275
            },
            {
                "latitude": 43.61581076175648,
                "longitude": -150.88354907504882
            },
            {
                "latitude": 43.43986906525049,
                "longitude": -149.79127661613109
            },
            {
                "latitude": 43.25265232200283,
                "longitude": -148.70020514672316
            },
            {
                "latitude": 43.05407711786161,
                "longitude": -147.61038389204543
            },
            {
                "latitude": 42.844055265497325,
                "longitude": -146.52186013691116
            },
            {
                "latitude": 42.62249388629612,
                "longitude": -145.43467915454988
            },
            {
                "latitude": 42.38929550409682,
                "longitude": -144.34888413970285
            },
            {
                "latitude": 42.14435815212137,
                "longitude": -143.26451614605833
            },
            {
                "latitude": 41.8875754945481,
                "longitude": -142.1816140280775
            },
            {
                "latitude": 41.61883696427767,
                "longitude": -141.100214387244
            },
            {
                "latitude": 41.33802791854569,
                "longitude": -140.0203515227553
            },
            {
                "latitude": 41.13,
                "longitude": -139.25,
                "altitude": 100000
            },
            {
                "latitude": 40.801100965252864,
                "longitude": -138.20411487943306
            },
            {
                "latitude": 40.459932135128824,
                "longitude": -137.15991579496585
            },
            {
                "latitude": 40.106358140928116,
                "longitude": -136.1174212093485
            },
            {
                "latitude": 39.740241145226086,
                "longitude": -135.07664716839918
            },
            {
                "latitude": 39.36144117050304,
                "longitude": -134.0376072898197
            },
            {
                "latitude": 38.969816461936325,
                "longitude": -133.0003127556497
            },
            {
                "latitude": 38.56522388678592,
                "longitude": -131.96477230826713
            },
            {
                "latitude": 38.147519372854816,
                "longitude": -130.93099224984047
            },
            {
                "latitude": 37.71655838853707,
                "longitude": -129.8989764451353
            },
            {
                "latitude": 37.272196466978066,
                "longitude": -128.8687263275784
            },
            {
                "latitude": 36.814289776855674,
                "longitude": -127.84024090848342
            },
            {
                "latitude": 36.34269574224645,
                "longitude": -126.81351678934409
            },
            {
                "latitude": 35.85727371396084,
                "longitude": -125.78854817710443
            },
            {
                "latitude": 35.38,
                "longitude": -124.81,
                "altitude": 100000
            },
            {
                "latitude": 35.219049224155555,
                "longitude": -123.58185456973266
            },
            {
                "latitude": 35.04512418843778,
                "longitude": -122.35452773163412
            },
            {
                "latitude": 34.85817733011977,
                "longitude": -121.12806061521944
            },
            {
                "latitude": 34.658158181681735,
                "longitude": -119.90249274740061
            },
            {
                "latitude": 34.44501360015003,
                "longitude": -118.67786197311102
            },
            {
                "latitude": 34.21868801864212,
                "longitude": -117.45420437964488
            },
            {
                "latitude": 33.97912372134099,
                "longitude": -116.23155422486289
            },
            {
                "latitude": 33.726261143173176,
                "longitude": -115.00994386940144
            },
            {
                "latitude": 33.46003919550518,
                "longitude": -113.78940371300887
            },
            {
                "latitude": 33.18039561920333,
                "longitude": -112.56996213511742
            },
            {
                "latitude": 32.88726736641966,
                "longitude": -111.35164543974814
            },
            {
                "latitude": 32.58059101246843,
                "longitude": -110.13447780483047
            },
            {
                "latitude": 32.2603031991452,
                "longitude": -108.91848123600826
            },
            {
                "latitude": 31.926341110805915,
                "longitude": -107.70367552499036
            },
            {
                "latitude": 31.578642984470143,
                "longitude": -106.49007821249413
            },
            {
                "latitude": 31.217148655133375,
                "longitude": -105.27770455581881
            },
            {
                "latitude": 30.841800137367663,
                "longitude": -104.06656750107749
            },
            {
                "latitude": 30.47,
                "longitude": -102.91,
                "altitude": 100000
            },
            {
                "latitude": 30.08041915448742,
                "longitude": -101.78807062530166
            },
            {
                "latitude": 29.678549628538022,
                "longitude": -100.66726263257898
            },
            {
                "latitude": 29.264355436121818,
                "longitude": -99.54757771085988
            },
            {
                "latitude": 28.837805241747223,
                "longitude": -98.42901573075186
            },
            {
                "latitude": 28.39887296198791,
                "longitude": -97.31157474721662
            },
            {
                "latitude": 27.947538392887214,
                "longitude": -96.19525100539286
            },
            {
                "latitude": 27.483787862465228,
                "longitude": -95.08003894945038
            },
            {
                "latitude": 27.007614907259274,
                "longitude": -93.96593123445707
            },
            {
                "latitude": 26.519020971504798,
                "longitude": -92.85291874123978
            },
            {
                "latitude": 26.018016127212135,
                "longitude": -91.7409905942182
            },
            {
                "latitude": 25.50461981301463,
                "longitude": -90.6301341821902
            },
            {
                "latitude": 24.978861589257644,
                "longitude": -89.52033518204597
            },
            {
                "latitude": 24.440781906367516,
                "longitude": -88.41157758538654
            },
            {
                "latitude": 23.890432883087676,
                "longitude": -87.30384372802064
            },
            {
                "latitude": 23.32787909069977,
                "longitude": -86.19711432231188
            },
            {
                "latitude": 22.753198338865218,
                "longitude": -85.0913684923452
            },
            {
                "latitude": 22.16648245823332,
                "longitude": -83.98658381187848
            },
            {
                "latitude": 22.05,
                "longitude": -83.77,
                "altitude": 100000
            },
            {
                "latitude": 21.762645000160607,
                "longitude": -82.48322566182124
            },
            {
                "latitude": 21.46428557025922,
                "longitude": -81.19705188180609
            },
            {
                "latitude": 21.154975156123403,
                "longitude": -79.91148403824785
            },
            {
                "latitude": 20.834772616900725,
                "longitude": -78.62652624346248
            },
            {
                "latitude": 20.503742592561643,
                "longitude": -77.34218133455637
            },
            {
                "latitude": 20.16195587750905,
                "longitude": -76.05845086706204
            },
            {
                "latitude": 19.80948979883459,
                "longitude": -74.77533511146147
            },
            {
                "latitude": 19.44642859761517,
                "longitude": -73.49283305261052
            },
            {
                "latitude": 19.07286381149345,
                "longitude": -72.21094239207035
            },
            {
                "latitude": 18.68889465663452,
                "longitude": -70.92965955334593
            },
            {
                "latitude": 18.29462840699976,
                "longitude": -69.64897969002406
            },
            {
                "latitude": 17.890180768728953,
                "longitude": -68.3688966967972
            },
            {
                "latitude": 17.475676247276706,
                "longitude": -67.08940322335128
            },
            {
                "latitude": 17.051248504809863,
                "longitude": -65.81049069108971
            },
            {
                "latitude": 16.617040705243046,
                "longitude": -64.53214931265734
            },
            {
                "latitude": 16.35,
                "longitude": -63.76,
                "altitude": 100000
            },
            {
                "latitude": 16.308602554036796,
                "longitude": -62.36444744667482
            },
            {
                "latitude": 16.258027490842807,
                "longitude": -60.969017297681766
            },
            {
                "latitude": 16.198293681146005,
                "longitude": -59.57372137786535
            },
            {
                "latitude": 16.1294233001283,
                "longitude": -58.178571202552725
            },
            {
                "latitude": 16.051441873010724,
                "longitude": -56.783577949303385
            },
            {
                "latitude": 15.964378327971179,
                "longitude": -55.38875243041063
            },
            {
                "latitude": 15.868265056157098,
                "longitude": -53.99410506622971
            },
            {
                "latitude": 15.763137978520568,
                "longitude": -52.599645859405456
            },
            {
                "latitude": 15.649036619168282,
                "longitude": -51.20538437007002
            },
            {
                "latitude": 15.526004184882684,
                "longitude": -49.81132969207946
            },
            {
                "latitude": 15.394087650434347,
                "longitude": -48.417490430355166
            },
            {
                "latitude": 15.253337849268554,
                "longitude": -47.02387467939348
            },
            {
                "latitude": 15.103809569111492,
                "longitude": -45.63049000300415
            },
            {
                "latitude": 14.945561652003652,
                "longitude": -44.23734341533471
            },
            {
                "latitude": 14.778657098229715,
                "longitude": -42.84444136323518
            },
            {
                "latitude": 14.603163173575943,
                "longitude": -41.45178971001321
            },
            {
                "latitude": 14.59,
                "longitude": -41.35,
                "altitude": 100000
            },
            {
                "latitude": 14.371485994038242,
                "longitude": -39.95898292627045
            },
            {
                "latitude": 14.144457609321579,
                "longitude": -38.56826101571263
            },
            {
                "latitude": 13.909011485645832,
                "longitude": -37.17783647084088
            },
            {
                "latitude": 13.665249550151188,
                "longitude": -35.787710779342156
            },
            {
                "latitude": 13.413279146463523,
                "longitude": -34.39788471017763
            },
            {
                "latitude": 13.15321316037739,
                "longitude": -33.008358311506456
            },
            {
                "latitude": 12.885170141065164,
                "longitude": -31.619130910439743
            },
            {
                "latitude": 12.609274416770473,
                "longitude": -30.230201114627892
            },
            {
                "latitude": 12.325656203922252,
                "longitude": -28.84156681567873
            },
            {
                "latitude": 12.034451708589268,
                "longitude": -27.45322519439895
            },
            {
                "latitude": 11.735803219184303,
                "longitude": -26.06517272784577
            },
            {
                "latitude": 11.429859189323231,
                "longitude": -24.677405198170206
            },
            {
                "latitude": 11.116774309747031,
                "longitude": -23.28991770322847
            },
            {
                "latitude": 10.796709568225836,
                "longitude": -21.902704668932284
            },
            {
                "latitude": 10.58,
                "longitude": -20.98,
                "altitude": 100000
            },
            {
                "latitude": 10.53489395287648,
                "longitude": -19.568690801344736
            },
            {
                "latitude": 10.483526830772348,
                "longitude": -18.15744816441764
            },
            {
                "latitude": 10.42592473591608,
                "longitude": -16.746276720885565
            },
            {
                "latitude": 10.362116966949008,
                "longitude": -15.335180930940624
            },
            {
                "latitude": 10.292136029570235,
                "longitude": -13.924165072259157
            },
            {
                "latitude": 10.216017648093917,
                "longitude": -12.513233229397484
            },
            {
                "latitude": 10.133800777770517,
                "longitude": -11.10238928365235
            },
            {
                "latitude": 10.04552761770995,
                "longitude": -9.691636903413059
            },
            {
                "latitude": 9.951243624231278,
                "longitude": -8.28097953503076
            },
            {
                "latitude": 9.85099752445103,
                "longitude": -6.870420394229535
            },
            {
                "latitude": 9.74484132991028,
                "longitude": -5.459962458082139
            },
            {
                "latitude": 9.632830350029304,
                "longitude": -4.04960845757211
            },
            {
                "latitude": 9.515023205168182,
                "longitude": -2.6393608707624288
            },
            {
                "latitude": 9.391481839062068,
                "longitude": -1.2292219165891798
            },
            {
                "latitude": 9.34,
                "longitude": -0.66,
                "altitude": 100000
            },
            {
                "latitude": 9.291663707072388,
                "longitude": 0.7423531799770737
            },
            {
                "latitude": 9.237845874653944,
                "longitude": 2.1446493320227273
            },
            {
                "latitude": 9.178574631218114,
                "longitude": 3.5468850856214083
            },
            {
                "latitude": 9.113880999176594,
                "longitude": 4.949057214400045
            },
            {
                "latitude": 9.043798898948806,
                "longitude": 6.35116264399656
            },
            {
                "latitude": 8.968365153101278,
                "longitude": 7.7531984595658425
            },
            {
                "latitude": 8.887619490439672,
                "longitude": 9.155161912903843
            },
            {
                "latitude": 8.801604549927593,
                "longitude": 10.557050429171307
            },
            {
                "latitude": 8.710365884298225,
                "longitude": 11.958861613199735
            },
            {
                "latitude": 8.613951963217263,
                "longitude": 13.360593255363055
            },
            {
                "latitude": 8.512414175848638,
                "longitude": 14.76224333699971
            },
            {
                "latitude": 8.405806832668272,
                "longitude": 16.163810035370858
            },
            {
                "latitude": 8.2941871663653,
                "longitude": 17.5652917281417
            },
            {
                "latitude": 8.17761533166545,
                "longitude": 18.966686997373987
            },
            {
                "latitude": 8.056154403906937,
                "longitude": 20.367994633019205
            },
            {
                "latitude": 7.929870376196041,
                "longitude": 21.76921363590308
            },
            {
                "latitude": 7.798832154966921,
                "longitude": 23.17034322019332
            },
            {
                "latitude": 7.75,
                "longitude": 23.68,
                "altitude": 100000
            },
            {
                "latitude": 7.606920492955011,
                "longitude": 25.02766289552982
            },
            {
                "latitude": 7.459593500000227,
                "longitude": 26.37523723801705
            },
            {
                "latitude": 7.308094765293547,
                "longitude": 27.722723252659478
            },
            {
                "latitude": 7.152502554942437,
                "longitude": 29.070121361597778
            },
            {
                "latitude": 6.992897641705337,
                "longitude": 30.417432182960184
            },
            {
                "latitude": 6.829363287225959,
                "longitude": 31.7646565294605
            },
            {
                "latitude": 6.661985221669653,
                "longitude": 33.111795406553
            },
            {
                "latitude": 6.4908516206369775,
                "longitude": 34.45885001014852
            },
            {
                "latitude": 6.316053079236235,
                "longitude": 35.805821723897246
            },
            {
                "latitude": 6.137682583204335,
                "longitude": 37.152712116044945
            },
            {
                "latitude": 5.9558354769736805,
                "longitude": 38.49952293587001
            },
            {
                "latitude": 5.770609428592,
                "longitude": 39.846256109710176
            },
            {
                "latitude": 5.582104391412024,
                "longitude": 41.1929137365884
            },
            {
                "latitude": 5.55,
                "longitude": 41.42,
                "altitude": 100000
            },
            {
                "latitude": 5.1706849656592775,
                "longitude": 42.743446966547765
            },
            {
                "latitude": 4.788196655582181,
                "longitude": 44.066795302030975
            },
            {
                "latitude": 4.402760483758108,
                "longitude": 45.39005658888956
            },
            {
                "latitude": 4.014605406294311,
                "longitude": 46.71324258671639
            },
            {
                "latitude": 3.623963691859021,
                "longitude": 48.03636520613299
            },
            {
                "latitude": 3.231070679234662,
                "longitude": 49.35943648243123
            },
            {
                "latitude": 2.8361645227206744,
                "longitude": 50.68246854904579
            },
            {
                "latitude": 2.439485926215193,
                "longitude": 52.005473610921946
            },
            {
                "latitude": 2.041277866889731,
                "longitude": 53.32846391784215
            },
            {
                "latitude": 1.6417853094504968,
                "longitude": 54.65145173777429
            },
            {
                "latitude": 1.2412549120528633,
                "longitude": 55.974449330303216
            },
            {
                "latitude": 0.8399347250011278,
                "longitude": 57.29746892020584
            },
            {
                "latitude": 0.43807388342306175,
                "longitude": 58.62052267122835
            },
            {
                "latitude": 0.42,
                "longitude": 58.68,
                "altitude": 100000
            },
            {
                "latitude": 0.1312058557000989,
                "longitude": 60.02661733483624
            },
            {
                "latitude": -0.1576734932237227,
                "longitude": 61.37326294494172
            },
            {
                "latitude": -0.4464651325262332,
                "longitude": 62.71994306455879
            },
            {
                "latitude": -0.7349961970990935,
                "longitude": 64.06666384801247
            },
            {
                "latitude": -1.0230940336234355,
                "longitude": 65.41343135623265
            },
            {
                "latitude": -1.3105863627295355,
                "longitude": 66.76025154351333
            },
            {
                "latitude": -1.5973014401917067,
                "longitude": 68.10713024453669
            },
            {
                "latitude": -1.883068216692228,
                "longitude": 69.45407316168843
            },
            {
                "latitude": -2.167716495696663,
                "longitude": 70.80108585269028
            },
            {
                "latitude": -2.4510770889943183,
                "longitude": 72.14817371857447
            },
            {
                "latitude": -2.7329819694716715,
                "longitude": 73.49534199202387
            },
            {
                "latitude": -3.0132644207031927,
                "longitude": 74.84259572610064
            },
            {
                "latitude": -3.2917591829631574,
                "longitude": 76.18993978338544
            },
            {
                "latitude": -3.5683025952832748,
                "longitude": 77.53737882554755
            },
            {
                "latitude": -3.8427327332044183,
                "longitude": 78.88491730336597
            },
            {
                "latitude": -4.114889541895956,
                "longitude": 80.23255944722005
            },
            {
                "latitude": -4.38461496434308,
                "longitude": 81.5803092580673
            },
            {
                "latitude": -4.6517530643308,
                "longitude": 82.9281704989247
            },
            {
                "latitude": -4.66,
                "longitude": 82.97,
                "altitude": 100000
            },
            {
                "latitude": -4.7447249689157,
                "longitude": 84.35397183956368
            },
            {
                "latitude": -4.826675887842586,
                "longitude": 85.73797192690195
            },
            {
                "latitude": -4.905806390639645,
                "longitude": 87.12199940515688
            },
            {
                "latitude": -4.982071785343774,
                "longitude": 88.50605335368314
            },
            {
                "latitude": -5.055429072620781,
                "longitude": 89.8901327901751
            },
            {
                "latitude": -5.125836963126566,
                "longitude": 91.27423667293692
            },
            {
                "latitude": -5.193255893808497,
                "longitude": 92.65836390329088
            },
            {
                "latitude": -5.2576480431778,
                "longitude": 94.04251332811808
            },
            {
                "latitude": -5.318977345584293,
                "longitude": 95.42668374252625
            },
            {
                "latitude": -5.377209504525227,
                "longitude": 96.8108738926384
            },
            {
                "latitude": -5.432312005019986,
                "longitude": 98.19508247849585
            },
            {
                "latitude": -5.484254125082432,
                "longitude": 99.57930815706952
            },
            {
                "latitude": -5.533006946322294,
                "longitude": 100.96354954537216
            },
            {
                "latitude": -5.57854336370654,
                "longitude": 102.34780522366485
            },
            {
                "latitude": -5.620838094510983,
                "longitude": 103.73207373875013
            },
            {
                "latitude": -5.659867686491444,
                "longitude": 105.11635360734452
            },
            {
                "latitude": -5.695610525302801,
                "longitude": 106.5006433195225
            },
            {
                "latitude": -5.7,
                "longitude": 106.68,
                "altitude": 100000
            },
            {
                "latitude": -5.804685245916516,
                "longitude": 108.0673350464198
            },
            {
                "latitude": -5.905956090798152,
                "longitude": 109.45471317105881
            },
            {
                "latitude": -6.003755842867198,
                "longitude": 110.84213309188486
            },
            {
                "latitude": -6.098029900261976,
                "longitude": 112.22959342915931
            },
            {
                "latitude": -6.188725768850492,
                "longitude": 113.61709270862367
            },
            {
                "latitude": -6.275793078620314,
                "longitude": 115.00462936490601
            },
            {
                "latitude": -6.359183598709894,
                "longitude": 116.39220174513986
            },
            {
                "latitude": -6.438851251147551,
                "longitude": 117.77980811278734
            },
            {
                "latitude": -6.51475212336478,
                "longitude": 119.16744665165824
            },
            {
                "latitude": -6.586844479550706,
                "longitude": 120.55511547011584
            },
            {
                "latitude": -6.655088770914162,
                "longitude": 121.9428126054603
            },
            {
                "latitude": -6.719447644919258,
                "longitude": 123.33053602847993
            },
            {
                "latitude": -6.779885953559196,
                "longitude": 124.71828364815954
            },
            {
                "latitude": -6.836370760731699,
                "longitude": 126.10605331653596
            },
            {
                "latitude": -6.888871348777686,
                "longitude": 127.4938428336893
            },
            {
                "latitude": -6.937359224242709,
                "longitude": 128.88164995285882
            },
            {
                "latitude": -6.981808122918266,
                "longitude": 130.26947238567172
            },
            {
                "latitude": -6.99,
                "longitude": 130.54,
                "altitude": 100000
            },
            {
                "latitude": -6.847081062493092,
                "longitude": 131.91911189000936
            },
            {
                "latitude": -6.700153581785937,
                "longitude": 133.29814407772494
            },
            {
                "latitude": -6.5492980483449355,
                "longitude": 134.67709709371155
            },
            {
                "latitude": -6.394597459729946,
                "longitude": 136.0559716532469
            },
            {
                "latitude": -6.23613729599685,
                "longitude": 137.43476865462821
            },
            {
                "latitude": -6.074005492424694,
                "longitude": 138.8134891770439
            },
            {
                "latitude": -5.908292409459413,
                "longitude": 140.19213447801533
            },
            {
                "latitude": -5.739090799773673,
                "longitude": 141.57070599041532
            },
            {
                "latitude": -5.566495772350558,
                "longitude": 142.9492053190705
            },
            {
                "latitude": -5.3906047535080015,
                "longitude": 144.32763423695656
            },
            {
                "latitude": -5.211517444790548,
                "longitude": 145.7059946809954
            },
            {
                "latitude": -5.19,
                "longitude": 145.87,
                "altitude": 100000
            },
            {
                "latitude": -5.168266226856581,
                "longitude": 147.2554068663486
            },
            {
                "latitude": -5.143525818465448,
                "longitude": 148.6407986429562
            },
            {
                "latitude": -5.1157926671434115,
                "longitude": 150.02617429099502
            },
            {
                "latitude": -5.085082348963947,
                "longitude": 151.41153280927867
            },
            {
                "latitude": -5.051412117904111,
                "longitude": 152.79687323661494
            },
            {
                "latitude": -5.014800899331115,
                "longitude": 154.18219465406523
            },
            {
                "latitude": -4.975269282814366,
                "longitude": 155.56749618710575
            },
            {
                "latitude": -4.932839514247639,
                "longitude": 156.9527770076847
            },
            {
                "latitude": -4.887535487264966,
                "longitude": 158.3380363361708
            },
            {
                "latitude": -4.839382733932905,
                "longitude": 159.72327344318884
            },
            {
                "latitude": -4.788408414701,
                "longitude": 161.10848765133684
            },
            {
                "latitude": -4.734641307591549,
                "longitude": 162.49367833678184
            },
            {
                "latitude": -4.73,
                "longitude": 162.61,
                "altitude": 100000
            },
            {
                "latitude": -4.718579867993154,
                "longitude": 164.04161882369556
            },
            {
                "latitude": -4.704226900564926,
                "longitude": 165.4732273473579
            },
            {
                "latitude": -4.686949773840609,
                "longitude": 166.9048245489343
            },
            {
                "latitude": -4.666758927352452,
                "longitude": 168.33640943455742
            },
            {
                "latitude": -4.643666559410876,
                "longitude": 169.76798104103463
            },
            {
                "latitude": -4.617686621706534,
                "longitude": 171.19953843826127
            },
            {
                "latitude": -4.5888348131346115,
                "longitude": 172.63108073155183
            },
            {
                "latitude": -4.557128572831513,
                "longitude": 174.06260706388318
            },
            {
                "latitude": -4.522587072412914,
                "longitude": 175.49411661804393
            },
            {
                "latitude": -4.485231207401074,
                "longitude": 176.92560861868472
            },
            {
                "latitude": -4.4450835878283845,
                "longitude": 178.35708233426413
            },
            {
                "latitude": -4.402168528003134,
                "longitude": 179.7885370788851
            },
            {
                "latitude": -4.356512035422827,
                "longitude": -178.78002778598264
            },
            {
                "latitude": -4.308141798819642,
                "longitude": -177.34861284989864
            },
            {
                "latitude": -4.257087175322173,
                "longitude": -175.9172186519704
            },
            {
                "latitude": -4.203379176717105,
                "longitude": -174.48584567949837
            },
            {
                "latitude": -4.147050454794329,
                "longitude": -173.05449436675084
            },
            {
                "latitude": -4.088135285758802,
                "longitude": -171.62316509387185
            },
            {
                "latitude": -4.0266695536925035,
                "longitude": -170.19185818592484
            },
            {
                "latitude": -4.02,
                "longitude": -170.04,
                "altitude": 100000
            },
            {
                "latitude": -2.511772674275812,
                "longitude": -170.11482014080605
            },
            {
                "latitude": -0.9994174308358517,
                "longitude": -170.18967159861856
            },
            {
                "latitude": 0.5151657009116205,
                "longitude": -170.26456421886968
            },
            {
                "latitude": 2.030055620720154,
                "longitude": -170.3395076894293
            },
            {
                "latitude": 2.04,
                "longitude": -170.34,
                "altitude": 100000
            },
            {
                "latitude": 2.168947242831715,
                "longitude": -171.71525541105854
            },
            {
                "latitude": 2.296626828504608,
                "longitude": -173.09053732675162
            },
            {
                "latitude": 2.422964600890776,
                "longitude": -174.4658465229335
            },
            {
                "latitude": 2.5478872714181735,
                "longitude": -175.84118371266285
            },
            {
                "latitude": 2.6713224636943163,
                "longitude": -177.21654954457617
            },
            {
                "latitude": 2.793198757094416,
                "longitude": -178.5919446014079
            },
            {
                "latitude": 2.913445729279821,
                "longitude": -179.96736939866207
            },
            {
                "latitude": 3.0319939976161,
                "longitude": 178.65717561656282
            },
            {
                "latitude": 3.148775259463551,
                "longitude": 177.28169006659274
            },
            {
                "latitude": 3.2637223313164108,
                "longitude": 175.90617364403823
            },
            {
                "latitude": 3.3767691867705394,
                "longitude": 174.5306261124945
            },
            {
                "latitude": 3.4878509933028132,
                "longitude": 173.1550473070794
            },
            {
                "latitude": 3.5969041478488974,
                "longitude": 171.7794371348084
            },
            {
                "latitude": 3.6,
                "longitude": 171.74,
                "altitude": 100000
            },
            {
                "latitude": 5.096710222588534,
                "longitude": 171.58841361864594
            },
            {
                "latitude": 6.587991957960904,
                "longitude": 171.43666936838596
            },
            {
                "latitude": 8.072030780340135,
                "longitude": 171.28474919600794
            },
            {
                "latitude": 9.547063827271138,
                "longitude": 171.1326352952096
            },
            {
                "latitude": 11.011392257557635,
                "longitude": 170.98031008205402
            },
            {
                "latitude": 11.11,
                "longitude": 170.97,
                "altitude": 100000
            },
            {
                "latitude": 11.13243353951805,
                "longitude": 172.34431699736487
            },
            {
                "latitude": 11.148619654789343,
                "longitude": 173.7186246122317
            },
            {
                "latitude": 11.158551216272183,
                "longitude": 175.09291715208448
            },
            {
                "latitude": 11.162223995698602,
                "longitude": 176.46718895629138
            },
            {
                "latitude": 11.159636661574796,
                "longitude": 177.8414344091623
            },
            {
                "latitude": 11.150790776318614,
                "longitude": 179.2156479529262
            },
            {
                "latitude": 11.1356907950496,
                "longitude": -179.4101758994028
            },
            {
                "latitude": 11.114344066032611,
                "longitude": -178.03604255130062
            },
            {
                "latitude": 11.08676083276176,
                "longitude": -176.66195731018095
            },
            {
                "latitude": 11.052954237657087,
                "longitude": -175.28792537504506
            },
            {
                "latitude": 11.01294032733213,
                "longitude": -173.91395182436403
            },
            {
                "latitude": 10.96673805937642,
                "longitude": -172.54004160422312
            },
            {
                "latitude": 10.914369310582943,
                "longitude": -171.16619951675673
            },
            {
                "latitude": 10.855858886536804,
                "longitude": -169.79243020890303
            },
            {
                "latitude": 10.791234532467643,
                "longitude": -168.4187381615056
            },
            {
                "latitude": 10.720526945255084,
                "longitude": -167.0451276787898
            },
            {
                "latitude": 10.6437697864633,
                "longitude": -165.6716028782394
            },
            {
                "latitude": 10.560999696268054,
                "longitude": -164.29816768089938
            },
            {
                "latitude": 10.472256308127244,
                "longitude": -162.92482580212928
            },
            {
                "latitude": 10.37758226403382,
                "longitude": -161.55158074283037
            },
            {
                "latitude": 10.31,
                "longitude": -160.62,
                "altitude": 100000
            },
            {
                "latitude": 8.92869413767028,
                "longitude": -160.50134016486896
            },
            {
                "latitude": 7.537076993406277,
                "longitude": -160.38270311798402
            },
            {
                "latitude": 6.136524279639411,
                "longitude": -160.2640742508866
            },
            {
                "latitude": 4.7284720249415155,
                "longitude": -160.14543913582781
            },
            {
                "latitude": 3.314408339975556,
                "longitude": -160.02678353223638
            },
            {
                "latitude": 1.8958643206948051,
                "longitude": -159.9080933916048
            },
            {
                "latitude": 0.47440421550645834,
                "longitude": -159.78935486053993
            },
            {
                "latitude": -0.9483849941561854,
                "longitude": -159.67055428175962
            },
            {
                "latitude": -2.370904431621291,
                "longitude": -159.55167819286078
            },
            {
                "latitude": -3.791554398989379,
                "longitude": -159.43271332273545
            },
            {
                "latitude": -5.208745496932909,
                "longitude": -159.31364658556714
            },
            {
                "latitude": -6.620909597611988,
                "longitude": -159.19446507239834
            },
            {
                "latitude": -8.026510482002234,
                "longitude": -159.07515604032056
            },
            {
                "latitude": -9.42405396293284,
                "longitude": -158.95570689939373
            },
            {
                "latitude": -10.812097330687026,
                "longitude": -158.83610519745687
            },
            {
                "latitude": -12.189257978367062,
                "longitude": -158.71633860303632
            },
            {
                "latitude": -13.554221088395032,
                "longitude": -158.59639488659758
            },
            {
                "latitude": -14.905746288379031,
                "longitude": -158.47626190041473
            },
            {
                "latitude": -16.24267321291728,
                "longitude": -158.3559275573504
            },
            {
                "latitude": -17.56392593653336,
                "longitude": -158.2353798088475
            },
            {
                "latitude": -18.86851627070368,
                "longitude": -158.11460662243147
            },
            {
                "latitude": -20.1555459438513,
                "longitude": -157.9935959590132
            },
            {
                "latitude": -21.424207706419157,
                "longitude": -157.87233575026087
            },
            {
                "latitude": -22.673785423084414,
                "longitude": -157.75081387628637
            },
            {
                "latitude": -23.90365323043918,
                "longitude": -157.6290181438604
            },
            {
                "latitude": -25.113273850856,
                "longitude": -157.50693626533692
            },
            {
                "latitude": -26.30219616179476,
                "longitude": -157.38455583843293
            },
            {
                "latitude": -27.470052124666413,
                "longitude": -157.26186432697338
            },
            {
                "latitude": -28.6165531788637,
                "longitude": -157.1388490426775
            },
            {
                "latitude": -29.52,
                "longitude": -157.04,
                "altitude": 100000
            },
            {
                "latitude": -29.751829996616777,
                "longitude": -158.2877987240838
            },
            {
                "latitude": -29.971030193531632,
                "longitude": -159.53613824237934
            },
            {
                "latitude": -30.1776295993666,
                "longitude": -160.78498679401443
            },
            {
                "latitude": -30.371657534809653,
                "longitude": -162.03431157214362
            },
            {
                "latitude": -30.55314332141531,
                "longitude": -163.28407877959552
            },
            {
                "latitude": -30.72211599284778,
                "longitude": -164.53425368727693
            },
            {
                "latitude": -30.87860402797214,
                "longitude": -165.78480069523164
            },
            {
                "latitude": -31.022635105185298,
                "longitude": -167.03568339623928
            },
            {
                "latitude": -31.154235877375065,
                "longitude": -168.2868646418286
            },
            {
                "latitude": -31.273431766902036,
                "longitude": -169.53830661056713
            },
            {
                "latitude": -31.380246780013785,
                "longitude": -170.78997087847927
            },
            {
                "latitude": -31.474703340123472,
                "longitude": -172.04181849143515
            },
            {
                "latitude": -31.556822139413814,
                "longitude": -173.29381003934247
            },
            {
                "latitude": -31.626622008262444,
                "longitude": -174.54590573196586
            },
            {
                "latitude": -31.684119802023996,
                "longitude": -175.79806547619043
            },
            {
                "latitude": -31.729330304748867,
                "longitude": -177.05024895453926
            },
            {
                "latitude": -31.76226614946546,
                "longitude": -178.30241570474888
            },
            {
                "latitude": -31.782937754703724,
                "longitude": -179.55452520020157
            },
            {
                "latitude": -31.79135327699044,
                "longitude": 179.19346306899027
            },
            {
                "latitude": -31.78751857910119,
                "longitude": 177.94158951445638
            },
            {
                "latitude": -31.771437213910442,
                "longitude": 176.6898943678071
            },
            {
                "latitude": -31.74311042373738,
                "longitude": 175.43841759885083
            },
            {
                "latitude": -31.702537155143013,
                "longitude": 174.18719883400087
            },
            {
                "latitude": -31.649714089191047,
                "longitude": 172.9362772750845
            },
            {
                "latitude": -31.58463568724175,
                "longitude": 171.68569161876295
            },
            {
                "latitude": -31.5072942524042,
                "longitude": 170.43547997677018
            },
            {
                "latitude": -31.417680006826696,
                "longitude": 169.18567979717488
            },
            {
                "latitude": -31.34,
                "longitude": 168.22,
                "altitude": 100000
            },
            {
                "latitude": -30.380550164407328,
                "longitude": 168.30438207334805
            },
            {
                "latitude": -29.403988946154623,
                "longitude": 168.3885799866047
            },
            {
                "latitude": -28.410337973956313,
                "longitude": 168.4726028185868
            },
            {
                "latitude": -27.399656922039828,
                "longitude": 168.55645960625617
            },
            {
                "latitude": -26.372046107240884,
                "longitude": 168.64015934567965
            },
            {
                "latitude": -26.25,
                "longitude": 168.65,
                "altitude": 100000
            },
            {
                "latitude": -26.31946243974744,
                "longitude": 169.9619009779124
            },
            {
                "latitude": -26.376919101715004,
                "longitude": 171.2738420135415
            },
            {
                "latitude": -26.422373408298867,
                "longitude": 172.5857925787701
            },
            {
                "latitude": -26.455828872583943,
                "longitude": 173.89772206177534
            },
            {
                "latitude": -26.477289024351773,
                "longitude": 175.20959983228408
            },
            {
                "latitude": -26.486757353543343,
                "longitude": 176.52139530728323
            },
            {
                "latitude": -26.484237271099005,
                "longitude": 177.8330780170185
            },
            {
                "latitude": -26.469732087111073,
                "longitude": 179.14461767111393
            },
            {
                "latitude": -26.443245006239163,
                "longitude": -179.54401577535816
            },
            {
                "latitude": -26.404779140354112,
                "longitude": -178.23285205602684
            },
            {
                "latitude": -26.354337538391913,
                "longitude": -176.9219205277633
            },
            {
                "latitude": -26.291923233414913,
                "longitude": -175.61125010578337
            },
            {
                "latitude": -26.21753930689174,
                "longitude": -174.3008691994812
            },
            {
                "latitude": -26.131188970220524,
                "longitude": -172.9908056491621
            },
            {
                "latitude": -26.032875663530753,
                "longitude": -171.68108666384015
            },
            {
                "latitude": -25.92260317180683,
                "longitude": -170.3717387602638
            },
            {
                "latitude": -25.800375758380966,
                "longitude": -169.06278770332835
            },
            {
                "latitude": -25.666198315843385,
                "longitude": -167.75425844803104
            },
            {
                "latitude": -25.63,
                "longitude": -167.42,
                "altitude": 100000
            },
            {
                "latitude": -24.482387635591245,
                "longitude": -167.6361429029071
            },
            {
                "latitude": -23.31514670623538,
                "longitude": -167.8519186379265
            },
            {
                "latitude": -22.128633433031233,
                "longitude": -168.06735447676834
            },
            {
                "latitude": -20.923277366555695,
                "longitude": -168.28247757411572
            },
            {
                "latitude": -19.699584081210922,
                "longitude": -168.49731495871646
            },
            {
                "latitude": -18.458137367230126,
                "longitude": -168.71189352271676
            },
            {
                "latitude": -17.199600835946285,
                "longitude": -168.92624000936124
            },
            {
                "latitude": -15.924718856103349,
                "longitude": -169.14038099923258
            },
            {
                "latitude": -14.634316743780614,
                "longitude": -169.3543428952528
            },
            {
                "latitude": -13.329300136122962,
                "longitude": -169.56815190671642
            },
            {
                "latitude": -12.010653489641447,
                "longitude": -169.7818340326747
            },
            {
                "latitude": -10.679437657369693,
                "longitude": -169.9954150450332
            },
            {
                "latitude": -10.4,
                "longitude": -170.04,
                "altitude": 100000
            },
            {
                "latitude": -10.530935899551062,
                "longitude": -171.42235227892547
            },
            {
                "latitude": -10.655780955175954,
                "longitude": -172.8047939657111
            },
            {
                "latitude": -10.774474554638326,
                "longitude": -174.18732008561622
            },
            {
                "latitude": -10.886959468433949,
                "longitude": -175.56992546708264
            },
            {
                "latitude": -10.993181824681074,
                "longitude": -176.95260475340177
            },
            {
                "latitude": -11.093091083559434,
                "longitude": -178.3353524148237
            },
            {
                "latitude": -11.186640011570232,
                "longitude": -179.71816276108353
            },
            {
                "latitude": -11.273784655878107,
                "longitude": 178.89897004568152
            },
            {
                "latitude": -11.354484318984126,
                "longitude": 177.51605197765227
            },
            {
                "latitude": -11.428701533965702,
                "longitude": 176.13308912771268
            },
            {
                "latitude": -11.496402040505941,
                "longitude": 174.7500876955298
            },
            {
                "latitude": -11.557554761920663,
                "longitude": 173.36705397335916
            },
            {
                "latitude": -11.61213178337652,
                "longitude": 171.98399433160674
            },
            {
                "latitude": -11.660108331478582,
                "longitude": 170.60091520417978
            },
            {
                "latitude": -11.70146275538994,
                "longitude": 169.21782307365942
            },
            {
                "latitude": -11.736176509630047,
                "longitude": 167.83472445632876
            },
            {
                "latitude": -11.764234138682156,
                "longitude": 166.45162588709076
            },
            {
                "latitude": -11.785623263523691,
                "longitude": 165.06853390431058
            },
            {
                "latitude": -11.800334570176647,
                "longitude": 163.68545503461792
            },
            {
                "latitude": -11.80836180035821,
                "longitude": 162.30239577770445
            },
            {
                "latitude": -11.81,
                "longitude": 161.3,
                "altitude": 100000
            },
            {
                "latitude": -12.004469830733859,
                "longitude": 159.99045097305927
            },
            {
                "latitude": -12.192602065506398,
                "longitude": 158.68073988682497
            },
            {
                "latitude": -12.374317809747636,
                "longitude": 157.37087131068958
            },
            {
                "latitude": -12.549541762002724,
                "longitude": 156.06085014000612
            },
            {
                "latitude": -12.718202163997175,
                "longitude": 154.75068158651283
            },
            {
                "latitude": -12.880230748889106,
                "longitude": 153.44037116810634
            },
            {
                "latitude": -13.035562688119636,
                "longitude": 152.12992469798058
            },
            {
                "latitude": -13.18413653726211,
                "longitude": 150.8193482731474
            },
            {
                "latitude": -13.325894181259322,
                "longitude": 149.50864826235838
            },
            {
                "latitude": -13.460780779424924,
                "longitude": 148.19783129344756
            },
            {
                "latitude": -13.52,
                "longitude": 147.6,
                "altitude": 100000
            },
            {
                "latitude": -13.531492579019076,
                "longitude": 146.25792615540962
            },
            {
                "latitude": -13.535833573547858,
                "longitude": 144.91588018708856
            },
            {
                "latitude": -13.533021866841592,
                "longitude": 143.573869861648
            },
            {
                "latitude": -13.523059142126142,
                "longitude": 142.23190287260704
            },
            {
                "latitude": -13.50594988116989,
                "longitude": 140.8899868233551
            },
            {
                "latitude": -13.481701366146764,
                "longitude": 139.54812921027548
            },
            {
                "latitude": -13.450323684773208,
                "longitude": 138.20633740606843
            },
            {
                "latitude": -13.41182973868377,
                "longitude": 136.86461864331366
            },
            {
                "latitude": -13.366235254992308,
                "longitude": 135.52297999831043
            },
            {
                "latitude": -13.31355880096784,
                "longitude": 134.1814283752341
            },
            {
                "latitude": -13.253821801736349,
                "longitude": 132.83997049064672
            },
            {
                "latitude": -13.187048560902134,
                "longitude": 131.49861285839899
            },
            {
                "latitude": -13.113266283964595,
                "longitude": 130.15736177495992
            },
            {
                "latitude": -13.06,
                "longitude": 129.26,
                "altitude": 100000
            },
            {
                "latitude": -13.035473886587774,
                "longitude": 127.88129955321638
            },
            {
                "latitude": -13.003653270672086,
                "longitude": 126.50266551923059
            },
            {
                "latitude": -12.964552262974975,
                "longitude": 125.1241051954696
            },
            {
                "latitude": -12.918188101178991,
                "longitude": 123.74562571263559
            },
            {
                "latitude": -12.864581164814323,
                "longitude": 122.36723401786446
            },
            {
                "latitude": -12.80375499324708,
                "longitude": 120.9889368582844
            },
            {
                "latitude": -12.735736306646173,
                "longitude": 119.61074076501578
            },
            {
                "latitude": -12.660555029785785,
                "longitude": 118.23265203765344
            },
            {
                "latitude": -12.578244318520287,
                "longitude": 116.85467672927109
            },
            {
                "latitude": -12.488840588748364,
                "longitude": 115.4768206319862
            },
            {
                "latitude": -12.39238354766335,
                "longitude": 114.09908926312268
            },
            {
                "latitude": -12.34,
                "longitude": 113.39,
                "altitude": 100000
            },
            {
                "latitude": -12.34783460986939,
                "longitude": 112.04896778424654
            },
            {
                "latitude": -12.349112507553789,
                "longitude": 110.70796152890365
            },
            {
                "latitude": -12.343833606626237,
                "longitude": 109.36698762643682
            },
            {
                "latitude": -12.332000551494167,
                "longitude": 108.02605240195562
            },
            {
                "latitude": -12.313618717091204,
                "longitude": 106.6851620992393
            },
            {
                "latitude": -12.288696210837573,
                "longitude": 105.3443228669149
            },
            {
                "latitude": -12.257243876849158,
                "longitude": 104.00354074481976
            },
            {
                "latitude": -12.219275302360511,
                "longitude": 102.66282165058051
            },
            {
                "latitude": -12.174806826312428,
                "longitude": 101.32217136643925
            },
            {
                "latitude": -12.123857550039968,
                "longitude": 99.98159552635838
            },
            {
                "latitude": -12.066449349982346,
                "longitude": 98.6410996034343
            },
            {
                "latitude": -12.002606892321689,
                "longitude": 97.30068889765005
            },
            {
                "latitude": -11.93235764944337,
                "longitude": 95.96036852399588
            },
            {
                "latitude": -11.85573191809651,
                "longitude": 94.62014340098655
            },
            {
                "latitude": -11.772762839119435,
                "longitude": 93.28001823960273
            },
            {
                "latitude": -11.683486418581106,
                "longitude": 91.93999753268359
            },
            {
                "latitude": -11.62,
                "longitude": 91.04,
                "altitude": 100000
            },
            {
                "latitude": -11.503574655305936,
                "longitude": 89.62330916844495
            },
            {
                "latitude": -11.380214527109338,
                "longitude": 88.20675813457669
            },
            {
                "latitude": -11.249980632057607,
                "longitude": 86.79035072359726
            },
            {
                "latitude": -11.112937794522995,
                "longitude": 85.3740904077197
            },
            {
                "latitude": -10.969154683014953,
                "longitude": 83.95798029730486
            },
            {
                "latitude": -10.818703846253761,
                "longitude": 82.5420231329084
            },
            {
                "latitude": -10.66166174851426,
                "longitude": 81.12622127826104
            },
            {
                "latitude": -10.498108803834992,
                "longitude": 79.71057671420202
            },
            {
                "latitude": -10.328129408675958,
                "longitude": 78.29509103358359
            },
            {
                "latitude": -10.15181197259797,
                "longitude": 76.87976543716124
            },
            {
                "latitude": -9.969248946527879,
                "longitude": 75.46460073048212
            },
            {
                "latitude": -9.9,
                "longitude": 74.94,
                "altitude": 100000
            },
            {
                "latitude": -9.65478787012918,
                "longitude": 73.6137752233882
            },
            {
                "latitude": -9.404169626554916,
                "longitude": 72.28772914687798
            },
            {
                "latitude": -9.14826777007007,
                "longitude": 70.96185860101878
            },
            {
                "latitude": -8.887208743899249,
                "longitude": 69.63616003464594
            },
            {
                "latitude": -8.621122925208354,
                "longitude": 68.31062952291987
            },
            {
                "latitude": -8.35014460924494,
                "longitude": 66.98526277620712
            },
            {
                "latitude": -8.074411985764156,
                "longitude": 65.6600551497811
            },
            {
                "latitude": -7.794067107421211,
                "longitude": 64.33500165431782
            },
            {
                "latitude": -7.509255849840861,
                "longitude": 63.010096967159974
            },
            {
                "latitude": -7.220127863106812,
                "longitude": 61.68533544432114
            },
            {
                "latitude": -6.926836514449232,
                "longitude": 60.36071113319943
            },
            {
                "latitude": -6.629538821946723,
                "longitude": 59.036217785968695
            },
            {
                "latitude": -6.328395379099832,
                "longitude": 57.711848873613285
            },
            {
                "latitude": -6.023570270176301,
                "longitude": 56.387597600571205
            },
            {
                "latitude": -5.7152309762736335,
                "longitude": 55.06345691994867
            },
            {
                "latitude": -5.63,
                "longitude": 54.7,
                "altitude": 100000
            },
            {
                "latitude": -5.424187585296476,
                "longitude": 53.32088106737122
            },
            {
                "latitude": -5.215120641011798,
                "longitude": 51.941839415418755
            },
            {
                "latitude": -5.002919502583524,
                "longitude": 50.562871895422106
            },
            {
                "latitude": -4.78770688915664,
                "longitude": 49.18397518622593
            },
            {
                "latitude": -4.569607836126686,
                "longitude": 47.80514580213867
            },
            {
                "latitude": -4.348749623288102,
                "longitude": 46.42638010121538
            },
            {
                "latitude": -4.125261698605323,
                "longitude": 45.04767429390366
            },
            {
                "latitude": -3.899275597644131,
                "longitude": 43.669024452030804
            },
            {
                "latitude": -3.6709248587211505,
                "longitude": 42.29042651810965
            },
            {
                "latitude": -3.4403449338498717,
                "longitude": 40.91187631493967
            },
            {
                "latitude": -3.2076730955821176,
                "longitude": 39.53336955547925
            },
            {
                "latitude": -2.97304833986444,
                "longitude": 38.15490185296462
            },
            {
                "latitude": -2.7366112850490367,
                "longitude": 36.77646873125031
            },
            {
                "latitude": -2.72,
                "longitude": 36.68,
                "altitude": 100000
            },
            {
                "latitude": -2.3965696393809344,
                "longitude": 35.327381627706956
            },
            {
                "latitude": -2.0716566564398264,
                "longitude": 33.97478361095132
            },
            {
                "latitude": -1.7454592912061675,
                "longitude": 32.622197556100225
            },
            {
                "latitude": -1.4181771685199402,
                "longitude": 31.269615048927694
            },
            {
                "latitude": -1.0900110965508387,
                "longitude": 29.91702767357353
            },
            {
                "latitude": -0.7611628611939472,
                "longitude": 28.564427031447103
            },
            {
                "latitude": -0.4318350170039288,
                "longitude": 27.211804760032802
            },
            {
                "latitude": -0.10223067535397573,
                "longitude": 25.85915255155479
            },
            {
                "latitude": -0.1,
                "longitude": 25.85,
                "altitude": 100000
            },
            {
                "latitude": 0.04064206429305626,
                "longitude": 24.440617889290305
            },
            {
                "latitude": 0.18125986307014327,
                "longitude": 23.031227613197803
            },
            {
                "latitude": 0.32176677515123,
                "longitude": 21.62182764080562
            },
            {
                "latitude": 0.4620762526398724,
                "longitude": 20.21241646487159
            },
            {
                "latitude": 0.6021018813704814,
                "longitude": 18.802992605467157
            },
            {
                "latitude": 0.7417574411951939,
                "longitude": 17.393554613548318
            },
            {
                "latitude": 0.8809569660290747,
                "longitude": 15.984101074450207
            },
            {
                "latitude": 1.0196148035732517,
                "longitude": 14.574630611296868
            },
            {
                "latitude": 1.1576456746367807,
                "longitude": 13.16514188831827
            },
            {
                "latitude": 1.2949647319795252,
                "longitude": 11.755633614066554
            },
            {
                "latitude": 1.4314876186001215,
                "longitude": 10.346104544524025
            },
            {
                "latitude": 1.5671305253951662,
                "longitude": 8.936553486095503
            },
            {
                "latitude": 1.7018102481180986,
                "longitude": 7.526979298478013
            },
            {
                "latitude": 1.8354442435688414,
                "longitude": 6.117380897401023
            },
            {
                "latitude": 1.967950684948094,
                "longitude": 4.707757257230888
            },
            {
                "latitude": 2.099248516313229,
                "longitude": 3.298107413433338
            },
            {
                "latitude": 2.1,
                "longitude": 3.29,
                "altitude": 100000
            },
            {
                "latitude": 2.1860498171081035,
                "longitude": 1.9265067073939264
            },
            {
                "latitude": 2.270854152014639,
                "longitude": 0.5629975309595848
            },
            {
                "latitude": 2.3543650113868106,
                "longitude": -0.8005276999019567
            },
            {
                "latitude": 2.4365351719148727,
                "longitude": -2.1640691194736026
            },
            {
                "latitude": 2.5173182066613826,
                "longitude": -3.5276268254200582
            },
            {
                "latitude": 2.596668510770147,
                "longitude": -4.89120087856813
            },
            {
                "latitude": 2.674541326523509,
                "longitude": -6.25479130277001
            },
            {
                "latitude": 2.7508927677379873,
                "longitude": -7.618398084849775
            },
            {
                "latitude": 2.825679843489539,
                "longitude": -8.982021174633308
            },
            {
                "latitude": 2.8988604811610306,
                "longitude": -10.345660485061488
            },
            {
                "latitude": 2.970393548805718,
                "longitude": -11.709315892386476
            },
            {
                "latitude": 3.0402388768217774,
                "longitude": -13.072987236450578
            },
            {
                "latitude": 3.108357278934071,
                "longitude": -14.436674321047136
            },
            {
                "latitude": 3.11,
                "longitude": -14.47,
                "altitude": 100000
            },
            {
                "latitude": 3.261719006371181,
                "longitude": -15.909449182237239
            },
            {
                "latitude": 3.411343436565091,
                "longitude": -17.34894412830974
            },
            {
                "latitude": 3.5587786201864513,
                "longitude": -18.788485568992563
            },
            {
                "latitude": 3.703931470412757,
                "longitude": -20.22807411804187
            },
            {
                "latitude": 3.846710542500308,
                "longitude": -21.667710270673382
            },
            {
                "latitude": 3.987026090096792,
                "longitude": -23.10739440233581
            },
            {
                "latitude": 4.124790119336787,
                "longitude": -24.547126767782142
            },
            {
                "latitude": 4.259916440704614,
                "longitude": -25.986907500440942
            },
            {
                "latitude": 4.392320718656892,
                "longitude": -27.426736612089073
            },
            {
                "latitude": 4.521920519004854,
                "longitude": -28.866613992826597
            },
            {
                "latitude": 4.648635354063944,
                "longitude": -30.30653941135386
            },
            {
                "latitude": 4.772386725585418,
                "longitude": -31.7465125155502
            },
            {
                "latitude": 4.893098165491513,
                "longitude": -33.18653283335257
            },
            {
                "latitude": 4.9,
                "longitude": -33.27,
                "altitude": 100000
            },
            {
                "latitude": 5.16250643789586,
                "longitude": -34.64120465780759
            },
            {
                "latitude": 5.421880739230437,
                "longitude": -36.012532713037295
            },
            {
                "latitude": 5.677971195706403,
                "longitude": -37.38398691020538
            },
            {
                "latitude": 5.930628897208628,
                "longitude": -38.75556970695745
            },
            {
                "latitude": 6.179707824908335,
                "longitude": -40.127283268697624
            },
            {
                "latitude": 6.425064937663299,
                "longitude": -41.49912946386026
            },
            {
                "latitude": 6.666560251692623,
                "longitude": -42.87110985983256
            },
            {
                "latitude": 6.904056913537865,
                "longitude": -44.24322571953575
            },
            {
                "latitude": 7.137421266354319,
                "longitude": -45.615477998670784
            },
            {
                "latitude": 7.366522909607239,
                "longitude": -46.98786734363372
            },
            {
                "latitude": 7.39,
                "longitude": -47.13,
                "altitude": 100000
            },
            {
                "latitude": 7.667200537957423,
                "longitude": -48.51495902027066
            },
            {
                "latitude": 7.93965517799837,
                "longitude": -49.90009896990933
            },
            {
                "latitude": 8.207209001752588,
                "longitude": -51.28542104818075
            },
            {
                "latitude": 8.469711318103228,
                "longitude": -52.67092603514307
            },
            {
                "latitude": 8.727015713724333,
                "longitude": -54.05661428993335
            },
            {
                "latitude": 8.978980094186847,
                "longitude": -55.44248574996939
            },
            {
                "latitude": 9.225466715948683,
                "longitude": -56.82853993106972
            },
            {
                "latitude": 9.466342209581152,
                "longitude": -58.21477592849211
            },
            {
                "latitude": 9.701477594617389,
                "longitude": -59.60119241888965
            },
            {
                "latitude": 9.93074828643781,
                "longitude": -60.987787663181756
            },
            {
                "latitude": 10.15403409563352,
                "longitude": -62.374559510336105
            },
            {
                "latitude": 10.371219220310481,
                "longitude": -63.761505402055874
            },
            {
                "latitude": 10.58219223181566,
                "longitude": -65.14862237836523
            },
            {
                "latitude": 10.786846054381076,
                "longitude": -66.53590708408416
            },
            {
                "latitude": 10.985077939192799,
                "longitude": -67.92335577618245
            },
            {
                "latitude": 11.176789433399737,
                "longitude": -69.31096433200064
            },
            {
                "latitude": 11.361886344581688,
                "longitude": -70.69872825832425
            },
            {
                "latitude": 11.44,
                "longitude": -71.3,
                "altitude": 100000
            },
            {
                "latitude": 11.793523035404883,
                "longitude": -72.57696317388813
            },
            {
                "latitude": 12.140546191798249,
                "longitude": -73.85425228058615
            },
            {
                "latitude": 12.480914652828249,
                "longitude": -75.13186842805884
            },
            {
                "latitude": 12.81447963253811,
                "longitude": -76.40981209484113
            },
            {
                "latitude": 13.141098329022368,
                "longitude": -77.68808312883709
            },
            {
                "latitude": 13.46063386458213,
                "longitude": -78.96668074719382
            },
            {
                "latitude": 13.772955213329142,
                "longitude": -80.24560353725613
            },
            {
                "latitude": 14.077937117212416,
                "longitude": -81.52484945860768
            },
            {
                "latitude": 14.37545999145748,
                "longitude": -82.80441584620313
            },
            {
                "latitude": 14.5,
                "longitude": -83.35,
                "altitude": 100000
            },
            {
                "latitude": 15.06882860853868,
                "longitude": -84.6559104144887
            },
            {
                "latitude": 15.627512633692339,
                "longitude": -85.96255701207481
            },
            {
                "latitude": 16.1757874572705,
                "longitude": -87.26994933952722
            },
            {
                "latitude": 16.713404928298466,
                "longitude": -88.57809549972266
            },
            {
                "latitude": 17.240133072328888,
                "longitude": -89.8870021366751
            },
            {
                "latitude": 17.755755742977918,
                "longitude": -91.19667442237413
            },
            {
                "latitude": 18.26007222148539,
                "longitude": -92.50711604547514
            },
            {
                "latitude": 18.75289677013529,
                "longitude": -93.81832920189372
            },
            {
                "latitude": 19.23405814533921,
                "longitude": -95.1303145873661
            },
            {
                "latitude": 19.703399076088196,
                "longitude": -96.44307139204531
            },
            {
                "latitude": 20.1,
                "longitude": -97.58,
                "altitude": 100000
            },
            {
                "latitude": 20.548021352150123,
                "longitude": -98.82779631523985
            },
            {
                "latitude": 20.984805649761167,
                "longitude": -100.0763251406866
            },
            {
                "latitude": 21.410251362393847,
                "longitude": -101.32558253053345
            },
            {
                "latitude": 21.824267030760303,
                "longitude": -102.57556323771146
            },
            {
                "latitude": 22.22677074369452,
                "longitude": -103.82626071678546
            },
            {
                "latitude": 22.617689611592752,
                "longitude": -105.07766712881622
            },
            {
                "latitude": 22.996959239351384,
                "longitude": -106.3297733482589
            },
            {
                "latitude": 23.364523201575796,
                "longitude": -107.58256897196367
            },
            {
                "latitude": 23.72033252257937,
                "longitude": -108.8360423303424
            },
            {
                "latitude": 24.064345163441423,
                "longitude": -110.09018050075984
            },
            {
                "latitude": 24.396525518148444,
                "longitude": -111.34496932320323
            },
            {
                "latitude": 24.71684392060689,
                "longitude": -112.60039341827745
            },
            {
                "latitude": 25.0252761640905,
                "longitude": -113.85643620756706
            },
            {
                "latitude": 25.321803034470825,
                "longitude": -115.11307993639807
            },
            {
                "latitude": 25.606409858379354,
                "longitude": -116.37030569902525
            },
            {
                "latitude": 25.879086067262136,
                "longitude": -117.62809346626146
            },
            {
                "latitude": 26.139824778115468,
                "longitude": -118.88642211555722
            },
            {
                "latitude": 26.388622391532632,
                "longitude": -120.145269463529
            },
            {
                "latitude": 26.56,
                "longitude": -121.05,
                "altitude": 100000
            },
            {
                "latitude": 27.015392068646428,
                "longitude": -122.25972898333426
            },
            {
                "latitude": 27.4572407018642,
                "longitude": -123.47048992902272
            },
            {
                "latitude": 27.885546321070294,
                "longitude": -124.68227197109266
            },
            {
                "latitude": 28.30031742079038,
                "longitude": -125.8950625108673
            },
            {
                "latitude": 28.701569776222865,
                "longitude": -127.10884722175743
            },
            {
                "latitude": 29.08932567947834,
                "longitude": -128.3236100570327
            },
            {
                "latitude": 29.463613205991955,
                "longitude": -129.53933326070504
            },
            {
                "latitude": 29.82446551221335,
                "longitude": -130.75599738164397
            },
            {
                "latitude": 30.17192016532348,
                "longitude": -131.97358129103156
            },
            {
                "latitude": 30.506018505410356,
                "longitude": -133.19206220325157
            },
            {
                "latitude": 30.826805040255444,
                "longitude": -134.4114157002925
            },
            {
                "latitude": 31.134326872636628,
                "longitude": -135.63161575973024
            },
            {
                "latitude": 31.42863315984237,
                "longitude": -136.85263478633945
            },
            {
                "latitude": 31.709774604911054,
                "longitude": -138.07444364736816
            },
            {
                "latitude": 31.72,
                "longitude": -138.12,
                "altitude": 100000
            },
            {
                "latitude": 31.991410299682425,
                "longitude": -139.3540009184965
            },
            {
                "latitude": 32.24950247591896,
                "longitude": -140.58874475742365
            },
            {
                "latitude": 32.494330939891924,
                "longitude": -141.82419703409056
            },
            {
                "latitude": 32.72594991352899,
                "longitude": -143.06032185109186
            },
            {
                "latitude": 32.94441304898509,
                "longitude": -144.2970819523334
            },
            {
                "latitude": 33.149773076273355,
                "longitude": -145.53443878279256
            },
            {
                "latitude": 33.34208147792116,
                "longitude": -146.77235255192613
            },
            {
                "latitude": 33.52138818952234,
                "longitude": -148.01078230062274
            },
            {
                "latitude": 33.68774132506526,
                "longitude": -149.24968597157883
            },
            {
                "latitude": 33.84118692593739,
                "longitude": -150.48902048296156
            },
            {
                "latitude": 33.98176873253911,
                "longitude": -151.7287418052064
            },
            {
                "latitude": 34.10952797748056,
                "longitude": -152.9688050407822
            },
            {
                "latitude": 34.22450319938482,
                "longitude": -154.20916450674255
            },
            {
                "latitude": 34.3,
                "longitude": -155.11,
                "altitude": 100000
            },
            {
                "latitude": 34.57390888769056,
                "longitude": -156.2742999590753
            },
            {
                "latitude": 34.835225077825086,
                "longitude": -157.43944044988072
            },
            {
                "latitude": 35.08402083779979,
                "longitude": -158.60538777365073
            },
            {
                "latitude": 35.32036724930333,
                "longitude": -159.77210678237714
            },
            {
                "latitude": 35.544333899298096,
                "longitude": -160.9395609262863
            },
            {
                "latitude": 35.75598859541929,
                "longitude": -162.10771230487498
            },
            {
                "latitude": 35.955397104499696,
                "longitude": -163.27652172144082
            },
            {
                "latitude": 36.142622912954764,
                "longitude": -164.44594874102995
            },
            {
                "latitude": 36.31772700779818,
                "longitude": -165.61595175170817
            },
            {
                "latitude": 36.4807676771021,
                "longitude": -166.78648802904803
            },
            {
                "latitude": 36.63180032876499,
                "longitude": -167.95751380371107
            },
            {
                "latitude": 36.77087732650584,
                "longitude": -169.1289843319896
            },
            {
                "latitude": 36.898047842061864,
                "longitude": -170.3008539691607
            },
            {
                "latitude": 37.01335772262954,
                "longitude": -171.473076245492
            },
            {
                "latitude": 37.1168493726543,
                "longitude": -172.64560394472858
            },
            {
                "latitude": 37.208561649140805,
                "longitude": -173.81838918487782
            },
            {
                "latitude": 37.28852976972517,
                "longitude": -174.99138350110076
            },
            {
                "latitude": 37.356785232819604,
                "longitude": -176.16453793050846
            },
            {
                "latitude": 37.41335574921141,
                "longitude": -177.33780309865466
            },
            {
                "latitude": 37.45826518456855,
                "longitude": -178.51112930750767
            },
            {
                "latitude": 37.49153351237604,
                "longitude": -179.68446662468017
            },
            {
                "latitude": 37.51317677689826,
                "longitude": 179.1422350263117
            },
            {
                "latitude": 37.523207065834235,
                "longitude": 177.96902577499017
            },
            {
                "latitude": 37.52163249240356,
                "longitude": 176.79595571229376
            },
            {
                "latitude": 37.508457186672516,
                "longitude": 175.62307479862676
            },
            {
                "latitude": 37.48368129599979,
                "longitude": 174.4504327718172
            },
            {
                "latitude": 37.447300994552755,
                "longitude": 173.2780790552197
            },
            {
                "latitude": 37.399308501914916,
                "longitude": 172.10606266619814
            },
            {
                "latitude": 37.339692110875596,
                "longitude": 170.93443212521993
            },
            {
                "latitude": 37.26843622456248,
                "longitude": 169.76323536579125
            },
            {
                "latitude": 37.18552140314745,
                "longitude": 168.59251964545732
            },
            {
                "latitude": 37.18,
                "longitude": 168.52,
                "altitude": 100000
            },
            {
                "latitude": 38.056217772580816,
                "longitude": 168.547054676096
            },
            {
                "latitude": 38.91479593607573,
                "longitude": 168.5742007009333
            },
            {
                "latitude": 39.75595956234416,
                "longitude": 168.60144089619797
            },
            {
                "latitude": 40.57995220623496,
                "longitude": 168.62877813397333
            },
            {
                "latitude": 41.38703349479671,
                "longitude": 168.65621533808562
            },
            {
                "latitude": 42.17747686703325,
                "longitude": 168.68375548542983
            },
            {
                "latitude": 42.95156746572417,
                "longitude": 168.71140160728638
            },
            {
                "latitude": 43.70960018078577,
                "longitude": 168.73915679063828
            },
            {
                "latitude": 44.451877841936785,
                "longitude": 168.76702417949767
            },
            {
                "latitude": 45.05,
                "longitude": 168.79,
                "altitude": 100000
            }
        ]
    ];
    var polygonOverTheGlobeInput = transformInputData(polygonOverTheGlobeRawInput);
    var polygonOverTheGlobeRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": 45.67291829316015,
                        "longitude": -180
                    },
                    {
                        "latitude": 45.67453614944354,
                        "longitude": -178.88931931892276
                    },
                    {
                        "latitude": 45.66521629163528,
                        "longitude": -177.7690235207158
                    },
                    {
                        "latitude": 45.64494484768027,
                        "longitude": -176.64901015005094
                    },
                    {
                        "latitude": 45.61371649960556,
                        "longitude": -175.52935315669936
                    },
                    {
                        "latitude": 45.57152018106362,
                        "longitude": -174.41012602828044
                    },
                    {
                        "latitude": 45.518339084344596,
                        "longitude": -173.29140165859704
                    },
                    {
                        "latitude": 45.45415066809756,
                        "longitude": -172.17325221732077
                    },
                    {
                        "latitude": 45.37892666597821,
                        "longitude": -171.05574902138775
                    },
                    {
                        "latitude": 45.292633096508695,
                        "longitude": -169.93896240845103
                    },
                    {
                        "latitude": 45.19523027450345,
                        "longitude": -168.82296161272654
                    },
                    {
                        "latitude": 45.08667282448599,
                        "longitude": -167.7078146435526
                    },
                    {
                        "latitude": 44.966909696594065,
                        "longitude": -166.59358816696925
                    },
                    {
                        "latitude": 44.93,
                        "longitude": -166.27,
                        "altitude": 100000
                    },
                    {
                        "latitude": 44.905946465903504,
                        "longitude": -165.1669661717937
                    },
                    {
                        "latitude": 44.87125770577928,
                        "longitude": -164.0642894031634
                    },
                    {
                        "latitude": 44.82592154535681,
                        "longitude": -162.9620365316124
                    },
                    {
                        "latitude": 44.769920587292475,
                        "longitude": -161.8602738195306
                    },
                    {
                        "latitude": 44.70323222092174,
                        "longitude": -160.7590668400568
                    },
                    {
                        "latitude": 44.6258286336366,
                        "longitude": -159.65848036448378
                    },
                    {
                        "latitude": 44.5376768241639,
                        "longitude": -158.55857825149528
                    },
                    {
                        "latitude": 44.43873861808192,
                        "longitude": -157.45942333851212
                    },
                    {
                        "latitude": 44.32897068597499,
                        "longitude": -156.36107733541394
                    },
                    {
                        "latitude": 44.2083245646905,
                        "longitude": -155.26360072088968
                    },
                    {
                        "latitude": 44.076746682229384,
                        "longitude": -154.16705264165532
                    },
                    {
                        "latitude": 43.93417838686923,
                        "longitude": -153.07149081476348
                    },
                    {
                        "latitude": 43.78055598119138,
                        "longitude": -151.97697143321275
                    },
                    {
                        "latitude": 43.61581076175648,
                        "longitude": -150.88354907504882
                    },
                    {
                        "latitude": 43.43986906525049,
                        "longitude": -149.79127661613109
                    },
                    {
                        "latitude": 43.25265232200283,
                        "longitude": -148.70020514672316
                    },
                    {
                        "latitude": 43.05407711786161,
                        "longitude": -147.61038389204543
                    },
                    {
                        "latitude": 42.844055265497325,
                        "longitude": -146.52186013691116
                    },
                    {
                        "latitude": 42.62249388629612,
                        "longitude": -145.43467915454988
                    },
                    {
                        "latitude": 42.38929550409682,
                        "longitude": -144.34888413970285
                    },
                    {
                        "latitude": 42.14435815212137,
                        "longitude": -143.26451614605833
                    },
                    {
                        "latitude": 41.8875754945481,
                        "longitude": -142.1816140280775
                    },
                    {
                        "latitude": 41.61883696427767,
                        "longitude": -141.100214387244
                    },
                    {
                        "latitude": 41.33802791854569,
                        "longitude": -140.0203515227553
                    },
                    {
                        "latitude": 41.13,
                        "longitude": -139.25,
                        "altitude": 100000
                    },
                    {
                        "latitude": 40.801100965252864,
                        "longitude": -138.20411487943306
                    },
                    {
                        "latitude": 40.459932135128824,
                        "longitude": -137.15991579496585
                    },
                    {
                        "latitude": 40.106358140928116,
                        "longitude": -136.1174212093485
                    },
                    {
                        "latitude": 39.740241145226086,
                        "longitude": -135.07664716839918
                    },
                    {
                        "latitude": 39.36144117050304,
                        "longitude": -134.0376072898197
                    },
                    {
                        "latitude": 38.969816461936325,
                        "longitude": -133.0003127556497
                    },
                    {
                        "latitude": 38.56522388678592,
                        "longitude": -131.96477230826713
                    },
                    {
                        "latitude": 38.147519372854816,
                        "longitude": -130.93099224984047
                    },
                    {
                        "latitude": 37.71655838853707,
                        "longitude": -129.8989764451353
                    },
                    {
                        "latitude": 37.272196466978066,
                        "longitude": -128.8687263275784
                    },
                    {
                        "latitude": 36.814289776855674,
                        "longitude": -127.84024090848342
                    },
                    {
                        "latitude": 36.34269574224645,
                        "longitude": -126.81351678934409
                    },
                    {
                        "latitude": 35.85727371396084,
                        "longitude": -125.78854817710443
                    },
                    {
                        "latitude": 35.38,
                        "longitude": -124.81,
                        "altitude": 100000
                    },
                    {
                        "latitude": 35.219049224155555,
                        "longitude": -123.58185456973266
                    },
                    {
                        "latitude": 35.04512418843778,
                        "longitude": -122.35452773163412
                    },
                    {
                        "latitude": 34.85817733011977,
                        "longitude": -121.12806061521944
                    },
                    {
                        "latitude": 34.658158181681735,
                        "longitude": -119.90249274740061
                    },
                    {
                        "latitude": 34.44501360015003,
                        "longitude": -118.67786197311102
                    },
                    {
                        "latitude": 34.21868801864212,
                        "longitude": -117.45420437964488
                    },
                    {
                        "latitude": 33.97912372134099,
                        "longitude": -116.23155422486289
                    },
                    {
                        "latitude": 33.726261143173176,
                        "longitude": -115.00994386940144
                    },
                    {
                        "latitude": 33.46003919550518,
                        "longitude": -113.78940371300887
                    },
                    {
                        "latitude": 33.18039561920333,
                        "longitude": -112.56996213511742
                    },
                    {
                        "latitude": 32.88726736641966,
                        "longitude": -111.35164543974814
                    },
                    {
                        "latitude": 32.58059101246843,
                        "longitude": -110.13447780483047
                    },
                    {
                        "latitude": 32.2603031991452,
                        "longitude": -108.91848123600826
                    },
                    {
                        "latitude": 31.926341110805915,
                        "longitude": -107.70367552499036
                    },
                    {
                        "latitude": 31.578642984470143,
                        "longitude": -106.49007821249413
                    },
                    {
                        "latitude": 31.217148655133375,
                        "longitude": -105.27770455581881
                    },
                    {
                        "latitude": 30.841800137367663,
                        "longitude": -104.06656750107749
                    },
                    {
                        "latitude": 30.47,
                        "longitude": -102.91,
                        "altitude": 100000
                    },
                    {
                        "latitude": 30.08041915448742,
                        "longitude": -101.78807062530166
                    },
                    {
                        "latitude": 29.678549628538022,
                        "longitude": -100.66726263257898
                    },
                    {
                        "latitude": 29.264355436121818,
                        "longitude": -99.54757771085988
                    },
                    {
                        "latitude": 28.837805241747223,
                        "longitude": -98.42901573075186
                    },
                    {
                        "latitude": 28.39887296198791,
                        "longitude": -97.31157474721662
                    },
                    {
                        "latitude": 27.947538392887214,
                        "longitude": -96.19525100539286
                    },
                    {
                        "latitude": 27.483787862465228,
                        "longitude": -95.08003894945038
                    },
                    {
                        "latitude": 27.007614907259274,
                        "longitude": -93.96593123445707
                    },
                    {
                        "latitude": 26.519020971504798,
                        "longitude": -92.85291874123978
                    },
                    {
                        "latitude": 26.018016127212135,
                        "longitude": -91.7409905942182
                    },
                    {
                        "latitude": 25.50461981301463,
                        "longitude": -90.6301341821902
                    },
                    {
                        "latitude": 24.978861589257644,
                        "longitude": -89.52033518204597
                    },
                    {
                        "latitude": 24.440781906367516,
                        "longitude": -88.41157758538654
                    },
                    {
                        "latitude": 23.890432883087676,
                        "longitude": -87.30384372802064
                    },
                    {
                        "latitude": 23.32787909069977,
                        "longitude": -86.19711432231188
                    },
                    {
                        "latitude": 22.753198338865218,
                        "longitude": -85.0913684923452
                    },
                    {
                        "latitude": 22.16648245823332,
                        "longitude": -83.98658381187848
                    },
                    {
                        "latitude": 22.05,
                        "longitude": -83.77,
                        "altitude": 100000
                    },
                    {
                        "latitude": 21.762645000160607,
                        "longitude": -82.48322566182124
                    },
                    {
                        "latitude": 21.46428557025922,
                        "longitude": -81.19705188180609
                    },
                    {
                        "latitude": 21.154975156123403,
                        "longitude": -79.91148403824785
                    },
                    {
                        "latitude": 20.834772616900725,
                        "longitude": -78.62652624346248
                    },
                    {
                        "latitude": 20.503742592561643,
                        "longitude": -77.34218133455637
                    },
                    {
                        "latitude": 20.16195587750905,
                        "longitude": -76.05845086706204
                    },
                    {
                        "latitude": 19.80948979883459,
                        "longitude": -74.77533511146147
                    },
                    {
                        "latitude": 19.44642859761517,
                        "longitude": -73.49283305261052
                    },
                    {
                        "latitude": 19.07286381149345,
                        "longitude": -72.21094239207035
                    },
                    {
                        "latitude": 18.68889465663452,
                        "longitude": -70.92965955334593
                    },
                    {
                        "latitude": 18.29462840699976,
                        "longitude": -69.64897969002406
                    },
                    {
                        "latitude": 17.890180768728953,
                        "longitude": -68.3688966967972
                    },
                    {
                        "latitude": 17.475676247276706,
                        "longitude": -67.08940322335128
                    },
                    {
                        "latitude": 17.051248504809863,
                        "longitude": -65.81049069108971
                    },
                    {
                        "latitude": 16.617040705243046,
                        "longitude": -64.53214931265734
                    },
                    {
                        "latitude": 16.35,
                        "longitude": -63.76,
                        "altitude": 100000
                    },
                    {
                        "latitude": 16.308602554036796,
                        "longitude": -62.36444744667482
                    },
                    {
                        "latitude": 16.258027490842807,
                        "longitude": -60.969017297681766
                    },
                    {
                        "latitude": 16.198293681146005,
                        "longitude": -59.57372137786535
                    },
                    {
                        "latitude": 16.1294233001283,
                        "longitude": -58.178571202552725
                    },
                    {
                        "latitude": 16.051441873010724,
                        "longitude": -56.783577949303385
                    },
                    {
                        "latitude": 15.964378327971179,
                        "longitude": -55.38875243041063
                    },
                    {
                        "latitude": 15.868265056157098,
                        "longitude": -53.99410506622971
                    },
                    {
                        "latitude": 15.763137978520568,
                        "longitude": -52.599645859405456
                    },
                    {
                        "latitude": 15.649036619168282,
                        "longitude": -51.20538437007002
                    },
                    {
                        "latitude": 15.526004184882684,
                        "longitude": -49.81132969207946
                    },
                    {
                        "latitude": 15.394087650434347,
                        "longitude": -48.417490430355166
                    },
                    {
                        "latitude": 15.253337849268554,
                        "longitude": -47.02387467939348
                    },
                    {
                        "latitude": 15.103809569111492,
                        "longitude": -45.63049000300415
                    },
                    {
                        "latitude": 14.945561652003652,
                        "longitude": -44.23734341533471
                    },
                    {
                        "latitude": 14.778657098229715,
                        "longitude": -42.84444136323518
                    },
                    {
                        "latitude": 14.603163173575943,
                        "longitude": -41.45178971001321
                    },
                    {
                        "latitude": 14.59,
                        "longitude": -41.35,
                        "altitude": 100000
                    },
                    {
                        "latitude": 14.371485994038242,
                        "longitude": -39.95898292627045
                    },
                    {
                        "latitude": 14.144457609321579,
                        "longitude": -38.56826101571263
                    },
                    {
                        "latitude": 13.909011485645832,
                        "longitude": -37.17783647084088
                    },
                    {
                        "latitude": 13.665249550151188,
                        "longitude": -35.787710779342156
                    },
                    {
                        "latitude": 13.413279146463523,
                        "longitude": -34.39788471017763
                    },
                    {
                        "latitude": 13.15321316037739,
                        "longitude": -33.008358311506456
                    },
                    {
                        "latitude": 12.885170141065164,
                        "longitude": -31.619130910439743
                    },
                    {
                        "latitude": 12.609274416770473,
                        "longitude": -30.230201114627892
                    },
                    {
                        "latitude": 12.325656203922252,
                        "longitude": -28.84156681567873
                    },
                    {
                        "latitude": 12.034451708589268,
                        "longitude": -27.45322519439895
                    },
                    {
                        "latitude": 11.735803219184303,
                        "longitude": -26.06517272784577
                    },
                    {
                        "latitude": 11.429859189323231,
                        "longitude": -24.677405198170206
                    },
                    {
                        "latitude": 11.116774309747031,
                        "longitude": -23.28991770322847
                    },
                    {
                        "latitude": 10.796709568225836,
                        "longitude": -21.902704668932284
                    },
                    {
                        "latitude": 10.58,
                        "longitude": -20.98,
                        "altitude": 100000
                    },
                    {
                        "latitude": 10.53489395287648,
                        "longitude": -19.568690801344736
                    },
                    {
                        "latitude": 10.483526830772348,
                        "longitude": -18.15744816441764
                    },
                    {
                        "latitude": 10.42592473591608,
                        "longitude": -16.746276720885565
                    },
                    {
                        "latitude": 10.362116966949008,
                        "longitude": -15.335180930940624
                    },
                    {
                        "latitude": 10.292136029570235,
                        "longitude": -13.924165072259157
                    },
                    {
                        "latitude": 10.216017648093917,
                        "longitude": -12.513233229397484
                    },
                    {
                        "latitude": 10.133800777770517,
                        "longitude": -11.10238928365235
                    },
                    {
                        "latitude": 10.04552761770995,
                        "longitude": -9.691636903413059
                    },
                    {
                        "latitude": 9.951243624231278,
                        "longitude": -8.28097953503076
                    },
                    {
                        "latitude": 9.85099752445103,
                        "longitude": -6.870420394229535
                    },
                    {
                        "latitude": 9.74484132991028,
                        "longitude": -5.459962458082139
                    },
                    {
                        "latitude": 9.632830350029304,
                        "longitude": -4.04960845757211
                    },
                    {
                        "latitude": 9.515023205168182,
                        "longitude": -2.6393608707624288
                    },
                    {
                        "latitude": 9.391481839062068,
                        "longitude": -1.2292219165891798
                    },
                    {
                        "latitude": 9.34,
                        "longitude": -0.66,
                        "altitude": 100000
                    },
                    {
                        "latitude": 9.291663707072388,
                        "longitude": 0.7423531799770737
                    },
                    {
                        "latitude": 9.237845874653944,
                        "longitude": 2.1446493320227273
                    },
                    {
                        "latitude": 9.178574631218114,
                        "longitude": 3.5468850856214083
                    },
                    {
                        "latitude": 9.113880999176594,
                        "longitude": 4.949057214400045
                    },
                    {
                        "latitude": 9.043798898948806,
                        "longitude": 6.35116264399656
                    },
                    {
                        "latitude": 8.968365153101278,
                        "longitude": 7.7531984595658425
                    },
                    {
                        "latitude": 8.887619490439672,
                        "longitude": 9.155161912903843
                    },
                    {
                        "latitude": 8.801604549927593,
                        "longitude": 10.557050429171307
                    },
                    {
                        "latitude": 8.710365884298225,
                        "longitude": 11.958861613199735
                    },
                    {
                        "latitude": 8.613951963217263,
                        "longitude": 13.360593255363055
                    },
                    {
                        "latitude": 8.512414175848638,
                        "longitude": 14.76224333699971
                    },
                    {
                        "latitude": 8.405806832668272,
                        "longitude": 16.163810035370858
                    },
                    {
                        "latitude": 8.2941871663653,
                        "longitude": 17.5652917281417
                    },
                    {
                        "latitude": 8.17761533166545,
                        "longitude": 18.966686997373987
                    },
                    {
                        "latitude": 8.056154403906937,
                        "longitude": 20.367994633019205
                    },
                    {
                        "latitude": 7.929870376196041,
                        "longitude": 21.76921363590308
                    },
                    {
                        "latitude": 7.798832154966921,
                        "longitude": 23.17034322019332
                    },
                    {
                        "latitude": 7.75,
                        "longitude": 23.68,
                        "altitude": 100000
                    },
                    {
                        "latitude": 7.606920492955011,
                        "longitude": 25.02766289552982
                    },
                    {
                        "latitude": 7.459593500000227,
                        "longitude": 26.37523723801705
                    },
                    {
                        "latitude": 7.308094765293547,
                        "longitude": 27.722723252659478
                    },
                    {
                        "latitude": 7.152502554942437,
                        "longitude": 29.070121361597778
                    },
                    {
                        "latitude": 6.992897641705337,
                        "longitude": 30.417432182960184
                    },
                    {
                        "latitude": 6.829363287225959,
                        "longitude": 31.7646565294605
                    },
                    {
                        "latitude": 6.661985221669653,
                        "longitude": 33.111795406553
                    },
                    {
                        "latitude": 6.4908516206369775,
                        "longitude": 34.45885001014852
                    },
                    {
                        "latitude": 6.316053079236235,
                        "longitude": 35.805821723897246
                    },
                    {
                        "latitude": 6.137682583204335,
                        "longitude": 37.152712116044945
                    },
                    {
                        "latitude": 5.9558354769736805,
                        "longitude": 38.49952293587001
                    },
                    {
                        "latitude": 5.770609428592,
                        "longitude": 39.846256109710176
                    },
                    {
                        "latitude": 5.582104391412024,
                        "longitude": 41.1929137365884
                    },
                    {
                        "latitude": 5.55,
                        "longitude": 41.42,
                        "altitude": 100000
                    },
                    {
                        "latitude": 5.1706849656592775,
                        "longitude": 42.743446966547765
                    },
                    {
                        "latitude": 4.788196655582181,
                        "longitude": 44.066795302030975
                    },
                    {
                        "latitude": 4.402760483758108,
                        "longitude": 45.39005658888956
                    },
                    {
                        "latitude": 4.014605406294311,
                        "longitude": 46.71324258671639
                    },
                    {
                        "latitude": 3.623963691859021,
                        "longitude": 48.03636520613299
                    },
                    {
                        "latitude": 3.231070679234662,
                        "longitude": 49.35943648243123
                    },
                    {
                        "latitude": 2.8361645227206744,
                        "longitude": 50.68246854904579
                    },
                    {
                        "latitude": 2.439485926215193,
                        "longitude": 52.005473610921946
                    },
                    {
                        "latitude": 2.041277866889731,
                        "longitude": 53.32846391784215
                    },
                    {
                        "latitude": 1.6417853094504968,
                        "longitude": 54.65145173777429
                    },
                    {
                        "latitude": 1.2412549120528633,
                        "longitude": 55.974449330303216
                    },
                    {
                        "latitude": 0.8399347250011278,
                        "longitude": 57.29746892020584
                    },
                    {
                        "latitude": 0.43807388342306175,
                        "longitude": 58.62052267122835
                    },
                    {
                        "latitude": 0.42,
                        "longitude": 58.68,
                        "altitude": 100000
                    },
                    {
                        "latitude": 0.1312058557000989,
                        "longitude": 60.02661733483624
                    },
                    {
                        "latitude": -0.1576734932237227,
                        "longitude": 61.37326294494172
                    },
                    {
                        "latitude": -0.4464651325262332,
                        "longitude": 62.71994306455879
                    },
                    {
                        "latitude": -0.7349961970990935,
                        "longitude": 64.06666384801247
                    },
                    {
                        "latitude": -1.0230940336234355,
                        "longitude": 65.41343135623265
                    },
                    {
                        "latitude": -1.3105863627295355,
                        "longitude": 66.76025154351333
                    },
                    {
                        "latitude": -1.5973014401917067,
                        "longitude": 68.10713024453669
                    },
                    {
                        "latitude": -1.883068216692228,
                        "longitude": 69.45407316168843
                    },
                    {
                        "latitude": -2.167716495696663,
                        "longitude": 70.80108585269028
                    },
                    {
                        "latitude": -2.4510770889943183,
                        "longitude": 72.14817371857447
                    },
                    {
                        "latitude": -2.7329819694716715,
                        "longitude": 73.49534199202387
                    },
                    {
                        "latitude": -3.0132644207031927,
                        "longitude": 74.84259572610064
                    },
                    {
                        "latitude": -3.2917591829631574,
                        "longitude": 76.18993978338544
                    },
                    {
                        "latitude": -3.5683025952832748,
                        "longitude": 77.53737882554755
                    },
                    {
                        "latitude": -3.8427327332044183,
                        "longitude": 78.88491730336597
                    },
                    {
                        "latitude": -4.114889541895956,
                        "longitude": 80.23255944722005
                    },
                    {
                        "latitude": -4.38461496434308,
                        "longitude": 81.5803092580673
                    },
                    {
                        "latitude": -4.6517530643308,
                        "longitude": 82.9281704989247
                    },
                    {
                        "latitude": -4.66,
                        "longitude": 82.97,
                        "altitude": 100000
                    },
                    {
                        "latitude": -4.7447249689157,
                        "longitude": 84.35397183956368
                    },
                    {
                        "latitude": -4.826675887842586,
                        "longitude": 85.73797192690195
                    },
                    {
                        "latitude": -4.905806390639645,
                        "longitude": 87.12199940515688
                    },
                    {
                        "latitude": -4.982071785343774,
                        "longitude": 88.50605335368314
                    },
                    {
                        "latitude": -5.055429072620781,
                        "longitude": 89.8901327901751
                    },
                    {
                        "latitude": -5.125836963126566,
                        "longitude": 91.27423667293692
                    },
                    {
                        "latitude": -5.193255893808497,
                        "longitude": 92.65836390329088
                    },
                    {
                        "latitude": -5.2576480431778,
                        "longitude": 94.04251332811808
                    },
                    {
                        "latitude": -5.318977345584293,
                        "longitude": 95.42668374252625
                    },
                    {
                        "latitude": -5.377209504525227,
                        "longitude": 96.8108738926384
                    },
                    {
                        "latitude": -5.432312005019986,
                        "longitude": 98.19508247849585
                    },
                    {
                        "latitude": -5.484254125082432,
                        "longitude": 99.57930815706952
                    },
                    {
                        "latitude": -5.533006946322294,
                        "longitude": 100.96354954537216
                    },
                    {
                        "latitude": -5.57854336370654,
                        "longitude": 102.34780522366485
                    },
                    {
                        "latitude": -5.620838094510983,
                        "longitude": 103.73207373875013
                    },
                    {
                        "latitude": -5.659867686491444,
                        "longitude": 105.11635360734452
                    },
                    {
                        "latitude": -5.695610525302801,
                        "longitude": 106.5006433195225
                    },
                    {
                        "latitude": -5.7,
                        "longitude": 106.68,
                        "altitude": 100000
                    },
                    {
                        "latitude": -5.804685245916516,
                        "longitude": 108.0673350464198
                    },
                    {
                        "latitude": -5.905956090798152,
                        "longitude": 109.45471317105881
                    },
                    {
                        "latitude": -6.003755842867198,
                        "longitude": 110.84213309188486
                    },
                    {
                        "latitude": -6.098029900261976,
                        "longitude": 112.22959342915931
                    },
                    {
                        "latitude": -6.188725768850492,
                        "longitude": 113.61709270862367
                    },
                    {
                        "latitude": -6.275793078620314,
                        "longitude": 115.00462936490601
                    },
                    {
                        "latitude": -6.359183598709894,
                        "longitude": 116.39220174513986
                    },
                    {
                        "latitude": -6.438851251147551,
                        "longitude": 117.77980811278734
                    },
                    {
                        "latitude": -6.51475212336478,
                        "longitude": 119.16744665165824
                    },
                    {
                        "latitude": -6.586844479550706,
                        "longitude": 120.55511547011584
                    },
                    {
                        "latitude": -6.655088770914162,
                        "longitude": 121.9428126054603
                    },
                    {
                        "latitude": -6.719447644919258,
                        "longitude": 123.33053602847993
                    },
                    {
                        "latitude": -6.779885953559196,
                        "longitude": 124.71828364815954
                    },
                    {
                        "latitude": -6.836370760731699,
                        "longitude": 126.10605331653596
                    },
                    {
                        "latitude": -6.888871348777686,
                        "longitude": 127.4938428336893
                    },
                    {
                        "latitude": -6.937359224242709,
                        "longitude": 128.88164995285882
                    },
                    {
                        "latitude": -6.981808122918266,
                        "longitude": 130.26947238567172
                    },
                    {
                        "latitude": -6.99,
                        "longitude": 130.54,
                        "altitude": 100000
                    },
                    {
                        "latitude": -6.847081062493092,
                        "longitude": 131.91911189000936
                    },
                    {
                        "latitude": -6.700153581785937,
                        "longitude": 133.29814407772494
                    },
                    {
                        "latitude": -6.5492980483449355,
                        "longitude": 134.67709709371155
                    },
                    {
                        "latitude": -6.394597459729946,
                        "longitude": 136.0559716532469
                    },
                    {
                        "latitude": -6.23613729599685,
                        "longitude": 137.43476865462821
                    },
                    {
                        "latitude": -6.074005492424694,
                        "longitude": 138.8134891770439
                    },
                    {
                        "latitude": -5.908292409459413,
                        "longitude": 140.19213447801533
                    },
                    {
                        "latitude": -5.739090799773673,
                        "longitude": 141.57070599041532
                    },
                    {
                        "latitude": -5.566495772350558,
                        "longitude": 142.9492053190705
                    },
                    {
                        "latitude": -5.3906047535080015,
                        "longitude": 144.32763423695656
                    },
                    {
                        "latitude": -5.211517444790548,
                        "longitude": 145.7059946809954
                    },
                    {
                        "latitude": -5.19,
                        "longitude": 145.87,
                        "altitude": 100000
                    },
                    {
                        "latitude": -5.168266226856581,
                        "longitude": 147.2554068663486
                    },
                    {
                        "latitude": -5.143525818465448,
                        "longitude": 148.6407986429562
                    },
                    {
                        "latitude": -5.1157926671434115,
                        "longitude": 150.02617429099502
                    },
                    {
                        "latitude": -5.085082348963947,
                        "longitude": 151.41153280927867
                    },
                    {
                        "latitude": -5.051412117904111,
                        "longitude": 152.79687323661494
                    },
                    {
                        "latitude": -5.014800899331115,
                        "longitude": 154.18219465406523
                    },
                    {
                        "latitude": -4.975269282814366,
                        "longitude": 155.56749618710575
                    },
                    {
                        "latitude": -4.932839514247639,
                        "longitude": 156.9527770076847
                    },
                    {
                        "latitude": -4.887535487264966,
                        "longitude": 158.3380363361708
                    },
                    {
                        "latitude": -4.839382733932905,
                        "longitude": 159.72327344318884
                    },
                    {
                        "latitude": -4.788408414701,
                        "longitude": 161.10848765133684
                    },
                    {
                        "latitude": -4.734641307591549,
                        "longitude": 162.49367833678184
                    },
                    {
                        "latitude": -4.73,
                        "longitude": 162.61,
                        "altitude": 100000
                    },
                    {
                        "latitude": -4.718579867993154,
                        "longitude": 164.04161882369556
                    },
                    {
                        "latitude": -4.704226900564926,
                        "longitude": 165.4732273473579
                    },
                    {
                        "latitude": -4.686949773840609,
                        "longitude": 166.9048245489343
                    },
                    {
                        "latitude": -4.666758927352452,
                        "longitude": 168.33640943455742
                    },
                    {
                        "latitude": -4.643666559410876,
                        "longitude": 169.76798104103463
                    },
                    {
                        "latitude": -4.617686621706534,
                        "longitude": 171.19953843826127
                    },
                    {
                        "latitude": -4.5888348131346115,
                        "longitude": 172.63108073155183
                    },
                    {
                        "latitude": -4.557128572831513,
                        "longitude": 174.06260706388318
                    },
                    {
                        "latitude": -4.522587072412914,
                        "longitude": 175.49411661804393
                    },
                    {
                        "latitude": -4.485231207401074,
                        "longitude": 176.92560861868472
                    },
                    {
                        "latitude": -4.4450835878283845,
                        "longitude": 178.35708233426413
                    },
                    {
                        "latitude": -4.402168528003134,
                        "longitude": 179.7885370788851
                    },
                    {
                        "latitude": -4.395423789766706,
                        "longitude": 180
                    },
                    {
                        "latitude": -11.204400651245713,
                        "longitude": 180
                    },
                    {
                        "latitude": -11.273784655878107,
                        "longitude": 178.89897004568152
                    },
                    {
                        "latitude": -11.354484318984126,
                        "longitude": 177.51605197765227
                    },
                    {
                        "latitude": -11.428701533965702,
                        "longitude": 176.13308912771268
                    },
                    {
                        "latitude": -11.496402040505941,
                        "longitude": 174.7500876955298
                    },
                    {
                        "latitude": -11.557554761920663,
                        "longitude": 173.36705397335916
                    },
                    {
                        "latitude": -11.61213178337652,
                        "longitude": 171.98399433160674
                    },
                    {
                        "latitude": -11.660108331478582,
                        "longitude": 170.60091520417978
                    },
                    {
                        "latitude": -11.70146275538994,
                        "longitude": 169.21782307365942
                    },
                    {
                        "latitude": -11.736176509630047,
                        "longitude": 167.83472445632876
                    },
                    {
                        "latitude": -11.764234138682156,
                        "longitude": 166.45162588709076
                    },
                    {
                        "latitude": -11.785623263523691,
                        "longitude": 165.06853390431058
                    },
                    {
                        "latitude": -11.800334570176647,
                        "longitude": 163.68545503461792
                    },
                    {
                        "latitude": -11.80836180035821,
                        "longitude": 162.30239577770445
                    },
                    {
                        "latitude": -11.81,
                        "longitude": 161.3,
                        "altitude": 100000
                    },
                    {
                        "latitude": -12.004469830733859,
                        "longitude": 159.99045097305927
                    },
                    {
                        "latitude": -12.192602065506398,
                        "longitude": 158.68073988682497
                    },
                    {
                        "latitude": -12.374317809747636,
                        "longitude": 157.37087131068958
                    },
                    {
                        "latitude": -12.549541762002724,
                        "longitude": 156.06085014000612
                    },
                    {
                        "latitude": -12.718202163997175,
                        "longitude": 154.75068158651283
                    },
                    {
                        "latitude": -12.880230748889106,
                        "longitude": 153.44037116810634
                    },
                    {
                        "latitude": -13.035562688119636,
                        "longitude": 152.12992469798058
                    },
                    {
                        "latitude": -13.18413653726211,
                        "longitude": 150.8193482731474
                    },
                    {
                        "latitude": -13.325894181259322,
                        "longitude": 149.50864826235838
                    },
                    {
                        "latitude": -13.460780779424924,
                        "longitude": 148.19783129344756
                    },
                    {
                        "latitude": -13.52,
                        "longitude": 147.6,
                        "altitude": 100000
                    },
                    {
                        "latitude": -13.531492579019076,
                        "longitude": 146.25792615540962
                    },
                    {
                        "latitude": -13.535833573547858,
                        "longitude": 144.91588018708856
                    },
                    {
                        "latitude": -13.533021866841592,
                        "longitude": 143.573869861648
                    },
                    {
                        "latitude": -13.523059142126142,
                        "longitude": 142.23190287260704
                    },
                    {
                        "latitude": -13.50594988116989,
                        "longitude": 140.8899868233551
                    },
                    {
                        "latitude": -13.481701366146764,
                        "longitude": 139.54812921027548
                    },
                    {
                        "latitude": -13.450323684773208,
                        "longitude": 138.20633740606843
                    },
                    {
                        "latitude": -13.41182973868377,
                        "longitude": 136.86461864331366
                    },
                    {
                        "latitude": -13.366235254992308,
                        "longitude": 135.52297999831043
                    },
                    {
                        "latitude": -13.31355880096784,
                        "longitude": 134.1814283752341
                    },
                    {
                        "latitude": -13.253821801736349,
                        "longitude": 132.83997049064672
                    },
                    {
                        "latitude": -13.187048560902134,
                        "longitude": 131.49861285839899
                    },
                    {
                        "latitude": -13.113266283964595,
                        "longitude": 130.15736177495992
                    },
                    {
                        "latitude": -13.06,
                        "longitude": 129.26,
                        "altitude": 100000
                    },
                    {
                        "latitude": -13.035473886587774,
                        "longitude": 127.88129955321638
                    },
                    {
                        "latitude": -13.003653270672086,
                        "longitude": 126.50266551923059
                    },
                    {
                        "latitude": -12.964552262974975,
                        "longitude": 125.1241051954696
                    },
                    {
                        "latitude": -12.918188101178991,
                        "longitude": 123.74562571263559
                    },
                    {
                        "latitude": -12.864581164814323,
                        "longitude": 122.36723401786446
                    },
                    {
                        "latitude": -12.80375499324708,
                        "longitude": 120.9889368582844
                    },
                    {
                        "latitude": -12.735736306646173,
                        "longitude": 119.61074076501578
                    },
                    {
                        "latitude": -12.660555029785785,
                        "longitude": 118.23265203765344
                    },
                    {
                        "latitude": -12.578244318520287,
                        "longitude": 116.85467672927109
                    },
                    {
                        "latitude": -12.488840588748364,
                        "longitude": 115.4768206319862
                    },
                    {
                        "latitude": -12.39238354766335,
                        "longitude": 114.09908926312268
                    },
                    {
                        "latitude": -12.34,
                        "longitude": 113.39,
                        "altitude": 100000
                    },
                    {
                        "latitude": -12.34783460986939,
                        "longitude": 112.04896778424654
                    },
                    {
                        "latitude": -12.349112507553789,
                        "longitude": 110.70796152890365
                    },
                    {
                        "latitude": -12.343833606626237,
                        "longitude": 109.36698762643682
                    },
                    {
                        "latitude": -12.332000551494167,
                        "longitude": 108.02605240195562
                    },
                    {
                        "latitude": -12.313618717091204,
                        "longitude": 106.6851620992393
                    },
                    {
                        "latitude": -12.288696210837573,
                        "longitude": 105.3443228669149
                    },
                    {
                        "latitude": -12.257243876849158,
                        "longitude": 104.00354074481976
                    },
                    {
                        "latitude": -12.219275302360511,
                        "longitude": 102.66282165058051
                    },
                    {
                        "latitude": -12.174806826312428,
                        "longitude": 101.32217136643925
                    },
                    {
                        "latitude": -12.123857550039968,
                        "longitude": 99.98159552635838
                    },
                    {
                        "latitude": -12.066449349982346,
                        "longitude": 98.6410996034343
                    },
                    {
                        "latitude": -12.002606892321689,
                        "longitude": 97.30068889765005
                    },
                    {
                        "latitude": -11.93235764944337,
                        "longitude": 95.96036852399588
                    },
                    {
                        "latitude": -11.85573191809651,
                        "longitude": 94.62014340098655
                    },
                    {
                        "latitude": -11.772762839119435,
                        "longitude": 93.28001823960273
                    },
                    {
                        "latitude": -11.683486418581106,
                        "longitude": 91.93999753268359
                    },
                    {
                        "latitude": -11.62,
                        "longitude": 91.04,
                        "altitude": 100000
                    },
                    {
                        "latitude": -11.503574655305936,
                        "longitude": 89.62330916844495
                    },
                    {
                        "latitude": -11.380214527109338,
                        "longitude": 88.20675813457669
                    },
                    {
                        "latitude": -11.249980632057607,
                        "longitude": 86.79035072359726
                    },
                    {
                        "latitude": -11.112937794522995,
                        "longitude": 85.3740904077197
                    },
                    {
                        "latitude": -10.969154683014953,
                        "longitude": 83.95798029730486
                    },
                    {
                        "latitude": -10.818703846253761,
                        "longitude": 82.5420231329084
                    },
                    {
                        "latitude": -10.66166174851426,
                        "longitude": 81.12622127826104
                    },
                    {
                        "latitude": -10.498108803834992,
                        "longitude": 79.71057671420202
                    },
                    {
                        "latitude": -10.328129408675958,
                        "longitude": 78.29509103358359
                    },
                    {
                        "latitude": -10.15181197259797,
                        "longitude": 76.87976543716124
                    },
                    {
                        "latitude": -9.969248946527879,
                        "longitude": 75.46460073048212
                    },
                    {
                        "latitude": -9.9,
                        "longitude": 74.94,
                        "altitude": 100000
                    },
                    {
                        "latitude": -9.65478787012918,
                        "longitude": 73.6137752233882
                    },
                    {
                        "latitude": -9.404169626554916,
                        "longitude": 72.28772914687798
                    },
                    {
                        "latitude": -9.14826777007007,
                        "longitude": 70.96185860101878
                    },
                    {
                        "latitude": -8.887208743899249,
                        "longitude": 69.63616003464594
                    },
                    {
                        "latitude": -8.621122925208354,
                        "longitude": 68.31062952291987
                    },
                    {
                        "latitude": -8.35014460924494,
                        "longitude": 66.98526277620712
                    },
                    {
                        "latitude": -8.074411985764156,
                        "longitude": 65.6600551497811
                    },
                    {
                        "latitude": -7.794067107421211,
                        "longitude": 64.33500165431782
                    },
                    {
                        "latitude": -7.509255849840861,
                        "longitude": 63.010096967159974
                    },
                    {
                        "latitude": -7.220127863106812,
                        "longitude": 61.68533544432114
                    },
                    {
                        "latitude": -6.926836514449232,
                        "longitude": 60.36071113319943
                    },
                    {
                        "latitude": -6.629538821946723,
                        "longitude": 59.036217785968695
                    },
                    {
                        "latitude": -6.328395379099832,
                        "longitude": 57.711848873613285
                    },
                    {
                        "latitude": -6.023570270176301,
                        "longitude": 56.387597600571205
                    },
                    {
                        "latitude": -5.7152309762736335,
                        "longitude": 55.06345691994867
                    },
                    {
                        "latitude": -5.63,
                        "longitude": 54.7,
                        "altitude": 100000
                    },
                    {
                        "latitude": -5.424187585296476,
                        "longitude": 53.32088106737122
                    },
                    {
                        "latitude": -5.215120641011798,
                        "longitude": 51.941839415418755
                    },
                    {
                        "latitude": -5.002919502583524,
                        "longitude": 50.562871895422106
                    },
                    {
                        "latitude": -4.78770688915664,
                        "longitude": 49.18397518622593
                    },
                    {
                        "latitude": -4.569607836126686,
                        "longitude": 47.80514580213867
                    },
                    {
                        "latitude": -4.348749623288102,
                        "longitude": 46.42638010121538
                    },
                    {
                        "latitude": -4.125261698605323,
                        "longitude": 45.04767429390366
                    },
                    {
                        "latitude": -3.899275597644131,
                        "longitude": 43.669024452030804
                    },
                    {
                        "latitude": -3.6709248587211505,
                        "longitude": 42.29042651810965
                    },
                    {
                        "latitude": -3.4403449338498717,
                        "longitude": 40.91187631493967
                    },
                    {
                        "latitude": -3.2076730955821176,
                        "longitude": 39.53336955547925
                    },
                    {
                        "latitude": -2.97304833986444,
                        "longitude": 38.15490185296462
                    },
                    {
                        "latitude": -2.7366112850490367,
                        "longitude": 36.77646873125031
                    },
                    {
                        "latitude": -2.72,
                        "longitude": 36.68,
                        "altitude": 100000
                    },
                    {
                        "latitude": -2.3965696393809344,
                        "longitude": 35.327381627706956
                    },
                    {
                        "latitude": -2.0716566564398264,
                        "longitude": 33.97478361095132
                    },
                    {
                        "latitude": -1.7454592912061675,
                        "longitude": 32.622197556100225
                    },
                    {
                        "latitude": -1.4181771685199402,
                        "longitude": 31.269615048927694
                    },
                    {
                        "latitude": -1.0900110965508387,
                        "longitude": 29.91702767357353
                    },
                    {
                        "latitude": -0.7611628611939472,
                        "longitude": 28.564427031447103
                    },
                    {
                        "latitude": -0.4318350170039288,
                        "longitude": 27.211804760032802
                    },
                    {
                        "latitude": -0.10223067535397573,
                        "longitude": 25.85915255155479
                    },
                    {
                        "latitude": -0.1,
                        "longitude": 25.85,
                        "altitude": 100000
                    },
                    {
                        "latitude": 0.04064206429305626,
                        "longitude": 24.440617889290305
                    },
                    {
                        "latitude": 0.18125986307014327,
                        "longitude": 23.031227613197803
                    },
                    {
                        "latitude": 0.32176677515123,
                        "longitude": 21.62182764080562
                    },
                    {
                        "latitude": 0.4620762526398724,
                        "longitude": 20.21241646487159
                    },
                    {
                        "latitude": 0.6021018813704814,
                        "longitude": 18.802992605467157
                    },
                    {
                        "latitude": 0.7417574411951939,
                        "longitude": 17.393554613548318
                    },
                    {
                        "latitude": 0.8809569660290747,
                        "longitude": 15.984101074450207
                    },
                    {
                        "latitude": 1.0196148035732517,
                        "longitude": 14.574630611296868
                    },
                    {
                        "latitude": 1.1576456746367807,
                        "longitude": 13.16514188831827
                    },
                    {
                        "latitude": 1.2949647319795252,
                        "longitude": 11.755633614066554
                    },
                    {
                        "latitude": 1.4314876186001215,
                        "longitude": 10.346104544524025
                    },
                    {
                        "latitude": 1.5671305253951662,
                        "longitude": 8.936553486095503
                    },
                    {
                        "latitude": 1.7018102481180986,
                        "longitude": 7.526979298478013
                    },
                    {
                        "latitude": 1.8354442435688414,
                        "longitude": 6.117380897401023
                    },
                    {
                        "latitude": 1.967950684948094,
                        "longitude": 4.707757257230888
                    },
                    {
                        "latitude": 2.099248516313229,
                        "longitude": 3.298107413433338
                    },
                    {
                        "latitude": 2.1,
                        "longitude": 3.29,
                        "altitude": 100000
                    },
                    {
                        "latitude": 2.1860498171081035,
                        "longitude": 1.9265067073939264
                    },
                    {
                        "latitude": 2.270854152014639,
                        "longitude": 0.5629975309595848
                    },
                    {
                        "latitude": 2.3543650113868106,
                        "longitude": -0.8005276999019567
                    },
                    {
                        "latitude": 2.4365351719148727,
                        "longitude": -2.1640691194736026
                    },
                    {
                        "latitude": 2.5173182066613826,
                        "longitude": -3.5276268254200582
                    },
                    {
                        "latitude": 2.596668510770147,
                        "longitude": -4.89120087856813
                    },
                    {
                        "latitude": 2.674541326523509,
                        "longitude": -6.25479130277001
                    },
                    {
                        "latitude": 2.7508927677379873,
                        "longitude": -7.618398084849775
                    },
                    {
                        "latitude": 2.825679843489539,
                        "longitude": -8.982021174633308
                    },
                    {
                        "latitude": 2.8988604811610306,
                        "longitude": -10.345660485061488
                    },
                    {
                        "latitude": 2.970393548805718,
                        "longitude": -11.709315892386476
                    },
                    {
                        "latitude": 3.0402388768217774,
                        "longitude": -13.072987236450578
                    },
                    {
                        "latitude": 3.108357278934071,
                        "longitude": -14.436674321047136
                    },
                    {
                        "latitude": 3.11,
                        "longitude": -14.47,
                        "altitude": 100000
                    },
                    {
                        "latitude": 3.261719006371181,
                        "longitude": -15.909449182237239
                    },
                    {
                        "latitude": 3.411343436565091,
                        "longitude": -17.34894412830974
                    },
                    {
                        "latitude": 3.5587786201864513,
                        "longitude": -18.788485568992563
                    },
                    {
                        "latitude": 3.703931470412757,
                        "longitude": -20.22807411804187
                    },
                    {
                        "latitude": 3.846710542500308,
                        "longitude": -21.667710270673382
                    },
                    {
                        "latitude": 3.987026090096792,
                        "longitude": -23.10739440233581
                    },
                    {
                        "latitude": 4.124790119336787,
                        "longitude": -24.547126767782142
                    },
                    {
                        "latitude": 4.259916440704614,
                        "longitude": -25.986907500440942
                    },
                    {
                        "latitude": 4.392320718656892,
                        "longitude": -27.426736612089073
                    },
                    {
                        "latitude": 4.521920519004854,
                        "longitude": -28.866613992826597
                    },
                    {
                        "latitude": 4.648635354063944,
                        "longitude": -30.30653941135386
                    },
                    {
                        "latitude": 4.772386725585418,
                        "longitude": -31.7465125155502
                    },
                    {
                        "latitude": 4.893098165491513,
                        "longitude": -33.18653283335257
                    },
                    {
                        "latitude": 4.9,
                        "longitude": -33.27,
                        "altitude": 100000
                    },
                    {
                        "latitude": 5.16250643789586,
                        "longitude": -34.64120465780759
                    },
                    {
                        "latitude": 5.421880739230437,
                        "longitude": -36.012532713037295
                    },
                    {
                        "latitude": 5.677971195706403,
                        "longitude": -37.38398691020538
                    },
                    {
                        "latitude": 5.930628897208628,
                        "longitude": -38.75556970695745
                    },
                    {
                        "latitude": 6.179707824908335,
                        "longitude": -40.127283268697624
                    },
                    {
                        "latitude": 6.425064937663299,
                        "longitude": -41.49912946386026
                    },
                    {
                        "latitude": 6.666560251692623,
                        "longitude": -42.87110985983256
                    },
                    {
                        "latitude": 6.904056913537865,
                        "longitude": -44.24322571953575
                    },
                    {
                        "latitude": 7.137421266354319,
                        "longitude": -45.615477998670784
                    },
                    {
                        "latitude": 7.366522909607239,
                        "longitude": -46.98786734363372
                    },
                    {
                        "latitude": 7.39,
                        "longitude": -47.13,
                        "altitude": 100000
                    },
                    {
                        "latitude": 7.667200537957423,
                        "longitude": -48.51495902027066
                    },
                    {
                        "latitude": 7.93965517799837,
                        "longitude": -49.90009896990933
                    },
                    {
                        "latitude": 8.207209001752588,
                        "longitude": -51.28542104818075
                    },
                    {
                        "latitude": 8.469711318103228,
                        "longitude": -52.67092603514307
                    },
                    {
                        "latitude": 8.727015713724333,
                        "longitude": -54.05661428993335
                    },
                    {
                        "latitude": 8.978980094186847,
                        "longitude": -55.44248574996939
                    },
                    {
                        "latitude": 9.225466715948683,
                        "longitude": -56.82853993106972
                    },
                    {
                        "latitude": 9.466342209581152,
                        "longitude": -58.21477592849211
                    },
                    {
                        "latitude": 9.701477594617389,
                        "longitude": -59.60119241888965
                    },
                    {
                        "latitude": 9.93074828643781,
                        "longitude": -60.987787663181756
                    },
                    {
                        "latitude": 10.15403409563352,
                        "longitude": -62.374559510336105
                    },
                    {
                        "latitude": 10.371219220310481,
                        "longitude": -63.761505402055874
                    },
                    {
                        "latitude": 10.58219223181566,
                        "longitude": -65.14862237836523
                    },
                    {
                        "latitude": 10.786846054381076,
                        "longitude": -66.53590708408416
                    },
                    {
                        "latitude": 10.985077939192799,
                        "longitude": -67.92335577618245
                    },
                    {
                        "latitude": 11.176789433399737,
                        "longitude": -69.31096433200064
                    },
                    {
                        "latitude": 11.361886344581688,
                        "longitude": -70.69872825832425
                    },
                    {
                        "latitude": 11.44,
                        "longitude": -71.3,
                        "altitude": 100000
                    },
                    {
                        "latitude": 11.793523035404883,
                        "longitude": -72.57696317388813
                    },
                    {
                        "latitude": 12.140546191798249,
                        "longitude": -73.85425228058615
                    },
                    {
                        "latitude": 12.480914652828249,
                        "longitude": -75.13186842805884
                    },
                    {
                        "latitude": 12.81447963253811,
                        "longitude": -76.40981209484113
                    },
                    {
                        "latitude": 13.141098329022368,
                        "longitude": -77.68808312883709
                    },
                    {
                        "latitude": 13.46063386458213,
                        "longitude": -78.96668074719382
                    },
                    {
                        "latitude": 13.772955213329142,
                        "longitude": -80.24560353725613
                    },
                    {
                        "latitude": 14.077937117212416,
                        "longitude": -81.52484945860768
                    },
                    {
                        "latitude": 14.37545999145748,
                        "longitude": -82.80441584620313
                    },
                    {
                        "latitude": 14.5,
                        "longitude": -83.35,
                        "altitude": 100000
                    },
                    {
                        "latitude": 15.06882860853868,
                        "longitude": -84.6559104144887
                    },
                    {
                        "latitude": 15.627512633692339,
                        "longitude": -85.96255701207481
                    },
                    {
                        "latitude": 16.1757874572705,
                        "longitude": -87.26994933952722
                    },
                    {
                        "latitude": 16.713404928298466,
                        "longitude": -88.57809549972266
                    },
                    {
                        "latitude": 17.240133072328888,
                        "longitude": -89.8870021366751
                    },
                    {
                        "latitude": 17.755755742977918,
                        "longitude": -91.19667442237413
                    },
                    {
                        "latitude": 18.26007222148539,
                        "longitude": -92.50711604547514
                    },
                    {
                        "latitude": 18.75289677013529,
                        "longitude": -93.81832920189372
                    },
                    {
                        "latitude": 19.23405814533921,
                        "longitude": -95.1303145873661
                    },
                    {
                        "latitude": 19.703399076088196,
                        "longitude": -96.44307139204531
                    },
                    {
                        "latitude": 20.1,
                        "longitude": -97.58,
                        "altitude": 100000
                    },
                    {
                        "latitude": 20.548021352150123,
                        "longitude": -98.82779631523985
                    },
                    {
                        "latitude": 20.984805649761167,
                        "longitude": -100.0763251406866
                    },
                    {
                        "latitude": 21.410251362393847,
                        "longitude": -101.32558253053345
                    },
                    {
                        "latitude": 21.824267030760303,
                        "longitude": -102.57556323771146
                    },
                    {
                        "latitude": 22.22677074369452,
                        "longitude": -103.82626071678546
                    },
                    {
                        "latitude": 22.617689611592752,
                        "longitude": -105.07766712881622
                    },
                    {
                        "latitude": 22.996959239351384,
                        "longitude": -106.3297733482589
                    },
                    {
                        "latitude": 23.364523201575796,
                        "longitude": -107.58256897196367
                    },
                    {
                        "latitude": 23.72033252257937,
                        "longitude": -108.8360423303424
                    },
                    {
                        "latitude": 24.064345163441423,
                        "longitude": -110.09018050075984
                    },
                    {
                        "latitude": 24.396525518148444,
                        "longitude": -111.34496932320323
                    },
                    {
                        "latitude": 24.71684392060689,
                        "longitude": -112.60039341827745
                    },
                    {
                        "latitude": 25.0252761640905,
                        "longitude": -113.85643620756706
                    },
                    {
                        "latitude": 25.321803034470825,
                        "longitude": -115.11307993639807
                    },
                    {
                        "latitude": 25.606409858379354,
                        "longitude": -116.37030569902525
                    },
                    {
                        "latitude": 25.879086067262136,
                        "longitude": -117.62809346626146
                    },
                    {
                        "latitude": 26.139824778115468,
                        "longitude": -118.88642211555722
                    },
                    {
                        "latitude": 26.388622391532632,
                        "longitude": -120.145269463529
                    },
                    {
                        "latitude": 26.56,
                        "longitude": -121.05,
                        "altitude": 100000
                    },
                    {
                        "latitude": 27.015392068646428,
                        "longitude": -122.25972898333426
                    },
                    {
                        "latitude": 27.4572407018642,
                        "longitude": -123.47048992902272
                    },
                    {
                        "latitude": 27.885546321070294,
                        "longitude": -124.68227197109266
                    },
                    {
                        "latitude": 28.30031742079038,
                        "longitude": -125.8950625108673
                    },
                    {
                        "latitude": 28.701569776222865,
                        "longitude": -127.10884722175743
                    },
                    {
                        "latitude": 29.08932567947834,
                        "longitude": -128.3236100570327
                    },
                    {
                        "latitude": 29.463613205991955,
                        "longitude": -129.53933326070504
                    },
                    {
                        "latitude": 29.82446551221335,
                        "longitude": -130.75599738164397
                    },
                    {
                        "latitude": 30.17192016532348,
                        "longitude": -131.97358129103156
                    },
                    {
                        "latitude": 30.506018505410356,
                        "longitude": -133.19206220325157
                    },
                    {
                        "latitude": 30.826805040255444,
                        "longitude": -134.4114157002925
                    },
                    {
                        "latitude": 31.134326872636628,
                        "longitude": -135.63161575973024
                    },
                    {
                        "latitude": 31.42863315984237,
                        "longitude": -136.85263478633945
                    },
                    {
                        "latitude": 31.709774604911054,
                        "longitude": -138.07444364736816
                    },
                    {
                        "latitude": 31.72,
                        "longitude": -138.12,
                        "altitude": 100000
                    },
                    {
                        "latitude": 31.991410299682425,
                        "longitude": -139.3540009184965
                    },
                    {
                        "latitude": 32.24950247591896,
                        "longitude": -140.58874475742365
                    },
                    {
                        "latitude": 32.494330939891924,
                        "longitude": -141.82419703409056
                    },
                    {
                        "latitude": 32.72594991352899,
                        "longitude": -143.06032185109186
                    },
                    {
                        "latitude": 32.94441304898509,
                        "longitude": -144.2970819523334
                    },
                    {
                        "latitude": 33.149773076273355,
                        "longitude": -145.53443878279256
                    },
                    {
                        "latitude": 33.34208147792116,
                        "longitude": -146.77235255192613
                    },
                    {
                        "latitude": 33.52138818952234,
                        "longitude": -148.01078230062274
                    },
                    {
                        "latitude": 33.68774132506526,
                        "longitude": -149.24968597157883
                    },
                    {
                        "latitude": 33.84118692593739,
                        "longitude": -150.48902048296156
                    },
                    {
                        "latitude": 33.98176873253911,
                        "longitude": -151.7287418052064
                    },
                    {
                        "latitude": 34.10952797748056,
                        "longitude": -152.9688050407822
                    },
                    {
                        "latitude": 34.22450319938482,
                        "longitude": -154.20916450674255
                    },
                    {
                        "latitude": 34.3,
                        "longitude": -155.11,
                        "altitude": 100000
                    },
                    {
                        "latitude": 34.57390888769056,
                        "longitude": -156.2742999590753
                    },
                    {
                        "latitude": 34.835225077825086,
                        "longitude": -157.43944044988072
                    },
                    {
                        "latitude": 35.08402083779979,
                        "longitude": -158.60538777365073
                    },
                    {
                        "latitude": 35.32036724930333,
                        "longitude": -159.77210678237714
                    },
                    {
                        "latitude": 35.544333899298096,
                        "longitude": -160.9395609262863
                    },
                    {
                        "latitude": 35.75598859541929,
                        "longitude": -162.10771230487498
                    },
                    {
                        "latitude": 35.955397104499696,
                        "longitude": -163.27652172144082
                    },
                    {
                        "latitude": 36.142622912954764,
                        "longitude": -164.44594874102995
                    },
                    {
                        "latitude": 36.31772700779818,
                        "longitude": -165.61595175170817
                    },
                    {
                        "latitude": 36.4807676771021,
                        "longitude": -166.78648802904803
                    },
                    {
                        "latitude": 36.63180032876499,
                        "longitude": -167.95751380371107
                    },
                    {
                        "latitude": 36.77087732650584,
                        "longitude": -169.1289843319896
                    },
                    {
                        "latitude": 36.898047842061864,
                        "longitude": -170.3008539691607
                    },
                    {
                        "latitude": 37.01335772262954,
                        "longitude": -171.473076245492
                    },
                    {
                        "latitude": 37.1168493726543,
                        "longitude": -172.64560394472858
                    },
                    {
                        "latitude": 37.208561649140805,
                        "longitude": -173.81838918487782
                    },
                    {
                        "latitude": 37.28852976972517,
                        "longitude": -174.99138350110076
                    },
                    {
                        "latitude": 37.356785232819604,
                        "longitude": -176.16453793050846
                    },
                    {
                        "latitude": 37.41335574921141,
                        "longitude": -177.33780309865466
                    },
                    {
                        "latitude": 37.45826518456855,
                        "longitude": -178.51112930750767
                    },
                    {
                        "latitude": 37.49153351237604,
                        "longitude": -179.68446662468017
                    },
                    {
                        "latitude": 37.49735400322852,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": 37.49735400322852,
                        "longitude": 180
                    },
                    {
                        "latitude": 37.51317677689826,
                        "longitude": 179.1422350263117
                    },
                    {
                        "latitude": 37.523207065834235,
                        "longitude": 177.96902577499017
                    },
                    {
                        "latitude": 37.52163249240356,
                        "longitude": 176.79595571229376
                    },
                    {
                        "latitude": 37.508457186672516,
                        "longitude": 175.62307479862676
                    },
                    {
                        "latitude": 37.48368129599979,
                        "longitude": 174.4504327718172
                    },
                    {
                        "latitude": 37.447300994552755,
                        "longitude": 173.2780790552197
                    },
                    {
                        "latitude": 37.399308501914916,
                        "longitude": 172.10606266619814
                    },
                    {
                        "latitude": 37.339692110875596,
                        "longitude": 170.93443212521993
                    },
                    {
                        "latitude": 37.26843622456248,
                        "longitude": 169.76323536579125
                    },
                    {
                        "latitude": 37.18552140314745,
                        "longitude": 168.59251964545732
                    },
                    {
                        "latitude": 37.18,
                        "longitude": 168.52,
                        "altitude": 100000
                    },
                    {
                        "latitude": 38.056217772580816,
                        "longitude": 168.547054676096
                    },
                    {
                        "latitude": 38.91479593607573,
                        "longitude": 168.5742007009333
                    },
                    {
                        "latitude": 39.75595956234416,
                        "longitude": 168.60144089619797
                    },
                    {
                        "latitude": 40.57995220623496,
                        "longitude": 168.62877813397333
                    },
                    {
                        "latitude": 41.38703349479671,
                        "longitude": 168.65621533808562
                    },
                    {
                        "latitude": 42.17747686703325,
                        "longitude": 168.68375548542983
                    },
                    {
                        "latitude": 42.95156746572417,
                        "longitude": 168.71140160728638
                    },
                    {
                        "latitude": 43.70960018078577,
                        "longitude": 168.73915679063828
                    },
                    {
                        "latitude": 44.451877841936785,
                        "longitude": 168.76702417949767
                    },
                    {
                        "latitude": 45.05,
                        "longitude": 168.79,
                        "altitude": 100000
                    },
                    {
                        "latitude": 45.05,
                        "longitude": 168.79,
                        "altitude": 100000
                    },
                    {
                        "latitude": 45.162445984078516,
                        "longitude": 169.90852249367853
                    },
                    {
                        "latitude": 45.26361806824381,
                        "longitude": 171.02756862793237
                    },
                    {
                        "latitude": 45.35357444528224,
                        "longitude": 172.14706806924687
                    },
                    {
                        "latitude": 45.432367533602715,
                        "longitude": 173.26694951645248
                    },
                    {
                        "latitude": 45.50004397169657,
                        "longitude": 174.38714082241373
                    },
                    {
                        "latitude": 45.556644615373166,
                        "longitude": 175.5075691184693
                    },
                    {
                        "latitude": 45.60220453722235,
                        "longitude": 176.62816094127672
                    },
                    {
                        "latitude": 45.6367530278342,
                        "longitude": 177.74884236170126
                    },
                    {
                        "latitude": 45.660313598382146,
                        "longitude": 178.86953911538254
                    },
                    {
                        "latitude": 45.672903984248585,
                        "longitude": 179.99017673460273
                    },
                    {
                        "latitude": 45.67291829316015,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": 11.142172011366828,
                        "longitude": -180
                    },
                    {
                        "latitude": 11.1356907950496,
                        "longitude": -179.4101758994028
                    },
                    {
                        "latitude": 11.114344066032611,
                        "longitude": -178.03604255130062
                    },
                    {
                        "latitude": 11.08676083276176,
                        "longitude": -176.66195731018095
                    },
                    {
                        "latitude": 11.052954237657087,
                        "longitude": -175.28792537504506
                    },
                    {
                        "latitude": 11.01294032733213,
                        "longitude": -173.91395182436403
                    },
                    {
                        "latitude": 10.96673805937642,
                        "longitude": -172.54004160422312
                    },
                    {
                        "latitude": 10.914369310582943,
                        "longitude": -171.16619951675673
                    },
                    {
                        "latitude": 10.855858886536804,
                        "longitude": -169.79243020890303
                    },
                    {
                        "latitude": 10.791234532467643,
                        "longitude": -168.4187381615056
                    },
                    {
                        "latitude": 10.720526945255084,
                        "longitude": -167.0451276787898
                    },
                    {
                        "latitude": 10.6437697864633,
                        "longitude": -165.6716028782394
                    },
                    {
                        "latitude": 10.560999696268054,
                        "longitude": -164.29816768089938
                    },
                    {
                        "latitude": 10.472256308127244,
                        "longitude": -162.92482580212928
                    },
                    {
                        "latitude": 10.37758226403382,
                        "longitude": -161.55158074283037
                    },
                    {
                        "latitude": 10.31,
                        "longitude": -160.62,
                        "altitude": 100000
                    },
                    {
                        "latitude": 8.92869413767028,
                        "longitude": -160.50134016486896
                    },
                    {
                        "latitude": 7.537076993406277,
                        "longitude": -160.38270311798402
                    },
                    {
                        "latitude": 6.136524279639411,
                        "longitude": -160.2640742508866
                    },
                    {
                        "latitude": 4.7284720249415155,
                        "longitude": -160.14543913582781
                    },
                    {
                        "latitude": 3.314408339975556,
                        "longitude": -160.02678353223638
                    },
                    {
                        "latitude": 1.8958643206948051,
                        "longitude": -159.9080933916048
                    },
                    {
                        "latitude": 0.47440421550645834,
                        "longitude": -159.78935486053993
                    },
                    {
                        "latitude": -0.9483849941561854,
                        "longitude": -159.67055428175962
                    },
                    {
                        "latitude": -2.370904431621291,
                        "longitude": -159.55167819286078
                    },
                    {
                        "latitude": -3.791554398989379,
                        "longitude": -159.43271332273545
                    },
                    {
                        "latitude": -5.208745496932909,
                        "longitude": -159.31364658556714
                    },
                    {
                        "latitude": -6.620909597611988,
                        "longitude": -159.19446507239834
                    },
                    {
                        "latitude": -8.026510482002234,
                        "longitude": -159.07515604032056
                    },
                    {
                        "latitude": -9.42405396293284,
                        "longitude": -158.95570689939373
                    },
                    {
                        "latitude": -10.812097330687026,
                        "longitude": -158.83610519745687
                    },
                    {
                        "latitude": -12.189257978367062,
                        "longitude": -158.71633860303632
                    },
                    {
                        "latitude": -13.554221088395032,
                        "longitude": -158.59639488659758
                    },
                    {
                        "latitude": -14.905746288379031,
                        "longitude": -158.47626190041473
                    },
                    {
                        "latitude": -16.24267321291728,
                        "longitude": -158.3559275573504
                    },
                    {
                        "latitude": -17.56392593653336,
                        "longitude": -158.2353798088475
                    },
                    {
                        "latitude": -18.86851627070368,
                        "longitude": -158.11460662243147
                    },
                    {
                        "latitude": -20.1555459438513,
                        "longitude": -157.9935959590132
                    },
                    {
                        "latitude": -21.424207706419157,
                        "longitude": -157.87233575026087
                    },
                    {
                        "latitude": -22.673785423084414,
                        "longitude": -157.75081387628637
                    },
                    {
                        "latitude": -23.90365323043918,
                        "longitude": -157.6290181438604
                    },
                    {
                        "latitude": -25.113273850856,
                        "longitude": -157.50693626533692
                    },
                    {
                        "latitude": -26.30219616179476,
                        "longitude": -157.38455583843293
                    },
                    {
                        "latitude": -27.470052124666413,
                        "longitude": -157.26186432697338
                    },
                    {
                        "latitude": -28.6165531788637,
                        "longitude": -157.1388490426775
                    },
                    {
                        "latitude": -29.52,
                        "longitude": -157.04,
                        "altitude": 100000
                    },
                    {
                        "latitude": -29.751829996616777,
                        "longitude": -158.2877987240838
                    },
                    {
                        "latitude": -29.971030193531632,
                        "longitude": -159.53613824237934
                    },
                    {
                        "latitude": -30.1776295993666,
                        "longitude": -160.78498679401443
                    },
                    {
                        "latitude": -30.371657534809653,
                        "longitude": -162.03431157214362
                    },
                    {
                        "latitude": -30.55314332141531,
                        "longitude": -163.28407877959552
                    },
                    {
                        "latitude": -30.72211599284778,
                        "longitude": -164.53425368727693
                    },
                    {
                        "latitude": -30.87860402797214,
                        "longitude": -165.78480069523164
                    },
                    {
                        "latitude": -31.022635105185298,
                        "longitude": -167.03568339623928
                    },
                    {
                        "latitude": -31.154235877375065,
                        "longitude": -168.2868646418286
                    },
                    {
                        "latitude": -31.273431766902036,
                        "longitude": -169.53830661056713
                    },
                    {
                        "latitude": -31.380246780013785,
                        "longitude": -170.78997087847927
                    },
                    {
                        "latitude": -31.474703340123472,
                        "longitude": -172.04181849143515
                    },
                    {
                        "latitude": -31.556822139413814,
                        "longitude": -173.29381003934247
                    },
                    {
                        "latitude": -31.626622008262444,
                        "longitude": -174.54590573196586
                    },
                    {
                        "latitude": -31.684119802023996,
                        "longitude": -175.79806547619043
                    },
                    {
                        "latitude": -31.729330304748867,
                        "longitude": -177.05024895453926
                    },
                    {
                        "latitude": -31.76226614946546,
                        "longitude": -178.30241570474888
                    },
                    {
                        "latitude": -31.782937754703724,
                        "longitude": -179.55452520020157
                    },
                    {
                        "latitude": -31.785932058202345,
                        "longitude": -180
                    },
                    {
                        "latitude": -26.45245501011025,
                        "longitude": -180
                    },
                    {
                        "latitude": -26.443245006239163,
                        "longitude": -179.54401577535816
                    },
                    {
                        "latitude": -26.404779140354112,
                        "longitude": -178.23285205602684
                    },
                    {
                        "latitude": -26.354337538391913,
                        "longitude": -176.9219205277633
                    },
                    {
                        "latitude": -26.291923233414913,
                        "longitude": -175.61125010578337
                    },
                    {
                        "latitude": -26.21753930689174,
                        "longitude": -174.3008691994812
                    },
                    {
                        "latitude": -26.131188970220524,
                        "longitude": -172.9908056491621
                    },
                    {
                        "latitude": -26.032875663530753,
                        "longitude": -171.68108666384015
                    },
                    {
                        "latitude": -25.92260317180683,
                        "longitude": -170.3717387602638
                    },
                    {
                        "latitude": -25.800375758380966,
                        "longitude": -169.06278770332835
                    },
                    {
                        "latitude": -25.666198315843385,
                        "longitude": -167.75425844803104
                    },
                    {
                        "latitude": -25.63,
                        "longitude": -167.42,
                        "altitude": 100000
                    },
                    {
                        "latitude": -24.482387635591245,
                        "longitude": -167.6361429029071
                    },
                    {
                        "latitude": -23.31514670623538,
                        "longitude": -167.8519186379265
                    },
                    {
                        "latitude": -22.128633433031233,
                        "longitude": -168.06735447676834
                    },
                    {
                        "latitude": -20.923277366555695,
                        "longitude": -168.28247757411572
                    },
                    {
                        "latitude": -19.699584081210922,
                        "longitude": -168.49731495871646
                    },
                    {
                        "latitude": -18.458137367230126,
                        "longitude": -168.71189352271676
                    },
                    {
                        "latitude": -17.199600835946285,
                        "longitude": -168.92624000936124
                    },
                    {
                        "latitude": -15.924718856103349,
                        "longitude": -169.14038099923258
                    },
                    {
                        "latitude": -14.634316743780614,
                        "longitude": -169.3543428952528
                    },
                    {
                        "latitude": -13.329300136122962,
                        "longitude": -169.56815190671642
                    },
                    {
                        "latitude": -12.010653489641447,
                        "longitude": -169.7818340326747
                    },
                    {
                        "latitude": -10.679437657369693,
                        "longitude": -169.9954150450332
                    },
                    {
                        "latitude": -10.4,
                        "longitude": -170.04,
                        "altitude": 100000
                    },
                    {
                        "latitude": -10.530935899551062,
                        "longitude": -171.42235227892547
                    },
                    {
                        "latitude": -10.655780955175954,
                        "longitude": -172.8047939657111
                    },
                    {
                        "latitude": -10.774474554638326,
                        "longitude": -174.18732008561622
                    },
                    {
                        "latitude": -10.886959468433949,
                        "longitude": -175.56992546708264
                    },
                    {
                        "latitude": -10.993181824681074,
                        "longitude": -176.95260475340177
                    },
                    {
                        "latitude": -11.093091083559434,
                        "longitude": -178.3353524148237
                    },
                    {
                        "latitude": -11.186640011570232,
                        "longitude": -179.71816276108353
                    },
                    {
                        "latitude": -11.204400651245713,
                        "longitude": -180
                    },
                    {
                        "latitude": -4.395423789766706,
                        "longitude": -180
                    },
                    {
                        "latitude": -4.356512035422827,
                        "longitude": -178.78002778598264
                    },
                    {
                        "latitude": -4.308141798819642,
                        "longitude": -177.34861284989864
                    },
                    {
                        "latitude": -4.257087175322173,
                        "longitude": -175.9172186519704
                    },
                    {
                        "latitude": -4.203379176717105,
                        "longitude": -174.48584567949837
                    },
                    {
                        "latitude": -4.147050454794329,
                        "longitude": -173.05449436675084
                    },
                    {
                        "latitude": -4.088135285758802,
                        "longitude": -171.62316509387185
                    },
                    {
                        "latitude": -4.0266695536925035,
                        "longitude": -170.19185818592484
                    },
                    {
                        "latitude": -4.02,
                        "longitude": -170.04,
                        "altitude": 100000
                    },
                    {
                        "latitude": -2.511772674275812,
                        "longitude": -170.11482014080605
                    },
                    {
                        "latitude": -0.9994174308358517,
                        "longitude": -170.18967159861856
                    },
                    {
                        "latitude": 0.5151657009116205,
                        "longitude": -170.26456421886968
                    },
                    {
                        "latitude": 2.030055620720154,
                        "longitude": -170.3395076894293
                    },
                    {
                        "latitude": 2.04,
                        "longitude": -170.34,
                        "altitude": 100000
                    },
                    {
                        "latitude": 2.168947242831715,
                        "longitude": -171.71525541105854
                    },
                    {
                        "latitude": 2.296626828504608,
                        "longitude": -173.09053732675162
                    },
                    {
                        "latitude": 2.422964600890776,
                        "longitude": -174.4658465229335
                    },
                    {
                        "latitude": 2.5478872714181735,
                        "longitude": -175.84118371266285
                    },
                    {
                        "latitude": 2.6713224636943163,
                        "longitude": -177.21654954457617
                    },
                    {
                        "latitude": 2.793198757094416,
                        "longitude": -178.5919446014079
                    },
                    {
                        "latitude": 2.913445729279821,
                        "longitude": -179.96736939866207
                    },
                    {
                        "latitude": 2.9162581086933246,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": 2.9162581086933246,
                        "longitude": 180
                    },
                    {
                        "latitude": 3.0319939976161,
                        "longitude": 178.65717561656282
                    },
                    {
                        "latitude": 3.148775259463551,
                        "longitude": 177.28169006659274
                    },
                    {
                        "latitude": 3.2637223313164108,
                        "longitude": 175.90617364403823
                    },
                    {
                        "latitude": 3.3767691867705394,
                        "longitude": 174.5306261124945
                    },
                    {
                        "latitude": 3.4878509933028132,
                        "longitude": 173.1550473070794
                    },
                    {
                        "latitude": 3.5969041478488974,
                        "longitude": 171.7794371348084
                    },
                    {
                        "latitude": 3.6,
                        "longitude": 171.74,
                        "altitude": 100000
                    },
                    {
                        "latitude": 5.096710222588534,
                        "longitude": 171.58841361864594
                    },
                    {
                        "latitude": 6.587991957960904,
                        "longitude": 171.43666936838596
                    },
                    {
                        "latitude": 8.072030780340135,
                        "longitude": 171.28474919600794
                    },
                    {
                        "latitude": 9.547063827271138,
                        "longitude": 171.1326352952096
                    },
                    {
                        "latitude": 11.011392257557635,
                        "longitude": 170.98031008205402
                    },
                    {
                        "latitude": 11.11,
                        "longitude": 170.97,
                        "altitude": 100000
                    },
                    {
                        "latitude": 11.13243353951805,
                        "longitude": 172.34431699736487
                    },
                    {
                        "latitude": 11.148619654789343,
                        "longitude": 173.7186246122317
                    },
                    {
                        "latitude": 11.158551216272183,
                        "longitude": 175.09291715208448
                    },
                    {
                        "latitude": 11.162223995698602,
                        "longitude": 176.46718895629138
                    },
                    {
                        "latitude": 11.159636661574796,
                        "longitude": 177.8414344091623
                    },
                    {
                        "latitude": 11.150790776318614,
                        "longitude": 179.2156479529262
                    },
                    {
                        "latitude": 11.142172011366828,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": -31.785932058202345,
                        "longitude": 180
                    },
                    {
                        "latitude": -31.79135327699044,
                        "longitude": 179.19346306899027
                    },
                    {
                        "latitude": -31.78751857910119,
                        "longitude": 177.94158951445638
                    },
                    {
                        "latitude": -31.771437213910442,
                        "longitude": 176.6898943678071
                    },
                    {
                        "latitude": -31.74311042373738,
                        "longitude": 175.43841759885083
                    },
                    {
                        "latitude": -31.702537155143013,
                        "longitude": 174.18719883400087
                    },
                    {
                        "latitude": -31.649714089191047,
                        "longitude": 172.9362772750845
                    },
                    {
                        "latitude": -31.58463568724175,
                        "longitude": 171.68569161876295
                    },
                    {
                        "latitude": -31.5072942524042,
                        "longitude": 170.43547997677018
                    },
                    {
                        "latitude": -31.417680006826696,
                        "longitude": 169.18567979717488
                    },
                    {
                        "latitude": -31.34,
                        "longitude": 168.22,
                        "altitude": 100000
                    },
                    {
                        "latitude": -30.380550164407328,
                        "longitude": 168.30438207334805
                    },
                    {
                        "latitude": -29.403988946154623,
                        "longitude": 168.3885799866047
                    },
                    {
                        "latitude": -28.410337973956313,
                        "longitude": 168.4726028185868
                    },
                    {
                        "latitude": -27.399656922039828,
                        "longitude": 168.55645960625617
                    },
                    {
                        "latitude": -26.372046107240884,
                        "longitude": 168.64015934567965
                    },
                    {
                        "latitude": -26.25,
                        "longitude": 168.65,
                        "altitude": 100000
                    },
                    {
                        "latitude": -26.31946243974744,
                        "longitude": 169.9619009779124
                    },
                    {
                        "latitude": -26.376919101715004,
                        "longitude": 171.2738420135415
                    },
                    {
                        "latitude": -26.422373408298867,
                        "longitude": 172.5857925787701
                    },
                    {
                        "latitude": -26.455828872583943,
                        "longitude": 173.89772206177534
                    },
                    {
                        "latitude": -26.477289024351773,
                        "longitude": 175.20959983228408
                    },
                    {
                        "latitude": -26.486757353543343,
                        "longitude": 176.52139530728323
                    },
                    {
                        "latitude": -26.484237271099005,
                        "longitude": 177.8330780170185
                    },
                    {
                        "latitude": -26.469732087111073,
                        "longitude": 179.14461767111393
                    },
                    {
                        "latitude": -26.45245501011025,
                        "longitude": 180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 12,
                            "linkTo": 754
                        },
                        "290": {
                            "visited": true,
                            "forPole": false,
                            "index": 302,
                            "linkTo": 470
                        },
                        "291": {
                            "visited": true,
                            "forPole": false,
                            "index": 470,
                            "linkTo": 302
                        },
                        "575": {
                            "visited": false,
                            "forPole": false,
                            "index": 754,
                            "linkTo": 12
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 755,
                            "linkTo": 11
                        },
                        "33": {
                            "visited": false,
                            "forPole": false,
                            "index": 11,
                            "linkTo": 755
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 346,
                            "linkTo": 324
                        },
                        "64": {
                            "visited": true,
                            "forPole": false,
                            "index": 410,
                            "linkTo": 437
                        },
                        "65": {
                            "visited": true,
                            "forPole": false,
                            "index": 437,
                            "linkTo": 410
                        },
                        "97": {
                            "visited": true,
                            "forPole": false,
                            "index": 469,
                            "linkTo": 303
                        },
                        "98": {
                            "visited": true,
                            "forPole": false,
                            "index": 303,
                            "linkTo": 469
                        },
                        "119": {
                            "visited": false,
                            "forPole": false,
                            "index": 324,
                            "linkTo": 346
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 325,
                            "linkTo": 345
                        },
                        "20": {
                            "visited": false,
                            "forPole": false,
                            "index": 345,
                            "linkTo": 325
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 411,
                            "linkTo": 436
                        },
                        "25": {
                            "visited": false,
                            "forPole": false,
                            "index": 436,
                            "linkTo": 411
                        }
                    }
                }
            ]
        }
    ];
    var polygonOverTheGlobeOutput = transformOutputData(polygonOverTheGlobeRawOutput);

    var polygonSouthPoleAndIntersectionRawInput = [
        [
            {
                "latitude": -85.07088484266322,
                "longitude": 140.43400971467202,
                "altitude": 2753.885010796302
            },
            {
                "latitude": -85.1429911034316,
                "longitude": 141.6353198179013
            },
            {
                "latitude": -85.21277205457805,
                "longitude": 142.86968986167076
            },
            {
                "latitude": -85.28015047304503,
                "longitude": 144.13743325621428
            },
            {
                "latitude": -85.34504699368168,
                "longitude": 145.4387564561269
            },
            {
                "latitude": -85.40738039319889,
                "longitude": 146.7737450560712
            },
            {
                "latitude": -85.46706792739323,
                "longitude": 148.14234959811043
            },
            {
                "latitude": -85.52402572413692,
                "longitude": 149.54437134782896
            },
            {
                "latitude": -85.57816923364328,
                "longitude": 150.97944834869452
            },
            {
                "latitude": -85.62941373627886,
                "longitude": 152.44704211522165
            },
            {
                "latitude": -85.6776749066829,
                "longitude": 153.94642537227824
            },
            {
                "latitude": -85.72286943119755,
                "longitude": 155.47667128662164
            },
            {
                "latitude": -85.76491567363416,
                "longitude": 157.03664466332097
            },
            {
                "latitude": -85.80373438226206,
                "longitude": 158.6249955898122
            },
            {
                "latitude": -85.83924942868653,
                "longitude": 160.2401559997927
            },
            {
                "latitude": -85.87138856707548,
                "longitude": 161.880339594463
            },
            {
                "latitude": -85.90008420013402,
                "longitude": 163.54354549730039
            },
            {
                "latitude": -85.9252741364395,
                "longitude": 165.22756592972604
            },
            {
                "latitude": -85.9469023223834,
                "longitude": 166.92999807982252
            },
            {
                "latitude": -85.96491953115,
                "longitude": 168.64826019809271
            },
            {
                "latitude": -85.97928399101654,
                "longitude": 170.37961179892497
            },
            {
                "latitude": -85.98996193586474,
                "longitude": 172.1211776819456
            },
            {
                "latitude": -85.99692806218913,
                "longitude": 173.86997532353308
            },
            {
                "latitude": -86.00016587905402,
                "longitude": 175.62294503614797
            },
            {
                "latitude": -85.99966794032747,
                "longitude": 177.37698216253318
            },
            {
                "latitude": -85.99543595196566,
                "longitude": 179.12897047294453
            },
            {
                "latitude": -85.98748075096505,
                "longitude": -179.1241841260044
            },
            {
                "latitude": -85.97582215664112,
                "longitude": -177.38552047786308
            },
            {
                "latitude": -85.9604886988872,
                "longitude": -175.65799053552138
            },
            {
                "latitude": -85.9415172318083,
                "longitude": -173.94442999775396
            },
            {
                "latitude": -85.91895244440478,
                "longitude": -172.24753191805382
            },
            {
                "latitude": -85.89284628263975,
                "longitude": -170.5698238420483
            },
            {
                "latitude": -85.86325729914715,
                "longitude": -168.91364887245
            },
            {
                "latitude": -85.8302499479792,
                "longitude": -167.2811508952836
            },
            {
                "latitude": -85.79389384215035,
                "longitude": -165.67426403853952
            },
            {
                "latitude": -85.75426299135724,
                "longitude": -164.0947062837068
            },
            {
                "latitude": -85.71143503625393,
                "longitude": -162.5439770191664
            },
            {
                "latitude": -85.66549049413548,
                "longitude": -161.02335821725097
            },
            {
                "latitude": -85.61651202899877,
                "longitude": -159.53391883657247
            },
            {
                "latitude": -85.56458375682085,
                "longitude": -158.0765219984341
            },
            {
                "latitude": -85.50979059467211,
                "longitude": -156.65183445935725
            },
            {
                "latitude": -85.45221766007616,
                "longitude": -155.260337898112
            },
            {
                "latitude": -85.39194972493033,
                "longitude": -153.90234155136662
            },
            {
                "latitude": -85.32907072638913,
                "longitude": -152.57799576292703
            },
            {
                "latitude": -85.26366333543028,
                "longitude": -151.2873060532354
            },
            {
                "latitude": -85.19580858239954,
                "longitude": -150.03014736431277
            },
            {
                "latitude": -85.12558553767073,
                "longitude": -148.80627818711582
            },
            {
                "latitude": -85.05307104465835,
                "longitude": -147.61535433039867
            },
            {
                "latitude": -84.97833950176083,
                "longitude": -146.4569421403278
            },
            {
                "latitude": -84.9014626893697,
                "longitude": -145.33053102663865
            },
            {
                "latitude": -84.82250963782668,
                "longitude": -144.23554519295854
            },
            {
                "latitude": -84.74154653210958,
                "longitude": -143.17135450546047
            },
            {
                "latitude": -84.66468006669442,
                "longitude": -142.21087049203012,
                "altitude": 279.884700681834
            },
            {
                "latitude": -84.76992669761403,
                "longitude": -141.30710672947268
            },
            {
                "latitude": -84.8735065339294,
                "longitude": -140.36954530590228
            },
            {
                "latitude": -84.97536073407846,
                "longitude": -139.39668044612122
            },
            {
                "latitude": -85.07542556618192,
                "longitude": -138.38696464722486
            },
            {
                "latitude": -85.17363216233593,
                "longitude": -137.3388145621192
            },
            {
                "latitude": -85.26990627820686,
                "longitude": -136.25061863215313
            },
            {
                "latitude": -85.3641680635043,
                "longitude": -135.12074674984672
            },
            {
                "latitude": -85.45633185018859,
                "longitude": -133.94756225324514
            },
            {
                "latitude": -85.54630596670388,
                "longitude": -132.7294365678071
            },
            {
                "latitude": -85.633992588111,
                "longitude": -131.46476681654838
            },
            {
                "latitude": -85.71928763370987,
                "longitude": -130.1519967101659
            },
            {
                "latitude": -85.80208072551164,
                "longitude": -128.7896410009673
            },
            {
                "latitude": -85.88225522270791,
                "longitude": -127.3763137317412
            },
            {
                "latitude": -85.95968834894158,
                "longitude": -125.91076042677322
            },
            {
                "latitude": -86.03425143059732,
                "longitude": -124.3918942504423
            },
            {
                "latitude": -86.10581026528378,
                "longitude": -122.81883599314949
            },
            {
                "latitude": -86.1742256399645,
                "longitude": -121.19095753017977
            },
            {
                "latitude": -86.23935401753214,
                "longitude": -119.50792813476002
            },
            {
                "latitude": -86.30104840872232,
                "longitude": -117.76976271477074
            },
            {
                "latitude": -86.35915944284834,
                "longitude": -115.9768706922547
            },
            {
                "latitude": -86.41353664563366,
                "longitude": -114.13010387294389
            },
            {
                "latitude": -86.46402992527692,
                "longitude": -112.23080128562898
            },
            {
                "latitude": -86.51049125874414,
                "longitude": -110.28082864402609
            },
            {
                "latitude": -86.55277655932183,
                "longitude": -108.28260984093971
            },
            {
                "latitude": -86.59074769408969,
                "longitude": -106.23914777525974
            },
            {
                "latitude": -86.62427460687766,
                "longitude": -104.15403188559823
            },
            {
                "latitude": -86.65323748943655,
                "longitude": -102.03143006106359
            },
            {
                "latitude": -86.67752893218933,
                "longitude": -99.8760631435835
            },
            {
                "latitude": -86.69705597737686,
                "longitude": -97.69316102507798
            },
            {
                "latitude": -86.71174199297526,
                "longitude": -95.4884003416553
            },
            {
                "latitude": -86.72152828651802,
                "longitude": -93.26782490588053
            },
            {
                "latitude": -86.72637538453114,
                "longitude": -91.03775119611046
            },
            {
                "latitude": -86.72626391574877,
                "longitude": -88.80466231796065
            },
            {
                "latitude": -86.72119505393528,
                "longitude": -86.57509474296603
            },
            {
                "latitude": -86.71119049770502,
                "longitude": -84.35552270569745
            },
            {
                "latitude": -86.69629198833657,
                "longitude": -82.15224533035925
            },
            {
                "latitude": -86.67656039009482,
                "longitude": -79.97128133683017
            },
            {
                "latitude": -86.65207437888284,
                "longitude": -77.81827557260885
            },
            {
                "latitude": -86.62292880232421,
                "longitude": -75.69842070709566
            },
            {
                "latitude": -86.5892327863636,
                "longitude": -73.61639631777275
            },
            {
                "latitude": -86.55110766956307,
                "longitude": -71.57632641877396
            },
            {
                "latitude": -86.50868484657006,
                "longitude": -69.581755351003
            },
            {
                "latitude": -86.46210359740225,
                "longitude": -67.63564096820936
            },
            {
                "latitude": -86.41150897036086,
                "longitude": -65.74036328261477
            },
            {
                "latitude": -86.35704977483552,
                "longitude": -63.89774620911273
            },
            {
                "latitude": -86.29887672736363,
                "longitude": -62.10908976870232
            },
            {
                "latitude": -86.23714078122168,
                "longitude": -60.37521005421871
            },
            {
                "latitude": -86.17199165754292,
                "longitude": -58.69648438276098
            },
            {
                "latitude": -86.10357658512056,
                "longitude": -57.0728993102791
            },
            {
                "latitude": -86.03203924707981,
                "longitude": -55.50409951552688
            },
            {
                "latitude": -85.9575189256063,
                "longitude": -53.98943592948013
            },
            {
                "latitude": -85.88014983088225,
                "longitude": -52.52801185738449
            },
            {
                "latitude": -85.80006059708931,
                "longitude": -51.11872618843525
            },
            {
                "latitude": -85.71737392656124,
                "longitude": -49.760313096467456
            },
            {
                "latitude": -85.63220636259274,
                "longitude": -48.45137789553784
            },
            {
                "latitude": -85.54466817176498,
                "longitude": -47.19042892458962
            },
            {
                "latitude": -85.45486331765385,
                "longitude": -45.975905497504264
            },
            {
                "latitude": -85.36288950922383,
                "longitude": -44.80620207347198
            },
            {
                "latitude": -85.26883830889655,
                "longitude": -43.67968888390036
            },
            {
                "latitude": -85.17279528706281,
                "longitude": -42.594729302636885
            },
            {
                "latitude": -85.07484021159233,
                "longitude": -41.54969427252544
            },
            {
                "latitude": -84.97504726259012,
                "longitude": -40.54297410907818
            },
            {
                "latitude": -84.87348526423348,
                "longitude": -39.57298799635556
            },
            {
                "latitude": -84.77021792694114,
                "longitude": -38.6381914751831
            },
            {
                "latitude": -84.66530409439454,
                "longitude": -37.73708220292759
            },
            {
                "latitude": -84.55879799102472,
                "longitude": -36.868204239792675
            },
            {
                "latitude": -84.45074946652663,
                "longitude": -36.03015109089862
            },
            {
                "latitude": -84.3412042347553,
                "longitude": -35.22156770767214
            },
            {
                "latitude": -84.23020410502754,
                "longitude": -34.441151627240885
            },
            {
                "latitude": -84.11778720440377,
                "longitude": -33.68765340521939
            },
            {
                "latitude": -84.00398818997363,
                "longitude": -32.959876475845064
            },
            {
                "latitude": -83.88883845053087,
                "longitude": -32.25667655404568
            },
            {
                "latitude": -83.77939303790043,
                "longitude": -31.617109768312034,
                "altitude": 1755.736411014133
            },
            {
                "latitude": -83.84921639368022,
                "longitude": -30.52608778122047
            },
            {
                "latitude": -83.91662130081416,
                "longitude": -29.413154138937657
            },
            {
                "latitude": -83.98155492153568,
                "longitude": -28.278381925351592
            },
            {
                "latitude": -84.04396372918816,
                "longitude": -27.12191077146261
            },
            {
                "latitude": -84.10379372055553,
                "longitude": -25.94395156759378
            },
            {
                "latitude": -84.16099064883238,
                "longitude": -24.744790963655756
            },
            {
                "latitude": -84.21550027677823,
                "longitude": -23.524795564013743
            },
            {
                "latitude": -84.26726864918277,
                "longitude": -22.284415716691253
            },
            {
                "latitude": -84.31624238329827,
                "longitude": -21.02418879162895
            },
            {
                "latitude": -84.36236897540411,
                "longitude": -19.744741840009404
            },
            {
                "latitude": -84.40559712114296,
                "longitude": -18.44679352676226
            },
            {
                "latitude": -84.44587704674251,
                "longitude": -17.131155231742355
            },
            {
                "latitude": -84.48316084771665,
                "longitude": -15.798731222107962
            },
            {
                "latitude": -84.51740283114944,
                "longitude": -14.450517809388138
            },
            {
                "latitude": -84.5485598572222,
                "longitude": -13.087601419729623
            },
            {
                "latitude": -84.57659167527532,
                "longitude": -11.71115552478329
            },
            {
                "latitude": -84.60146124941801,
                "longitude": -10.32243640333879
            },
            {
                "latitude": -84.62313506853418,
                "longitude": -8.92277772962856
            },
            {
                "latitude": -84.64158343549994,
                "longitude": -7.513584012454266
            },
            {
                "latitude": -84.65678073053367,
                "longitude": -6.096322938987068
            },
            {
                "latitude": -84.66870564386441,
                "longitude": -4.672516707129941
            },
            {
                "latitude": -84.6773413733069,
                "longitude": -3.243732459463022
            },
            {
                "latitude": -84.68267578289534,
                "longitude": -1.8115719587272932
            },
            {
                "latitude": -84.68470151941115,
                "longitude": -0.3776606682775445
            },
            {
                "latitude": -84.68341608444089,
                "longitude": 1.0563635801927642
            },
            {
                "latitude": -84.67882186048567,
                "longitude": 2.488862136034622
            },
            {
                "latitude": -84.6709260905822,
                "longitude": 3.918207093435684
            },
            {
                "latitude": -84.65974081185557,
                "longitude": 5.342792666450917
            },
            {
                "latitude": -84.64528274436725,
                "longitude": 6.761046178261306
            },
            {
                "latitude": -84.6275731375136,
                "longitude": 8.171438480122056
            },
            {
                "latitude": -84.60663757704728,
                "longitude": 9.572493633599978
            },
            {
                "latitude": -84.58250575649299,
                "longitude": 10.962797712592312
            },
            {
                "latitude": -84.55521121730438,
                "longitude": 12.341006608138585
            },
            {
                "latitude": -84.52479106254026,
                "longitude": 13.705852747938861
            },
            {
                "latitude": -84.49128564911513,
                "longitude": 15.056150672477676
            },
            {
                "latitude": -84.45473826380726,
                "longitude": 16.390801439471257
            },
            {
                "latitude": -84.4151947881913,
                "longitude": 17.70879585685646
            },
            {
                "latitude": -84.37270335751226,
                "longitude": 19.009216570744467
            },
            {
                "latitude": -84.32731401825602,
                "longitude": 20.29123905789469
            },
            {
                "latitude": -84.27907838880634,
                "longitude": 21.554131591775608
            },
            {
                "latitude": -84.2280493271518,
                "longitude": 22.797254266850512
            },
            {
                "latitude": -84.17428060911084,
                "longitude": 24.020057177255275
            },
            {
                "latitude": -84.11782662003337,
                "longitude": 25.222077853612088
            },
            {
                "latitude": -84.05874206240432,
                "longitude": 26.402938065595308
            },
            {
                "latitude": -83.99708168125301,
                "longitude": 27.56234009840612
            },
            {
                "latitude": -83.93290000877066,
                "longitude": 28.70006260897183
            },
            {
                "latitude": -83.86625112906898,
                "longitude": 29.81595616296419
            },
            {
                "latitude": -83.79718846358233,
                "longitude": 30.909938547141255
            },
            {
                "latitude": -83.72576457723608,
                "longitude": 31.981989943558382
            },
            {
                "latitude": -83.65203100517058,
                "longitude": 33.03214804333007
            },
            {
                "latitude": -83.576038099529,
                "longitude": 34.060503168272554
            },
            {
                "latitude": -83.4978348955871,
                "longitude": 35.06719345927274
            },
            {
                "latitude": -83.41746899631944,
                "longitude": 36.0524001809094
            },
            {
                "latitude": -83.33498647435816,
                "longitude": 37.01634318292999
            },
            {
                "latitude": -83.2504317902015,
                "longitude": 37.95927655083476
            },
            {
                "latitude": -83.16384772546724,
                "longitude": 38.881484470161595
            },
            {
                "latitude": -83.07527532995405,
                "longitude": 39.78327732217207
            },
            {
                "latitude": -82.98475388126883,
                "longitude": 40.664988022548236
            },
            {
                "latitude": -82.8923208557923,
                "longitude": 41.526968609421935
            },
            {
                "latitude": -82.79801190979276,
                "longitude": 42.369587082551284
            },
            {
                "latitude": -82.70186086954003,
                "longitude": 43.193224491692256
            },
            {
                "latitude": -82.60389972933373,
                "longitude": 43.99827226913255
            },
            {
                "latitude": -82.504158656421,
                "longitude": 44.785129798896925
            },
            {
                "latitude": -82.4026660018508,
                "longitude": 45.55420221323464
            },
            {
                "latitude": -82.29944831638005,
                "longitude": 46.30589840558926
            },
            {
                "latitude": -82.19453037062317,
                "longitude": 47.04062924826747
            },
            {
                "latitude": -82.08793517870352,
                "longitude": 47.75880600240004
            },
            {
                "latitude": -81.9796840247386,
                "longitude": 48.46083890746971
            },
            {
                "latitude": -81.86979649155349,
                "longitude": 49.14713593761196
            },
            {
                "latitude": -81.75829049108457,
                "longitude": 49.81810171202884
            },
            {
                "latitude": -81.64518229599071,
                "longitude": 50.47413654715077
            },
            {
                "latitude": -81.53048657204715,
                "longitude": 51.115635638599464
            },
            {
                "latitude": -81.41421641094792,
                "longitude": 51.74298836151537
            },
            {
                "latitude": -81.29638336318811,
                "longitude": 52.35657767838881
            },
            {
                "latitude": -81.1769974707425,
                "longitude": 52.95677964415162
            },
            {
                "latitude": -81.05606729929335,
                "longitude": 53.54396299892869
            },
            {
                "latitude": -80.93359996979659,
                "longitude": 54.11848883950027
            },
            {
                "latitude": -80.80960118920729,
                "longitude": 54.680710361173226
            },
            {
                "latitude": -80.6840752802109,
                "longitude": 55.230972662396525
            },
            {
                "latitude": -80.55702520983465,
                "longitude": 55.769612605070925
            },
            {
                "latitude": -80.42845261683257,
                "longitude": 56.296958724095155
            },
            {
                "latitude": -80.29835783775923,
                "longitude": 56.813331180252106
            },
            {
                "latitude": -80.16673993166093,
                "longitude": 57.319041751070785
            },
            {
                "latitude": -80.03359670333136,
                "longitude": 57.81439385479703
            },
            {
                "latitude": -79.89892472508785,
                "longitude": 58.29968260307253
            },
            {
                "latitude": -79.76271935703765,
                "longitude": 58.77519487835301
            },
            {
                "latitude": -79.62497476581028,
                "longitude": 59.241209432496156
            },
            {
                "latitude": -79.48568394174285,
                "longitude": 59.69799700331892
            },
            {
                "latitude": -79.34483871450796,
                "longitude": 60.14582044626046
            },
            {
                "latitude": -79.20242976718282,
                "longitude": 60.58493487859744
            },
            {
                "latitude": -79.0584466487587,
                "longitude": 61.015587833939605
            },
            {
                "latitude": -78.91287778509674,
                "longitude": 61.43801942499055
            },
            {
                "latitude": -78.7657104883362,
                "longitude": 61.85246251279135
            },
            {
                "latitude": -78.61693096476431,
                "longitude": 62.259142880875345
            },
            {
                "latitude": -78.46652432115818,
                "longitude": 62.65827941295282
            },
            {
                "latitude": -78.31447456960935,
                "longitude": 63.05008427291566
            },
            {
                "latitude": -78.16076463084305,
                "longitude": 63.43476308610607
            },
            {
                "latitude": -78.00537633604281,
                "longitude": 63.81251512093262
            },
            {
                "latitude": -77.84829042719252,
                "longitude": 64.1835334700397
            },
            {
                "latitude": -77.6894865559452,
                "longitude": 64.54800523034773
            },
            {
                "latitude": -77.52894328102857,
                "longitude": 64.90611168138079
            },
            {
                "latitude": -77.3666380641963,
                "longitude": 65.25802846138528
            },
            {
                "latitude": -77.28317943694962,
                "longitude": 65.4351713099017,
                "altitude": 2885.809723253143
            },
            {
                "latitude": -77.37249408958236,
                "longitude": 66.1634222217084
            },
            {
                "latitude": -77.45941875665193,
                "longitude": 66.89842209620137
            },
            {
                "latitude": -77.54395157416,
                "longitude": 67.64012427003475
            },
            {
                "latitude": -77.62609010344224,
                "longitude": 68.3884741173658
            },
            {
                "latitude": -77.70583136873493,
                "longitude": 69.14340881796379
            },
            {
                "latitude": -77.78317189544228,
                "longitude": 69.90485713898997
            },
            {
                "latitude": -77.85810774907465,
                "longitude": 70.67273923237201
            },
            {
                "latitude": -77.93063457481911,
                "longitude": 71.44696644973129
            },
            {
                "latitude": -78.00074763769376,
                "longitude": 72.22744117684242
            },
            {
                "latitude": -78.06844186322529,
                "longitude": 73.01405668960818
            },
            {
                "latitude": -78.13371187858034,
                "longitude": 73.80669703351857
            },
            {
                "latitude": -78.19655205406974,
                "longitude": 74.60523692852925
            },
            {
                "latitude": -78.2569565449341,
                "longitude": 75.40954170123935
            },
            {
                "latitude": -78.31491933330793,
                "longitude": 76.21946724617214
            },
            {
                "latitude": -78.37043427025205,
                "longitude": 77.03486001786186
            },
            {
                "latitude": -78.42349511773028,
                "longitude": 77.85555705532745
            },
            {
                "latitude": -78.47409559040058,
                "longitude": 78.6813860403661
            },
            {
                "latitude": -78.52222939708061,
                "longitude": 79.51216539093008
            },
            {
                "latitude": -78.56789028174012,
                "longitude": 80.34770439065531
            },
            {
                "latitude": -78.6110720638659,
                "longitude": 81.18780335539566
            },
            {
                "latitude": -78.65176867803952,
                "longitude": 82.03225383737866
            },
            {
                "latitude": -78.68997421256336,
                "longitude": 82.88083886734368
            },
            {
                "latitude": -78.72568294696707,
                "longitude": 83.73333323474901
            },
            {
                "latitude": -78.75888938822516,
                "longitude": 84.58950380584862
            },
            {
                "latitude": -78.78958830551596,
                "longitude": 85.4491098791391
            },
            {
                "latitude": -78.81777476335357,
                "longitude": 86.31190357737117
            },
            {
                "latitude": -78.8434441529271,
                "longitude": 87.1776302750091
            },
            {
                "latitude": -78.86659222148684,
                "longitude": 88.04602905970923
            },
            {
                "latitude": -78.88721509962213,
                "longitude": 88.91683322608195
            },
            {
                "latitude": -78.9053093262845,
                "longitude": 89.7897707997007
            },
            {
                "latitude": -78.9208718714191,
                "longitude": 90.66456508903532
            },
            {
                "latitude": -78.93390015607787,
                "longitude": 91.54093526271522
            },
            {
                "latitude": -78.94439206990107,
                "longitude": 92.41859694927882
            },
            {
                "latitude": -78.95234598586705,
                "longitude": 93.29726285633934
            },
            {
                "latitude": -78.95776077222564,
                "longitude": 94.17664340590073
            },
            {
                "latitude": -78.96063580154616,
                "longitude": 95.056447382391
            },
            {
                "latitude": -78.96097095682771,
                "longitude": 95.93638258984906
            },
            {
                "latitude": -78.95876663463756,
                "longitude": 96.81615651460538
            },
            {
                "latitude": -78.95402374526066,
                "longitude": 97.69547698973972
            },
            {
                "latitude": -78.9467437098614,
                "longitude": 98.57405285758017
            },
            {
                "latitude": -78.93692845467757,
                "longitude": 99.4515946265284
            },
            {
                "latitude": -78.9245804022832,
                "longitude": 100.32781511855546
            },
            {
                "latitude": -78.90970245997572,
                "longitude": 101.20243010380969
            },
            {
                "latitude": -78.89229800535824,
                "longitude": 102.07515891891128
            },
            {
                "latitude": -78.8723708692045,
                "longitude": 102.945725065676
            },
            {
                "latitude": -78.84992531570938,
                "longitude": 103.81385678720872
            },
            {
                "latitude": -78.8249660202396,
                "longitude": 104.67928761853453
            },
            {
                "latitude": -78.7974980447148,
                "longitude": 105.54175690918571
            },
            {
                "latitude": -78.76752681075632,
                "longitude": 106.40101031543541
            },
            {
                "latitude": -78.7350580707542,
                "longitude": 107.25680026015587
            },
            {
                "latitude": -78.70009787700727,
                "longitude": 108.10888635858035
            },
            {
                "latitude": -78.66265254909989,
                "longitude": 108.95703580855499
            },
            {
                "latitude": -78.62272863968228,
                "longitude": 109.80102374417889
            },
            {
                "latitude": -78.5803328988239,
                "longitude": 110.64063355204198
            },
            {
                "latitude": -78.53547223711145,
                "longitude": 111.47565714957605
            },
            {
                "latitude": -78.48815368766155,
                "longitude": 112.30589522533339
            },
            {
                "latitude": -78.4383843672178,
                "longitude": 113.13115744129348
            },
            {
                "latitude": -78.38617143649668,
                "longitude": 113.9512625975716
            },
            {
                "latitude": -78.33152205994395,
                "longitude": 114.76603876015679
            },
            {
                "latitude": -78.27444336505647,
                "longitude": 115.57532335254412
            },
            {
                "latitude": -78.21494240141722,
                "longitude": 116.37896321234007
            },
            {
                "latitude": -78.15302609958508,
                "longitude": 117.17681461411237
            },
            {
                "latitude": -78.08870122996976,
                "longitude": 117.96874325992603
            },
            {
                "latitude": -78.02197436181582,
                "longitude": 118.75462423915194
            },
            {
                "latitude": -77.95285182240781,
                "longitude": 119.53434195925719
            },
            {
                "latitude": -77.88133965659951,
                "longitude": 120.30779004938454
            },
            {
                "latitude": -77.80744358675955,
                "longitude": 121.07487123860466
            },
            {
                "latitude": -77.7311689732146,
                "longitude": 121.83549721077796
            },
            {
                "latitude": -77.65252077526164,
                "longitude": 122.58958843799641
            },
            {
                "latitude": -77.5715035128094,
                "longitude": 123.33707399458822
            },
            {
                "latitude": -77.48812122869914,
                "longitude": 124.07789135366485
            },
            {
                "latitude": -77.40237745174446,
                "longitude": 124.81198616816665
            },
            {
                "latitude": -77.31427516052,
                "longitude": 125.53931203832894
            },
            {
                "latitude": -77.22381674792038,
                "longitude": 126.25983026743958
            },
            {
                "latitude": -77.13100398649934,
                "longitude": 126.97350960769917
            },
            {
                "latitude": -77.03583799459352,
                "longitude": 127.68032599792332
            },
            {
                "latitude": -76.93831920322476,
                "longitude": 128.38026229474835
            },
            {
                "latitude": -76.83844732376807,
                "longitude": 129.07330799891542
            },
            {
                "latitude": -76.73622131636617,
                "longitude": 129.7594589781181
            },
            {
                "latitude": -76.63163935906394,
                "longitude": 130.4387171878037
            },
            {
                "latitude": -76.5246988176299,
                "longitude": 131.1110903912222
            },
            {
                "latitude": -76.41539621602878,
                "longitude": 131.7765918799183
            },
            {
                "latitude": -76.30372720750053,
                "longitude": 132.4352401957639
            },
            {
                "latitude": -76.18968654620078,
                "longitude": 133.0870588555321
            },
            {
                "latitude": -76.07326805935044,
                "longitude": 133.73207607891658
            },
            {
                "latitude": -75.95446461984146,
                "longitude": 134.37032452080814
            },
            {
                "latitude": -75.83326811924036,
                "longitude": 135.00184100854906
            },
            {
                "latitude": -75.70966944113046,
                "longitude": 135.62666628479997
            },
            {
                "latitude": -75.58365843473042,
                "longitude": 136.24484475656982
            },
            {
                "latitude": -75.45522388872514,
                "longitude": 136.85642425088176
            },
            {
                "latitude": -75.32435350524361,
                "longitude": 137.46145577747328
            },
            {
                "latitude": -75.19964223355011,
                "longitude": 138.0218702697203,
                "altitude": 3116.1856871037094
            },
            {
                "latitude": -75.33025248549154,
                "longitude": 138.64922145358193
            },
            {
                "latitude": -75.45828154516062,
                "longitude": 139.28315248904275
            },
            {
                "latitude": -75.58374313034908,
                "longitude": 139.92370382194372
            },
            {
                "latitude": -75.70664980153092,
                "longitude": 140.57091206381824
            },
            {
                "latitude": -75.82701299381422,
                "longitude": 141.22480974223436
            },
            {
                "latitude": -75.94484304900713,
                "longitude": 141.88542504572288
            },
            {
                "latitude": -76.06014924786562,
                "longitude": 142.55278156390094
            },
            {
                "latitude": -76.17293984258676,
                "longitude": 143.226898023482
            },
            {
                "latitude": -76.28322208960925,
                "longitude": 143.90778802095102
            },
            {
                "latitude": -76.39100228277816,
                "longitude": 144.59545975277118
            },
            {
                "latitude": -76.49628578692723,
                "longitude": 145.2899157440805
            },
            {
                "latitude": -76.59907707192777,
                "longitude": 145.99115257692932
            },
            {
                "latitude": -76.6993797472472,
                "longitude": 146.69916061920327
            },
            {
                "latitude": -76.79719659705626,
                "longitude": 147.4139237554698
            },
            {
                "latitude": -76.89252961591555,
                "longitude": 148.13541912107863
            },
            {
                "latitude": -76.98538004506841,
                "longitude": 148.86361684093688
            },
            {
                "latitude": -77.07574840935752,
                "longitude": 149.598479774466
            },
            {
                "latitude": -77.16363455477601,
                "longitude": 150.33996326833002
            },
            {
                "latitude": -77.24903768665676,
                "longitude": 151.08801491859964
            },
            {
                "latitude": -77.33195640849263,
                "longitude": 151.84257434408585
            },
            {
                "latitude": -77.41238876137419,
                "longitude": 152.60357297263465
            },
            {
                "latitude": -77.49033226401957,
                "longitude": 153.37093384222325
            },
            {
                "latitude": -77.56578395336305,
                "longitude": 154.14457141873348
            },
            {
                "latitude": -77.63874042565823,
                "longitude": 154.92439143229996
            },
            {
                "latitude": -77.70919787804132,
                "longitude": 155.71029073413723
            },
            {
                "latitude": -77.77715215048931,
                "longitude": 156.50215717573792
            },
            {
                "latitude": -77.84259876809881,
                "longitude": 157.29986951230663
            },
            {
                "latitude": -77.90553298359852,
                "longitude": 158.10329733224324
            },
            {
                "latitude": -77.96594981999976,
                "longitude": 158.9123010144216
            },
            {
                "latitude": -78.02384411327911,
                "longitude": 159.72673171491584
            },
            {
                "latitude": -78.07921055497667,
                "longitude": 160.54643138471658
            },
            {
                "latitude": -78.13204373458518,
                "longitude": 161.3712328198392
            },
            {
                "latitude": -78.1823381815964,
                "longitude": 162.20095974507151
            },
            {
                "latitude": -78.23008840706281,
                "longitude": 163.0354269324254
            },
            {
                "latitude": -78.27528894452703,
                "longitude": 163.874440355157
            },
            {
                "latitude": -78.31793439016394,
                "longitude": 164.71779737799605
            },
            {
                "latitude": -78.35801944197695,
                "longitude": 165.56528698398662
            },
            {
                "latitude": -78.39553893788589,
                "longitude": 166.41669003808283
            },
            {
                "latitude": -78.43048789254163,
                "longitude": 167.27177958737295
            },
            {
                "latitude": -78.46286153270252,
                "longitude": 168.13032119752114
            },
            {
                "latitude": -78.49265533100808,
                "longitude": 168.9920733247265
            },
            {
                "latitude": -78.51986503798723,
                "longitude": 169.85678772220143
            },
            {
                "latitude": -78.5444867121441,
                "longitude": 170.7242098798747
            },
            {
                "latitude": -78.5665167479681,
                "longitude": 171.59407949572935
            },
            {
                "latitude": -78.58595190172319,
                "longitude": 172.46613097689732
            },
            {
                "latitude": -78.60278931488,
                "longitude": 173.34009396835467
            },
            {
                "latitude": -78.61702653506468,
                "longitude": 174.21569390679846
            },
            {
                "latitude": -78.62866153440977,
                "longitude": 175.09265259704188
            },
            {
                "latitude": -78.63769272520604,
                "longitude": 175.9706888080413
            },
            {
                "latitude": -78.64411897276742,
                "longitude": 176.84951888547434
            },
            {
                "latitude": -78.64793960543797,
                "longitude": 177.72885737761789
            },
            {
                "latitude": -78.64915442168407,
                "longitude": 178.60841767114223
            },
            {
                "latitude": -78.64776369423363,
                "longitude": 179.48791263333302
            },
            {
                "latitude": -78.64376817123924,
                "longitude": -179.63294474281184
            },
            {
                "latitude": -78.6371690744624,
                "longitude": -178.75444069419444
            },
            {
                "latitude": -78.62796809449112,
                "longitude": -177.87686004751382
            },
            {
                "latitude": -78.61616738302166,
                "longitude": -177.0004855869796
            },
            {
                "latitude": -78.60176954225236,
                "longitude": -176.12559743329354
            },
            {
                "latitude": -78.58477761145407,
                "longitude": -175.25247243723422
            },
            {
                "latitude": -78.56519505079683,
                "longitude": -174.38138359103252
            },
            {
                "latitude": -78.54302572252763,
                "longitude": -173.51259946054483
            },
            {
                "latitude": -78.51827386960832,
                "longitude": -172.6463836410256
            },
            {
                "latitude": -78.49094409193415,
                "longitude": -171.78299423906853
            },
            {
                "latitude": -78.46104132026568,
                "longitude": -170.92268338303307
            },
            {
                "latitude": -78.42857078801511,
                "longitude": -170.06569676400463
            },
            {
                "latitude": -78.39353800103855,
                "longitude": -169.2122732090534
            },
            {
                "latitude": -78.35594870558843,
                "longitude": -168.3626442882657
            },
            {
                "latitude": -78.31580885459003,
                "longitude": -167.51703395672567
            },
            {
                "latitude": -78.27312457240512,
                "longitude": -166.67565823232678
            },
            {
                "latitude": -78.22790211824987,
                "longitude": -165.8387249099989
            },
            {
                "latitude": -78.1801478484338,
                "longitude": -165.00643331264757
            },
            {
                "latitude": -78.12986817758535,
                "longitude": -164.17897407882475
            },
            {
                "latitude": -78.07706953902587,
                "longitude": -163.35652898688252
            },
            {
                "latitude": -78.02175834445205,
                "longitude": -162.5392708151117
            },
            {
                "latitude": -77.9639409430791,
                "longitude": -161.727363237134
            },
            {
                "latitude": -77.90362358039238,
                "longitude": -160.9209607516013
            },
            {
                "latitude": -77.84081235664758,
                "longitude": -160.12020864506326
            },
            {
                "latitude": -77.77551318525026,
                "longitude": -159.32524298669148
            },
            {
                "latitude": -77.70773175113918,
                "longitude": -158.53619065340033
            },
            {
                "latitude": -77.63747346928547,
                "longitude": -157.7531693837759
            },
            {
                "latitude": -77.5647434434126,
                "longitude": -156.9762878591216
            },
            {
                "latitude": -77.48954642502986,
                "longitude": -156.20564580984438
            },
            {
                "latitude": -77.41188677286347,
                "longitude": -155.44133414534568
            },
            {
                "latitude": -77.38647046312421,
                "longitude": -155.19766905240436,
                "altitude": 489.79145417822104
            },
            {
                "latitude": -77.53376534420897,
                "longitude": -154.88666860028113
            },
            {
                "latitude": -77.67961329487431,
                "longitude": -154.57073528933378
            },
            {
                "latitude": -77.82403187704911,
                "longitude": -154.2497419706707
            },
            {
                "latitude": -77.9670379126736,
                "longitude": -153.92355775816813
            },
            {
                "latitude": -78.10864748737927,
                "longitude": -153.59204791847512
            },
            {
                "latitude": -78.24887595335755,
                "longitude": -153.2550737592593
            },
            {
                "latitude": -78.38773793141358,
                "longitude": -152.91249251588022
            },
            {
                "latitude": -78.52524731220134,
                "longitude": -152.56415723671063
            },
            {
                "latitude": -78.6614172566353,
                "longitude": -152.2099166673638
            },
            {
                "latitude": -78.79626019547291,
                "longitude": -151.84961513412838
            },
            {
                "latitude": -78.92978782806254,
                "longitude": -151.4830924269574
            },
            {
                "latitude": -79.06201112025131,
                "longitude": -151.11018368241253
            },
            {
                "latitude": -79.1929403014454,
                "longitude": -150.73071926702062
            },
            {
                "latitude": -79.3225848608175,
                "longitude": -150.344524661565
            },
            {
                "latitude": -79.45095354265436,
                "longitude": -149.95142034690426
            },
            {
                "latitude": -79.53615616616862,
                "longitude": -149.68438242324405,
                "altitude": 612.0629223405749
            },
            {
                "latitude": -79.62854100996391,
                "longitude": -150.44864726836283
            },
            {
                "latitude": -79.718702149614,
                "longitude": -151.2229786473842
            },
            {
                "latitude": -79.80662742792859,
                "longitude": -152.00739025432932
            },
            {
                "latitude": -79.89230393214045,
                "longitude": -152.80188364857085
            },
            {
                "latitude": -79.97571803808886,
                "longitude": -153.60644754271922
            },
            {
                "latitude": -80.0568554571261,
                "longitude": -154.42105709296587
            },
            {
                "latitude": -80.13570128580217,
                "longitude": -155.24567319670825
            },
            {
                "latitude": -80.21224005836153,
                "longitude": -156.08024180270763
            },
            {
                "latitude": -80.28645580206292,
                "longitude": -156.92469323944425
            },
            {
                "latitude": -80.35833209530793,
                "longitude": -157.77894156772243
            },
            {
                "latitude": -80.42785212853566,
                "longitude": -158.6428839639333
            },
            {
                "latitude": -80.4949987678113,
                "longitude": -159.51640014069565
            },
            {
                "latitude": -80.55975462100328,
                "longitude": -160.39935181185086
            },
            {
                "latitude": -80.62210210641099,
                "longitude": -161.29158220898245
            },
            {
                "latitude": -80.68202352366825,
                "longitude": -162.1929156567461
            },
            {
                "latitude": -80.7395011267117,
                "longitude": -163.1031572143261
            },
            {
                "latitude": -80.79451719856591,
                "longitude": -164.02209239026715
            },
            {
                "latitude": -80.84705412765882,
                "longitude": -164.94948693775686
            },
            {
                "latitude": -80.89709448534457,
                "longitude": -165.88508673714725
            },
            {
                "latitude": -80.94462110427432,
                "longitude": -166.82861777209436
            },
            {
                "latitude": -80.98961715722035,
                "longitude": -167.77978620516268
            },
            {
                "latitude": -81.03206623592823,
                "longitude": -168.73827855808122
            },
            {
                "latitude": -81.07195242953958,
                "longitude": -169.70376200105082
            },
            {
                "latitude": -81.10926040210683,
                "longitude": -170.6758847545955
            },
            {
                "latitude": -81.14397546869532,
                "longitude": -171.65427660642558
            },
            {
                "latitude": -81.17608366955766,
                "longitude": -172.63854954465302
            },
            {
                "latitude": -81.2055718418505,
                "longitude": -173.62829850747974
            },
            {
                "latitude": -81.23242768836357,
                "longitude": -174.62310224818674
            },
            {
                "latitude": -81.25663984273251,
                "longitude": -175.6225243129036
            },
            {
                "latitude": -81.27819793061703,
                "longitude": -176.62611412726164
            },
            {
                "latitude": -81.29709262634404,
                "longitude": -177.63340818664722
            },
            {
                "latitude": -81.31331570453999,
                "longitude": -178.64393134341043
            },
            {
                "latitude": -81.32686008630824,
                "longitude": -179.6571981830657
            },
            {
                "latitude": -81.33771987954674,
                "longitude": 179.327285519716
            },
            {
                "latitude": -81.3458904130461,
                "longitude": 178.31002127566435
            },
            {
                "latitude": -81.35136826405993,
                "longitude": 177.29151629736288
            },
            {
                "latitude": -81.35415127909617,
                "longitude": 176.27228186980489
            },
            {
                "latitude": -81.35423858773642,
                "longitude": 175.2528316879423
            },
            {
                "latitude": -81.35163060935835,
                "longitude": 174.2336801746169
            },
            {
                "latitude": -81.34632905269844,
                "longitude": 173.21534079255954
            },
            {
                "latitude": -81.3383369082618,
                "longitude": 172.19832436423388
            },
            {
                "latitude": -81.3276584336523,
                "longitude": 171.18313741318195
            },
            {
                "latitude": -81.3142991319627,
                "longitude": 170.1702805402027
            },
            {
                "latitude": -81.29826572342638,
                "longitude": 169.16024684717004
            },
            {
                "latitude": -81.27956611059501,
                "longitude": 168.15352042058717
            },
            {
                "latitude": -81.25820933735905,
                "longitude": 167.15057488609312
            },
            {
                "latitude": -81.23420554218035,
                "longitude": 166.15187204411032
            },
            {
                "latitude": -81.20756590595106,
                "longitude": 165.15786059566796
            },
            {
                "latitude": -81.1783025949276,
                "longitude": 164.16897496618483
            },
            {
                "latitude": -81.14642869922353,
                "longitude": 163.18563423366962
            },
            {
                "latitude": -81.11195816736526,
                "longitude": 162.20824116642976
            },
            {
                "latitude": -81.07490573743254,
                "longitude": 161.2371813739941
            },
            {
                "latitude": -81.03528686531439,
                "longitude": 160.2728225735791
            },
            {
                "latitude": -80.99311765061238,
                "longitude": 159.31551397308817
            },
            {
                "latitude": -80.94841476071976,
                "longitude": 158.36558577034816
            },
            {
                "latitude": -80.9011953535921,
                "longitude": 157.4233487670814
            },
            {
                "latitude": -80.85147699971054,
                "longitude": 156.48909409499504
            },
            {
                "latitude": -80.79927760371456,
                "longitude": 155.56309305036316
            },
            {
                "latitude": -80.74461532615771,
                "longitude": 154.6455970325842
            },
            {
                "latitude": -80.68750850580784,
                "longitude": 153.7368375814279
            },
            {
                "latitude": -80.62797558288177,
                "longitude": 152.8370265070443
            },
            {
                "latitude": -80.56603502356832,
                "longitude": 151.9463561062899
            },
            {
                "latitude": -80.50170524615895,
                "longitude": 151.06499945853693
            },
            {
                "latitude": -80.43500454906572,
                "longitude": 150.19311079385898
            },
            {
                "latitude": -80.36595104097044,
                "longitude": 149.33082592632888
            },
            {
                "latitude": -80.29456257331006,
                "longitude": 148.47826274511155
            },
            {
                "latitude": -80.22085667526817,
                "longitude": 147.63552175607617
            },
            {
                "latitude": -80.14485049140602,
                "longitude": 146.80268666678163
            },
            {
                "latitude": -80.06656072203408,
                "longitude": 145.97982500788913
            },
            {
                "latitude": -79.98600356639112,
                "longitude": 145.16698878432334
            },
            {
                "latitude": -79.98093393952347,
                "longitude": 145.11691608600648,
                "altitude": 2162.3807497647917
            },
            {
                "latitude": -80.13210358480517,
                "longitude": 145.04738940192198
            },
            {
                "latitude": -80.28221719764761,
                "longitude": 144.9762225541203
            },
            {
                "latitude": -80.43129672323924,
                "longitude": 144.90335026495077
            },
            {
                "latitude": -80.57936364699471,
                "longitude": 144.82870379219938
            },
            {
                "latitude": -80.72643900533306,
                "longitude": 144.7522106961635
            },
            {
                "latitude": -80.87254339596326,
                "longitude": 144.6737945877437
            },
            {
                "latitude": -81.01769698767566,
                "longitude": 144.59337485572811
            },
            {
                "latitude": -81.16191952963763,
                "longitude": 144.51086637124308
            },
            {
                "latitude": -81.30523036018884,
                "longitude": 144.42617916711546
            },
            {
                "latitude": -81.44764841512995,
                "longitude": 144.33921808963416
            },
            {
                "latitude": -81.58919223549583,
                "longitude": 144.24988241990894
            },
            {
                "latitude": -81.729879974801,
                "longitude": 144.15806546169532
            },
            {
                "latitude": -81.86972940574374,
                "longitude": 144.06365409218148
            },
            {
                "latitude": -82.00875792634977,
                "longitude": 143.96652827181083
            },
            {
                "latitude": -82.14698256553527,
                "longitude": 143.86656050873196
            },
            {
                "latitude": -82.28441998806096,
                "longitude": 143.76361527292008
            },
            {
                "latitude": -82.42108649884942,
                "longitude": 143.65754835438793
            },
            {
                "latitude": -82.55699804662686,
                "longitude": 143.54820615918922
            },
            {
                "latitude": -82.69217022684909,
                "longitude": 143.43542493609655
            },
            {
                "latitude": -82.82661828386091,
                "longitude": 143.31902992589562
            },
            {
                "latitude": -82.96035711223313,
                "longitude": 143.1988344241532
            },
            {
                "latitude": -83.09340125720907,
                "longitude": 143.07463874706866
            },
            {
                "latitude": -83.22576491418447,
                "longitude": 142.94622908857485
            },
            {
                "latitude": -83.35746192713185,
                "longitude": 142.81337625518415
            },
            {
                "latitude": -83.48850578586402,
                "longitude": 142.6758342631353
            },
            {
                "latitude": -83.61890962201798,
                "longitude": 142.5333387801406
            },
            {
                "latitude": -83.74868620361963,
                "longitude": 142.38560539140173
            },
            {
                "latitude": -83.87784792806669,
                "longitude": 142.2323276664844
            },
            {
                "latitude": -84.00640681334153,
                "longitude": 142.07317500003685
            },
            {
                "latitude": -84.13437448723505,
                "longitude": 141.9077901950964
            },
            {
                "latitude": -84.2617621743242,
                "longitude": 141.73578675273308
            },
            {
                "latitude": -84.38858068040369,
                "longitude": 141.55674582587363
            },
            {
                "latitude": -84.51484037402076,
                "longitude": 141.3702127881499
            },
            {
                "latitude": -84.64055116469852,
                "longitude": 141.17569336029382
            },
            {
                "latitude": -84.76572247736247,
                "longitude": 140.97264922667685
            },
            {
                "latitude": -84.89036322239238,
                "longitude": 140.76049306271926
            },
            {
                "latitude": -85.0144817606195,
                "longitude": 140.53858287964226
            },
            {
                "latitude": -85.07088484266322,
                "longitude": 140.43400971467202,
                "altitude": 2753.885010796302
            }
        ]
    ];
    var polygonSouthPoleAndIntersectionInput = transformInputData(polygonSouthPoleAndIntersectionRawInput);
    var polygonSouthPoleAndIntersectionRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": -78.645436362134,
                        "longitude": -180
                    },
                    {
                        "latitude": -78.64376817123924,
                        "longitude": -179.63294474281184
                    },
                    {
                        "latitude": -78.6371690744624,
                        "longitude": -178.75444069419444
                    },
                    {
                        "latitude": -78.62796809449112,
                        "longitude": -177.87686004751382
                    },
                    {
                        "latitude": -78.61616738302166,
                        "longitude": -177.0004855869796
                    },
                    {
                        "latitude": -78.60176954225236,
                        "longitude": -176.12559743329354
                    },
                    {
                        "latitude": -78.58477761145407,
                        "longitude": -175.25247243723422
                    },
                    {
                        "latitude": -78.56519505079683,
                        "longitude": -174.38138359103252
                    },
                    {
                        "latitude": -78.54302572252763,
                        "longitude": -173.51259946054483
                    },
                    {
                        "latitude": -78.51827386960832,
                        "longitude": -172.6463836410256
                    },
                    {
                        "latitude": -78.49094409193415,
                        "longitude": -171.78299423906853
                    },
                    {
                        "latitude": -78.46104132026568,
                        "longitude": -170.92268338303307
                    },
                    {
                        "latitude": -78.42857078801511,
                        "longitude": -170.06569676400463
                    },
                    {
                        "latitude": -78.39353800103855,
                        "longitude": -169.2122732090534
                    },
                    {
                        "latitude": -78.35594870558843,
                        "longitude": -168.3626442882657
                    },
                    {
                        "latitude": -78.31580885459003,
                        "longitude": -167.51703395672567
                    },
                    {
                        "latitude": -78.27312457240512,
                        "longitude": -166.67565823232678
                    },
                    {
                        "latitude": -78.22790211824987,
                        "longitude": -165.8387249099989
                    },
                    {
                        "latitude": -78.1801478484338,
                        "longitude": -165.00643331264757
                    },
                    {
                        "latitude": -78.12986817758535,
                        "longitude": -164.17897407882475
                    },
                    {
                        "latitude": -78.07706953902587,
                        "longitude": -163.35652898688252
                    },
                    {
                        "latitude": -78.02175834445205,
                        "longitude": -162.5392708151117
                    },
                    {
                        "latitude": -77.9639409430791,
                        "longitude": -161.727363237134
                    },
                    {
                        "latitude": -77.90362358039238,
                        "longitude": -160.9209607516013
                    },
                    {
                        "latitude": -77.84081235664758,
                        "longitude": -160.12020864506326
                    },
                    {
                        "latitude": -77.77551318525026,
                        "longitude": -159.32524298669148
                    },
                    {
                        "latitude": -77.70773175113918,
                        "longitude": -158.53619065340033
                    },
                    {
                        "latitude": -77.63747346928547,
                        "longitude": -157.7531693837759
                    },
                    {
                        "latitude": -77.5647434434126,
                        "longitude": -156.9762878591216
                    },
                    {
                        "latitude": -77.48954642502986,
                        "longitude": -156.20564580984438
                    },
                    {
                        "latitude": -77.41188677286347,
                        "longitude": -155.44133414534568
                    },
                    {
                        "latitude": -77.38647046312421,
                        "longitude": -155.19766905240436,
                        "altitude": 489.79145417822104
                    },
                    {
                        "latitude": -77.53376534420897,
                        "longitude": -154.88666860028113
                    },
                    {
                        "latitude": -77.67961329487431,
                        "longitude": -154.57073528933378
                    },
                    {
                        "latitude": -77.82403187704911,
                        "longitude": -154.2497419706707
                    },
                    {
                        "latitude": -77.9670379126736,
                        "longitude": -153.92355775816813
                    },
                    {
                        "latitude": -78.10864748737927,
                        "longitude": -153.59204791847512
                    },
                    {
                        "latitude": -78.24887595335755,
                        "longitude": -153.2550737592593
                    },
                    {
                        "latitude": -78.38773793141358,
                        "longitude": -152.91249251588022
                    },
                    {
                        "latitude": -78.52524731220134,
                        "longitude": -152.56415723671063
                    },
                    {
                        "latitude": -78.6614172566353,
                        "longitude": -152.2099166673638
                    },
                    {
                        "latitude": -78.79626019547291,
                        "longitude": -151.84961513412838
                    },
                    {
                        "latitude": -78.92978782806254,
                        "longitude": -151.4830924269574
                    },
                    {
                        "latitude": -79.06201112025131,
                        "longitude": -151.11018368241253
                    },
                    {
                        "latitude": -79.1929403014454,
                        "longitude": -150.73071926702062
                    },
                    {
                        "latitude": -79.3225848608175,
                        "longitude": -150.344524661565
                    },
                    {
                        "latitude": -79.45095354265436,
                        "longitude": -149.95142034690426
                    },
                    {
                        "latitude": -79.53615616616862,
                        "longitude": -149.68438242324405,
                        "altitude": 612.0629223405749
                    },
                    {
                        "latitude": -79.62854100996391,
                        "longitude": -150.44864726836283
                    },
                    {
                        "latitude": -79.718702149614,
                        "longitude": -151.2229786473842
                    },
                    {
                        "latitude": -79.80662742792859,
                        "longitude": -152.00739025432932
                    },
                    {
                        "latitude": -79.89230393214045,
                        "longitude": -152.80188364857085
                    },
                    {
                        "latitude": -79.97571803808886,
                        "longitude": -153.60644754271922
                    },
                    {
                        "latitude": -80.0568554571261,
                        "longitude": -154.42105709296587
                    },
                    {
                        "latitude": -80.13570128580217,
                        "longitude": -155.24567319670825
                    },
                    {
                        "latitude": -80.21224005836153,
                        "longitude": -156.08024180270763
                    },
                    {
                        "latitude": -80.28645580206292,
                        "longitude": -156.92469323944425
                    },
                    {
                        "latitude": -80.35833209530793,
                        "longitude": -157.77894156772243
                    },
                    {
                        "latitude": -80.42785212853566,
                        "longitude": -158.6428839639333
                    },
                    {
                        "latitude": -80.4949987678113,
                        "longitude": -159.51640014069565
                    },
                    {
                        "latitude": -80.55975462100328,
                        "longitude": -160.39935181185086
                    },
                    {
                        "latitude": -80.62210210641099,
                        "longitude": -161.29158220898245
                    },
                    {
                        "latitude": -80.68202352366825,
                        "longitude": -162.1929156567461
                    },
                    {
                        "latitude": -80.7395011267117,
                        "longitude": -163.1031572143261
                    },
                    {
                        "latitude": -80.79451719856591,
                        "longitude": -164.02209239026715
                    },
                    {
                        "latitude": -80.84705412765882,
                        "longitude": -164.94948693775686
                    },
                    {
                        "latitude": -80.89709448534457,
                        "longitude": -165.88508673714725
                    },
                    {
                        "latitude": -80.94462110427432,
                        "longitude": -166.82861777209436
                    },
                    {
                        "latitude": -80.98961715722035,
                        "longitude": -167.77978620516268
                    },
                    {
                        "latitude": -81.03206623592823,
                        "longitude": -168.73827855808122
                    },
                    {
                        "latitude": -81.07195242953958,
                        "longitude": -169.70376200105082
                    },
                    {
                        "latitude": -81.10926040210683,
                        "longitude": -170.6758847545955
                    },
                    {
                        "latitude": -81.14397546869532,
                        "longitude": -171.65427660642558
                    },
                    {
                        "latitude": -81.17608366955766,
                        "longitude": -172.63854954465302
                    },
                    {
                        "latitude": -81.2055718418505,
                        "longitude": -173.62829850747974
                    },
                    {
                        "latitude": -81.23242768836357,
                        "longitude": -174.62310224818674
                    },
                    {
                        "latitude": -81.25663984273251,
                        "longitude": -175.6225243129036
                    },
                    {
                        "latitude": -81.27819793061703,
                        "longitude": -176.62611412726164
                    },
                    {
                        "latitude": -81.29709262634404,
                        "longitude": -177.63340818664722
                    },
                    {
                        "latitude": -81.31331570453999,
                        "longitude": -178.64393134341043
                    },
                    {
                        "latitude": -81.32686008630824,
                        "longitude": -179.6571981830657
                    },
                    {
                        "latitude": -81.33052596233986,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": -81.33052596233986,
                        "longitude": 180
                    },
                    {
                        "latitude": -81.33771987954674,
                        "longitude": 179.327285519716
                    },
                    {
                        "latitude": -81.3458904130461,
                        "longitude": 178.31002127566435
                    },
                    {
                        "latitude": -81.35136826405993,
                        "longitude": 177.29151629736288
                    },
                    {
                        "latitude": -81.35415127909617,
                        "longitude": 176.27228186980489
                    },
                    {
                        "latitude": -81.35423858773642,
                        "longitude": 175.2528316879423
                    },
                    {
                        "latitude": -81.35163060935835,
                        "longitude": 174.2336801746169
                    },
                    {
                        "latitude": -81.34632905269844,
                        "longitude": 173.21534079255954
                    },
                    {
                        "latitude": -81.3383369082618,
                        "longitude": 172.19832436423388
                    },
                    {
                        "latitude": -81.3276584336523,
                        "longitude": 171.18313741318195
                    },
                    {
                        "latitude": -81.3142991319627,
                        "longitude": 170.1702805402027
                    },
                    {
                        "latitude": -81.29826572342638,
                        "longitude": 169.16024684717004
                    },
                    {
                        "latitude": -81.27956611059501,
                        "longitude": 168.15352042058717
                    },
                    {
                        "latitude": -81.25820933735905,
                        "longitude": 167.15057488609312
                    },
                    {
                        "latitude": -81.23420554218035,
                        "longitude": 166.15187204411032
                    },
                    {
                        "latitude": -81.20756590595106,
                        "longitude": 165.15786059566796
                    },
                    {
                        "latitude": -81.1783025949276,
                        "longitude": 164.16897496618483
                    },
                    {
                        "latitude": -81.14642869922353,
                        "longitude": 163.18563423366962
                    },
                    {
                        "latitude": -81.11195816736526,
                        "longitude": 162.20824116642976
                    },
                    {
                        "latitude": -81.07490573743254,
                        "longitude": 161.2371813739941
                    },
                    {
                        "latitude": -81.03528686531439,
                        "longitude": 160.2728225735791
                    },
                    {
                        "latitude": -80.99311765061238,
                        "longitude": 159.31551397308817
                    },
                    {
                        "latitude": -80.94841476071976,
                        "longitude": 158.36558577034816
                    },
                    {
                        "latitude": -80.9011953535921,
                        "longitude": 157.4233487670814
                    },
                    {
                        "latitude": -80.85147699971054,
                        "longitude": 156.48909409499504
                    },
                    {
                        "latitude": -80.79927760371456,
                        "longitude": 155.56309305036316
                    },
                    {
                        "latitude": -80.74461532615771,
                        "longitude": 154.6455970325842
                    },
                    {
                        "latitude": -80.68750850580784,
                        "longitude": 153.7368375814279
                    },
                    {
                        "latitude": -80.62797558288177,
                        "longitude": 152.8370265070443
                    },
                    {
                        "latitude": -80.56603502356832,
                        "longitude": 151.9463561062899
                    },
                    {
                        "latitude": -80.50170524615895,
                        "longitude": 151.06499945853693
                    },
                    {
                        "latitude": -80.43500454906572,
                        "longitude": 150.19311079385898
                    },
                    {
                        "latitude": -80.36595104097044,
                        "longitude": 149.33082592632888
                    },
                    {
                        "latitude": -80.29456257331006,
                        "longitude": 148.47826274511155
                    },
                    {
                        "latitude": -80.22085667526817,
                        "longitude": 147.63552175607617
                    },
                    {
                        "latitude": -80.14485049140602,
                        "longitude": 146.80268666678163
                    },
                    {
                        "latitude": -80.06656072203408,
                        "longitude": 145.97982500788913
                    },
                    {
                        "latitude": -79.98600356639112,
                        "longitude": 145.16698878432334
                    },
                    {
                        "latitude": -79.98093393952347,
                        "longitude": 145.11691608600648,
                        "altitude": 2162.3807497647917
                    },
                    {
                        "latitude": -80.13210358480517,
                        "longitude": 145.04738940192198
                    },
                    {
                        "latitude": -80.28221719764761,
                        "longitude": 144.9762225541203
                    },
                    {
                        "latitude": -80.43129672323924,
                        "longitude": 144.90335026495077
                    },
                    {
                        "latitude": -80.57936364699471,
                        "longitude": 144.82870379219938
                    },
                    {
                        "latitude": -80.72643900533306,
                        "longitude": 144.7522106961635
                    },
                    {
                        "latitude": -80.87254339596326,
                        "longitude": 144.6737945877437
                    },
                    {
                        "latitude": -81.01769698767566,
                        "longitude": 144.59337485572811
                    },
                    {
                        "latitude": -81.16191952963763,
                        "longitude": 144.51086637124308
                    },
                    {
                        "latitude": -81.30523036018884,
                        "longitude": 144.42617916711546
                    },
                    {
                        "latitude": -81.44764841512995,
                        "longitude": 144.33921808963416
                    },
                    {
                        "latitude": -81.58919223549583,
                        "longitude": 144.24988241990894
                    },
                    {
                        "latitude": -81.729879974801,
                        "longitude": 144.15806546169532
                    },
                    {
                        "latitude": -81.86972940574374,
                        "longitude": 144.06365409218148
                    },
                    {
                        "latitude": -82.00875792634977,
                        "longitude": 143.96652827181083
                    },
                    {
                        "latitude": -82.14698256553527,
                        "longitude": 143.86656050873196
                    },
                    {
                        "latitude": -82.28441998806096,
                        "longitude": 143.76361527292008
                    },
                    {
                        "latitude": -82.42108649884942,
                        "longitude": 143.65754835438793
                    },
                    {
                        "latitude": -82.55699804662686,
                        "longitude": 143.54820615918922
                    },
                    {
                        "latitude": -82.69217022684909,
                        "longitude": 143.43542493609655
                    },
                    {
                        "latitude": -82.82661828386091,
                        "longitude": 143.31902992589562
                    },
                    {
                        "latitude": -82.96035711223313,
                        "longitude": 143.1988344241532
                    },
                    {
                        "latitude": -83.09340125720907,
                        "longitude": 143.07463874706866
                    },
                    {
                        "latitude": -83.22576491418447,
                        "longitude": 142.94622908857485
                    },
                    {
                        "latitude": -83.35746192713185,
                        "longitude": 142.81337625518415
                    },
                    {
                        "latitude": -83.48850578586402,
                        "longitude": 142.6758342631353
                    },
                    {
                        "latitude": -83.61890962201798,
                        "longitude": 142.5333387801406
                    },
                    {
                        "latitude": -83.74868620361963,
                        "longitude": 142.38560539140173
                    },
                    {
                        "latitude": -83.87784792806669,
                        "longitude": 142.2323276664844
                    },
                    {
                        "latitude": -84.00640681334153,
                        "longitude": 142.07317500003685
                    },
                    {
                        "latitude": -84.13437448723505,
                        "longitude": 141.9077901950964
                    },
                    {
                        "latitude": -84.2617621743242,
                        "longitude": 141.73578675273308
                    },
                    {
                        "latitude": -84.38858068040369,
                        "longitude": 141.55674582587363
                    },
                    {
                        "latitude": -84.51484037402076,
                        "longitude": 141.3702127881499
                    },
                    {
                        "latitude": -84.64055116469852,
                        "longitude": 141.17569336029382
                    },
                    {
                        "latitude": -84.76572247736247,
                        "longitude": 140.97264922667685
                    },
                    {
                        "latitude": -84.89036322239238,
                        "longitude": 140.76049306271926
                    },
                    {
                        "latitude": -85.0144817606195,
                        "longitude": 140.53858287964226
                    },
                    {
                        "latitude": -85.07088484266322,
                        "longitude": 140.43400971467202,
                        "altitude": 2753.885010796302
                    },
                    {
                        "latitude": -85.07088484266322,
                        "longitude": 140.43400971467202,
                        "altitude": 2753.885010796302
                    },
                    {
                        "latitude": -85.1429911034316,
                        "longitude": 141.6353198179013
                    },
                    {
                        "latitude": -85.21277205457805,
                        "longitude": 142.86968986167076
                    },
                    {
                        "latitude": -85.28015047304503,
                        "longitude": 144.13743325621428
                    },
                    {
                        "latitude": -85.34504699368168,
                        "longitude": 145.4387564561269
                    },
                    {
                        "latitude": -85.40738039319889,
                        "longitude": 146.7737450560712
                    },
                    {
                        "latitude": -85.46706792739323,
                        "longitude": 148.14234959811043
                    },
                    {
                        "latitude": -85.52402572413692,
                        "longitude": 149.54437134782896
                    },
                    {
                        "latitude": -85.57816923364328,
                        "longitude": 150.97944834869452
                    },
                    {
                        "latitude": -85.62941373627886,
                        "longitude": 152.44704211522165
                    },
                    {
                        "latitude": -85.6776749066829,
                        "longitude": 153.94642537227824
                    },
                    {
                        "latitude": -85.72286943119755,
                        "longitude": 155.47667128662164
                    },
                    {
                        "latitude": -85.76491567363416,
                        "longitude": 157.03664466332097
                    },
                    {
                        "latitude": -85.80373438226206,
                        "longitude": 158.6249955898122
                    },
                    {
                        "latitude": -85.83924942868653,
                        "longitude": 160.2401559997927
                    },
                    {
                        "latitude": -85.87138856707548,
                        "longitude": 161.880339594463
                    },
                    {
                        "latitude": -85.90008420013402,
                        "longitude": 163.54354549730039
                    },
                    {
                        "latitude": -85.9252741364395,
                        "longitude": 165.22756592972604
                    },
                    {
                        "latitude": -85.9469023223834,
                        "longitude": 166.92999807982252
                    },
                    {
                        "latitude": -85.96491953115,
                        "longitude": 168.64826019809271
                    },
                    {
                        "latitude": -85.97928399101654,
                        "longitude": 170.37961179892497
                    },
                    {
                        "latitude": -85.98996193586474,
                        "longitude": 172.1211776819456
                    },
                    {
                        "latitude": -85.99692806218913,
                        "longitude": 173.86997532353308
                    },
                    {
                        "latitude": -86.00016587905402,
                        "longitude": 175.62294503614797
                    },
                    {
                        "latitude": -85.99966794032747,
                        "longitude": 177.37698216253318
                    },
                    {
                        "latitude": -85.99543595196566,
                        "longitude": 179.12897047294453
                    },
                    {
                        "latitude": -85.99146925006919,
                        "longitude": 180
                    },
                    {
                        "latitude": -90,
                        "longitude": 180
                    },
                    {
                        "latitude": -90,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.99146925006919,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.98748075096505,
                        "longitude": -179.1241841260044
                    },
                    {
                        "latitude": -85.97582215664112,
                        "longitude": -177.38552047786308
                    },
                    {
                        "latitude": -85.9604886988872,
                        "longitude": -175.65799053552138
                    },
                    {
                        "latitude": -85.9415172318083,
                        "longitude": -173.94442999775396
                    },
                    {
                        "latitude": -85.91895244440478,
                        "longitude": -172.24753191805382
                    },
                    {
                        "latitude": -85.89284628263975,
                        "longitude": -170.5698238420483
                    },
                    {
                        "latitude": -85.86325729914715,
                        "longitude": -168.91364887245
                    },
                    {
                        "latitude": -85.8302499479792,
                        "longitude": -167.2811508952836
                    },
                    {
                        "latitude": -85.79389384215035,
                        "longitude": -165.67426403853952
                    },
                    {
                        "latitude": -85.75426299135724,
                        "longitude": -164.0947062837068
                    },
                    {
                        "latitude": -85.71143503625393,
                        "longitude": -162.5439770191664
                    },
                    {
                        "latitude": -85.66549049413548,
                        "longitude": -161.02335821725097
                    },
                    {
                        "latitude": -85.61651202899877,
                        "longitude": -159.53391883657247
                    },
                    {
                        "latitude": -85.56458375682085,
                        "longitude": -158.0765219984341
                    },
                    {
                        "latitude": -85.50979059467211,
                        "longitude": -156.65183445935725
                    },
                    {
                        "latitude": -85.45221766007616,
                        "longitude": -155.260337898112
                    },
                    {
                        "latitude": -85.39194972493033,
                        "longitude": -153.90234155136662
                    },
                    {
                        "latitude": -85.32907072638913,
                        "longitude": -152.57799576292703
                    },
                    {
                        "latitude": -85.26366333543028,
                        "longitude": -151.2873060532354
                    },
                    {
                        "latitude": -85.19580858239954,
                        "longitude": -150.03014736431277
                    },
                    {
                        "latitude": -85.12558553767073,
                        "longitude": -148.80627818711582
                    },
                    {
                        "latitude": -85.05307104465835,
                        "longitude": -147.61535433039867
                    },
                    {
                        "latitude": -84.97833950176083,
                        "longitude": -146.4569421403278
                    },
                    {
                        "latitude": -84.9014626893697,
                        "longitude": -145.33053102663865
                    },
                    {
                        "latitude": -84.82250963782668,
                        "longitude": -144.23554519295854
                    },
                    {
                        "latitude": -84.74154653210958,
                        "longitude": -143.17135450546047
                    },
                    {
                        "latitude": -84.66468006669442,
                        "longitude": -142.21087049203012,
                        "altitude": 279.884700681834
                    },
                    {
                        "latitude": -84.76992669761403,
                        "longitude": -141.30710672947268
                    },
                    {
                        "latitude": -84.8735065339294,
                        "longitude": -140.36954530590228
                    },
                    {
                        "latitude": -84.97536073407846,
                        "longitude": -139.39668044612122
                    },
                    {
                        "latitude": -85.07542556618192,
                        "longitude": -138.38696464722486
                    },
                    {
                        "latitude": -85.17363216233593,
                        "longitude": -137.3388145621192
                    },
                    {
                        "latitude": -85.26990627820686,
                        "longitude": -136.25061863215313
                    },
                    {
                        "latitude": -85.3641680635043,
                        "longitude": -135.12074674984672
                    },
                    {
                        "latitude": -85.45633185018859,
                        "longitude": -133.94756225324514
                    },
                    {
                        "latitude": -85.54630596670388,
                        "longitude": -132.7294365678071
                    },
                    {
                        "latitude": -85.633992588111,
                        "longitude": -131.46476681654838
                    },
                    {
                        "latitude": -85.71928763370987,
                        "longitude": -130.1519967101659
                    },
                    {
                        "latitude": -85.80208072551164,
                        "longitude": -128.7896410009673
                    },
                    {
                        "latitude": -85.88225522270791,
                        "longitude": -127.3763137317412
                    },
                    {
                        "latitude": -85.95968834894158,
                        "longitude": -125.91076042677322
                    },
                    {
                        "latitude": -86.03425143059732,
                        "longitude": -124.3918942504423
                    },
                    {
                        "latitude": -86.10581026528378,
                        "longitude": -122.81883599314949
                    },
                    {
                        "latitude": -86.1742256399645,
                        "longitude": -121.19095753017977
                    },
                    {
                        "latitude": -86.23935401753214,
                        "longitude": -119.50792813476002
                    },
                    {
                        "latitude": -86.30104840872232,
                        "longitude": -117.76976271477074
                    },
                    {
                        "latitude": -86.35915944284834,
                        "longitude": -115.9768706922547
                    },
                    {
                        "latitude": -86.41353664563366,
                        "longitude": -114.13010387294389
                    },
                    {
                        "latitude": -86.46402992527692,
                        "longitude": -112.23080128562898
                    },
                    {
                        "latitude": -86.51049125874414,
                        "longitude": -110.28082864402609
                    },
                    {
                        "latitude": -86.55277655932183,
                        "longitude": -108.28260984093971
                    },
                    {
                        "latitude": -86.59074769408969,
                        "longitude": -106.23914777525974
                    },
                    {
                        "latitude": -86.62427460687766,
                        "longitude": -104.15403188559823
                    },
                    {
                        "latitude": -86.65323748943655,
                        "longitude": -102.03143006106359
                    },
                    {
                        "latitude": -86.67752893218933,
                        "longitude": -99.8760631435835
                    },
                    {
                        "latitude": -86.69705597737686,
                        "longitude": -97.69316102507798
                    },
                    {
                        "latitude": -86.71174199297526,
                        "longitude": -95.4884003416553
                    },
                    {
                        "latitude": -86.72152828651802,
                        "longitude": -93.26782490588053
                    },
                    {
                        "latitude": -86.72637538453114,
                        "longitude": -91.03775119611046
                    },
                    {
                        "latitude": -86.72626391574877,
                        "longitude": -88.80466231796065
                    },
                    {
                        "latitude": -86.72119505393528,
                        "longitude": -86.57509474296603
                    },
                    {
                        "latitude": -86.71119049770502,
                        "longitude": -84.35552270569745
                    },
                    {
                        "latitude": -86.69629198833657,
                        "longitude": -82.15224533035925
                    },
                    {
                        "latitude": -86.67656039009482,
                        "longitude": -79.97128133683017
                    },
                    {
                        "latitude": -86.65207437888284,
                        "longitude": -77.81827557260885
                    },
                    {
                        "latitude": -86.62292880232421,
                        "longitude": -75.69842070709566
                    },
                    {
                        "latitude": -86.5892327863636,
                        "longitude": -73.61639631777275
                    },
                    {
                        "latitude": -86.55110766956307,
                        "longitude": -71.57632641877396
                    },
                    {
                        "latitude": -86.50868484657006,
                        "longitude": -69.581755351003
                    },
                    {
                        "latitude": -86.46210359740225,
                        "longitude": -67.63564096820936
                    },
                    {
                        "latitude": -86.41150897036086,
                        "longitude": -65.74036328261477
                    },
                    {
                        "latitude": -86.35704977483552,
                        "longitude": -63.89774620911273
                    },
                    {
                        "latitude": -86.29887672736363,
                        "longitude": -62.10908976870232
                    },
                    {
                        "latitude": -86.23714078122168,
                        "longitude": -60.37521005421871
                    },
                    {
                        "latitude": -86.17199165754292,
                        "longitude": -58.69648438276098
                    },
                    {
                        "latitude": -86.10357658512056,
                        "longitude": -57.0728993102791
                    },
                    {
                        "latitude": -86.03203924707981,
                        "longitude": -55.50409951552688
                    },
                    {
                        "latitude": -85.9575189256063,
                        "longitude": -53.98943592948013
                    },
                    {
                        "latitude": -85.88014983088225,
                        "longitude": -52.52801185738449
                    },
                    {
                        "latitude": -85.80006059708931,
                        "longitude": -51.11872618843525
                    },
                    {
                        "latitude": -85.71737392656124,
                        "longitude": -49.760313096467456
                    },
                    {
                        "latitude": -85.63220636259274,
                        "longitude": -48.45137789553784
                    },
                    {
                        "latitude": -85.54466817176498,
                        "longitude": -47.19042892458962
                    },
                    {
                        "latitude": -85.45486331765385,
                        "longitude": -45.975905497504264
                    },
                    {
                        "latitude": -85.36288950922383,
                        "longitude": -44.80620207347198
                    },
                    {
                        "latitude": -85.26883830889655,
                        "longitude": -43.67968888390036
                    },
                    {
                        "latitude": -85.17279528706281,
                        "longitude": -42.594729302636885
                    },
                    {
                        "latitude": -85.07484021159233,
                        "longitude": -41.54969427252544
                    },
                    {
                        "latitude": -84.97504726259012,
                        "longitude": -40.54297410907818
                    },
                    {
                        "latitude": -84.87348526423348,
                        "longitude": -39.57298799635556
                    },
                    {
                        "latitude": -84.77021792694114,
                        "longitude": -38.6381914751831
                    },
                    {
                        "latitude": -84.66530409439454,
                        "longitude": -37.73708220292759
                    },
                    {
                        "latitude": -84.55879799102472,
                        "longitude": -36.868204239792675
                    },
                    {
                        "latitude": -84.45074946652663,
                        "longitude": -36.03015109089862
                    },
                    {
                        "latitude": -84.3412042347553,
                        "longitude": -35.22156770767214
                    },
                    {
                        "latitude": -84.23020410502754,
                        "longitude": -34.441151627240885
                    },
                    {
                        "latitude": -84.11778720440377,
                        "longitude": -33.68765340521939
                    },
                    {
                        "latitude": -84.00398818997363,
                        "longitude": -32.959876475845064
                    },
                    {
                        "latitude": -83.88883845053087,
                        "longitude": -32.25667655404568
                    },
                    {
                        "latitude": -83.77939303790043,
                        "longitude": -31.617109768312034,
                        "altitude": 1755.736411014133
                    },
                    {
                        "latitude": -83.84921639368022,
                        "longitude": -30.52608778122047
                    },
                    {
                        "latitude": -83.91662130081416,
                        "longitude": -29.413154138937657
                    },
                    {
                        "latitude": -83.98155492153568,
                        "longitude": -28.278381925351592
                    },
                    {
                        "latitude": -84.04396372918816,
                        "longitude": -27.12191077146261
                    },
                    {
                        "latitude": -84.10379372055553,
                        "longitude": -25.94395156759378
                    },
                    {
                        "latitude": -84.16099064883238,
                        "longitude": -24.744790963655756
                    },
                    {
                        "latitude": -84.21550027677823,
                        "longitude": -23.524795564013743
                    },
                    {
                        "latitude": -84.26726864918277,
                        "longitude": -22.284415716691253
                    },
                    {
                        "latitude": -84.31624238329827,
                        "longitude": -21.02418879162895
                    },
                    {
                        "latitude": -84.36236897540411,
                        "longitude": -19.744741840009404
                    },
                    {
                        "latitude": -84.40559712114296,
                        "longitude": -18.44679352676226
                    },
                    {
                        "latitude": -84.44587704674251,
                        "longitude": -17.131155231742355
                    },
                    {
                        "latitude": -84.48316084771665,
                        "longitude": -15.798731222107962
                    },
                    {
                        "latitude": -84.51740283114944,
                        "longitude": -14.450517809388138
                    },
                    {
                        "latitude": -84.5485598572222,
                        "longitude": -13.087601419729623
                    },
                    {
                        "latitude": -84.57659167527532,
                        "longitude": -11.71115552478329
                    },
                    {
                        "latitude": -84.60146124941801,
                        "longitude": -10.32243640333879
                    },
                    {
                        "latitude": -84.62313506853418,
                        "longitude": -8.92277772962856
                    },
                    {
                        "latitude": -84.64158343549994,
                        "longitude": -7.513584012454266
                    },
                    {
                        "latitude": -84.65678073053367,
                        "longitude": -6.096322938987068
                    },
                    {
                        "latitude": -84.66870564386441,
                        "longitude": -4.672516707129941
                    },
                    {
                        "latitude": -84.6773413733069,
                        "longitude": -3.243732459463022
                    },
                    {
                        "latitude": -84.68267578289534,
                        "longitude": -1.8115719587272932
                    },
                    {
                        "latitude": -84.68470151941115,
                        "longitude": -0.3776606682775445
                    },
                    {
                        "latitude": -84.68341608444089,
                        "longitude": 1.0563635801927642
                    },
                    {
                        "latitude": -84.67882186048567,
                        "longitude": 2.488862136034622
                    },
                    {
                        "latitude": -84.6709260905822,
                        "longitude": 3.918207093435684
                    },
                    {
                        "latitude": -84.65974081185557,
                        "longitude": 5.342792666450917
                    },
                    {
                        "latitude": -84.64528274436725,
                        "longitude": 6.761046178261306
                    },
                    {
                        "latitude": -84.6275731375136,
                        "longitude": 8.171438480122056
                    },
                    {
                        "latitude": -84.60663757704728,
                        "longitude": 9.572493633599978
                    },
                    {
                        "latitude": -84.58250575649299,
                        "longitude": 10.962797712592312
                    },
                    {
                        "latitude": -84.55521121730438,
                        "longitude": 12.341006608138585
                    },
                    {
                        "latitude": -84.52479106254026,
                        "longitude": 13.705852747938861
                    },
                    {
                        "latitude": -84.49128564911513,
                        "longitude": 15.056150672477676
                    },
                    {
                        "latitude": -84.45473826380726,
                        "longitude": 16.390801439471257
                    },
                    {
                        "latitude": -84.4151947881913,
                        "longitude": 17.70879585685646
                    },
                    {
                        "latitude": -84.37270335751226,
                        "longitude": 19.009216570744467
                    },
                    {
                        "latitude": -84.32731401825602,
                        "longitude": 20.29123905789469
                    },
                    {
                        "latitude": -84.27907838880634,
                        "longitude": 21.554131591775608
                    },
                    {
                        "latitude": -84.2280493271518,
                        "longitude": 22.797254266850512
                    },
                    {
                        "latitude": -84.17428060911084,
                        "longitude": 24.020057177255275
                    },
                    {
                        "latitude": -84.11782662003337,
                        "longitude": 25.222077853612088
                    },
                    {
                        "latitude": -84.05874206240432,
                        "longitude": 26.402938065595308
                    },
                    {
                        "latitude": -83.99708168125301,
                        "longitude": 27.56234009840612
                    },
                    {
                        "latitude": -83.93290000877066,
                        "longitude": 28.70006260897183
                    },
                    {
                        "latitude": -83.86625112906898,
                        "longitude": 29.81595616296419
                    },
                    {
                        "latitude": -83.79718846358233,
                        "longitude": 30.909938547141255
                    },
                    {
                        "latitude": -83.72576457723608,
                        "longitude": 31.981989943558382
                    },
                    {
                        "latitude": -83.65203100517058,
                        "longitude": 33.03214804333007
                    },
                    {
                        "latitude": -83.576038099529,
                        "longitude": 34.060503168272554
                    },
                    {
                        "latitude": -83.4978348955871,
                        "longitude": 35.06719345927274
                    },
                    {
                        "latitude": -83.41746899631944,
                        "longitude": 36.0524001809094
                    },
                    {
                        "latitude": -83.33498647435816,
                        "longitude": 37.01634318292999
                    },
                    {
                        "latitude": -83.2504317902015,
                        "longitude": 37.95927655083476
                    },
                    {
                        "latitude": -83.16384772546724,
                        "longitude": 38.881484470161595
                    },
                    {
                        "latitude": -83.07527532995405,
                        "longitude": 39.78327732217207
                    },
                    {
                        "latitude": -82.98475388126883,
                        "longitude": 40.664988022548236
                    },
                    {
                        "latitude": -82.8923208557923,
                        "longitude": 41.526968609421935
                    },
                    {
                        "latitude": -82.79801190979276,
                        "longitude": 42.369587082551284
                    },
                    {
                        "latitude": -82.70186086954003,
                        "longitude": 43.193224491692256
                    },
                    {
                        "latitude": -82.60389972933373,
                        "longitude": 43.99827226913255
                    },
                    {
                        "latitude": -82.504158656421,
                        "longitude": 44.785129798896925
                    },
                    {
                        "latitude": -82.4026660018508,
                        "longitude": 45.55420221323464
                    },
                    {
                        "latitude": -82.29944831638005,
                        "longitude": 46.30589840558926
                    },
                    {
                        "latitude": -82.19453037062317,
                        "longitude": 47.04062924826747
                    },
                    {
                        "latitude": -82.08793517870352,
                        "longitude": 47.75880600240004
                    },
                    {
                        "latitude": -81.9796840247386,
                        "longitude": 48.46083890746971
                    },
                    {
                        "latitude": -81.86979649155349,
                        "longitude": 49.14713593761196
                    },
                    {
                        "latitude": -81.75829049108457,
                        "longitude": 49.81810171202884
                    },
                    {
                        "latitude": -81.64518229599071,
                        "longitude": 50.47413654715077
                    },
                    {
                        "latitude": -81.53048657204715,
                        "longitude": 51.115635638599464
                    },
                    {
                        "latitude": -81.41421641094792,
                        "longitude": 51.74298836151537
                    },
                    {
                        "latitude": -81.29638336318811,
                        "longitude": 52.35657767838881
                    },
                    {
                        "latitude": -81.1769974707425,
                        "longitude": 52.95677964415162
                    },
                    {
                        "latitude": -81.05606729929335,
                        "longitude": 53.54396299892869
                    },
                    {
                        "latitude": -80.93359996979659,
                        "longitude": 54.11848883950027
                    },
                    {
                        "latitude": -80.80960118920729,
                        "longitude": 54.680710361173226
                    },
                    {
                        "latitude": -80.6840752802109,
                        "longitude": 55.230972662396525
                    },
                    {
                        "latitude": -80.55702520983465,
                        "longitude": 55.769612605070925
                    },
                    {
                        "latitude": -80.42845261683257,
                        "longitude": 56.296958724095155
                    },
                    {
                        "latitude": -80.29835783775923,
                        "longitude": 56.813331180252106
                    },
                    {
                        "latitude": -80.16673993166093,
                        "longitude": 57.319041751070785
                    },
                    {
                        "latitude": -80.03359670333136,
                        "longitude": 57.81439385479703
                    },
                    {
                        "latitude": -79.89892472508785,
                        "longitude": 58.29968260307253
                    },
                    {
                        "latitude": -79.76271935703765,
                        "longitude": 58.77519487835301
                    },
                    {
                        "latitude": -79.62497476581028,
                        "longitude": 59.241209432496156
                    },
                    {
                        "latitude": -79.48568394174285,
                        "longitude": 59.69799700331892
                    },
                    {
                        "latitude": -79.34483871450796,
                        "longitude": 60.14582044626046
                    },
                    {
                        "latitude": -79.20242976718282,
                        "longitude": 60.58493487859744
                    },
                    {
                        "latitude": -79.0584466487587,
                        "longitude": 61.015587833939605
                    },
                    {
                        "latitude": -78.91287778509674,
                        "longitude": 61.43801942499055
                    },
                    {
                        "latitude": -78.7657104883362,
                        "longitude": 61.85246251279135
                    },
                    {
                        "latitude": -78.61693096476431,
                        "longitude": 62.259142880875345
                    },
                    {
                        "latitude": -78.46652432115818,
                        "longitude": 62.65827941295282
                    },
                    {
                        "latitude": -78.31447456960935,
                        "longitude": 63.05008427291566
                    },
                    {
                        "latitude": -78.16076463084305,
                        "longitude": 63.43476308610607
                    },
                    {
                        "latitude": -78.00537633604281,
                        "longitude": 63.81251512093262
                    },
                    {
                        "latitude": -77.84829042719252,
                        "longitude": 64.1835334700397
                    },
                    {
                        "latitude": -77.6894865559452,
                        "longitude": 64.54800523034773
                    },
                    {
                        "latitude": -77.52894328102857,
                        "longitude": 64.90611168138079
                    },
                    {
                        "latitude": -77.3666380641963,
                        "longitude": 65.25802846138528
                    },
                    {
                        "latitude": -77.28317943694962,
                        "longitude": 65.4351713099017,
                        "altitude": 2885.809723253143
                    },
                    {
                        "latitude": -77.37249408958236,
                        "longitude": 66.1634222217084
                    },
                    {
                        "latitude": -77.45941875665193,
                        "longitude": 66.89842209620137
                    },
                    {
                        "latitude": -77.54395157416,
                        "longitude": 67.64012427003475
                    },
                    {
                        "latitude": -77.62609010344224,
                        "longitude": 68.3884741173658
                    },
                    {
                        "latitude": -77.70583136873493,
                        "longitude": 69.14340881796379
                    },
                    {
                        "latitude": -77.78317189544228,
                        "longitude": 69.90485713898997
                    },
                    {
                        "latitude": -77.85810774907465,
                        "longitude": 70.67273923237201
                    },
                    {
                        "latitude": -77.93063457481911,
                        "longitude": 71.44696644973129
                    },
                    {
                        "latitude": -78.00074763769376,
                        "longitude": 72.22744117684242
                    },
                    {
                        "latitude": -78.06844186322529,
                        "longitude": 73.01405668960818
                    },
                    {
                        "latitude": -78.13371187858034,
                        "longitude": 73.80669703351857
                    },
                    {
                        "latitude": -78.19655205406974,
                        "longitude": 74.60523692852925
                    },
                    {
                        "latitude": -78.2569565449341,
                        "longitude": 75.40954170123935
                    },
                    {
                        "latitude": -78.31491933330793,
                        "longitude": 76.21946724617214
                    },
                    {
                        "latitude": -78.37043427025205,
                        "longitude": 77.03486001786186
                    },
                    {
                        "latitude": -78.42349511773028,
                        "longitude": 77.85555705532745
                    },
                    {
                        "latitude": -78.47409559040058,
                        "longitude": 78.6813860403661
                    },
                    {
                        "latitude": -78.52222939708061,
                        "longitude": 79.51216539093008
                    },
                    {
                        "latitude": -78.56789028174012,
                        "longitude": 80.34770439065531
                    },
                    {
                        "latitude": -78.6110720638659,
                        "longitude": 81.18780335539566
                    },
                    {
                        "latitude": -78.65176867803952,
                        "longitude": 82.03225383737866
                    },
                    {
                        "latitude": -78.68997421256336,
                        "longitude": 82.88083886734368
                    },
                    {
                        "latitude": -78.72568294696707,
                        "longitude": 83.73333323474901
                    },
                    {
                        "latitude": -78.75888938822516,
                        "longitude": 84.58950380584862
                    },
                    {
                        "latitude": -78.78958830551596,
                        "longitude": 85.4491098791391
                    },
                    {
                        "latitude": -78.81777476335357,
                        "longitude": 86.31190357737117
                    },
                    {
                        "latitude": -78.8434441529271,
                        "longitude": 87.1776302750091
                    },
                    {
                        "latitude": -78.86659222148684,
                        "longitude": 88.04602905970923
                    },
                    {
                        "latitude": -78.88721509962213,
                        "longitude": 88.91683322608195
                    },
                    {
                        "latitude": -78.9053093262845,
                        "longitude": 89.7897707997007
                    },
                    {
                        "latitude": -78.9208718714191,
                        "longitude": 90.66456508903532
                    },
                    {
                        "latitude": -78.93390015607787,
                        "longitude": 91.54093526271522
                    },
                    {
                        "latitude": -78.94439206990107,
                        "longitude": 92.41859694927882
                    },
                    {
                        "latitude": -78.95234598586705,
                        "longitude": 93.29726285633934
                    },
                    {
                        "latitude": -78.95776077222564,
                        "longitude": 94.17664340590073
                    },
                    {
                        "latitude": -78.96063580154616,
                        "longitude": 95.056447382391
                    },
                    {
                        "latitude": -78.96097095682771,
                        "longitude": 95.93638258984906
                    },
                    {
                        "latitude": -78.95876663463756,
                        "longitude": 96.81615651460538
                    },
                    {
                        "latitude": -78.95402374526066,
                        "longitude": 97.69547698973972
                    },
                    {
                        "latitude": -78.9467437098614,
                        "longitude": 98.57405285758017
                    },
                    {
                        "latitude": -78.93692845467757,
                        "longitude": 99.4515946265284
                    },
                    {
                        "latitude": -78.9245804022832,
                        "longitude": 100.32781511855546
                    },
                    {
                        "latitude": -78.90970245997572,
                        "longitude": 101.20243010380969
                    },
                    {
                        "latitude": -78.89229800535824,
                        "longitude": 102.07515891891128
                    },
                    {
                        "latitude": -78.8723708692045,
                        "longitude": 102.945725065676
                    },
                    {
                        "latitude": -78.84992531570938,
                        "longitude": 103.81385678720872
                    },
                    {
                        "latitude": -78.8249660202396,
                        "longitude": 104.67928761853453
                    },
                    {
                        "latitude": -78.7974980447148,
                        "longitude": 105.54175690918571
                    },
                    {
                        "latitude": -78.76752681075632,
                        "longitude": 106.40101031543541
                    },
                    {
                        "latitude": -78.7350580707542,
                        "longitude": 107.25680026015587
                    },
                    {
                        "latitude": -78.70009787700727,
                        "longitude": 108.10888635858035
                    },
                    {
                        "latitude": -78.66265254909989,
                        "longitude": 108.95703580855499
                    },
                    {
                        "latitude": -78.62272863968228,
                        "longitude": 109.80102374417889
                    },
                    {
                        "latitude": -78.5803328988239,
                        "longitude": 110.64063355204198
                    },
                    {
                        "latitude": -78.53547223711145,
                        "longitude": 111.47565714957605
                    },
                    {
                        "latitude": -78.48815368766155,
                        "longitude": 112.30589522533339
                    },
                    {
                        "latitude": -78.4383843672178,
                        "longitude": 113.13115744129348
                    },
                    {
                        "latitude": -78.38617143649668,
                        "longitude": 113.9512625975716
                    },
                    {
                        "latitude": -78.33152205994395,
                        "longitude": 114.76603876015679
                    },
                    {
                        "latitude": -78.27444336505647,
                        "longitude": 115.57532335254412
                    },
                    {
                        "latitude": -78.21494240141722,
                        "longitude": 116.37896321234007
                    },
                    {
                        "latitude": -78.15302609958508,
                        "longitude": 117.17681461411237
                    },
                    {
                        "latitude": -78.08870122996976,
                        "longitude": 117.96874325992603
                    },
                    {
                        "latitude": -78.02197436181582,
                        "longitude": 118.75462423915194
                    },
                    {
                        "latitude": -77.95285182240781,
                        "longitude": 119.53434195925719
                    },
                    {
                        "latitude": -77.88133965659951,
                        "longitude": 120.30779004938454
                    },
                    {
                        "latitude": -77.80744358675955,
                        "longitude": 121.07487123860466
                    },
                    {
                        "latitude": -77.7311689732146,
                        "longitude": 121.83549721077796
                    },
                    {
                        "latitude": -77.65252077526164,
                        "longitude": 122.58958843799641
                    },
                    {
                        "latitude": -77.5715035128094,
                        "longitude": 123.33707399458822
                    },
                    {
                        "latitude": -77.48812122869914,
                        "longitude": 124.07789135366485
                    },
                    {
                        "latitude": -77.40237745174446,
                        "longitude": 124.81198616816665
                    },
                    {
                        "latitude": -77.31427516052,
                        "longitude": 125.53931203832894
                    },
                    {
                        "latitude": -77.22381674792038,
                        "longitude": 126.25983026743958
                    },
                    {
                        "latitude": -77.13100398649934,
                        "longitude": 126.97350960769917
                    },
                    {
                        "latitude": -77.03583799459352,
                        "longitude": 127.68032599792332
                    },
                    {
                        "latitude": -76.93831920322476,
                        "longitude": 128.38026229474835
                    },
                    {
                        "latitude": -76.83844732376807,
                        "longitude": 129.07330799891542
                    },
                    {
                        "latitude": -76.73622131636617,
                        "longitude": 129.7594589781181
                    },
                    {
                        "latitude": -76.63163935906394,
                        "longitude": 130.4387171878037
                    },
                    {
                        "latitude": -76.5246988176299,
                        "longitude": 131.1110903912222
                    },
                    {
                        "latitude": -76.41539621602878,
                        "longitude": 131.7765918799183
                    },
                    {
                        "latitude": -76.30372720750053,
                        "longitude": 132.4352401957639
                    },
                    {
                        "latitude": -76.18968654620078,
                        "longitude": 133.0870588555321
                    },
                    {
                        "latitude": -76.07326805935044,
                        "longitude": 133.73207607891658
                    },
                    {
                        "latitude": -75.95446461984146,
                        "longitude": 134.37032452080814
                    },
                    {
                        "latitude": -75.83326811924036,
                        "longitude": 135.00184100854906
                    },
                    {
                        "latitude": -75.70966944113046,
                        "longitude": 135.62666628479997
                    },
                    {
                        "latitude": -75.58365843473042,
                        "longitude": 136.24484475656982
                    },
                    {
                        "latitude": -75.45522388872514,
                        "longitude": 136.85642425088176
                    },
                    {
                        "latitude": -75.32435350524361,
                        "longitude": 137.46145577747328
                    },
                    {
                        "latitude": -75.19964223355011,
                        "longitude": 138.0218702697203,
                        "altitude": 3116.1856871037094
                    },
                    {
                        "latitude": -75.33025248549154,
                        "longitude": 138.64922145358193
                    },
                    {
                        "latitude": -75.45828154516062,
                        "longitude": 139.28315248904275
                    },
                    {
                        "latitude": -75.58374313034908,
                        "longitude": 139.92370382194372
                    },
                    {
                        "latitude": -75.70664980153092,
                        "longitude": 140.57091206381824
                    },
                    {
                        "latitude": -75.82701299381422,
                        "longitude": 141.22480974223436
                    },
                    {
                        "latitude": -75.94484304900713,
                        "longitude": 141.88542504572288
                    },
                    {
                        "latitude": -76.06014924786562,
                        "longitude": 142.55278156390094
                    },
                    {
                        "latitude": -76.17293984258676,
                        "longitude": 143.226898023482
                    },
                    {
                        "latitude": -76.28322208960925,
                        "longitude": 143.90778802095102
                    },
                    {
                        "latitude": -76.39100228277816,
                        "longitude": 144.59545975277118
                    },
                    {
                        "latitude": -76.49628578692723,
                        "longitude": 145.2899157440805
                    },
                    {
                        "latitude": -76.59907707192777,
                        "longitude": 145.99115257692932
                    },
                    {
                        "latitude": -76.6993797472472,
                        "longitude": 146.69916061920327
                    },
                    {
                        "latitude": -76.79719659705626,
                        "longitude": 147.4139237554698
                    },
                    {
                        "latitude": -76.89252961591555,
                        "longitude": 148.13541912107863
                    },
                    {
                        "latitude": -76.98538004506841,
                        "longitude": 148.86361684093688
                    },
                    {
                        "latitude": -77.07574840935752,
                        "longitude": 149.598479774466
                    },
                    {
                        "latitude": -77.16363455477601,
                        "longitude": 150.33996326833002
                    },
                    {
                        "latitude": -77.24903768665676,
                        "longitude": 151.08801491859964
                    },
                    {
                        "latitude": -77.33195640849263,
                        "longitude": 151.84257434408585
                    },
                    {
                        "latitude": -77.41238876137419,
                        "longitude": 152.60357297263465
                    },
                    {
                        "latitude": -77.49033226401957,
                        "longitude": 153.37093384222325
                    },
                    {
                        "latitude": -77.56578395336305,
                        "longitude": 154.14457141873348
                    },
                    {
                        "latitude": -77.63874042565823,
                        "longitude": 154.92439143229996
                    },
                    {
                        "latitude": -77.70919787804132,
                        "longitude": 155.71029073413723
                    },
                    {
                        "latitude": -77.77715215048931,
                        "longitude": 156.50215717573792
                    },
                    {
                        "latitude": -77.84259876809881,
                        "longitude": 157.29986951230663
                    },
                    {
                        "latitude": -77.90553298359852,
                        "longitude": 158.10329733224324
                    },
                    {
                        "latitude": -77.96594981999976,
                        "longitude": 158.9123010144216
                    },
                    {
                        "latitude": -78.02384411327911,
                        "longitude": 159.72673171491584
                    },
                    {
                        "latitude": -78.07921055497667,
                        "longitude": 160.54643138471658
                    },
                    {
                        "latitude": -78.13204373458518,
                        "longitude": 161.3712328198392
                    },
                    {
                        "latitude": -78.1823381815964,
                        "longitude": 162.20095974507151
                    },
                    {
                        "latitude": -78.23008840706281,
                        "longitude": 163.0354269324254
                    },
                    {
                        "latitude": -78.27528894452703,
                        "longitude": 163.874440355157
                    },
                    {
                        "latitude": -78.31793439016394,
                        "longitude": 164.71779737799605
                    },
                    {
                        "latitude": -78.35801944197695,
                        "longitude": 165.56528698398662
                    },
                    {
                        "latitude": -78.39553893788589,
                        "longitude": 166.41669003808283
                    },
                    {
                        "latitude": -78.43048789254163,
                        "longitude": 167.27177958737295
                    },
                    {
                        "latitude": -78.46286153270252,
                        "longitude": 168.13032119752114
                    },
                    {
                        "latitude": -78.49265533100808,
                        "longitude": 168.9920733247265
                    },
                    {
                        "latitude": -78.51986503798723,
                        "longitude": 169.85678772220143
                    },
                    {
                        "latitude": -78.5444867121441,
                        "longitude": 170.7242098798747
                    },
                    {
                        "latitude": -78.5665167479681,
                        "longitude": 171.59407949572935
                    },
                    {
                        "latitude": -78.58595190172319,
                        "longitude": 172.46613097689732
                    },
                    {
                        "latitude": -78.60278931488,
                        "longitude": 173.34009396835467
                    },
                    {
                        "latitude": -78.61702653506468,
                        "longitude": 174.21569390679846
                    },
                    {
                        "latitude": -78.62866153440977,
                        "longitude": 175.09265259704188
                    },
                    {
                        "latitude": -78.63769272520604,
                        "longitude": 175.9706888080413
                    },
                    {
                        "latitude": -78.64411897276742,
                        "longitude": 176.84951888547434
                    },
                    {
                        "latitude": -78.64793960543797,
                        "longitude": 177.72885737761789
                    },
                    {
                        "latitude": -78.64915442168407,
                        "longitude": 178.60841767114223
                    },
                    {
                        "latitude": -78.64776369423363,
                        "longitude": 179.48791263333302
                    },
                    {
                        "latitude": -78.645436362134,
                        "longitude": 180
                    }
                ]
            ],
            "pole": 2,
            "poleIndex": 1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 379,
                            "linkTo": 460
                        },
                        "81": {
                            "visited": false,
                            "forPole": false,
                            "index": 460,
                            "linkTo": 379
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 461,
                            "linkTo": 378
                        },
                        "103": {
                            "visited": false,
                            "forPole": true,
                            "index": 26,
                            "linkTo": -1
                        },
                        "106": {
                            "visited": false,
                            "forPole": true,
                            "index": 29,
                            "linkTo": -1
                        },
                        "455": {
                            "visited": false,
                            "forPole": false,
                            "index": 378,
                            "linkTo": 461
                        }
                    }
                }
            ]
        }
    ];
    var polygonSouthPoleAndIntersectionOutput = transformOutputData(polygonSouthPoleAndIntersectionRawOutput);

    var polygonNorthPoleAndIntersectionRawInput = [
        [
            {
                "latitude": 83.99470687132454,
                "longitude": 47.16155718697617,
                "altitude": -3871.037368202361
            },
            {
                "latitude": 84.09707986125422,
                "longitude": 46.225373649181954
            },
            {
                "latitude": 84.19750121032408,
                "longitude": 45.25980548770665
            },
            {
                "latitude": 84.29591405759817,
                "longitude": 44.26390634779206
            },
            {
                "latitude": 84.39225776311172,
                "longitude": 43.23673572299413
            },
            {
                "latitude": 84.48646783760707,
                "longitude": 42.177366229047614
            },
            {
                "latitude": 84.57847589198941,
                "longitude": 41.084891983382825
            },
            {
                "latitude": 84.66820961111654,
                "longitude": 39.958438169855185
            },
            {
                "latitude": 84.75559275705494,
                "longitude": 38.79717185668599
            },
            {
                "latitude": 84.84054520742924,
                "longitude": 37.60031411822853
            },
            {
                "latitude": 84.9229830349416,
                "longitude": 36.36715348689062
            },
            {
                "latitude": 85.00281863450321,
                "longitude": 35.09706072931645
            },
            {
                "latitude": 85.07996090466364,
                "longitude": 33.78950489983852
            },
            {
                "latitude": 85.15431549009564,
                "longitude": 32.44407057358519
            },
            {
                "latitude": 85.22578509174106,
                "longitude": 31.060476101212476
            },
            {
                "latitude": 85.29426985078375,
                "longitude": 29.638592657352405
            },
            {
                "latitude": 85.35966781183967,
                "longitude": 28.178463776664373
            },
            {
                "latitude": 85.42187546957271,
                "longitude": 26.68032498696651
            },
            {
                "latitude": 85.48078840132263,
                "longitude": 25.14462306161475
            },
            {
                "latitude": 85.53630198623193,
                "longitude": 23.57203432768036
            },
            {
                "latitude": 85.58831220877614,
                "longitude": 21.96348138844885
            },
            {
                "latitude": 85.63671654156721,
                "longitude": 20.320147555383716
            },
            {
                "latitude": 85.68141489887526,
                "longitude": 18.64348824385756
            },
            {
                "latitude": 85.72231064861816,
                "longitude": 16.935238576822783
            },
            {
                "latitude": 85.75931166676277,
                "longitude": 15.197416468851667
            },
            {
                "latitude": 85.79233141437227,
                "longitude": 13.432320535848152
            },
            {
                "latitude": 85.82129001418107,
                "longitude": 11.64252229694323
            },
            {
                "latitude": 85.8461153008332,
                "longitude": 9.830852304821692
            },
            {
                "latitude": 85.86674381706952,
                "longitude": 8.000380054828698
            },
            {
                "latitude": 85.88312172743295,
                "longitude": 6.154387772725707
            },
            {
                "latitude": 85.89520562165731,
                "longitude": 4.296338452291527
            },
            {
                "latitude": 85.90296318193938,
                "longitude": 2.4298387895887585
            },
            {
                "latitude": 85.90637369174159,
                "longitude": 0.5585979206617699
            },
            {
                "latitude": 85.9054283685359,
                "longitude": -1.3136169067773347
            },
            {
                "latitude": 85.90013050872803,
                "longitude": -3.1830264282006837
            },
            {
                "latitude": 85.89049543957111,
                "longitude": -5.045885824855094
            },
            {
                "latitude": 85.87655027978037,
                "longitude": -6.89853013443466
            },
            {
                "latitude": 85.85833351734354,
                "longitude": -8.73741724967573
            },
            {
                "latitude": 85.8358944192863,
                "longitude": -10.559167279206354
            },
            {
                "latitude": 85.80929229348368,
                "longitude": -12.360597242577338
            },
            {
                "latitude": 85.77859562675704,
                "longitude": -14.13875031517966
            },
            {
                "latitude": 85.74388112624854,
                "longitude": -15.890919108861182
            },
            {
                "latitude": 85.70523269239142,
                "longitude": -17.614662749982
            },
            {
                "latitude": 85.66274035172472,
                "longitude": -19.307817779399958
            },
            {
                "latitude": 85.61649917649461,
                "longitude": -20.968503132686912
            },
            {
                "latitude": 85.56660821566383,
                "longitude": -22.59511965233562
            },
            {
                "latitude": 85.51316945886711,
                "longitude": -24.186344730215712
            },
            {
                "latitude": 85.45628685128595,
                "longitude": -25.74112277610196
            },
            {
                "latitude": 85.39606537362909,
                "longitude": -27.25865225874609
            },
            {
                "latitude": 85.3326101976236,
                "longitude": -28.738370074761015
            },
            {
                "latitude": 85.26602592384351,
                "longitude": -30.179933974591865
            },
            {
                "latitude": 85.1964159054512,
                "longitude": -31.58320372208654
            },
            {
                "latitude": 85.12388165860912,
                "longitude": -32.94822159276993
            },
            {
                "latitude": 85.04852235797206,
                "longitude": -34.2751927334114
            },
            {
                "latitude": 84.97043441380478,
                "longitude": -35.56446581838329
            },
            {
                "latitude": 84.88971112587059,
                "longitude": -36.816514351909255
            },
            {
                "latitude": 84.80644240825924,
                "longitude": -38.03191888355609
            },
            {
                "latitude": 84.72071457872218,
                "longitude": -39.21135032994626
            },
            {
                "latitude": 84.63261020578948,
                "longitude": -40.355554530281815
            },
            {
                "latitude": 84.54220800691256,
                "longitude": -41.46533810758735
            },
            {
                "latitude": 84.44958279103756,
                "longitude": -42.54155566162912
            },
            {
                "latitude": 84.3548054393272,
                "longitude": -43.5850982827638
            },
            {
                "latitude": 84.28164736724293,
                "longitude": -44.35411158365523,
                "altitude": -1288.5104514023271
            },
            {
                "latitude": 84.38238930919223,
                "longitude": -45.39439656984446
            },
            {
                "latitude": 84.48091698356409,
                "longitude": -46.46873463199597
            },
            {
                "latitude": 84.57715726556243,
                "longitude": -47.57816865827513
            },
            {
                "latitude": 84.67103250884415,
                "longitude": -48.7237141741517
            },
            {
                "latitude": 84.76246052098661,
                "longitude": -49.90634731708564
            },
            {
                "latitude": 84.85135457770845,
                "longitude": -51.126991198211954
            },
            {
                "latitude": 84.9376234833775,
                "longitude": -52.38650059148825
            },
            {
                "latitude": 85.02117168591877,
                "longitude": -53.68564492723087
            },
            {
                "latitude": 85.1018994546893,
                "longitude": -55.02508961525814
            },
            {
                "latitude": 85.17970313013974,
                "longitude": -56.405375784254566
            },
            {
                "latitude": 85.25447545406294,
                "longitude": -57.82689859926791
            },
            {
                "latitude": 85.32610598886068,
                "longitude": -59.28988440851014
            },
            {
                "latitude": 85.3944816334403,
                "longitude": -60.79436707285558
            },
            {
                "latitude": 85.45948724201554,
                "longitude": -62.340163944231726
            },
            {
                "latitude": 85.5210063501358,
                "longitude": -63.92685207839537
            },
            {
                "latitude": 85.57892200966354,
                "longitude": -65.5537453873564
            },
            {
                "latitude": 85.63311773112723,
                "longitude": -67.2198735488913
            },
            {
                "latitude": 85.68347852792206,
                "longitude": -68.92396358520271
            },
            {
                "latitude": 85.72989205229662,
                "longitude": -70.66442508836258
            },
            {
                "latitude": 85.77224980809119,
                "longitude": -72.43934009455072
            },
            {
                "latitude": 85.81044842001906,
                "longitude": -74.24645858053904
            },
            {
                "latitude": 85.84439093419546,
                "longitude": -76.08320046458694
            },
            {
                "latitude": 85.87398811997548,
                "longitude": -77.94666483374077
            },
            {
                "latitude": 85.8991597393754,
                "longitude": -79.83364688960731
            },
            {
                "latitude": 85.91983574779708,
                "longitude": -81.7406628107983
            },
            {
                "latitude": 85.93595738883315,
                "longitude": -83.66398238563256
            },
            {
                "latitude": 85.94747814686856,
                "longitude": -85.59966889377478
            },
            {
                "latitude": 85.95436452415615,
                "longitude": -87.54362533669044
            },
            {
                "latitude": 85.95659661401734,
                "longitude": -89.49164576410668
            },
            {
                "latitude": 85.95416844859261,
                "longitude": -91.43947014744239
            },
            {
                "latitude": 85.9470881077832,
                "longitude": -93.38284103845098
            },
            {
                "latitude": 85.93537758514236,
                "longitude": -95.31756014229455
            },
            {
                "latitude": 85.91907241589449,
                "longitude": -97.23954293952337
            },
            {
                "latitude": 85.89822108131375,
                "longitude": -99.14486961045547
            },
            {
                "latitude": 85.8728842117952,
                "longitude": -101.02983073670123
            },
            {
                "latitude": 85.84313361755449,
                "longitude": -102.89096655711246
            },
            {
                "latitude": 85.80905118068671,
                "longitude": -104.7250989117657
            },
            {
                "latitude": 85.77072764506332,
                "longitude": -106.52935538723924
            },
            {
                "latitude": 85.72826134130054,
                "longitude": -108.30118554961706
            },
            {
                "latitude": 85.68175688290663,
                "longitude": -110.03836949240359
            },
            {
                "latitude": 85.63132386703177,
                "longitude": -111.73901921503935
            },
            {
                "latitude": 85.57707560933684,
                "longitude": -113.40157357143924
            },
            {
                "latitude": 85.51912793780416,
                "longitude": -115.02478768177481
            },
            {
                "latitude": 85.45759806518733,
                "longitude": -116.60771778600058
            },
            {
                "latitude": 85.39260355463003,
                "longitude": -118.14970254094128
            },
            {
                "latitude": 85.32426138804504,
                "longitude": -119.65034173414712
            },
            {
                "latitude": 85.25268714235087,
                "longitude": -121.10947331901279
            },
            {
                "latitude": 85.17799427477348,
                "longitude": -122.52714957899357
            },
            {
                "latitude": 85.1002935151934,
                "longitude": -123.90361311549962
            },
            {
                "latitude": 85.0196923609744,
                "longitude": -125.23927323402143
            },
            {
                "latitude": 84.93629466782818,
                "longitude": -126.53468318411232
            },
            {
                "latitude": 84.85020032898045,
                "longitude": -127.79051859687084
            },
            {
                "latitude": 84.76150503414013,
                "longitude": -129.00755736244227
            },
            {
                "latitude": 84.67030009943618,
                "longitude": -130.18666110204495
            },
            {
                "latitude": 84.57667235950544,
                "longitude": -131.32875831500178
            },
            {
                "latitude": 84.48070411318727,
                "longitude": -132.4348292210942
            },
            {
                "latitude": 84.38247311475406,
                "longitude": -133.50589227139272
            },
            {
                "latitude": 84.28205260319896,
                "longitude": -134.54299226525532
            },
            {
                "latitude": 84.1795113627762,
                "longitude": -135.5471899858856
            },
            {
                "latitude": 84.0749138086898,
                "longitude": -136.51955325009948
            },
            {
                "latitude": 83.9683200925357,
                "longitude": -137.4611492581954
            },
            {
                "latitude": 83.85978622278495,
                "longitude": -138.3730381256175
            },
            {
                "latitude": 83.74936419624052,
                "longitude": -139.25626747815627
            },
            {
                "latitude": 83.63710213700035,
                "longitude": -140.11186799564342
            },
            {
                "latitude": 83.52304443999856,
                "longitude": -140.94084979454436
            },
            {
                "latitude": 83.40723191668947,
                "longitude": -141.7441995467768
            },
            {
                "latitude": 83.2897019408658,
                "longitude": -142.52287823989295
            },
            {
                "latitude": 83.17048859298146,
                "longitude": -143.27781949199004
            },
            {
                "latitude": 83.04962280167763,
                "longitude": -144.00992834301212
            },
            {
                "latitude": 82.92713248148935,
                "longitude": -144.72008045222148
            },
            {
                "latitude": 82.80304266594995,
                "longitude": -145.409121639375
            },
            {
                "latitude": 82.67737563551147,
                "longitude": -146.07786771442213
            },
            {
                "latitude": 82.5501510398679,
                "longitude": -146.7271045472805
            },
            {
                "latitude": 82.42138601440473,
                "longitude": -147.35758833540805
            },
            {
                "latitude": 82.29109529061537,
                "longitude": -147.97004603247237
            },
            {
                "latitude": 82.15929130041614,
                "longitude": -148.56517590642898
            },
            {
                "latitude": 82.02598427436403,
                "longitude": -149.14364819979016
            },
            {
                "latitude": 81.89118233384181,
                "longitude": -149.70610586882114
            },
            {
                "latitude": 81.75489157731946,
                "longitude": -150.25316538188878
            },
            {
                "latitude": 81.61711616083409,
                "longitude": -150.78541756024075
            },
            {
                "latitude": 81.50986946056605,
                "longitude": -151.18606845733086,
                "altitude": -3419.740220163263
            },
            {
                "latitude": 81.59342134716925,
                "longitude": -152.12769930204087
            },
            {
                "latitude": 81.67441208879697,
                "longitude": -153.08446534854977
            },
            {
                "latitude": 81.75280977362853,
                "longitude": -154.0563225168665
            },
            {
                "latitude": 81.82858172930636,
                "longitude": -155.04319478533918
            },
            {
                "latitude": 81.90169463751046,
                "longitude": -156.044972302423
            },
            {
                "latitude": 81.97211465728813,
                "longitude": -157.06150956384164
            },
            {
                "latitude": 82.03980755702632,
                "longitude": -158.0926236804854
            },
            {
                "latitude": 82.10473885483144,
                "longitude": -159.13809276407747
            },
            {
                "latitude": 82.16687396694552,
                "longitude": -160.19765445902812
            },
            {
                "latitude": 82.22617836368414,
                "longitude": -161.27100464989712
            },
            {
                "latitude": 82.28261773222582,
                "longitude": -162.3577963744217
            },
            {
                "latitude": 82.33615814542803,
                "longitude": -163.45763897205362
            },
            {
                "latitude": 82.38676623568097,
                "longitude": -164.57009749731714
            },
            {
                "latitude": 82.43440937265177,
                "longitude": -165.69469242597992
            },
            {
                "latitude": 82.47905584361604,
                "longitude": -166.8308996799733
            },
            {
                "latitude": 82.52067503492889,
                "longitude": -167.97815099417468
            },
            {
                "latitude": 82.55923761305307,
                "longitude": -169.13583464456244
            },
            {
                "latitude": 82.59471570345171,
                "longitude": -170.30329655288975
            },
            {
                "latitude": 82.62708306555739,
                "longitude": -171.4798417779431
            },
            {
                "latitude": 82.65631526197069,
                "longitude": -172.6647363977302
            },
            {
                "latitude": 82.68238982000435,
                "longitude": -173.8572097806857
            },
            {
                "latitude": 82.70528638369515,
                "longitude": -175.05645723732997
            },
            {
                "latitude": 82.72498685444091,
                "longitude": -176.26164303692474
            },
            {
                "latitude": 82.74147551849963,
                "longitude": -177.471903766729
            },
            {
                "latitude": 82.75473915970097,
                "longitude": -178.68635200466426
            },
            {
                "latitude": 82.76476715587692,
                "longitude": -179.90408026975888
            },
            {
                "latitude": 82.77155155770092,
                "longitude": 178.875834791136
            },
            {
                "latitude": 82.77508714885062,
                "longitude": 177.65432802698845
            },
            {
                "latitude": 82.77537148665269,
                "longitude": 176.4323412674047
            },
            {
                "latitude": 82.77240492263557,
                "longitude": 175.21081872255354
            },
            {
                "latitude": 82.76619060270318,
                "longitude": 173.990702354046
            },
            {
                "latitude": 82.75673444692596,
                "longitude": 172.77292727327782
            },
            {
                "latitude": 82.74404510924303,
                "longitude": 171.5584172231209
            },
            {
                "latitude": 82.72813391764565,
                "longitude": 170.34808019696217
            },
            {
                "latitude": 82.70901479568572,
                "longitude": 169.14280424601196
            },
            {
                "latitude": 82.6867041663952,
                "longitude": 167.94345352164206
            },
            {
                "latitude": 82.66122083992764,
                "longitude": 166.7508645944162
            },
            {
                "latitude": 82.63258588641531,
                "longitude": 165.56584308561662
            },
            {
                "latitude": 82.60082249569487,
                "longitude": 164.38916064064364
            },
            {
                "latitude": 82.56595582566645,
                "longitude": 163.22155226687963
            },
            {
                "latitude": 82.52801284112853,
                "longitude": 162.0637140516671
            },
            {
                "latitude": 82.4870221449716,
                "longitude": 160.91630126915769
            },
            {
                "latitude": 82.443013803615,
                "longitude": 159.77992687812525
            },
            {
                "latitude": 82.3960191685382,
                "longitude": 158.65516040656675
            },
            {
                "latitude": 82.3460706956956,
                "longitude": 157.54252721317826
            },
            {
                "latitude": 82.293201764512,
                "longitude": 156.4425081106921
            },
            {
                "latitude": 82.23744649804249,
                "longitude": 155.3555393316768
            },
            {
                "latitude": 82.17883958574849,
                "longitude": 154.28201281377844
            },
            {
                "latitude": 82.11741611019453,
                "longitude": 153.2222767785348
            },
            {
                "latitude": 82.05321137881769,
                "longitude": 152.17663657581755
            },
            {
                "latitude": 81.98626076175681,
                "longitude": 151.14535576461967
            },
            {
                "latitude": 81.9165995365735,
                "longitude": 150.12865740025097
            },
            {
                "latitude": 81.8442627405336,
                "longitude": 149.12672549797932
            },
            {
                "latitude": 81.76928503096637,
                "longitude": 148.13970664367397
            },
            {
                "latitude": 81.69170055407459,
                "longitude": 147.16771172299812
            },
            {
                "latitude": 81.61154282243078,
                "longitude": 146.21081774207548
            },
            {
                "latitude": 81.60588960207882,
                "longitude": 146.1450217990359,
                "altitude": -2320.314905497531
            },
            {
                "latitude": 81.75194781975623,
                "longitude": 145.42393485667628
            },
            {
                "latitude": 81.89580475042042,
                "longitude": 144.68172636127565
            },
            {
                "latitude": 82.03744078712906,
                "longitude": 143.9175920275629
            },
            {
                "latitude": 82.17683273560883,
                "longitude": 143.13070345520313
            },
            {
                "latitude": 82.31395369132575,
                "longitude": 142.32020914938892
            },
            {
                "latitude": 82.44877291332972,
                "longitude": 141.48523591820586
            },
            {
                "latitude": 82.58125569606038,
                "longitude": 140.62489070585525
            },
            {
                "latitude": 82.71136324057765,
                "longitude": 139.73826292678675
            },
            {
                "latitude": 82.83905252700296,
                "longitude": 138.8244273717135
            },
            {
                "latitude": 82.87456998128354,
                "longitude": 138.56203167997123,
                "altitude": -2868.342405800213
            },
            {
                "latitude": 82.97385729890665,
                "longitude": 139.51080686661868
            },
            {
                "latitude": 83.07082949567187,
                "longitude": 140.4827384524722
            },
            {
                "latitude": 83.16543833892662,
                "longitude": 141.4782349497348
            },
            {
                "latitude": 83.2576331960228,
                "longitude": 142.49767421844166
            },
            {
                "latitude": 83.34736109753784,
                "longitude": 143.54139818455192
            },
            {
                "latitude": 83.4345668203425,
                "longitude": 144.60970719022077
            },
            {
                "latitude": 83.51919299257524,
                "longitude": 145.70285399789228
            },
            {
                "latitude": 83.6011802225603,
                "longitude": 146.8210374810078
            },
            {
                "latitude": 83.68046725362865,
                "longitude": 147.96439604677693
            },
            {
                "latitude": 83.75699114665848,
                "longitude": 149.1330008505025
            },
            {
                "latitude": 83.83068749194287,
                "longitude": 150.32684887620363
            },
            {
                "latitude": 83.90149065169061,
                "longitude": 151.54585597443258
            },
            {
                "latitude": 83.96933403408953,
                "longitude": 152.78984996481327
            },
            {
                "latitude": 84.03415039937813,
                "longitude": 154.0585639273816
            },
            {
                "latitude": 84.09587219779678,
                "longitude": 155.3516298225885
            },
            {
                "latitude": 84.15443193861879,
                "longitude": 156.66857259401488
            },
            {
                "latitude": 84.20976258870105,
                "longitude": 158.0088049195118
            },
            {
                "latitude": 84.26179799815309,
                "longitude": 159.37162278461042
            },
            {
                "latitude": 84.31047334982686,
                "longitude": 160.75620205561148
            },
            {
                "latitude": 84.35572562839508,
                "longitude": 162.1615962277562
            },
            {
                "latitude": 84.39749410384977,
                "longitude": 163.58673551541796
            },
            {
                "latitude": 84.43572082334508,
                "longitude": 165.03042743563753
            },
            {
                "latitude": 84.47035110448152,
                "longitude": 166.49135901316026
            },
            {
                "latitude": 84.50133402241548,
                "longitude": 167.96810070438676
            },
            {
                "latitude": 84.52862288262916,
                "longitude": 169.45911209973616
            },
            {
                "latitude": 84.55217567085545,
                "longitude": 170.96274941974573
            },
            {
                "latitude": 84.57195547155183,
                "longitude": 172.4772747711908
            },
            {
                "latitude": 84.58793084648724,
                "longitude": 174.0008670774712
            },
            {
                "latitude": 84.6000761654661,
                "longitude": 175.531634544724
            },
            {
                "latitude": 84.60837188195617,
                "longitude": 177.0676284740999
            },
            {
                "latitude": 84.61280474741231,
                "longitude": 178.60685818399654
            },
            {
                "latitude": 84.6133679593539,
                "longitude": -179.8526932337027
            },
            {
                "latitude": 84.61006123972595,
                "longitude": -178.31305262992836
            },
            {
                "latitude": 84.60289084168583,
                "longitude": -176.77624031347307
            },
            {
                "latitude": 84.59186948465323,
                "longitude": -175.2442536985645
            },
            {
                "latitude": 84.57701621916274,
                "longitude": -173.71905141375217
            },
            {
                "latitude": 84.5583562246905,
                "longitude": -172.20253818365896
            },
            {
                "latitude": 84.5359205451326,
                "longitude": -170.69655076668215
            },
            {
                "latitude": 84.50974576792336,
                "longitude": -169.20284519370554
            },
            {
                "latitude": 84.47987365385325,
                "longitude": -167.72308550746178
            },
            {
                "latitude": 84.44635072544885,
                "longitude": -166.25883415185496
            },
            {
                "latitude": 84.40922782229,
                "longitude": -164.81154410791626
            },
            {
                "latitude": 84.3685596318658,
                "longitude": -163.38255282068098
            },
            {
                "latitude": 84.32440420451991,
                "longitude": -161.9730779114472
            },
            {
                "latitude": 84.27682246074001,
                "longitude": -160.58421462456627
            },
            {
                "latitude": 84.22587769853034,
                "longitude": -159.21693491861953
            },
            {
                "latitude": 84.17163510792611,
                "longitude": -157.87208807955804
            },
            {
                "latitude": 84.11416129889429,
                "longitude": -156.55040270864149
            },
            {
                "latitude": 84.05352384797094,
                "longitude": -155.25248992085756
            },
            {
                "latitude": 84.00400411920556,
                "longitude": -154.25556972710612,
                "altitude": -2278.5465963606644
            },
            {
                "latitude": 84.16693572245066,
                "longitude": -153.7316939036157
            },
            {
                "latitude": 84.32850309377238,
                "longitude": -153.18086022476933
            },
            {
                "latitude": 84.488699960539,
                "longitude": -152.6009458677754
            },
            {
                "latitude": 84.6475153672041,
                "longitude": -151.9896117505913
            },
            {
                "latitude": 84.80493314504422,
                "longitude": -151.3442762324827
            },
            {
                "latitude": 84.96093129459132,
                "longitude": -150.662085278844
            },
            {
                "latitude": 85.11548126562684,
                "longitude": -149.9398786232079
            },
            {
                "latitude": 85.26854711679735,
                "longitude": -149.17415141956013
            },
            {
                "latitude": 85.42008453360533,
                "longitude": -148.36101084849454
            },
            {
                "latitude": 85.57003967967273,
                "longitude": -147.49612713095547
            },
            {
                "latitude": 85.59071321906342,
                "longitude": -147.37179722024706,
                "altitude": -2357.1528619932833
            },
            {
                "latitude": 85.67190439190887,
                "longitude": -148.74925692562545
            },
            {
                "latitude": 85.75035228953824,
                "longitude": -150.17546622639998
            },
            {
                "latitude": 85.82593563009678,
                "longitude": -151.65136085173222
            },
            {
                "latitude": 85.89852814347778,
                "longitude": -153.17769027393635
            },
            {
                "latitude": 85.96799904915581,
                "longitude": -154.75498111166002
            },
            {
                "latitude": 86.03421367847537,
                "longitude": -156.38349834651626
            },
            {
                "latitude": 86.09703425484541,
                "longitude": -158.06320510820277
            },
            {
                "latitude": 86.15632084245578,
                "longitude": -159.7937220468238
            },
            {
                "latitude": 86.21193246992513,
                "longitude": -161.5742875887748
            },
            {
                "latitude": 86.26372842961662,
                "longitude": -163.40372064551343
            },
            {
                "latitude": 86.3115697461689,
                "longitude": -165.28038758780667
            },
            {
                "latitude": 86.35532079922585,
                "longitude": -167.2021754810112
            },
            {
                "latitude": 86.39485107569162,
                "longitude": -169.1664736655102
            },
            {
                "latitude": 86.43003701658789,
                "longitude": -171.17016572650533
            },
            {
                "latitude": 86.46076391343948,
                "longitude": -173.20963369976567
            },
            {
                "latitude": 86.48692779993127,
                "longitude": -175.2807759861697
            },
            {
                "latitude": 86.50843727732494,
                "longitude": -177.37903989601702
            },
            {
                "latitude": 86.52521520778093,
                "longitude": -179.49946903344588
            },
            {
                "latitude": 86.53720020912384,
                "longitude": 178.36323509540753
            },
            {
                "latitude": 86.54434788830088,
                "longitude": 176.21463874502223
            },
            {
                "latitude": 86.54663175897623,
                "longitude": 174.06049120737225
            },
            {
                "latitude": 86.54404380109632,
                "longitude": 171.90663277948522
            },
            {
                "latitude": 86.53659463605216,
                "longitude": 169.75889903418803
            },
            {
                "latitude": 86.52431330906354,
                "longitude": 167.62302528379257
            },
            {
                "latitude": 86.5072466891112,
                "longitude": 165.50455511190418
            },
            {
                "latitude": 86.48545851458445,
                "longitude": 163.4087565439017
            },
            {
                "latitude": 86.45902812829264,
                "longitude": 161.34054886808718
            },
            {
                "latitude": 86.42804895748702,
                "longitude": 159.30444237142416
            },
            {
                "latitude": 86.39262680226054,
                "longitude": 157.30449239810716
            },
            {
                "latitude": 86.35287799895215,
                "longitude": 155.34426826273122
            },
            {
                "latitude": 86.30892752414486,
                "longitude": 153.42683673198434
            },
            {
                "latitude": 86.26090710015748,
                "longitude": 151.55475909221593
            },
            {
                "latitude": 86.2089533554242,
                "longitude": 149.7301002853665
            },
            {
                "latitude": 86.15320608382147,
                "longitude": 147.95444823966307
            },
            {
                "latitude": 86.09380663679481,
                "longitude": 146.22894134039572
            },
            {
                "latitude": 86.03089647191194,
                "longitude": 144.55430196018952
            },
            {
                "latitude": 85.96461587190478,
                "longitude": 142.93087406755808
            },
            {
                "latitude": 85.89510283981605,
                "longitude": 141.3586631228833
            },
            {
                "latitude": 85.82249216883896,
                "longitude": 139.83737671842147
            },
            {
                "latitude": 85.74691467990715,
                "longitude": 138.36646469336532
            },
            {
                "latitude": 85.66849661603983,
                "longitude": 136.94515773198668
            },
            {
                "latitude": 85.58735917974323,
                "longitude": 135.57250371442777
            },
            {
                "latitude": 85.50361819822308,
                "longitude": 134.2474013239716
            },
            {
                "latitude": 85.41738390056717,
                "longitude": 132.9686306151075
            },
            {
                "latitude": 85.32876079120203,
                "longitude": 131.73488041118307
            },
            {
                "latitude": 85.23784760460676,
                "longitude": 130.54477252976272
            },
            {
                "latitude": 85.14473732732138,
                "longitude": 129.39688293088804
            },
            {
                "latitude": 85.0495172745569,
                "longitude": 128.28975995231895
            },
            {
                "latitude": 84.95226921009944,
                "longitude": 127.22193984105502
            },
            {
                "latitude": 84.85306949960521,
                "longitude": 126.19195981652504
            },
            {
                "latitude": 84.75198928875223,
                "longitude": 125.19836891201103
            },
            {
                "latitude": 84.64909469899831,
                "longitude": 124.23973684086363
            },
            {
                "latitude": 84.60594308977156,
                "longitude": 123.85243753171584,
                "altitude": -4249.106993635505
            },
            {
                "latitude": 84.68370044636643,
                "longitude": 122.6033138145203
            },
            {
                "latitude": 84.75870070697368,
                "longitude": 121.32086376321894
            },
            {
                "latitude": 84.83085823772916,
                "longitude": 120.004914889129
            },
            {
                "latitude": 84.90008535689532,
                "longitude": 118.65541879924558
            },
            {
                "latitude": 84.9662927218235,
                "longitude": 117.27246530872024
            },
            {
                "latitude": 85.02938977751943,
                "longitude": 115.85629650195341
            },
            {
                "latitude": 85.08928526812481,
                "longitude": 114.4073204217799
            },
            {
                "latitude": 85.14588781118516,
                "longitude": 112.92612401666477
            },
            {
                "latitude": 85.19910653285386,
                "longitude": 111.41348493150699
            },
            {
                "latitude": 85.24885176018365,
                "longitude": 109.87038169236239
            },
            {
                "latitude": 85.2950357644439,
                "longitude": 108.29800181328788
            },
            {
                "latitude": 85.33757354703056,
                "longitude": 106.6977473488084
            },
            {
                "latitude": 85.37638365709977,
                "longitude": 105.07123743217102
            },
            {
                "latitude": 85.41138902767477,
                "longitude": 103.42030738081341
            },
            {
                "latitude": 85.44251781479221,
                "longitude": 101.74700401837444
            },
            {
                "latitude": 85.46970422240629,
                "longitude": 100.05357695748171
            },
            {
                "latitude": 85.49288929442574,
                "longitude": 98.34246570777023
            },
            {
                "latitude": 85.51202165455047,
                "longitude": 96.61628261512212
            },
            {
                "latitude": 85.52705817462444,
                "longitude": 94.87779179465642
            },
            {
                "latitude": 85.53796455310619,
                "longitude": 93.12988438315514
            },
            {
                "latitude": 85.5447157870132,
                "longitude": 91.37555059648213
            },
            {
                "latitude": 85.54729652326753,
                "longitude": 89.61784922348934
            },
            {
                "latitude": 85.54570127869333,
                "longitude": 87.85987530952771
            },
            {
                "latitude": 85.53993452181176,
                "longitude": 86.10472687088954
            },
            {
                "latitude": 85.53001061385599,
                "longitude": 84.3554715294937
            },
            {
                "latitude": 85.51595361085036,
                "longitude": 82.61511396109715
            },
            {
                "latitude": 85.49779693292051,
                "longitude": 80.88656500996225
            },
            {
                "latitude": 85.47558291097442,
                "longitude": 79.17261324141894
            },
            {
                "latitude": 85.44936222432234,
                "longitude": 77.47589958745718
            },
            {
                "latitude": 85.41919324551826,
                "longitude": 75.79889559812705
            },
            {
                "latitude": 85.38514131059438,
                "longitude": 74.14388565334362
            },
            {
                "latitude": 85.34727793389688,
                "longitude": 72.5129533263632
            },
            {
                "latitude": 85.30567998691116,
                "longitude": 70.9079719318208
            },
            {
                "latitude": 85.26042885988223,
                "longitude": 69.33059914649407
            },
            {
                "latitude": 85.21160962378238,
                "longitude": 67.78227546659963
            },
            {
                "latitude": 85.15931020840857,
                "longitude": 66.2642261658394
            },
            {
                "latitude": 85.10362061024848,
                "longitude": 64.77746634569465
            },
            {
                "latitude": 85.04463214139375,
                "longitude": 63.32280862358268
            },
            {
                "latitude": 84.98243672834455,
                "longitude": 61.90087298367032
            },
            {
                "latitude": 84.91712626715524,
                "longitude": 60.512098316322515
            },
            {
                "latitude": 84.84879203912159,
                "longitude": 59.1567551914903
            },
            {
                "latitude": 84.77752418917619,
                "longitude": 57.83495944459935
            },
            {
                "latitude": 84.70341126738201,
                "longitude": 56.54668619650646
            },
            {
                "latitude": 84.62653983242622,
                "longitude": 55.29178397797765
            },
            {
                "latitude": 84.54699411481428,
                "longitude": 54.069988680549265
            },
            {
                "latitude": 84.4648557365454,
                "longitude": 52.88093710680922
            },
            {
                "latitude": 84.38020348338488,
                "longitude": 51.72417994196928
            },
            {
                "latitude": 84.29311312541654,
                "longitude": 50.59919401358634
            },
            {
                "latitude": 84.20365728131978,
                "longitude": 49.50539374647968
            },
            {
                "latitude": 84.111905321745,
                "longitude": 48.44214175478848
            },
            {
                "latitude": 84.01792330721386,
                "longitude": 47.408758542596345
            },
            {
                "latitude": 83.99470687132454,
                "longitude": 47.16155718697617,
                "altitude": -3871.037368202361
            }
        ]
    ];
    var polygonNorthPoleAndIntersectionInput = transformInputData(polygonNorthPoleAndIntersectionRawInput);
    var polygonNorthPoleAndIntersectionRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": 84.61331410171086,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.6133679593539,
                        "longitude": -179.8526932337027
                    },
                    {
                        "latitude": 84.61006123972595,
                        "longitude": -178.31305262992836
                    },
                    {
                        "latitude": 84.60289084168583,
                        "longitude": -176.77624031347307
                    },
                    {
                        "latitude": 84.59186948465323,
                        "longitude": -175.2442536985645
                    },
                    {
                        "latitude": 84.57701621916274,
                        "longitude": -173.71905141375217
                    },
                    {
                        "latitude": 84.5583562246905,
                        "longitude": -172.20253818365896
                    },
                    {
                        "latitude": 84.5359205451326,
                        "longitude": -170.69655076668215
                    },
                    {
                        "latitude": 84.50974576792336,
                        "longitude": -169.20284519370554
                    },
                    {
                        "latitude": 84.47987365385325,
                        "longitude": -167.72308550746178
                    },
                    {
                        "latitude": 84.44635072544885,
                        "longitude": -166.25883415185496
                    },
                    {
                        "latitude": 84.40922782229,
                        "longitude": -164.81154410791626
                    },
                    {
                        "latitude": 84.3685596318658,
                        "longitude": -163.38255282068098
                    },
                    {
                        "latitude": 84.32440420451991,
                        "longitude": -161.9730779114472
                    },
                    {
                        "latitude": 84.27682246074001,
                        "longitude": -160.58421462456627
                    },
                    {
                        "latitude": 84.22587769853034,
                        "longitude": -159.21693491861953
                    },
                    {
                        "latitude": 84.17163510792611,
                        "longitude": -157.87208807955804
                    },
                    {
                        "latitude": 84.11416129889429,
                        "longitude": -156.55040270864149
                    },
                    {
                        "latitude": 84.05352384797094,
                        "longitude": -155.25248992085756
                    },
                    {
                        "latitude": 84.00400411920556,
                        "longitude": -154.25556972710612,
                        "altitude": -2278.5465963606644
                    },
                    {
                        "latitude": 84.16693572245066,
                        "longitude": -153.7316939036157
                    },
                    {
                        "latitude": 84.32850309377238,
                        "longitude": -153.18086022476933
                    },
                    {
                        "latitude": 84.488699960539,
                        "longitude": -152.6009458677754
                    },
                    {
                        "latitude": 84.6475153672041,
                        "longitude": -151.9896117505913
                    },
                    {
                        "latitude": 84.80493314504422,
                        "longitude": -151.3442762324827
                    },
                    {
                        "latitude": 84.96093129459132,
                        "longitude": -150.662085278844
                    },
                    {
                        "latitude": 85.11548126562684,
                        "longitude": -149.9398786232079
                    },
                    {
                        "latitude": 85.26854711679735,
                        "longitude": -149.17415141956013
                    },
                    {
                        "latitude": 85.42008453360533,
                        "longitude": -148.36101084849454
                    },
                    {
                        "latitude": 85.57003967967273,
                        "longitude": -147.49612713095547
                    },
                    {
                        "latitude": 85.59071321906342,
                        "longitude": -147.37179722024706,
                        "altitude": -2357.1528619932833
                    },
                    {
                        "latitude": 85.67190439190887,
                        "longitude": -148.74925692562545
                    },
                    {
                        "latitude": 85.75035228953824,
                        "longitude": -150.17546622639998
                    },
                    {
                        "latitude": 85.82593563009678,
                        "longitude": -151.65136085173222
                    },
                    {
                        "latitude": 85.89852814347778,
                        "longitude": -153.17769027393635
                    },
                    {
                        "latitude": 85.96799904915581,
                        "longitude": -154.75498111166002
                    },
                    {
                        "latitude": 86.03421367847537,
                        "longitude": -156.38349834651626
                    },
                    {
                        "latitude": 86.09703425484541,
                        "longitude": -158.06320510820277
                    },
                    {
                        "latitude": 86.15632084245578,
                        "longitude": -159.7937220468238
                    },
                    {
                        "latitude": 86.21193246992513,
                        "longitude": -161.5742875887748
                    },
                    {
                        "latitude": 86.26372842961662,
                        "longitude": -163.40372064551343
                    },
                    {
                        "latitude": 86.3115697461689,
                        "longitude": -165.28038758780667
                    },
                    {
                        "latitude": 86.35532079922585,
                        "longitude": -167.2021754810112
                    },
                    {
                        "latitude": 86.39485107569162,
                        "longitude": -169.1664736655102
                    },
                    {
                        "latitude": 86.43003701658789,
                        "longitude": -171.17016572650533
                    },
                    {
                        "latitude": 86.46076391343948,
                        "longitude": -173.20963369976567
                    },
                    {
                        "latitude": 86.48692779993127,
                        "longitude": -175.2807759861697
                    },
                    {
                        "latitude": 86.50843727732494,
                        "longitude": -177.37903989601702
                    },
                    {
                        "latitude": 86.52521520778093,
                        "longitude": -179.49946903344588
                    },
                    {
                        "latitude": 86.528021962048,
                        "longitude": -180
                    },
                    {
                        "latitude": 90,
                        "longitude": -180
                    },
                    {
                        "latitude": 90,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.528021962048,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.53720020912384,
                        "longitude": 178.36323509540753
                    },
                    {
                        "latitude": 86.54434788830088,
                        "longitude": 176.21463874502223
                    },
                    {
                        "latitude": 86.54663175897623,
                        "longitude": 174.06049120737225
                    },
                    {
                        "latitude": 86.54404380109632,
                        "longitude": 171.90663277948522
                    },
                    {
                        "latitude": 86.53659463605216,
                        "longitude": 169.75889903418803
                    },
                    {
                        "latitude": 86.52431330906354,
                        "longitude": 167.62302528379257
                    },
                    {
                        "latitude": 86.5072466891112,
                        "longitude": 165.50455511190418
                    },
                    {
                        "latitude": 86.48545851458445,
                        "longitude": 163.4087565439017
                    },
                    {
                        "latitude": 86.45902812829264,
                        "longitude": 161.34054886808718
                    },
                    {
                        "latitude": 86.42804895748702,
                        "longitude": 159.30444237142416
                    },
                    {
                        "latitude": 86.39262680226054,
                        "longitude": 157.30449239810716
                    },
                    {
                        "latitude": 86.35287799895215,
                        "longitude": 155.34426826273122
                    },
                    {
                        "latitude": 86.30892752414486,
                        "longitude": 153.42683673198434
                    },
                    {
                        "latitude": 86.26090710015748,
                        "longitude": 151.55475909221593
                    },
                    {
                        "latitude": 86.2089533554242,
                        "longitude": 149.7301002853665
                    },
                    {
                        "latitude": 86.15320608382147,
                        "longitude": 147.95444823966307
                    },
                    {
                        "latitude": 86.09380663679481,
                        "longitude": 146.22894134039572
                    },
                    {
                        "latitude": 86.03089647191194,
                        "longitude": 144.55430196018952
                    },
                    {
                        "latitude": 85.96461587190478,
                        "longitude": 142.93087406755808
                    },
                    {
                        "latitude": 85.89510283981605,
                        "longitude": 141.3586631228833
                    },
                    {
                        "latitude": 85.82249216883896,
                        "longitude": 139.83737671842147
                    },
                    {
                        "latitude": 85.74691467990715,
                        "longitude": 138.36646469336532
                    },
                    {
                        "latitude": 85.66849661603983,
                        "longitude": 136.94515773198668
                    },
                    {
                        "latitude": 85.58735917974323,
                        "longitude": 135.57250371442777
                    },
                    {
                        "latitude": 85.50361819822308,
                        "longitude": 134.2474013239716
                    },
                    {
                        "latitude": 85.41738390056717,
                        "longitude": 132.9686306151075
                    },
                    {
                        "latitude": 85.32876079120203,
                        "longitude": 131.73488041118307
                    },
                    {
                        "latitude": 85.23784760460676,
                        "longitude": 130.54477252976272
                    },
                    {
                        "latitude": 85.14473732732138,
                        "longitude": 129.39688293088804
                    },
                    {
                        "latitude": 85.0495172745569,
                        "longitude": 128.28975995231895
                    },
                    {
                        "latitude": 84.95226921009944,
                        "longitude": 127.22193984105502
                    },
                    {
                        "latitude": 84.85306949960521,
                        "longitude": 126.19195981652504
                    },
                    {
                        "latitude": 84.75198928875223,
                        "longitude": 125.19836891201103
                    },
                    {
                        "latitude": 84.64909469899831,
                        "longitude": 124.23973684086363
                    },
                    {
                        "latitude": 84.60594308977156,
                        "longitude": 123.85243753171584,
                        "altitude": -4249.106993635505
                    },
                    {
                        "latitude": 84.68370044636643,
                        "longitude": 122.6033138145203
                    },
                    {
                        "latitude": 84.75870070697368,
                        "longitude": 121.32086376321894
                    },
                    {
                        "latitude": 84.83085823772916,
                        "longitude": 120.004914889129
                    },
                    {
                        "latitude": 84.90008535689532,
                        "longitude": 118.65541879924558
                    },
                    {
                        "latitude": 84.9662927218235,
                        "longitude": 117.27246530872024
                    },
                    {
                        "latitude": 85.02938977751943,
                        "longitude": 115.85629650195341
                    },
                    {
                        "latitude": 85.08928526812481,
                        "longitude": 114.4073204217799
                    },
                    {
                        "latitude": 85.14588781118516,
                        "longitude": 112.92612401666477
                    },
                    {
                        "latitude": 85.19910653285386,
                        "longitude": 111.41348493150699
                    },
                    {
                        "latitude": 85.24885176018365,
                        "longitude": 109.87038169236239
                    },
                    {
                        "latitude": 85.2950357644439,
                        "longitude": 108.29800181328788
                    },
                    {
                        "latitude": 85.33757354703056,
                        "longitude": 106.6977473488084
                    },
                    {
                        "latitude": 85.37638365709977,
                        "longitude": 105.07123743217102
                    },
                    {
                        "latitude": 85.41138902767477,
                        "longitude": 103.42030738081341
                    },
                    {
                        "latitude": 85.44251781479221,
                        "longitude": 101.74700401837444
                    },
                    {
                        "latitude": 85.46970422240629,
                        "longitude": 100.05357695748171
                    },
                    {
                        "latitude": 85.49288929442574,
                        "longitude": 98.34246570777023
                    },
                    {
                        "latitude": 85.51202165455047,
                        "longitude": 96.61628261512212
                    },
                    {
                        "latitude": 85.52705817462444,
                        "longitude": 94.87779179465642
                    },
                    {
                        "latitude": 85.53796455310619,
                        "longitude": 93.12988438315514
                    },
                    {
                        "latitude": 85.5447157870132,
                        "longitude": 91.37555059648213
                    },
                    {
                        "latitude": 85.54729652326753,
                        "longitude": 89.61784922348934
                    },
                    {
                        "latitude": 85.54570127869333,
                        "longitude": 87.85987530952771
                    },
                    {
                        "latitude": 85.53993452181176,
                        "longitude": 86.10472687088954
                    },
                    {
                        "latitude": 85.53001061385599,
                        "longitude": 84.3554715294937
                    },
                    {
                        "latitude": 85.51595361085036,
                        "longitude": 82.61511396109715
                    },
                    {
                        "latitude": 85.49779693292051,
                        "longitude": 80.88656500996225
                    },
                    {
                        "latitude": 85.47558291097442,
                        "longitude": 79.17261324141894
                    },
                    {
                        "latitude": 85.44936222432234,
                        "longitude": 77.47589958745718
                    },
                    {
                        "latitude": 85.41919324551826,
                        "longitude": 75.79889559812705
                    },
                    {
                        "latitude": 85.38514131059438,
                        "longitude": 74.14388565334362
                    },
                    {
                        "latitude": 85.34727793389688,
                        "longitude": 72.5129533263632
                    },
                    {
                        "latitude": 85.30567998691116,
                        "longitude": 70.9079719318208
                    },
                    {
                        "latitude": 85.26042885988223,
                        "longitude": 69.33059914649407
                    },
                    {
                        "latitude": 85.21160962378238,
                        "longitude": 67.78227546659963
                    },
                    {
                        "latitude": 85.15931020840857,
                        "longitude": 66.2642261658394
                    },
                    {
                        "latitude": 85.10362061024848,
                        "longitude": 64.77746634569465
                    },
                    {
                        "latitude": 85.04463214139375,
                        "longitude": 63.32280862358268
                    },
                    {
                        "latitude": 84.98243672834455,
                        "longitude": 61.90087298367032
                    },
                    {
                        "latitude": 84.91712626715524,
                        "longitude": 60.512098316322515
                    },
                    {
                        "latitude": 84.84879203912159,
                        "longitude": 59.1567551914903
                    },
                    {
                        "latitude": 84.77752418917619,
                        "longitude": 57.83495944459935
                    },
                    {
                        "latitude": 84.70341126738201,
                        "longitude": 56.54668619650646
                    },
                    {
                        "latitude": 84.62653983242622,
                        "longitude": 55.29178397797765
                    },
                    {
                        "latitude": 84.54699411481428,
                        "longitude": 54.069988680549265
                    },
                    {
                        "latitude": 84.4648557365454,
                        "longitude": 52.88093710680922
                    },
                    {
                        "latitude": 84.38020348338488,
                        "longitude": 51.72417994196928
                    },
                    {
                        "latitude": 84.29311312541654,
                        "longitude": 50.59919401358634
                    },
                    {
                        "latitude": 84.20365728131978,
                        "longitude": 49.50539374647968
                    },
                    {
                        "latitude": 84.111905321745,
                        "longitude": 48.44214175478848
                    },
                    {
                        "latitude": 84.01792330721386,
                        "longitude": 47.408758542596345
                    },
                    {
                        "latitude": 83.99470687132454,
                        "longitude": 47.16155718697617,
                        "altitude": -3871.037368202361
                    },
                    {
                        "latitude": 83.99470687132454,
                        "longitude": 47.16155718697617,
                        "altitude": -3871.037368202361
                    },
                    {
                        "latitude": 84.09707986125422,
                        "longitude": 46.225373649181954
                    },
                    {
                        "latitude": 84.19750121032408,
                        "longitude": 45.25980548770665
                    },
                    {
                        "latitude": 84.29591405759817,
                        "longitude": 44.26390634779206
                    },
                    {
                        "latitude": 84.39225776311172,
                        "longitude": 43.23673572299413
                    },
                    {
                        "latitude": 84.48646783760707,
                        "longitude": 42.177366229047614
                    },
                    {
                        "latitude": 84.57847589198941,
                        "longitude": 41.084891983382825
                    },
                    {
                        "latitude": 84.66820961111654,
                        "longitude": 39.958438169855185
                    },
                    {
                        "latitude": 84.75559275705494,
                        "longitude": 38.79717185668599
                    },
                    {
                        "latitude": 84.84054520742924,
                        "longitude": 37.60031411822853
                    },
                    {
                        "latitude": 84.9229830349416,
                        "longitude": 36.36715348689062
                    },
                    {
                        "latitude": 85.00281863450321,
                        "longitude": 35.09706072931645
                    },
                    {
                        "latitude": 85.07996090466364,
                        "longitude": 33.78950489983852
                    },
                    {
                        "latitude": 85.15431549009564,
                        "longitude": 32.44407057358519
                    },
                    {
                        "latitude": 85.22578509174106,
                        "longitude": 31.060476101212476
                    },
                    {
                        "latitude": 85.29426985078375,
                        "longitude": 29.638592657352405
                    },
                    {
                        "latitude": 85.35966781183967,
                        "longitude": 28.178463776664373
                    },
                    {
                        "latitude": 85.42187546957271,
                        "longitude": 26.68032498696651
                    },
                    {
                        "latitude": 85.48078840132263,
                        "longitude": 25.14462306161475
                    },
                    {
                        "latitude": 85.53630198623193,
                        "longitude": 23.57203432768036
                    },
                    {
                        "latitude": 85.58831220877614,
                        "longitude": 21.96348138844885
                    },
                    {
                        "latitude": 85.63671654156721,
                        "longitude": 20.320147555383716
                    },
                    {
                        "latitude": 85.68141489887526,
                        "longitude": 18.64348824385756
                    },
                    {
                        "latitude": 85.72231064861816,
                        "longitude": 16.935238576822783
                    },
                    {
                        "latitude": 85.75931166676277,
                        "longitude": 15.197416468851667
                    },
                    {
                        "latitude": 85.79233141437227,
                        "longitude": 13.432320535848152
                    },
                    {
                        "latitude": 85.82129001418107,
                        "longitude": 11.64252229694323
                    },
                    {
                        "latitude": 85.8461153008332,
                        "longitude": 9.830852304821692
                    },
                    {
                        "latitude": 85.86674381706952,
                        "longitude": 8.000380054828698
                    },
                    {
                        "latitude": 85.88312172743295,
                        "longitude": 6.154387772725707
                    },
                    {
                        "latitude": 85.89520562165731,
                        "longitude": 4.296338452291527
                    },
                    {
                        "latitude": 85.90296318193938,
                        "longitude": 2.4298387895887585
                    },
                    {
                        "latitude": 85.90637369174159,
                        "longitude": 0.5585979206617699
                    },
                    {
                        "latitude": 85.9054283685359,
                        "longitude": -1.3136169067773347
                    },
                    {
                        "latitude": 85.90013050872803,
                        "longitude": -3.1830264282006837
                    },
                    {
                        "latitude": 85.89049543957111,
                        "longitude": -5.045885824855094
                    },
                    {
                        "latitude": 85.87655027978037,
                        "longitude": -6.89853013443466
                    },
                    {
                        "latitude": 85.85833351734354,
                        "longitude": -8.73741724967573
                    },
                    {
                        "latitude": 85.8358944192863,
                        "longitude": -10.559167279206354
                    },
                    {
                        "latitude": 85.80929229348368,
                        "longitude": -12.360597242577338
                    },
                    {
                        "latitude": 85.77859562675704,
                        "longitude": -14.13875031517966
                    },
                    {
                        "latitude": 85.74388112624854,
                        "longitude": -15.890919108861182
                    },
                    {
                        "latitude": 85.70523269239142,
                        "longitude": -17.614662749982
                    },
                    {
                        "latitude": 85.66274035172472,
                        "longitude": -19.307817779399958
                    },
                    {
                        "latitude": 85.61649917649461,
                        "longitude": -20.968503132686912
                    },
                    {
                        "latitude": 85.56660821566383,
                        "longitude": -22.59511965233562
                    },
                    {
                        "latitude": 85.51316945886711,
                        "longitude": -24.186344730215712
                    },
                    {
                        "latitude": 85.45628685128595,
                        "longitude": -25.74112277610196
                    },
                    {
                        "latitude": 85.39606537362909,
                        "longitude": -27.25865225874609
                    },
                    {
                        "latitude": 85.3326101976236,
                        "longitude": -28.738370074761015
                    },
                    {
                        "latitude": 85.26602592384351,
                        "longitude": -30.179933974591865
                    },
                    {
                        "latitude": 85.1964159054512,
                        "longitude": -31.58320372208654
                    },
                    {
                        "latitude": 85.12388165860912,
                        "longitude": -32.94822159276993
                    },
                    {
                        "latitude": 85.04852235797206,
                        "longitude": -34.2751927334114
                    },
                    {
                        "latitude": 84.97043441380478,
                        "longitude": -35.56446581838329
                    },
                    {
                        "latitude": 84.88971112587059,
                        "longitude": -36.816514351909255
                    },
                    {
                        "latitude": 84.80644240825924,
                        "longitude": -38.03191888355609
                    },
                    {
                        "latitude": 84.72071457872218,
                        "longitude": -39.21135032994626
                    },
                    {
                        "latitude": 84.63261020578948,
                        "longitude": -40.355554530281815
                    },
                    {
                        "latitude": 84.54220800691256,
                        "longitude": -41.46533810758735
                    },
                    {
                        "latitude": 84.44958279103756,
                        "longitude": -42.54155566162912
                    },
                    {
                        "latitude": 84.3548054393272,
                        "longitude": -43.5850982827638
                    },
                    {
                        "latitude": 84.28164736724293,
                        "longitude": -44.35411158365523,
                        "altitude": -1288.5104514023271
                    },
                    {
                        "latitude": 84.38238930919223,
                        "longitude": -45.39439656984446
                    },
                    {
                        "latitude": 84.48091698356409,
                        "longitude": -46.46873463199597
                    },
                    {
                        "latitude": 84.57715726556243,
                        "longitude": -47.57816865827513
                    },
                    {
                        "latitude": 84.67103250884415,
                        "longitude": -48.7237141741517
                    },
                    {
                        "latitude": 84.76246052098661,
                        "longitude": -49.90634731708564
                    },
                    {
                        "latitude": 84.85135457770845,
                        "longitude": -51.126991198211954
                    },
                    {
                        "latitude": 84.9376234833775,
                        "longitude": -52.38650059148825
                    },
                    {
                        "latitude": 85.02117168591877,
                        "longitude": -53.68564492723087
                    },
                    {
                        "latitude": 85.1018994546893,
                        "longitude": -55.02508961525814
                    },
                    {
                        "latitude": 85.17970313013974,
                        "longitude": -56.405375784254566
                    },
                    {
                        "latitude": 85.25447545406294,
                        "longitude": -57.82689859926791
                    },
                    {
                        "latitude": 85.32610598886068,
                        "longitude": -59.28988440851014
                    },
                    {
                        "latitude": 85.3944816334403,
                        "longitude": -60.79436707285558
                    },
                    {
                        "latitude": 85.45948724201554,
                        "longitude": -62.340163944231726
                    },
                    {
                        "latitude": 85.5210063501358,
                        "longitude": -63.92685207839537
                    },
                    {
                        "latitude": 85.57892200966354,
                        "longitude": -65.5537453873564
                    },
                    {
                        "latitude": 85.63311773112723,
                        "longitude": -67.2198735488913
                    },
                    {
                        "latitude": 85.68347852792206,
                        "longitude": -68.92396358520271
                    },
                    {
                        "latitude": 85.72989205229662,
                        "longitude": -70.66442508836258
                    },
                    {
                        "latitude": 85.77224980809119,
                        "longitude": -72.43934009455072
                    },
                    {
                        "latitude": 85.81044842001906,
                        "longitude": -74.24645858053904
                    },
                    {
                        "latitude": 85.84439093419546,
                        "longitude": -76.08320046458694
                    },
                    {
                        "latitude": 85.87398811997548,
                        "longitude": -77.94666483374077
                    },
                    {
                        "latitude": 85.8991597393754,
                        "longitude": -79.83364688960731
                    },
                    {
                        "latitude": 85.91983574779708,
                        "longitude": -81.7406628107983
                    },
                    {
                        "latitude": 85.93595738883315,
                        "longitude": -83.66398238563256
                    },
                    {
                        "latitude": 85.94747814686856,
                        "longitude": -85.59966889377478
                    },
                    {
                        "latitude": 85.95436452415615,
                        "longitude": -87.54362533669044
                    },
                    {
                        "latitude": 85.95659661401734,
                        "longitude": -89.49164576410668
                    },
                    {
                        "latitude": 85.95416844859261,
                        "longitude": -91.43947014744239
                    },
                    {
                        "latitude": 85.9470881077832,
                        "longitude": -93.38284103845098
                    },
                    {
                        "latitude": 85.93537758514236,
                        "longitude": -95.31756014229455
                    },
                    {
                        "latitude": 85.91907241589449,
                        "longitude": -97.23954293952337
                    },
                    {
                        "latitude": 85.89822108131375,
                        "longitude": -99.14486961045547
                    },
                    {
                        "latitude": 85.8728842117952,
                        "longitude": -101.02983073670123
                    },
                    {
                        "latitude": 85.84313361755449,
                        "longitude": -102.89096655711246
                    },
                    {
                        "latitude": 85.80905118068671,
                        "longitude": -104.7250989117657
                    },
                    {
                        "latitude": 85.77072764506332,
                        "longitude": -106.52935538723924
                    },
                    {
                        "latitude": 85.72826134130054,
                        "longitude": -108.30118554961706
                    },
                    {
                        "latitude": 85.68175688290663,
                        "longitude": -110.03836949240359
                    },
                    {
                        "latitude": 85.63132386703177,
                        "longitude": -111.73901921503935
                    },
                    {
                        "latitude": 85.57707560933684,
                        "longitude": -113.40157357143924
                    },
                    {
                        "latitude": 85.51912793780416,
                        "longitude": -115.02478768177481
                    },
                    {
                        "latitude": 85.45759806518733,
                        "longitude": -116.60771778600058
                    },
                    {
                        "latitude": 85.39260355463003,
                        "longitude": -118.14970254094128
                    },
                    {
                        "latitude": 85.32426138804504,
                        "longitude": -119.65034173414712
                    },
                    {
                        "latitude": 85.25268714235087,
                        "longitude": -121.10947331901279
                    },
                    {
                        "latitude": 85.17799427477348,
                        "longitude": -122.52714957899357
                    },
                    {
                        "latitude": 85.1002935151934,
                        "longitude": -123.90361311549962
                    },
                    {
                        "latitude": 85.0196923609744,
                        "longitude": -125.23927323402143
                    },
                    {
                        "latitude": 84.93629466782818,
                        "longitude": -126.53468318411232
                    },
                    {
                        "latitude": 84.85020032898045,
                        "longitude": -127.79051859687084
                    },
                    {
                        "latitude": 84.76150503414013,
                        "longitude": -129.00755736244227
                    },
                    {
                        "latitude": 84.67030009943618,
                        "longitude": -130.18666110204495
                    },
                    {
                        "latitude": 84.57667235950544,
                        "longitude": -131.32875831500178
                    },
                    {
                        "latitude": 84.48070411318727,
                        "longitude": -132.4348292210942
                    },
                    {
                        "latitude": 84.38247311475406,
                        "longitude": -133.50589227139272
                    },
                    {
                        "latitude": 84.28205260319896,
                        "longitude": -134.54299226525532
                    },
                    {
                        "latitude": 84.1795113627762,
                        "longitude": -135.5471899858856
                    },
                    {
                        "latitude": 84.0749138086898,
                        "longitude": -136.51955325009948
                    },
                    {
                        "latitude": 83.9683200925357,
                        "longitude": -137.4611492581954
                    },
                    {
                        "latitude": 83.85978622278495,
                        "longitude": -138.3730381256175
                    },
                    {
                        "latitude": 83.74936419624052,
                        "longitude": -139.25626747815627
                    },
                    {
                        "latitude": 83.63710213700035,
                        "longitude": -140.11186799564342
                    },
                    {
                        "latitude": 83.52304443999856,
                        "longitude": -140.94084979454436
                    },
                    {
                        "latitude": 83.40723191668947,
                        "longitude": -141.7441995467768
                    },
                    {
                        "latitude": 83.2897019408658,
                        "longitude": -142.52287823989295
                    },
                    {
                        "latitude": 83.17048859298146,
                        "longitude": -143.27781949199004
                    },
                    {
                        "latitude": 83.04962280167763,
                        "longitude": -144.00992834301212
                    },
                    {
                        "latitude": 82.92713248148935,
                        "longitude": -144.72008045222148
                    },
                    {
                        "latitude": 82.80304266594995,
                        "longitude": -145.409121639375
                    },
                    {
                        "latitude": 82.67737563551147,
                        "longitude": -146.07786771442213
                    },
                    {
                        "latitude": 82.5501510398679,
                        "longitude": -146.7271045472805
                    },
                    {
                        "latitude": 82.42138601440473,
                        "longitude": -147.35758833540805
                    },
                    {
                        "latitude": 82.29109529061537,
                        "longitude": -147.97004603247237
                    },
                    {
                        "latitude": 82.15929130041614,
                        "longitude": -148.56517590642898
                    },
                    {
                        "latitude": 82.02598427436403,
                        "longitude": -149.14364819979016
                    },
                    {
                        "latitude": 81.89118233384181,
                        "longitude": -149.70610586882114
                    },
                    {
                        "latitude": 81.75489157731946,
                        "longitude": -150.25316538188878
                    },
                    {
                        "latitude": 81.61711616083409,
                        "longitude": -150.78541756024075
                    },
                    {
                        "latitude": 81.50986946056605,
                        "longitude": -151.18606845733086,
                        "altitude": -3419.740220163263
                    },
                    {
                        "latitude": 81.59342134716925,
                        "longitude": -152.12769930204087
                    },
                    {
                        "latitude": 81.67441208879697,
                        "longitude": -153.08446534854977
                    },
                    {
                        "latitude": 81.75280977362853,
                        "longitude": -154.0563225168665
                    },
                    {
                        "latitude": 81.82858172930636,
                        "longitude": -155.04319478533918
                    },
                    {
                        "latitude": 81.90169463751046,
                        "longitude": -156.044972302423
                    },
                    {
                        "latitude": 81.97211465728813,
                        "longitude": -157.06150956384164
                    },
                    {
                        "latitude": 82.03980755702632,
                        "longitude": -158.0926236804854
                    },
                    {
                        "latitude": 82.10473885483144,
                        "longitude": -159.13809276407747
                    },
                    {
                        "latitude": 82.16687396694552,
                        "longitude": -160.19765445902812
                    },
                    {
                        "latitude": 82.22617836368414,
                        "longitude": -161.27100464989712
                    },
                    {
                        "latitude": 82.28261773222582,
                        "longitude": -162.3577963744217
                    },
                    {
                        "latitude": 82.33615814542803,
                        "longitude": -163.45763897205362
                    },
                    {
                        "latitude": 82.38676623568097,
                        "longitude": -164.57009749731714
                    },
                    {
                        "latitude": 82.43440937265177,
                        "longitude": -165.69469242597992
                    },
                    {
                        "latitude": 82.47905584361604,
                        "longitude": -166.8308996799733
                    },
                    {
                        "latitude": 82.52067503492889,
                        "longitude": -167.97815099417468
                    },
                    {
                        "latitude": 82.55923761305307,
                        "longitude": -169.13583464456244
                    },
                    {
                        "latitude": 82.59471570345171,
                        "longitude": -170.30329655288975
                    },
                    {
                        "latitude": 82.62708306555739,
                        "longitude": -171.4798417779431
                    },
                    {
                        "latitude": 82.65631526197069,
                        "longitude": -172.6647363977302
                    },
                    {
                        "latitude": 82.68238982000435,
                        "longitude": -173.8572097806857
                    },
                    {
                        "latitude": 82.70528638369515,
                        "longitude": -175.05645723732997
                    },
                    {
                        "latitude": 82.72498685444091,
                        "longitude": -176.26164303692474
                    },
                    {
                        "latitude": 82.74147551849963,
                        "longitude": -177.471903766729
                    },
                    {
                        "latitude": 82.75473915970097,
                        "longitude": -178.68635200466426
                    },
                    {
                        "latitude": 82.76476715587692,
                        "longitude": -179.90408026975888
                    },
                    {
                        "latitude": 82.76530052693327,
                        "longitude": -180
                    }
                ],
                [
                    {
                        "latitude": 82.76530052693327,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.77155155770092,
                        "longitude": 178.875834791136
                    },
                    {
                        "latitude": 82.77508714885062,
                        "longitude": 177.65432802698845
                    },
                    {
                        "latitude": 82.77537148665269,
                        "longitude": 176.4323412674047
                    },
                    {
                        "latitude": 82.77240492263557,
                        "longitude": 175.21081872255354
                    },
                    {
                        "latitude": 82.76619060270318,
                        "longitude": 173.990702354046
                    },
                    {
                        "latitude": 82.75673444692596,
                        "longitude": 172.77292727327782
                    },
                    {
                        "latitude": 82.74404510924303,
                        "longitude": 171.5584172231209
                    },
                    {
                        "latitude": 82.72813391764565,
                        "longitude": 170.34808019696217
                    },
                    {
                        "latitude": 82.70901479568572,
                        "longitude": 169.14280424601196
                    },
                    {
                        "latitude": 82.6867041663952,
                        "longitude": 167.94345352164206
                    },
                    {
                        "latitude": 82.66122083992764,
                        "longitude": 166.7508645944162
                    },
                    {
                        "latitude": 82.63258588641531,
                        "longitude": 165.56584308561662
                    },
                    {
                        "latitude": 82.60082249569487,
                        "longitude": 164.38916064064364
                    },
                    {
                        "latitude": 82.56595582566645,
                        "longitude": 163.22155226687963
                    },
                    {
                        "latitude": 82.52801284112853,
                        "longitude": 162.0637140516671
                    },
                    {
                        "latitude": 82.4870221449716,
                        "longitude": 160.91630126915769
                    },
                    {
                        "latitude": 82.443013803615,
                        "longitude": 159.77992687812525
                    },
                    {
                        "latitude": 82.3960191685382,
                        "longitude": 158.65516040656675
                    },
                    {
                        "latitude": 82.3460706956956,
                        "longitude": 157.54252721317826
                    },
                    {
                        "latitude": 82.293201764512,
                        "longitude": 156.4425081106921
                    },
                    {
                        "latitude": 82.23744649804249,
                        "longitude": 155.3555393316768
                    },
                    {
                        "latitude": 82.17883958574849,
                        "longitude": 154.28201281377844
                    },
                    {
                        "latitude": 82.11741611019453,
                        "longitude": 153.2222767785348
                    },
                    {
                        "latitude": 82.05321137881769,
                        "longitude": 152.17663657581755
                    },
                    {
                        "latitude": 81.98626076175681,
                        "longitude": 151.14535576461967
                    },
                    {
                        "latitude": 81.9165995365735,
                        "longitude": 150.12865740025097
                    },
                    {
                        "latitude": 81.8442627405336,
                        "longitude": 149.12672549797932
                    },
                    {
                        "latitude": 81.76928503096637,
                        "longitude": 148.13970664367397
                    },
                    {
                        "latitude": 81.69170055407459,
                        "longitude": 147.16771172299812
                    },
                    {
                        "latitude": 81.61154282243078,
                        "longitude": 146.21081774207548
                    },
                    {
                        "latitude": 81.60588960207882,
                        "longitude": 146.1450217990359,
                        "altitude": -2320.314905497531
                    },
                    {
                        "latitude": 81.75194781975623,
                        "longitude": 145.42393485667628
                    },
                    {
                        "latitude": 81.89580475042042,
                        "longitude": 144.68172636127565
                    },
                    {
                        "latitude": 82.03744078712906,
                        "longitude": 143.9175920275629
                    },
                    {
                        "latitude": 82.17683273560883,
                        "longitude": 143.13070345520313
                    },
                    {
                        "latitude": 82.31395369132575,
                        "longitude": 142.32020914938892
                    },
                    {
                        "latitude": 82.44877291332972,
                        "longitude": 141.48523591820586
                    },
                    {
                        "latitude": 82.58125569606038,
                        "longitude": 140.62489070585525
                    },
                    {
                        "latitude": 82.71136324057765,
                        "longitude": 139.73826292678675
                    },
                    {
                        "latitude": 82.83905252700296,
                        "longitude": 138.8244273717135
                    },
                    {
                        "latitude": 82.87456998128354,
                        "longitude": 138.56203167997123,
                        "altitude": -2868.342405800213
                    },
                    {
                        "latitude": 82.97385729890665,
                        "longitude": 139.51080686661868
                    },
                    {
                        "latitude": 83.07082949567187,
                        "longitude": 140.4827384524722
                    },
                    {
                        "latitude": 83.16543833892662,
                        "longitude": 141.4782349497348
                    },
                    {
                        "latitude": 83.2576331960228,
                        "longitude": 142.49767421844166
                    },
                    {
                        "latitude": 83.34736109753784,
                        "longitude": 143.54139818455192
                    },
                    {
                        "latitude": 83.4345668203425,
                        "longitude": 144.60970719022077
                    },
                    {
                        "latitude": 83.51919299257524,
                        "longitude": 145.70285399789228
                    },
                    {
                        "latitude": 83.6011802225603,
                        "longitude": 146.8210374810078
                    },
                    {
                        "latitude": 83.68046725362865,
                        "longitude": 147.96439604677693
                    },
                    {
                        "latitude": 83.75699114665848,
                        "longitude": 149.1330008505025
                    },
                    {
                        "latitude": 83.83068749194287,
                        "longitude": 150.32684887620363
                    },
                    {
                        "latitude": 83.90149065169061,
                        "longitude": 151.54585597443258
                    },
                    {
                        "latitude": 83.96933403408953,
                        "longitude": 152.78984996481327
                    },
                    {
                        "latitude": 84.03415039937813,
                        "longitude": 154.0585639273816
                    },
                    {
                        "latitude": 84.09587219779678,
                        "longitude": 155.3516298225885
                    },
                    {
                        "latitude": 84.15443193861879,
                        "longitude": 156.66857259401488
                    },
                    {
                        "latitude": 84.20976258870105,
                        "longitude": 158.0088049195118
                    },
                    {
                        "latitude": 84.26179799815309,
                        "longitude": 159.37162278461042
                    },
                    {
                        "latitude": 84.31047334982686,
                        "longitude": 160.75620205561148
                    },
                    {
                        "latitude": 84.35572562839508,
                        "longitude": 162.1615962277562
                    },
                    {
                        "latitude": 84.39749410384977,
                        "longitude": 163.58673551541796
                    },
                    {
                        "latitude": 84.43572082334508,
                        "longitude": 165.03042743563753
                    },
                    {
                        "latitude": 84.47035110448152,
                        "longitude": 166.49135901316026
                    },
                    {
                        "latitude": 84.50133402241548,
                        "longitude": 167.96810070438676
                    },
                    {
                        "latitude": 84.52862288262916,
                        "longitude": 169.45911209973616
                    },
                    {
                        "latitude": 84.55217567085545,
                        "longitude": 170.96274941974573
                    },
                    {
                        "latitude": 84.57195547155183,
                        "longitude": 172.4772747711908
                    },
                    {
                        "latitude": 84.58793084648724,
                        "longitude": 174.0008670774712
                    },
                    {
                        "latitude": 84.6000761654661,
                        "longitude": 175.531634544724
                    },
                    {
                        "latitude": 84.60837188195617,
                        "longitude": 177.0676284740999
                    },
                    {
                        "latitude": 84.61280474741231,
                        "longitude": 178.60685818399654
                    },
                    {
                        "latitude": 84.61331410171086,
                        "longitude": 180
                    }
                ]
            ],
            "pole": 1,
            "poleIndex": 0,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 245,
                            "linkTo": 170
                        },
                        "49": {
                            "visited": false,
                            "forPole": true,
                            "index": 294,
                            "linkTo": -1
                        },
                        "52": {
                            "visited": false,
                            "forPole": true,
                            "index": 297,
                            "linkTo": -1
                        },
                        "310": {
                            "visited": false,
                            "forPole": false,
                            "index": 170,
                            "linkTo": 245
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 171,
                            "linkTo": 244
                        },
                        "73": {
                            "visited": false,
                            "forPole": false,
                            "index": 244,
                            "linkTo": 171
                        }
                    }
                }
            ]
        }
    ];
    var polygonNorthPoleAndIntersectionOutput = transformOutputData(polygonNorthPoleAndIntersectionRawOutput);

    var polygonHoleRawInput = [
        [
            {
                "latitude": 40,
                "longitude": -168
            },
            {
                "latitude": 40.55908853591122,
                "longitude": -168.9675327833062
            },
            {
                "latitude": 41.102308234737926,
                "longitude": -169.9373417663094
            },
            {
                "latitude": 41.62990878082619,
                "longitude": -170.90943627921186
            },
            {
                "latitude": 42.14214041065494,
                "longitude": -171.88382330981537
            },
            {
                "latitude": 42.639252976586775,
                "longitude": -172.86050744034276
            },
            {
                "latitude": 43.12149510520151,
                "longitude": -173.83949078665015
            },
            {
                "latitude": 43.58911344413328,
                "longitude": -174.8207729401386
            },
            {
                "latitude": 44.04235199136732,
                "longitude": -175.8043509126674
            },
            {
                "latitude": 44.48145150105371,
                "longitude": -176.79021908476193
            },
            {
                "latitude": 44.90664896005025,
                "longitude": -177.77836915740198
            },
            {
                "latitude": 45,
                "longitude": -178
            },
            {
                "latitude": 44.58305506854093,
                "longitude": -178.97675432548363
            },
            {
                "latitude": 44.15269909389255,
                "longitude": -179.9510526424957
            },
            {
                "latitude": 43.70871107305507,
                "longitude": 179.07710499077334
            },
            {
                "latitude": 43.25086599523841,
                "longitude": 178.1077155486529
            },
            {
                "latitude": 42.77893526195608,
                "longitude": 177.14077306944245
            },
            {
                "latitude": 42.292687164927244,
                "longitude": 176.1762686894512
            },
            {
                "latitude": 41.791887426693854,
                "longitude": 175.21419067942094
            },
            {
                "latitude": 41.276299809045426,
                "longitude": 174.25452448313519
            },
            {
                "latitude": 40.745686794500514,
                "longitude": 173.29725275803284
            },
            {
                "latitude": 40.19981034621057,
                "longitude": 172.34235541765696
            },
            {
                "latitude": 40,
                "longitude": 172
            },
            {
                "latitude": 40.092277049882505,
                "longitude": 173.1271967763212
            },
            {
                "latitude": 40.17342495465093,
                "longitude": 174.25465874289063
            },
            {
                "latitude": 40.243480126618145,
                "longitude": 175.3823333424249
            },
            {
                "latitude": 40.302474736653934,
                "longitude": 176.51016752793655
            },
            {
                "latitude": 40.35043667729767,
                "longitude": 177.63810785184126
            },
            {
                "latitude": 40.38738953266624,
                "longitude": 178.76610055643596
            },
            {
                "latitude": 40.41335255476794,
                "longitude": 179.89409166551997
            },
            {
                "latitude": 40.42834064589871,
                "longitude": -178.97797292307337
            },
            {
                "latitude": 40.432364346861604,
                "longitude": -177.85014734427142
            },
            {
                "latitude": 40.42542983081432,
                "longitude": -176.7224856721202
            },
            {
                "latitude": 40.40753890261262,
                "longitude": -175.59504182594532
            },
            {
                "latitude": 40.37868900358026,
                "longitude": -174.46786947655454
            },
            {
                "latitude": 40.33887322169868,
                "longitude": -173.34102195271916
            },
            {
                "latitude": 40.288080307270754,
                "longitude": -172.21455214816993
            },
            {
                "latitude": 40.22629469417639,
                "longitude": -171.08851242933935
            },
            {
                "latitude": 40.153496526898074,
                "longitude": -169.962954544077
            },
            {
                "latitude": 40.06966169355803,
                "longitude": -168.8379295315611
            },
            {
                "latitude": 40,
                "longitude": -168
            }
        ],
        [
            {
                "latitude": 41,
                "longitude": -171
            },
            {
                "latitude": 41.05961565119562,
                "longitude": -172.06165824330301
            },
            {
                "latitude": 41.10940234870382,
                "longitude": -173.12344702251286
            },
            {
                "latitude": 41.14938221727034,
                "longitude": -174.185319273447
            },
            {
                "latitude": 41.179573783866616,
                "longitude": -175.24722770333815
            },
            {
                "latitude": 41.19999196459433,
                "longitude": -176.30912486300696
            },
            {
                "latitude": 41.21064805531408,
                "longitude": -177.37096321962818
            },
            {
                "latitude": 41.21154972584451,
                "longitude": -178.43269522992424
            },
            {
                "latitude": 41.20270101761962,
                "longitude": -179.49427341361624
            },
            {
                "latitude": 41.18410234473152,
                "longitude": 179.44434957303628
            },
            {
                "latitude": 41.15575049832663,
                "longitude": 178.3832208637754
            },
            {
                "latitude": 41.11763865436246,
                "longitude": 177.32238730913295
            },
            {
                "latitude": 41.069756384771985,
                "longitude": 176.2618954036325
            },
            {
                "latitude": 41.01208967212242,
                "longitude": 175.20179121356887
            },
            {
                "latitude": 41,
                "longitude": 175
            },
            {
                "latitude": 41.483384476645114,
                "longitude": 176.0221809043942
            },
            {
                "latitude": 41.95171880075437,
                "longitude": 177.0465262027665
            },
            {
                "latitude": 42.405233484538364,
                "longitude": 178.07302859373291
            },
            {
                "latitude": 42.84415689400401,
                "longitude": 179.10167806712533
            },
            {
                "latitude": 43.26871462345419,
                "longitude": -179.867538136043
            },
            {
                "latitude": 43.67912894009644,
                "longitude": -178.83463555914759
            },
            {
                "latitude": 44,
                "longitude": -178
            },
            {
                "latitude": 43.60533483922107,
                "longitude": -176.97685874258957
            },
            {
                "latitude": 43.197115994121816,
                "longitude": -175.9560279327175
            },
            {
                "latitude": 42.77513878178771,
                "longitude": -174.93751588828772
            },
            {
                "latitude": 42.33919464582955,
                "longitude": -173.9213278096975
            },
            {
                "latitude": 41.88907157696093,
                "longitude": -172.90746579773602
            },
            {
                "latitude": 41.42455458865182,
                "longitude": -171.89592887513766
            },
            {
                "latitude": 41,
                "longitude": -171
            }
        ]
    ];
    var polygonHoleInput = transformInputData(polygonHoleRawInput);
    var polygonHoleRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": 44.130337401165924,
                        "longitude": 180
                    },
                    {
                        "latitude": 43.70871107305507,
                        "longitude": 179.07710499077334
                    },
                    {
                        "latitude": 43.25086599523841,
                        "longitude": 178.1077155486529
                    },
                    {
                        "latitude": 42.77893526195608,
                        "longitude": 177.14077306944245
                    },
                    {
                        "latitude": 42.292687164927244,
                        "longitude": 176.1762686894512
                    },
                    {
                        "latitude": 41.791887426693854,
                        "longitude": 175.21419067942094
                    },
                    {
                        "latitude": 41.276299809045426,
                        "longitude": 174.25452448313519
                    },
                    {
                        "latitude": 40.745686794500514,
                        "longitude": 173.29725275803284
                    },
                    {
                        "latitude": 40.19981034621057,
                        "longitude": 172.34235541765696
                    },
                    {
                        "latitude": 40,
                        "longitude": 172
                    },
                    {
                        "latitude": 40.092277049882505,
                        "longitude": 173.1271967763212
                    },
                    {
                        "latitude": 40.17342495465093,
                        "longitude": 174.25465874289063
                    },
                    {
                        "latitude": 40.243480126618145,
                        "longitude": 175.3823333424249
                    },
                    {
                        "latitude": 40.302474736653934,
                        "longitude": 176.51016752793655
                    },
                    {
                        "latitude": 40.35043667729767,
                        "longitude": 177.63810785184126
                    },
                    {
                        "latitude": 40.38738953266624,
                        "longitude": 178.76610055643596
                    },
                    {
                        "latitude": 40.41335255476794,
                        "longitude": 179.89409166551997
                    },
                    {
                        "latitude": 40.414759872733704,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": 40.414759872733704,
                        "longitude": -180
                    },
                    {
                        "latitude": 40.42834064589871,
                        "longitude": -178.97797292307337
                    },
                    {
                        "latitude": 40.432364346861604,
                        "longitude": -177.85014734427142
                    },
                    {
                        "latitude": 40.42542983081432,
                        "longitude": -176.7224856721202
                    },
                    {
                        "latitude": 40.40753890261262,
                        "longitude": -175.59504182594532
                    },
                    {
                        "latitude": 40.37868900358026,
                        "longitude": -174.46786947655454
                    },
                    {
                        "latitude": 40.33887322169868,
                        "longitude": -173.34102195271916
                    },
                    {
                        "latitude": 40.288080307270754,
                        "longitude": -172.21455214816993
                    },
                    {
                        "latitude": 40.22629469417639,
                        "longitude": -171.08851242933935
                    },
                    {
                        "latitude": 40.153496526898074,
                        "longitude": -169.962954544077
                    },
                    {
                        "latitude": 40.06966169355803,
                        "longitude": -168.8379295315611
                    },
                    {
                        "latitude": 40,
                        "longitude": -168
                    },
                    {
                        "latitude": 40,
                        "longitude": -168
                    },
                    {
                        "latitude": 40.55908853591122,
                        "longitude": -168.9675327833062
                    },
                    {
                        "latitude": 41.102308234737926,
                        "longitude": -169.9373417663094
                    },
                    {
                        "latitude": 41.62990878082619,
                        "longitude": -170.90943627921186
                    },
                    {
                        "latitude": 42.14214041065494,
                        "longitude": -171.88382330981537
                    },
                    {
                        "latitude": 42.639252976586775,
                        "longitude": -172.86050744034276
                    },
                    {
                        "latitude": 43.12149510520151,
                        "longitude": -173.83949078665015
                    },
                    {
                        "latitude": 43.58911344413328,
                        "longitude": -174.8207729401386
                    },
                    {
                        "latitude": 44.04235199136732,
                        "longitude": -175.8043509126674
                    },
                    {
                        "latitude": 44.48145150105371,
                        "longitude": -176.79021908476193
                    },
                    {
                        "latitude": 44.90664896005025,
                        "longitude": -177.77836915740198
                    },
                    {
                        "latitude": 45,
                        "longitude": -178
                    },
                    {
                        "latitude": 44.58305506854093,
                        "longitude": -178.97675432548363
                    },
                    {
                        "latitude": 44.15269909389255,
                        "longitude": -179.9510526424957
                    },
                    {
                        "latitude": 44.130337401165924,
                        "longitude": -180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 15,
                            "linkTo": 32
                        },
                        "17": {
                            "visited": false,
                            "forPole": false,
                            "index": 32,
                            "linkTo": 15
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 33,
                            "linkTo": 14
                        },
                        "26": {
                            "visited": false,
                            "forPole": false,
                            "index": 14,
                            "linkTo": 33
                        }
                    }
                }
            ]
        },
        {
            "polygons": [
                [
                    {
                        "latitude": 41.19383909274968,
                        "longitude": 180
                    },
                    {
                        "latitude": 41.18410234473152,
                        "longitude": 179.44434957303628
                    },
                    {
                        "latitude": 41.15575049832663,
                        "longitude": 178.3832208637754
                    },
                    {
                        "latitude": 41.11763865436246,
                        "longitude": 177.32238730913295
                    },
                    {
                        "latitude": 41.069756384771985,
                        "longitude": 176.2618954036325
                    },
                    {
                        "latitude": 41.01208967212242,
                        "longitude": 175.20179121356887
                    },
                    {
                        "latitude": 41,
                        "longitude": 175
                    },
                    {
                        "latitude": 41.483384476645114,
                        "longitude": 176.0221809043942
                    },
                    {
                        "latitude": 41.95171880075437,
                        "longitude": 177.0465262027665
                    },
                    {
                        "latitude": 42.405233484538364,
                        "longitude": 178.07302859373291
                    },
                    {
                        "latitude": 42.84415689400401,
                        "longitude": 179.10167806712533
                    },
                    {
                        "latitude": 43.2141564237879,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": 43.2141564237879,
                        "longitude": -180
                    },
                    {
                        "latitude": 43.26871462345419,
                        "longitude": -179.867538136043
                    },
                    {
                        "latitude": 43.67912894009644,
                        "longitude": -178.83463555914759
                    },
                    {
                        "latitude": 44,
                        "longitude": -178
                    },
                    {
                        "latitude": 43.60533483922107,
                        "longitude": -176.97685874258957
                    },
                    {
                        "latitude": 43.197115994121816,
                        "longitude": -175.9560279327175
                    },
                    {
                        "latitude": 42.77513878178771,
                        "longitude": -174.93751588828772
                    },
                    {
                        "latitude": 42.33919464582955,
                        "longitude": -173.9213278096975
                    },
                    {
                        "latitude": 41.88907157696093,
                        "longitude": -172.90746579773602
                    },
                    {
                        "latitude": 41.42455458865182,
                        "longitude": -171.89592887513766
                    },
                    {
                        "latitude": 41,
                        "longitude": -171
                    },
                    {
                        "latitude": 41,
                        "longitude": -171
                    },
                    {
                        "latitude": 41.05961565119562,
                        "longitude": -172.06165824330301
                    },
                    {
                        "latitude": 41.10940234870382,
                        "longitude": -173.12344702251286
                    },
                    {
                        "latitude": 41.14938221727034,
                        "longitude": -174.185319273447
                    },
                    {
                        "latitude": 41.179573783866616,
                        "longitude": -175.24722770333815
                    },
                    {
                        "latitude": 41.19999196459433,
                        "longitude": -176.30912486300696
                    },
                    {
                        "latitude": 41.21064805531408,
                        "longitude": -177.37096321962818
                    },
                    {
                        "latitude": 41.21154972584451,
                        "longitude": -178.43269522992424
                    },
                    {
                        "latitude": 41.20270101761962,
                        "longitude": -179.49427341361624
                    },
                    {
                        "latitude": 41.19383909274968,
                        "longitude": -180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 10,
                            "linkTo": 21
                        },
                        "11": {
                            "visited": false,
                            "forPole": false,
                            "index": 21,
                            "linkTo": 10
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 22,
                            "linkTo": 9
                        },
                        "20": {
                            "visited": false,
                            "forPole": false,
                            "index": 9,
                            "linkTo": 22
                        }
                    }
                }
            ]
        }
    ];
    var polygonHoleOutput = transformOutputData(polygonHoleRawOutput);

    var polygonHole2RawInput = [
        [
            {
                "latitude": 40,
                "longitude": -178
            },
            {
                "latitude": 40.55908853591122,
                "longitude": -178.96753278330618
            },
            {
                "latitude": 41.102308234737926,
                "longitude": -179.93734176630937
            },
            {
                "latitude": 41.62990878082619,
                "longitude": 179.09056372078814
            },
            {
                "latitude": 42.14214041065494,
                "longitude": 178.11617669018466
            },
            {
                "latitude": 42.639252976586775,
                "longitude": 177.1394925596572
            },
            {
                "latitude": 43.12149510520151,
                "longitude": 176.16050921334983
            },
            {
                "latitude": 43.58911344413328,
                "longitude": 175.1792270598614
            },
            {
                "latitude": 44.04235199136732,
                "longitude": 174.1956490873326
            },
            {
                "latitude": 44.48145150105371,
                "longitude": 173.20978091523804
            },
            {
                "latitude": 44.90664896005024,
                "longitude": 172.221630842598
            },
            {
                "latitude": 45,
                "longitude": 172
            },
            {
                "latitude": 44.58305506854093,
                "longitude": 171.0232456745164
            },
            {
                "latitude": 44.15269909389256,
                "longitude": 170.0489473575043
            },
            {
                "latitude": 43.70871107305507,
                "longitude": 169.07710499077334
            },
            {
                "latitude": 43.250865995238414,
                "longitude": 168.10771554865292
            },
            {
                "latitude": 42.77893526195608,
                "longitude": 167.14077306944247
            },
            {
                "latitude": 42.292687164927244,
                "longitude": 166.17626868945123
            },
            {
                "latitude": 41.791887426693854,
                "longitude": 165.21419067942094
            },
            {
                "latitude": 41.276299809045426,
                "longitude": 164.25452448313519
            },
            {
                "latitude": 40.74568679450051,
                "longitude": 163.29725275803287
            },
            {
                "latitude": 40.19981034621057,
                "longitude": 162.34235541765696
            },
            {
                "latitude": 40,
                "longitude": 162
            },
            {
                "latitude": 40.092277049882505,
                "longitude": 163.1271967763212
            },
            {
                "latitude": 40.17342495465093,
                "longitude": 164.25465874289063
            },
            {
                "latitude": 40.243480126618145,
                "longitude": 165.38233334242486
            },
            {
                "latitude": 40.302474736653934,
                "longitude": 166.51016752793652
            },
            {
                "latitude": 40.35043667729767,
                "longitude": 167.63810785184126
            },
            {
                "latitude": 40.38738953266624,
                "longitude": 168.76610055643593
            },
            {
                "latitude": 40.41335255476794,
                "longitude": 169.89409166551997
            },
            {
                "latitude": 40.42834064589871,
                "longitude": 171.02202707692663
            },
            {
                "latitude": 40.432364346861604,
                "longitude": 172.14985265572858
            },
            {
                "latitude": 40.42542983081432,
                "longitude": 173.2775143278798
            },
            {
                "latitude": 40.40753890261262,
                "longitude": 174.40495817405466
            },
            {
                "latitude": 40.37868900358026,
                "longitude": 175.53213052344546
            },
            {
                "latitude": 40.33887322169868,
                "longitude": 176.65897804728084
            },
            {
                "latitude": 40.288080307270754,
                "longitude": 177.78544785183004
            },
            {
                "latitude": 40.22629469417639,
                "longitude": 178.91148757066063
            },
            {
                "latitude": 40.153496526898074,
                "longitude": -179.962954544077
            },
            {
                "latitude": 40.06966169355803,
                "longitude": -178.83792953156112
            },
            {
                "latitude": 40,
                "longitude": -178
            }
        ],
        [
            {
                "latitude": 41,
                "longitude": 179
            },
            {
                "latitude": 41.05961565119562,
                "longitude": 177.93834175669699
            },
            {
                "latitude": 41.10940234870382,
                "longitude": 176.87655297748714
            },
            {
                "latitude": 41.14938221727034,
                "longitude": 175.81468072655304
            },
            {
                "latitude": 41.179573783866616,
                "longitude": 174.75277229666185
            },
            {
                "latitude": 41.19999196459434,
                "longitude": 173.69087513699307
            },
            {
                "latitude": 41.21064805531408,
                "longitude": 172.62903678037185
            },
            {
                "latitude": 41.21154972584451,
                "longitude": 171.56730477007576
            },
            {
                "latitude": 41.20270101761962,
                "longitude": 170.5057265863838
            },
            {
                "latitude": 41.18410234473152,
                "longitude": 169.44434957303628
            },
            {
                "latitude": 41.15575049832663,
                "longitude": 168.3832208637754
            },
            {
                "latitude": 41.11763865436245,
                "longitude": 167.32238730913295
            },
            {
                "latitude": 41.069756384771985,
                "longitude": 166.2618954036325
            },
            {
                "latitude": 41.012089672122436,
                "longitude": 165.20179121356887
            },
            {
                "latitude": 41,
                "longitude": 165
            },
            {
                "latitude": 41.483384476645114,
                "longitude": 166.0221809043942
            },
            {
                "latitude": 41.95171880075437,
                "longitude": 167.0465262027665
            },
            {
                "latitude": 42.405233484538364,
                "longitude": 168.07302859373291
            },
            {
                "latitude": 42.84415689400401,
                "longitude": 169.10167806712533
            },
            {
                "latitude": 43.26871462345419,
                "longitude": 170.13246186395702
            },
            {
                "latitude": 43.67912894009644,
                "longitude": 171.16536444085244
            },
            {
                "latitude": 44,
                "longitude": 172
            },
            {
                "latitude": 43.60533483922107,
                "longitude": 173.02314125741043
            },
            {
                "latitude": 43.197115994121816,
                "longitude": 174.0439720672825
            },
            {
                "latitude": 42.77513878178771,
                "longitude": 175.0624841117123
            },
            {
                "latitude": 42.33919464582955,
                "longitude": 176.0786721903025
            },
            {
                "latitude": 41.88907157696093,
                "longitude": 177.09253420226398
            },
            {
                "latitude": 41.42455458865182,
                "longitude": 178.10407112486234
            },
            {
                "latitude": 41,
                "longitude": 179
            }
        ]
    ];
    var polygonHole2Input = transformInputData(polygonHole2RawInput);
    var polygonHole2RawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": 41.13631574930911,
                        "longitude": 180
                    },
                    {
                        "latitude": 41.62990878082619,
                        "longitude": 179.09056372078814
                    },
                    {
                        "latitude": 42.14214041065494,
                        "longitude": 178.11617669018466
                    },
                    {
                        "latitude": 42.639252976586775,
                        "longitude": 177.1394925596572
                    },
                    {
                        "latitude": 43.12149510520151,
                        "longitude": 176.16050921334983
                    },
                    {
                        "latitude": 43.58911344413328,
                        "longitude": 175.1792270598614
                    },
                    {
                        "latitude": 44.04235199136732,
                        "longitude": 174.1956490873326
                    },
                    {
                        "latitude": 44.48145150105371,
                        "longitude": 173.20978091523804
                    },
                    {
                        "latitude": 44.90664896005024,
                        "longitude": 172.221630842598
                    },
                    {
                        "latitude": 45,
                        "longitude": 172
                    },
                    {
                        "latitude": 44.58305506854093,
                        "longitude": 171.0232456745164
                    },
                    {
                        "latitude": 44.15269909389256,
                        "longitude": 170.0489473575043
                    },
                    {
                        "latitude": 43.70871107305507,
                        "longitude": 169.07710499077334
                    },
                    {
                        "latitude": 43.250865995238414,
                        "longitude": 168.10771554865292
                    },
                    {
                        "latitude": 42.77893526195608,
                        "longitude": 167.14077306944247
                    },
                    {
                        "latitude": 42.292687164927244,
                        "longitude": 166.17626868945123
                    },
                    {
                        "latitude": 41.791887426693854,
                        "longitude": 165.21419067942094
                    },
                    {
                        "latitude": 41.276299809045426,
                        "longitude": 164.25452448313519
                    },
                    {
                        "latitude": 40.74568679450051,
                        "longitude": 163.29725275803287
                    },
                    {
                        "latitude": 40.19981034621057,
                        "longitude": 162.34235541765696
                    },
                    {
                        "latitude": 40,
                        "longitude": 162
                    },
                    {
                        "latitude": 40.092277049882505,
                        "longitude": 163.1271967763212
                    },
                    {
                        "latitude": 40.17342495465093,
                        "longitude": 164.25465874289063
                    },
                    {
                        "latitude": 40.243480126618145,
                        "longitude": 165.38233334242486
                    },
                    {
                        "latitude": 40.302474736653934,
                        "longitude": 166.51016752793652
                    },
                    {
                        "latitude": 40.35043667729767,
                        "longitude": 167.63810785184126
                    },
                    {
                        "latitude": 40.38738953266624,
                        "longitude": 168.76610055643593
                    },
                    {
                        "latitude": 40.41335255476794,
                        "longitude": 169.89409166551997
                    },
                    {
                        "latitude": 40.42834064589871,
                        "longitude": 171.02202707692663
                    },
                    {
                        "latitude": 40.432364346861604,
                        "longitude": 172.14985265572858
                    },
                    {
                        "latitude": 40.42542983081432,
                        "longitude": 173.2775143278798
                    },
                    {
                        "latitude": 40.40753890261262,
                        "longitude": 174.40495817405466
                    },
                    {
                        "latitude": 40.37868900358026,
                        "longitude": 175.53213052344546
                    },
                    {
                        "latitude": 40.33887322169868,
                        "longitude": 176.65897804728084
                    },
                    {
                        "latitude": 40.288080307270754,
                        "longitude": 177.78544785183004
                    },
                    {
                        "latitude": 40.22629469417639,
                        "longitude": 178.91148757066063
                    },
                    {
                        "latitude": 40.155892530988574,
                        "longitude": 180
                    }
                ],
                [
                    {
                        "latitude": 40.155892530988574,
                        "longitude": -180
                    },
                    {
                        "latitude": 40.153496526898074,
                        "longitude": -179.962954544077
                    },
                    {
                        "latitude": 40.06966169355803,
                        "longitude": -178.83792953156112
                    },
                    {
                        "latitude": 40,
                        "longitude": -178
                    },
                    {
                        "latitude": 40,
                        "longitude": -178
                    },
                    {
                        "latitude": 40.55908853591122,
                        "longitude": -178.96753278330618
                    },
                    {
                        "latitude": 41.102308234737926,
                        "longitude": -179.93734176630937
                    },
                    {
                        "latitude": 41.13631574930911,
                        "longitude": -180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 4,
                            "linkTo": 40
                        },
                        "36": {
                            "visited": false,
                            "forPole": false,
                            "index": 40,
                            "linkTo": 4
                        }
                    }
                },
                {
                    "_entries": {
                        "0": {
                            "visited": true,
                            "forPole": false,
                            "index": 41,
                            "linkTo": 3
                        },
                        "7": {
                            "visited": false,
                            "forPole": false,
                            "index": 3,
                            "linkTo": 41
                        }
                    }
                }
            ]
        },
        {
            "polygons": [
                [
                    {
                        "latitude": 41,
                        "longitude": 179
                    },
                    {
                        "latitude": 41.05961565119562,
                        "longitude": 177.93834175669699
                    },
                    {
                        "latitude": 41.10940234870382,
                        "longitude": 176.87655297748714
                    },
                    {
                        "latitude": 41.14938221727034,
                        "longitude": 175.81468072655304
                    },
                    {
                        "latitude": 41.179573783866616,
                        "longitude": 174.75277229666185
                    },
                    {
                        "latitude": 41.19999196459434,
                        "longitude": 173.69087513699307
                    },
                    {
                        "latitude": 41.21064805531408,
                        "longitude": 172.62903678037185
                    },
                    {
                        "latitude": 41.21154972584451,
                        "longitude": 171.56730477007576
                    },
                    {
                        "latitude": 41.20270101761962,
                        "longitude": 170.5057265863838
                    },
                    {
                        "latitude": 41.18410234473152,
                        "longitude": 169.44434957303628
                    },
                    {
                        "latitude": 41.15575049832663,
                        "longitude": 168.3832208637754
                    },
                    {
                        "latitude": 41.11763865436245,
                        "longitude": 167.32238730913295
                    },
                    {
                        "latitude": 41.069756384771985,
                        "longitude": 166.2618954036325
                    },
                    {
                        "latitude": 41.012089672122436,
                        "longitude": 165.20179121356887
                    },
                    {
                        "latitude": 41,
                        "longitude": 165
                    },
                    {
                        "latitude": 41.483384476645114,
                        "longitude": 166.0221809043942
                    },
                    {
                        "latitude": 41.95171880075437,
                        "longitude": 167.0465262027665
                    },
                    {
                        "latitude": 42.405233484538364,
                        "longitude": 168.07302859373291
                    },
                    {
                        "latitude": 42.84415689400401,
                        "longitude": 169.10167806712533
                    },
                    {
                        "latitude": 43.26871462345419,
                        "longitude": 170.13246186395702
                    },
                    {
                        "latitude": 43.67912894009644,
                        "longitude": 171.16536444085244
                    },
                    {
                        "latitude": 44,
                        "longitude": 172
                    },
                    {
                        "latitude": 43.60533483922107,
                        "longitude": 173.02314125741043
                    },
                    {
                        "latitude": 43.197115994121816,
                        "longitude": 174.0439720672825
                    },
                    {
                        "latitude": 42.77513878178771,
                        "longitude": 175.0624841117123
                    },
                    {
                        "latitude": 42.33919464582955,
                        "longitude": 176.0786721903025
                    },
                    {
                        "latitude": 41.88907157696093,
                        "longitude": 177.09253420226398
                    },
                    {
                        "latitude": 41.42455458865182,
                        "longitude": 178.10407112486234
                    },
                    {
                        "latitude": 41,
                        "longitude": 179
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {}
                }
            ]
        }
    ];
    var polygonHole2Output = transformOutputData(polygonHole2RawOutput);

    var fullSphereSectorRawInput = [
        [
            {
                "latitude": -90,
                "longitude": -180
            },
            {
                "latitude": -89.87215909090881,
                "longitude": -180
            },
            {
                "latitude": -89.74431181732949,
                "longitude": -180
            },
            {
                "latitude": -89.6164454491398,
                "longitude": -180
            },
            {
                "latitude": -89.48854725089888,
                "longitude": -180
            },
            {
                "latitude": -89.36060447702006,
                "longitude": -180
            },
            {
                "latitude": -89.2326043669483,
                "longitude": -180
            },
            {
                "latitude": -89.10453414032345,
                "longitude": -180
            },
            {
                "latitude": -88.97638099212966,
                "longitude": -180
            },
            {
                "latitude": -88.84813208783008,
                "longitude": -180
            },
            {
                "latitude": -88.71977455847643,
                "longitude": -180
            },
            {
                "latitude": -88.59129549579664,
                "longitude": -180
            },
            {
                "latitude": -88.46268194725344,
                "longitude": -180
            },
            {
                "latitude": -88.33392091106938,
                "longitude": -180
            },
            {
                "latitude": -88.2049993312171,
                "longitude": -180
            },
            {
                "latitude": -88.07590409236822,
                "longitude": -180
            },
            {
                "latitude": -87.94662201479971,
                "longitude": -180
            },
            {
                "latitude": -87.81713984925088,
                "longitude": -180
            },
            {
                "latitude": -87.68744427172963,
                "longitude": -180
            },
            {
                "latitude": -87.5575218782625,
                "longitude": -180
            },
            {
                "latitude": -87.42735917958343,
                "longitude": -180
            },
            {
                "latitude": -87.29694259575992,
                "longitude": -180
            },
            {
                "latitude": -87.1662584507491,
                "longitude": -180
            },
            {
                "latitude": -87.03529296688193,
                "longitude": -180
            },
            {
                "latitude": -86.90403225926869,
                "longitude": -180
            },
            {
                "latitude": -86.77246233012377,
                "longitude": -180
            },
            {
                "latitude": -86.64056906300249,
                "longitude": -180
            },
            {
                "latitude": -86.50833821694759,
                "longitude": -180
            },
            {
                "latitude": -86.37575542053854,
                "longitude": -180
            },
            {
                "latitude": -86.24280616584049,
                "longitude": -180
            },
            {
                "latitude": -86.10947580224548,
                "longitude": -180
            },
            {
                "latitude": -85.97574953020343,
                "longitude": -180
            },
            {
                "latitude": -85.84161239483505,
                "longitude": -180
            },
            {
                "latitude": -85.7070492794228,
                "longitude": -180
            },
            {
                "latitude": -85.57204489877324,
                "longitude": -180
            },
            {
                "latitude": -85.4365837924456,
                "longitude": -180
            },
            {
                "latitude": -85.30065031784005,
                "longitude": -180
            },
            {
                "latitude": -85.16422864313981,
                "longitude": -180
            },
            {
                "latitude": -85.02730274010058,
                "longitude": -180
            },
            {
                "latitude": -84.88985637668107,
                "longitude": -180
            },
            {
                "latitude": -84.7518731095069,
                "longitude": -180
            },
            {
                "latitude": -84.61333627616263,
                "longitude": -180
            },
            {
                "latitude": -84.47422898730257,
                "longitude": -180
            },
            {
                "latitude": -84.33453411857462,
                "longitude": -180
            },
            {
                "latitude": -84.19423430234929,
                "longitude": -180
            },
            {
                "latitude": -84.05331191924462,
                "longitude": -180
            },
            {
                "latitude": -83.91174908944046,
                "longitude": -180
            },
            {
                "latitude": -83.76952766377306,
                "longitude": -180
            },
            {
                "latitude": -83.62662921460064,
                "longitude": -180
            },
            {
                "latitude": -83.48303502643166,
                "longitude": -180
            },
            {
                "latitude": -83.33872608630637,
                "longitude": -180
            },
            {
                "latitude": -83.19368307392106,
                "longitude": -180
            },
            {
                "latitude": -83.0478863514866,
                "longitude": -180
            },
            {
                "latitude": -82.90131595330878,
                "longitude": -180
            },
            {
                "latitude": -82.75395157508196,
                "longitude": -180
            },
            {
                "latitude": -82.60577256288295,
                "longitude": -180
            },
            {
                "latitude": -82.45675790185462,
                "longitude": -180
            },
            {
                "latitude": -82.306886204567,
                "longitude": -180
            },
            {
                "latitude": -82.1561356990436,
                "longitude": -180
            },
            {
                "latitude": -82.00448421643958,
                "longitude": -180
            },
            {
                "latitude": -81.85190917835924,
                "longitude": -180
            },
            {
                "latitude": -81.69838758379788,
                "longitude": -180
            },
            {
                "latitude": -81.54389599569521,
                "longitude": -180
            },
            {
                "latitude": -81.38841052708345,
                "longitude": -180
            },
            {
                "latitude": -81.23190682681651,
                "longitude": -180
            },
            {
                "latitude": -81.0743600648631,
                "longitude": -180
            },
            {
                "latitude": -80.91574491714731,
                "longitude": -180
            },
            {
                "latitude": -80.7560355499196,
                "longitude": -180
            },
            {
                "latitude": -80.59520560364027,
                "longitude": -180
            },
            {
                "latitude": -80.43322817635615,
                "longitude": -180
            },
            {
                "latitude": -80.27007580655234,
                "longitude": -180
            },
            {
                "latitude": -80.10572045545752,
                "longitude": -180
            },
            {
                "latitude": -79.94013348878327,
                "longitude": -180
            },
            {
                "latitude": -79.7732856578747,
                "longitude": -180
            },
            {
                "latitude": -79.60514708025077,
                "longitude": -180
            },
            {
                "latitude": -79.43568721951023,
                "longitude": -180
            },
            {
                "latitude": -79.26487486457944,
                "longitude": -180
            },
            {
                "latitude": -79.09267810827666,
                "longitude": -180
            },
            {
                "latitude": -78.91906432516674,
                "longitude": -180
            },
            {
                "latitude": -78.74400014867915,
                "longitude": -180
            },
            {
                "latitude": -78.56745144746101,
                "longitude": -180
            },
            {
                "latitude": -78.3893833009359,
                "longitude": -180
            },
            {
                "latitude": -78.20975997403845,
                "longitude": -180
            },
            {
                "latitude": -78.0285448910927,
                "longitude": -180
            },
            {
                "latitude": -77.84570060880169,
                "longitude": -180
            },
            {
                "latitude": -77.66118878831477,
                "longitude": -180
            },
            {
                "latitude": -77.47497016633683,
                "longitude": -180
            },
            {
                "latitude": -77.2870045252433,
                "longitude": -180
            },
            {
                "latitude": -77.09725066216313,
                "longitude": -180
            },
            {
                "latitude": -76.9056663569904,
                "longitude": -180
            },
            {
                "latitude": -76.71220833928372,
                "longitude": -180
            },
            {
                "latitude": -76.51683225401193,
                "longitude": -180
            },
            {
                "latitude": -76.31949262610165,
                "longitude": -180
            },
            {
                "latitude": -76.12014282374227,
                "longitude": -180
            },
            {
                "latitude": -75.91873502040113,
                "longitude": -180
            },
            {
                "latitude": -75.71522015550102,
                "longitude": -180
            },
            {
                "latitude": -75.50954789370948,
                "longitude": -180
            },
            {
                "latitude": -75.30166658278891,
                "longitude": -180
            },
            {
                "latitude": -75.09152320995382,
                "longitude": -180
            },
            {
                "latitude": -74.87906335668025,
                "longitude": -180
            },
            {
                "latitude": -74.66423115191073,
                "longitude": -180
            },
            {
                "latitude": -74.44696922359661,
                "longitude": -180
            },
            {
                "latitude": -74.22721864851722,
                "longitude": -180
            },
            {
                "latitude": -74.00491890031441,
                "longitude": -180
            },
            {
                "latitude": -73.78000779567883,
                "longitude": -180
            },
            {
                "latitude": -73.55242143862314,
                "longitude": -180
            },
            {
                "latitude": -73.32209416277513,
                "longitude": -180
            },
            {
                "latitude": -73.0889584716226,
                "longitude": -180
            },
            {
                "latitude": -72.85294497664098,
                "longitude": -180
            },
            {
                "latitude": -72.61398233323177,
                "longitude": -180
            },
            {
                "latitude": -72.37199717440069,
                "longitude": -180
            },
            {
                "latitude": -72.12691404210162,
                "longitude": -180
            },
            {
                "latitude": -71.8786553161727,
                "longitude": -180
            },
            {
                "latitude": -71.62714114079004,
                "longitude": -180
            },
            {
                "latitude": -71.3722893483636,
                "longitude": -180
            },
            {
                "latitude": -71.11401538080054,
                "longitude": -180
            },
            {
                "latitude": -70.85223220806122,
                "longitude": -180
            },
            {
                "latitude": -70.58685024393353,
                "longitude": -180
            },
            {
                "latitude": -70.3177772589527,
                "longitude": -180
            },
            {
                "latitude": -70.04491829039551,
                "longitude": -180
            },
            {
                "latitude": -69.76817554927966,
                "longitude": -180
            },
            {
                "latitude": -69.4874483243026,
                "longitude": -180
            },
            {
                "latitude": -69.2026328826575,
                "longitude": -180
            },
            {
                "latitude": -68.91362236766926,
                "longitude": -180
            },
            {
                "latitude": -68.62030669319853,
                "longitude": -180
            },
            {
                "latitude": -68.3225724347693,
                "longitude": -180
            },
            {
                "latitude": -68.02030271738332,
                "longitude": -180
            },
            {
                "latitude": -67.7133770999946,
                "longitude": -180
            },
            {
                "latitude": -67.40167145662869,
                "longitude": -180
            },
            {
                "latitude": -67.08505785414408,
                "longitude": -180
            },
            {
                "latitude": -66.76340442664929,
                "longitude": -180
            },
            {
                "latitude": -66.436575246606,
                "longitude": -180
            },
            {
                "latitude": -66.10443019266958,
                "longitude": -180
            },
            {
                "latitude": -65.76682481434122,
                "longitude": -180
            },
            {
                "latitude": -65.42361019353231,
                "longitude": -180
            },
            {
                "latitude": -65.0746328031723,
                "longitude": -180
            },
            {
                "latitude": -64.71973436302501,
                "longitude": -180
            },
            {
                "latitude": -64.35875169291738,
                "longitude": -180
            },
            {
                "latitude": -63.991516563628146,
                "longitude": -180
            },
            {
                "latitude": -63.61785554573361,
                "longitude": -180
            },
            {
                "latitude": -63.23758985676242,
                "longitude": -180
            },
            {
                "latitude": -62.85053520707411,
                "longitude": -180
            },
            {
                "latitude": -62.4565016449452,
                "longitude": -180
            },
            {
                "latitude": -62.05529340142515,
                "longitude": -180
            },
            {
                "latitude": -61.646708735610844,
                "longitude": -180
            },
            {
                "latitude": -61.23053978108492,
                "longitude": -180
            },
            {
                "latitude": -60.806572394372054,
                "longitude": -180
            },
            {
                "latitude": -60.37458600638518,
                "longitude": -180
            },
            {
                "latitude": -59.93435347796726,
                "longitude": -180
            },
            {
                "latitude": -59.48564096077986,
                "longitude": -180
            },
            {
                "latitude": -59.02820776495211,
                "longitude": -180
            },
            {
                "latitude": -58.56180623508028,
                "longitude": -180
            },
            {
                "latitude": -58.08618163636514,
                "longitude": -180
            },
            {
                "latitude": -57.6010720528872,
                "longitude": -180
            },
            {
                "latitude": -57.106208300255375,
                "longitude": -180
            },
            {
                "latitude": -56.60131385511945,
                "longitude": -180
            },
            {
                "latitude": -56.08610480431482,
                "longitude": -180
            },
            {
                "latitude": -55.56028981670961,
                "longitude": -180
            },
            {
                "latitude": -55.023570141149015,
                "longitude": -180
            },
            {
                "latitude": -54.47563963424275,
                "longitude": -180
            },
            {
                "latitude": -53.91618482211629,
                "longitude": -180
            },
            {
                "latitude": -53.34488500064701,
                "longitude": -180
            },
            {
                "latitude": -52.761412379131166,
                "longitude": -180
            },
            {
                "latitude": -52.16543227277518,
                "longitude": -180
            },
            {
                "latitude": -51.55660334987387,
                "longitude": -180
            },
            {
                "latitude": -50.934577940024546,
                "longitude": -180
            },
            {
                "latitude": -50.29900241022749,
                "longitude": -180
            },
            {
                "latitude": -49.64951761623158,
                "longitude": -180
            },
            {
                "latitude": -48.985759436994975,
                "longitude": -180
            },
            {
                "latitude": -48.307359400632734,
                "longitude": -180
            },
            {
                "latitude": -47.613945410707295,
                "longitude": -180
            },
            {
                "latitude": -46.90514258216808,
                "longitude": -180
            },
            {
                "latitude": -46.18057419664902,
                "longitude": -180
            },
            {
                "latitude": -45.43986278716491,
                "longitude": -180
            },
            {
                "latitude": -44.68263136248975,
                "longitude": -180
            },
            {
                "latitude": -43.9085047816228,
                "longitude": -180
            },
            {
                "latitude": -43.11711128872245,
                "longitude": -180
            },
            {
                "latitude": -42.30808421867935,
                "longitude": -180
            },
            {
                "latitude": -41.48106388306878,
                "longitude": -180
            },
            {
                "latitude": -40.635699645528234,
                "longitude": -180
            },
            {
                "latitude": -39.77165219460128,
                "longitude": -180
            },
            {
                "latitude": -38.88859602072611,
                "longitude": -180
            },
            {
                "latitude": -37.98622210227706,
                "longitude": -180
            },
            {
                "latitude": -37.064240803337746,
                "longitude": -180
            },
            {
                "latitude": -36.12238498314884,
                "longitude": -180
            },
            {
                "latitude": -35.160413313885364,
                "longitude": -180
            },
            {
                "latitude": -34.17811379954215,
                "longitude": -180
            },
            {
                "latitude": -33.17530748421364,
                "longitude": -180
            },
            {
                "latitude": -32.1518523329345,
                "longitude": -180
            },
            {
                "latitude": -31.107647262509595,
                "longitude": -180
            },
            {
                "latitude": -30.04263629343538,
                "longitude": -180
            },
            {
                "latitude": -28.956812787167916,
                "longitude": -180
            },
            {
                "latitude": -27.850223725718017,
                "longitude": -180
            },
            {
                "latitude": -26.72297398299459,
                "longitude": -180
            },
            {
                "latitude": -25.575230529653833,
                "longitude": -180
            },
            {
                "latitude": -24.407226505672618,
                "longitude": -180
            },
            {
                "latitude": -23.219265087726086,
                "longitude": -180
            },
            {
                "latitude": -22.01172307203021,
                "longitude": -180
            },
            {
                "latitude": -20.785054087965914,
                "longitude": -180
            },
            {
                "latitude": -19.539791353917234,
                "longitude": -180
            },
            {
                "latitude": -18.276549884728052,
                "longitude": -180
            },
            {
                "latitude": -16.99602806039949,
                "longitude": -180
            },
            {
                "latitude": -15.699008468476391,
                "longitude": -180
            },
            {
                "latitude": -14.3863579383088,
                "longitude": -180
            },
            {
                "latitude": -13.059026694246432,
                "longitude": -180
            },
            {
                "latitude": -11.71804656693688,
                "longitude": -180
            },
            {
                "latitude": -10.36452821722244,
                "longitude": -180
            },
            {
                "latitude": -8.999657345473533,
                "longitude": -180
            },
            {
                "latitude": -7.624689880194082,
                "longitude": -180
            },
            {
                "latitude": -6.240946162843566,
                "longitude": -180
            },
            {
                "latitude": -4.84980417032998,
                "longitude": -180
            },
            {
                "latitude": -3.452691841683219,
                "longitude": -180
            },
            {
                "latitude": -2.051078600052428,
                "longitude": -180
            },
            {
                "latitude": -0.6464661843599931,
                "longitude": -180
            },
            {
                "latitude": 0.7596210743399123,
                "longitude": -180
            },
            {
                "latitude": 2.1656463794737753,
                "longitude": -180
            },
            {
                "latitude": 3.5700708332125983,
                "longitude": -180
            },
            {
                "latitude": 4.971363865008552,
                "longitude": -180
            },
            {
                "latitude": 6.368013548331728,
                "longitude": -180
            },
            {
                "latitude": 7.7585366323646765,
                "longitude": -180
            },
            {
                "latitude": 9.14148812365425,
                "longitude": -180
            },
            {
                "latitude": 10.515470265987595,
                "longitude": -180
            },
            {
                "latitude": 11.87914078442232,
                "longitude": -180
            },
            {
                "latitude": 13.231220280632062,
                "longitude": -180
            },
            {
                "latitude": 14.57049869055246,
                "longitude": -180
            },
            {
                "latitude": 15.89584074068001,
                "longitude": -180
            },
            {
                "latitude": 17.2061903652194,
                "longitude": -180
            },
            {
                "latitude": 18.500574071581664,
                "longitude": -180
            },
            {
                "latitude": 19.778103265594403,
                "longitude": -180
            },
            {
                "latitude": 21.03797556943246,
                "longitude": -180
            },
            {
                "latitude": 22.279475184124994,
                "longitude": -180
            },
            {
                "latitude": 23.50197236414075,
                "longitude": -180
            },
            {
                "latitude": 24.704922083784904,
                "longitude": -180
            },
            {
                "latitude": 25.8878619839191,
                "longitude": -180
            },
            {
                "latitude": 27.05040969295606,
                "longitude": -180
            },
            {
                "latitude": 28.192259618422273,
                "longitude": -180
            },
            {
                "latitude": 29.313179304958997,
                "longitude": -180
            },
            {
                "latitude": 30.413005451842185,
                "longitude": -180
            },
            {
                "latitude": 31.49163967837368,
                "longitude": -180
            },
            {
                "latitude": 32.549044119266284,
                "longitude": -180
            },
            {
                "latitude": 33.5852369248357,
                "longitude": -180
            },
            {
                "latitude": 34.60028773281166,
                "longitude": -180
            },
            {
                "latitude": 35.59431317023683,
                "longitude": -180
            },
            {
                "latitude": 36.56747243553039,
                "longitude": -180
            },
            {
                "latitude": 37.51996300259944,
                "longitude": -180
            },
            {
                "latitude": 38.4520164810744,
                "longitude": -180
            },
            {
                "latitude": 39.36389465946872,
                "longitude": -180
            },
            {
                "latitude": 40.2558857514124,
                "longitude": -180
            },
            {
                "latitude": 41.128300859143984,
                "longitude": -180
            },
            {
                "latitude": 41.981470663188624,
                "longitude": -180
            },
            {
                "latitude": 42.81574234260099,
                "longitude": -180
            },
            {
                "latitude": 43.631476726285015,
                "longitude": -180
            },
            {
                "latitude": 44.42904567268543,
                "longitude": -180
            },
            {
                "latitude": 45.208829672522114,
                "longitude": -180
            },
            {
                "latitude": 45.97121566716076,
                "longitude": -180
            },
            {
                "latitude": 46.71659507361627,
                "longitude": -180
            },
            {
                "latitude": 47.445362006015145,
                "longitude": -180
            },
            {
                "latitude": 48.15791168253931,
                "longitude": -180
            },
            {
                "latitude": 48.85463900638282,
                "longitude": -180
            },
            {
                "latitude": 49.53593730902352,
                "longitude": -180
            },
            {
                "latitude": 50.20219724409761,
                "longitude": -180
            },
            {
                "latitude": 50.85380582032584,
                "longitude": -180
            },
            {
                "latitude": 51.49114556223569,
                "longitude": -180
            },
            {
                "latitude": 52.11459378782824,
                "longitude": -180
            },
            {
                "latitude": 52.724521992816975,
                "longitude": -180
            },
            {
                "latitude": 53.3212953316014,
                "longitude": -180
            },
            {
                "latitude": 53.905272185707055,
                "longitude": -180
            },
            {
                "latitude": 54.47680381101361,
                "longitude": -180
            },
            {
                "latitude": 55.036234055685256,
                "longitude": -180
            },
            {
                "latitude": 55.58389914130909,
                "longitude": -180
            },
            {
                "latitude": 56.12012750032394,
                "longitude": -180
            },
            {
                "latitude": 56.64523966338031,
                "longitude": -180
            },
            {
                "latitude": 57.15954819080773,
                "longitude": -180
            },
            {
                "latitude": 57.663357642874274,
                "longitude": -180
            },
            {
                "latitude": 58.15696458400238,
                "longitude": -180
            },
            {
                "latitude": 58.64065761655617,
                "longitude": -180
            },
            {
                "latitude": 59.11471744023488,
                "longitude": -180
            },
            {
                "latitude": 59.57941693349715,
                "longitude": -180
            },
            {
                "latitude": 60.035021253801176,
                "longitude": -180
            },
            {
                "latitude": 60.48178795377829,
                "longitude": -180
            },
            {
                "latitude": 60.91996711076236,
                "longitude": -180
            },
            {
                "latitude": 61.349801467375045,
                "longitude": -180
            },
            {
                "latitude": 61.77152658112307,
                "longitude": -180
            },
            {
                "latitude": 62.185370981193344,
                "longitude": -180
            },
            {
                "latitude": 62.59155633084296,
                "longitude": -180
            },
            {
                "latitude": 62.99029759397027,
                "longitude": -180
            },
            {
                "latitude": 63.381803204625164,
                "longitude": -180
            },
            {
                "latitude": 63.766275238371406,
                "longitude": -180
            },
            {
                "latitude": 64.14390958455292,
                "longitude": -180
            },
            {
                "latitude": 64.5148961186403,
                "longitude": -180
            },
            {
                "latitude": 64.87941887394655,
                "longitude": -180
            },
            {
                "latitude": 65.23765621209967,
                "longitude": -180
            },
            {
                "latitude": 65.58978099175029,
                "longitude": -180
            },
            {
                "latitude": 65.93596073507045,
                "longitude": -180
            },
            {
                "latitude": 66.27635779167169,
                "longitude": -180
            },
            {
                "latitude": 66.61112949963147,
                "longitude": -180
            },
            {
                "latitude": 66.94042834337401,
                "longitude": -180
            },
            {
                "latitude": 67.26440210819872,
                "longitude": -180
            },
            {
                "latitude": 67.58319403129401,
                "longitude": -180
            },
            {
                "latitude": 67.89694294911065,
                "longitude": -180
            },
            {
                "latitude": 68.20578344100313,
                "longitude": -180
            },
            {
                "latitude": 68.5098459690753,
                "longitude": -180
            },
            {
                "latitude": 68.80925701419237,
                "longitude": -180
            },
            {
                "latitude": 69.10413920814317,
                "longitude": -180
            },
            {
                "latitude": 69.3946114619548,
                "longitude": -180
            },
            {
                "latitude": 69.6807890903785,
                "longitude": -180
            },
            {
                "latitude": 69.9627839325791,
                "longitude": -180
            },
            {
                "latitude": 70.24070446907243,
                "longitude": -180
            },
            {
                "latitude": 70.51465593496454,
                "longitude": -180
            },
            {
                "latitude": 70.78474042955486,
                "longitude": -180
            },
            {
                "latitude": 71.05105702237297,
                "longitude": -180
            },
            {
                "latitude": 71.31370185572268,
                "longitude": -180
            },
            {
                "latitude": 71.57276824381339,
                "longitude": -180
            },
            {
                "latitude": 71.8283467685603,
                "longitude": -180
            },
            {
                "latitude": 72.08052537213939,
                "longitude": -180
            },
            {
                "latitude": 72.32938944638308,
                "longitude": -180
            },
            {
                "latitude": 72.57502191910537,
                "longitude": -180
            },
            {
                "latitude": 72.81750333744516,
                "longitude": -180
            },
            {
                "latitude": 73.05691194831597,
                "longitude": -180
            },
            {
                "latitude": 73.29332377605107,
                "longitude": -180
            },
            {
                "latitude": 73.52681269733226,
                "longitude": -180
            },
            {
                "latitude": 73.75745051348873,
                "longitude": -180
            },
            {
                "latitude": 73.98530702025224,
                "longitude": -180
            },
            {
                "latitude": 74.21045007505296,
                "longitude": -180
            },
            {
                "latitude": 74.43294566193907,
                "longitude": -180
            },
            {
                "latitude": 74.65285795420101,
                "longitude": -180
            },
            {
                "latitude": 74.87024937478007,
                "longitude": -180
            },
            {
                "latitude": 75.08518065453862,
                "longitude": -180
            },
            {
                "latitude": 75.29771088846738,
                "longitude": -180
            },
            {
                "latitude": 75.50789758990365,
                "longitude": -180
            },
            {
                "latitude": 75.71579674283119,
                "longitude": -180
            },
            {
                "latitude": 75.92146285233183,
                "longitude": -180
            },
            {
                "latitude": 76.12494899325532,
                "longitude": -180
            },
            {
                "latitude": 76.32630685717328,
                "longitude": -180
            },
            {
                "latitude": 76.52558679767965,
                "longitude": -180
            },
            {
                "latitude": 76.72283787409926,
                "longitude": -180
            },
            {
                "latitude": 76.91810789366299,
                "longitude": -180
            },
            {
                "latitude": 77.11144345220704,
                "longitude": -180
            },
            {
                "latitude": 77.30288997345092,
                "longitude": -180
            },
            {
                "latitude": 77.4924917469077,
                "longitude": -180
            },
            {
                "latitude": 77.68029196447736,
                "longitude": -180
            },
            {
                "latitude": 77.86633275577304,
                "longitude": -180
            },
            {
                "latitude": 78.05065522222792,
                "longitude": -180
            },
            {
                "latitude": 78.23329947002797,
                "longitude": -180
            },
            {
                "latitude": 78.41430464191596,
                "longitude": -180
            },
            {
                "latitude": 78.5937089479081,
                "longitude": -180
            },
            {
                "latitude": 78.7715496949657,
                "longitude": -180
            },
            {
                "latitude": 78.94786331565982,
                "longitude": -180
            },
            {
                "latitude": 79.12268539586846,
                "longitude": -180
            },
            {
                "latitude": 79.29605070154199,
                "longitude": -180
            },
            {
                "latitude": 79.46799320457191,
                "longitude": -180
            },
            {
                "latitude": 79.63854610779778,
                "longitude": -180
            },
            {
                "latitude": 79.80774186918384,
                "longitude": -180
            },
            {
                "latitude": 79.97561222519742,
                "longitude": -180
            },
            {
                "latitude": 80.14218821341883,
                "longitude": -180
            },
            {
                "latitude": 80.30750019441224,
                "longitude": -180
            },
            {
                "latitude": 80.47157787288474,
                "longitude": -180
            },
            {
                "latitude": 80.63445031816144,
                "longitude": -180
            },
            {
                "latitude": 80.79614598400116,
                "longitude": -180
            },
            {
                "latitude": 80.95669272777872,
                "longitude": -180
            },
            {
                "latitude": 81.11611782905709,
                "longitude": -180
            },
            {
                "latitude": 81.27444800757212,
                "longitude": -180
            },
            {
                "latitude": 81.43170944065294,
                "longitude": -180
            },
            {
                "latitude": 81.58792778009781,
                "longitude": -180
            },
            {
                "latitude": 81.74312816852755,
                "longitude": -180
            },
            {
                "latitude": 81.89733525523452,
                "longitude": -180
            },
            {
                "latitude": 82.05057321154763,
                "longitude": -180
            },
            {
                "latitude": 82.20286574573018,
                "longitude": -180
            },
            {
                "latitude": 82.35423611742937,
                "longitude": -180
            },
            {
                "latitude": 82.50470715169295,
                "longitude": -180
            },
            {
                "latitude": 82.65430125257073,
                "longitude": -180
            },
            {
                "latitude": 82.80304041631533,
                "longitude": -180
            },
            {
                "latitude": 82.95094624419777,
                "longitude": -180
            },
            {
                "latitude": 83.09803995495255,
                "longitude": -180
            },
            {
                "latitude": 83.24434239686572,
                "longitude": -180
            },
            {
                "latitude": 83.38987405951963,
                "longitude": -180
            },
            {
                "latitude": 83.53465508520738,
                "longitude": -180
            },
            {
                "latitude": 83.67870528002938,
                "longitude": -180
            },
            {
                "latitude": 83.82204412468369,
                "longitude": -180
            },
            {
                "latitude": 83.96469078496271,
                "longitude": -180
            },
            {
                "latitude": 84.10666412196608,
                "longitude": -180
            },
            {
                "latitude": 84.24798270204165,
                "longitude": -180
            },
            {
                "latitude": 84.38866480646448,
                "longitude": -180
            },
            {
                "latitude": 84.52872844086392,
                "longitude": -180
            },
            {
                "latitude": 84.6681913444087,
                "longitude": -180
            },
            {
                "latitude": 84.80707099875865,
                "longitude": -180
            },
            {
                "latitude": 84.94538463679359,
                "longitude": -180
            },
            {
                "latitude": 85.08314925112602,
                "longitude": -180
            },
            {
                "latitude": 85.22038160240845,
                "longitude": -180
            },
            {
                "latitude": 85.35709822744141,
                "longitude": -180
            },
            {
                "latitude": 85.49331544709136,
                "longitude": -180
            },
            {
                "latitude": 85.62904937402531,
                "longitude": -180
            },
            {
                "latitude": 85.76431592027079,
                "longitude": -180
            },
            {
                "latitude": 85.89913080460634,
                "longitude": -180
            },
            {
                "latitude": 86.0335095597919,
                "longitude": -180
            },
            {
                "latitude": 86.1674675396432,
                "longitude": -180
            },
            {
                "latitude": 86.30101992595951,
                "longitude": -180
            },
            {
                "latitude": 86.43418173530802,
                "longitude": -180
            },
            {
                "latitude": 86.56696782567414,
                "longitude": -180
            },
            {
                "latitude": 86.69939290298068,
                "longitude": -180
            },
            {
                "latitude": 86.8314715274841,
                "longitude": -180
            },
            {
                "latitude": 86.9632181200527,
                "longitude": -180
            },
            {
                "latitude": 87.09464696833092,
                "longitude": -180
            },
            {
                "latitude": 87.22577223279698,
                "longitude": -180
            },
            {
                "latitude": 87.35660795271913,
                "longitude": -180
            },
            {
                "latitude": 87.48716805201276,
                "longitude": -180
            },
            {
                "latitude": 87.61746634500768,
                "longitude": -180
            },
            {
                "latitude": 87.74751654212585,
                "longitude": -180
            },
            {
                "latitude": 87.87733225547836,
                "longitude": -180
            },
            {
                "latitude": 88.0069270043834,
                "longitude": -180
            },
            {
                "latitude": 88.13631422081062,
                "longitude": -180
            },
            {
                "latitude": 88.26550725475767,
                "longitude": -180
            },
            {
                "latitude": 88.39451937956039,
                "longitude": -180
            },
            {
                "latitude": 88.5233637971444,
                "longitude": -180
            },
            {
                "latitude": 88.65205364321861,
                "longitude": -180
            },
            {
                "latitude": 88.7806019924176,
                "longitude": -180
            },
            {
                "latitude": 88.90902186339696,
                "longitude": -180
            },
            {
                "latitude": 89.03732622388175,
                "longitude": -180
            },
            {
                "latitude": 89.16552799567825,
                "longitude": -180
            },
            {
                "latitude": 89.293640059646,
                "longitude": -180
            },
            {
                "latitude": 89.42167526064162,
                "longitude": -180
            },
            {
                "latitude": 89.54964641242834,
                "longitude": -180
            },
            {
                "latitude": 89.67756630256787,
                "longitude": -180
            },
            {
                "latitude": 89.805447697283,
                "longitude": -180
            },
            {
                "latitude": 89.93330334631214,
                "longitude": -180
            },
            {
                "latitude": 90,
                "longitude": -180
            },
            {
                "latitude": 90,
                "longitude": 180
            },
            {
                "latitude": 89.87215909090881,
                "longitude": 180
            },
            {
                "latitude": 89.74431181732949,
                "longitude": 180
            },
            {
                "latitude": 89.6164454491398,
                "longitude": 180
            },
            {
                "latitude": 89.48854725089888,
                "longitude": 180
            },
            {
                "latitude": 89.36060447702006,
                "longitude": 180
            },
            {
                "latitude": 89.2326043669483,
                "longitude": 180
            },
            {
                "latitude": 89.10453414032345,
                "longitude": 180
            },
            {
                "latitude": 88.97638099212966,
                "longitude": 180
            },
            {
                "latitude": 88.84813208783008,
                "longitude": 180
            },
            {
                "latitude": 88.71977455847643,
                "longitude": 180
            },
            {
                "latitude": 88.59129549579664,
                "longitude": 180
            },
            {
                "latitude": 88.46268194725344,
                "longitude": 180
            },
            {
                "latitude": 88.33392091106938,
                "longitude": 180
            },
            {
                "latitude": 88.2049993312171,
                "longitude": 180
            },
            {
                "latitude": 88.07590409236822,
                "longitude": 180
            },
            {
                "latitude": 87.94662201479971,
                "longitude": 180
            },
            {
                "latitude": 87.81713984925088,
                "longitude": 180
            },
            {
                "latitude": 87.68744427172963,
                "longitude": 180
            },
            {
                "latitude": 87.5575218782625,
                "longitude": 180
            },
            {
                "latitude": 87.42735917958343,
                "longitude": 180
            },
            {
                "latitude": 87.29694259575992,
                "longitude": 180
            },
            {
                "latitude": 87.1662584507491,
                "longitude": 180
            },
            {
                "latitude": 87.03529296688193,
                "longitude": 180
            },
            {
                "latitude": 86.90403225926869,
                "longitude": 180
            },
            {
                "latitude": 86.77246233012377,
                "longitude": 180
            },
            {
                "latitude": 86.64056906300249,
                "longitude": 180
            },
            {
                "latitude": 86.50833821694759,
                "longitude": 180
            },
            {
                "latitude": 86.37575542053854,
                "longitude": 180
            },
            {
                "latitude": 86.24280616584049,
                "longitude": 180
            },
            {
                "latitude": 86.10947580224548,
                "longitude": 180
            },
            {
                "latitude": 85.97574953020343,
                "longitude": 180
            },
            {
                "latitude": 85.84161239483505,
                "longitude": 180
            },
            {
                "latitude": 85.7070492794228,
                "longitude": 180
            },
            {
                "latitude": 85.57204489877324,
                "longitude": 180
            },
            {
                "latitude": 85.4365837924456,
                "longitude": 180
            },
            {
                "latitude": 85.30065031784005,
                "longitude": 180
            },
            {
                "latitude": 85.16422864313981,
                "longitude": 180
            },
            {
                "latitude": 85.02730274010058,
                "longitude": 180
            },
            {
                "latitude": 84.88985637668107,
                "longitude": 180
            },
            {
                "latitude": 84.7518731095069,
                "longitude": 180
            },
            {
                "latitude": 84.61333627616263,
                "longitude": 180
            },
            {
                "latitude": 84.47422898730257,
                "longitude": 180
            },
            {
                "latitude": 84.33453411857462,
                "longitude": 180
            },
            {
                "latitude": 84.19423430234929,
                "longitude": 180
            },
            {
                "latitude": 84.05331191924462,
                "longitude": 180
            },
            {
                "latitude": 83.91174908944046,
                "longitude": 180
            },
            {
                "latitude": 83.76952766377306,
                "longitude": 180
            },
            {
                "latitude": 83.62662921460064,
                "longitude": 180
            },
            {
                "latitude": 83.48303502643166,
                "longitude": 180
            },
            {
                "latitude": 83.33872608630637,
                "longitude": 180
            },
            {
                "latitude": 83.19368307392106,
                "longitude": 180
            },
            {
                "latitude": 83.0478863514866,
                "longitude": 180
            },
            {
                "latitude": 82.90131595330878,
                "longitude": 180
            },
            {
                "latitude": 82.75395157508196,
                "longitude": 180
            },
            {
                "latitude": 82.60577256288295,
                "longitude": 180
            },
            {
                "latitude": 82.45675790185462,
                "longitude": 180
            },
            {
                "latitude": 82.306886204567,
                "longitude": 180
            },
            {
                "latitude": 82.1561356990436,
                "longitude": 180
            },
            {
                "latitude": 82.00448421643958,
                "longitude": 180
            },
            {
                "latitude": 81.85190917835924,
                "longitude": 180
            },
            {
                "latitude": 81.69838758379788,
                "longitude": 180
            },
            {
                "latitude": 81.54389599569521,
                "longitude": 180
            },
            {
                "latitude": 81.38841052708345,
                "longitude": 180
            },
            {
                "latitude": 81.23190682681651,
                "longitude": 180
            },
            {
                "latitude": 81.0743600648631,
                "longitude": 180
            },
            {
                "latitude": 80.91574491714731,
                "longitude": 180
            },
            {
                "latitude": 80.7560355499196,
                "longitude": 180
            },
            {
                "latitude": 80.59520560364027,
                "longitude": 180
            },
            {
                "latitude": 80.43322817635615,
                "longitude": 180
            },
            {
                "latitude": 80.27007580655234,
                "longitude": 180
            },
            {
                "latitude": 80.10572045545752,
                "longitude": 180
            },
            {
                "latitude": 79.94013348878327,
                "longitude": 180
            },
            {
                "latitude": 79.7732856578747,
                "longitude": 180
            },
            {
                "latitude": 79.60514708025077,
                "longitude": 180
            },
            {
                "latitude": 79.43568721951023,
                "longitude": 180
            },
            {
                "latitude": 79.26487486457944,
                "longitude": 180
            },
            {
                "latitude": 79.09267810827666,
                "longitude": 180
            },
            {
                "latitude": 78.91906432516674,
                "longitude": 180
            },
            {
                "latitude": 78.74400014867915,
                "longitude": 180
            },
            {
                "latitude": 78.56745144746101,
                "longitude": 180
            },
            {
                "latitude": 78.3893833009359,
                "longitude": 180
            },
            {
                "latitude": 78.20975997403845,
                "longitude": 180
            },
            {
                "latitude": 78.0285448910927,
                "longitude": 180
            },
            {
                "latitude": 77.84570060880169,
                "longitude": 180
            },
            {
                "latitude": 77.66118878831477,
                "longitude": 180
            },
            {
                "latitude": 77.47497016633683,
                "longitude": 180
            },
            {
                "latitude": 77.2870045252433,
                "longitude": 180
            },
            {
                "latitude": 77.09725066216313,
                "longitude": 180
            },
            {
                "latitude": 76.9056663569904,
                "longitude": 180
            },
            {
                "latitude": 76.71220833928372,
                "longitude": 180
            },
            {
                "latitude": 76.51683225401193,
                "longitude": 180
            },
            {
                "latitude": 76.31949262610165,
                "longitude": 180
            },
            {
                "latitude": 76.12014282374227,
                "longitude": 180
            },
            {
                "latitude": 75.91873502040113,
                "longitude": 180
            },
            {
                "latitude": 75.71522015550102,
                "longitude": 180
            },
            {
                "latitude": 75.50954789370948,
                "longitude": 180
            },
            {
                "latitude": 75.30166658278891,
                "longitude": 180
            },
            {
                "latitude": 75.09152320995382,
                "longitude": 180
            },
            {
                "latitude": 74.87906335668025,
                "longitude": 180
            },
            {
                "latitude": 74.66423115191073,
                "longitude": 180
            },
            {
                "latitude": 74.44696922359661,
                "longitude": 180
            },
            {
                "latitude": 74.22721864851722,
                "longitude": 180
            },
            {
                "latitude": 74.00491890031441,
                "longitude": 180
            },
            {
                "latitude": 73.78000779567883,
                "longitude": 180
            },
            {
                "latitude": 73.55242143862314,
                "longitude": 180
            },
            {
                "latitude": 73.32209416277513,
                "longitude": 180
            },
            {
                "latitude": 73.0889584716226,
                "longitude": 180
            },
            {
                "latitude": 72.85294497664098,
                "longitude": 180
            },
            {
                "latitude": 72.61398233323177,
                "longitude": 180
            },
            {
                "latitude": 72.37199717440069,
                "longitude": 180
            },
            {
                "latitude": 72.12691404210162,
                "longitude": 180
            },
            {
                "latitude": 71.8786553161727,
                "longitude": 180
            },
            {
                "latitude": 71.62714114079004,
                "longitude": 180
            },
            {
                "latitude": 71.3722893483636,
                "longitude": 180
            },
            {
                "latitude": 71.11401538080054,
                "longitude": 180
            },
            {
                "latitude": 70.85223220806122,
                "longitude": 180
            },
            {
                "latitude": 70.58685024393353,
                "longitude": 180
            },
            {
                "latitude": 70.3177772589527,
                "longitude": 180
            },
            {
                "latitude": 70.04491829039551,
                "longitude": 180
            },
            {
                "latitude": 69.76817554927966,
                "longitude": 180
            },
            {
                "latitude": 69.4874483243026,
                "longitude": 180
            },
            {
                "latitude": 69.2026328826575,
                "longitude": 180
            },
            {
                "latitude": 68.91362236766926,
                "longitude": 180
            },
            {
                "latitude": 68.62030669319853,
                "longitude": 180
            },
            {
                "latitude": 68.3225724347693,
                "longitude": 180
            },
            {
                "latitude": 68.02030271738332,
                "longitude": 180
            },
            {
                "latitude": 67.7133770999946,
                "longitude": 180
            },
            {
                "latitude": 67.40167145662869,
                "longitude": 180
            },
            {
                "latitude": 67.08505785414408,
                "longitude": 180
            },
            {
                "latitude": 66.76340442664929,
                "longitude": 180
            },
            {
                "latitude": 66.436575246606,
                "longitude": 180
            },
            {
                "latitude": 66.10443019266958,
                "longitude": 180
            },
            {
                "latitude": 65.76682481434122,
                "longitude": 180
            },
            {
                "latitude": 65.42361019353231,
                "longitude": 180
            },
            {
                "latitude": 65.0746328031723,
                "longitude": 180
            },
            {
                "latitude": 64.71973436302501,
                "longitude": 180
            },
            {
                "latitude": 64.35875169291738,
                "longitude": 180
            },
            {
                "latitude": 63.991516563628146,
                "longitude": 180
            },
            {
                "latitude": 63.61785554573361,
                "longitude": 180
            },
            {
                "latitude": 63.23758985676242,
                "longitude": 180
            },
            {
                "latitude": 62.85053520707411,
                "longitude": 180
            },
            {
                "latitude": 62.4565016449452,
                "longitude": 180
            },
            {
                "latitude": 62.05529340142515,
                "longitude": 180
            },
            {
                "latitude": 61.646708735610844,
                "longitude": 180
            },
            {
                "latitude": 61.23053978108492,
                "longitude": 180
            },
            {
                "latitude": 60.806572394372054,
                "longitude": 180
            },
            {
                "latitude": 60.37458600638518,
                "longitude": 180
            },
            {
                "latitude": 59.93435347796726,
                "longitude": 180
            },
            {
                "latitude": 59.48564096077986,
                "longitude": 180
            },
            {
                "latitude": 59.02820776495211,
                "longitude": 180
            },
            {
                "latitude": 58.56180623508028,
                "longitude": 180
            },
            {
                "latitude": 58.08618163636514,
                "longitude": 180
            },
            {
                "latitude": 57.6010720528872,
                "longitude": 180
            },
            {
                "latitude": 57.106208300255375,
                "longitude": 180
            },
            {
                "latitude": 56.60131385511945,
                "longitude": 180
            },
            {
                "latitude": 56.08610480431482,
                "longitude": 180
            },
            {
                "latitude": 55.56028981670961,
                "longitude": 180
            },
            {
                "latitude": 55.023570141149015,
                "longitude": 180
            },
            {
                "latitude": 54.47563963424275,
                "longitude": 180
            },
            {
                "latitude": 53.91618482211629,
                "longitude": 180
            },
            {
                "latitude": 53.34488500064701,
                "longitude": 180
            },
            {
                "latitude": 52.761412379131166,
                "longitude": 180
            },
            {
                "latitude": 52.16543227277518,
                "longitude": 180
            },
            {
                "latitude": 51.55660334987387,
                "longitude": 180
            },
            {
                "latitude": 50.934577940024546,
                "longitude": 180
            },
            {
                "latitude": 50.29900241022749,
                "longitude": 180
            },
            {
                "latitude": 49.64951761623158,
                "longitude": 180
            },
            {
                "latitude": 48.985759436994975,
                "longitude": 180
            },
            {
                "latitude": 48.307359400632734,
                "longitude": 180
            },
            {
                "latitude": 47.613945410707295,
                "longitude": 180
            },
            {
                "latitude": 46.90514258216808,
                "longitude": 180
            },
            {
                "latitude": 46.18057419664902,
                "longitude": 180
            },
            {
                "latitude": 45.43986278716491,
                "longitude": 180
            },
            {
                "latitude": 44.68263136248975,
                "longitude": 180
            },
            {
                "latitude": 43.9085047816228,
                "longitude": 180
            },
            {
                "latitude": 43.11711128872245,
                "longitude": 180
            },
            {
                "latitude": 42.30808421867935,
                "longitude": 180
            },
            {
                "latitude": 41.48106388306878,
                "longitude": 180
            },
            {
                "latitude": 40.635699645528234,
                "longitude": 180
            },
            {
                "latitude": 39.77165219460128,
                "longitude": 180
            },
            {
                "latitude": 38.88859602072611,
                "longitude": 180
            },
            {
                "latitude": 37.98622210227706,
                "longitude": 180
            },
            {
                "latitude": 37.064240803337746,
                "longitude": 180
            },
            {
                "latitude": 36.12238498314884,
                "longitude": 180
            },
            {
                "latitude": 35.160413313885364,
                "longitude": 180
            },
            {
                "latitude": 34.17811379954215,
                "longitude": 180
            },
            {
                "latitude": 33.17530748421364,
                "longitude": 180
            },
            {
                "latitude": 32.1518523329345,
                "longitude": 180
            },
            {
                "latitude": 31.107647262509595,
                "longitude": 180
            },
            {
                "latitude": 30.04263629343538,
                "longitude": 180
            },
            {
                "latitude": 28.956812787167916,
                "longitude": 180
            },
            {
                "latitude": 27.850223725718017,
                "longitude": 180
            },
            {
                "latitude": 26.72297398299459,
                "longitude": 180
            },
            {
                "latitude": 25.575230529653833,
                "longitude": 180
            },
            {
                "latitude": 24.407226505672618,
                "longitude": 180
            },
            {
                "latitude": 23.219265087726086,
                "longitude": 180
            },
            {
                "latitude": 22.01172307203021,
                "longitude": 180
            },
            {
                "latitude": 20.785054087965914,
                "longitude": 180
            },
            {
                "latitude": 19.539791353917234,
                "longitude": 180
            },
            {
                "latitude": 18.276549884728052,
                "longitude": 180
            },
            {
                "latitude": 16.99602806039949,
                "longitude": 180
            },
            {
                "latitude": 15.699008468476391,
                "longitude": 180
            },
            {
                "latitude": 14.3863579383088,
                "longitude": 180
            },
            {
                "latitude": 13.059026694246432,
                "longitude": 180
            },
            {
                "latitude": 11.71804656693688,
                "longitude": 180
            },
            {
                "latitude": 10.36452821722244,
                "longitude": 180
            },
            {
                "latitude": 8.999657345473533,
                "longitude": 180
            },
            {
                "latitude": 7.624689880194082,
                "longitude": 180
            },
            {
                "latitude": 6.240946162843566,
                "longitude": 180
            },
            {
                "latitude": 4.84980417032998,
                "longitude": 180
            },
            {
                "latitude": 3.452691841683219,
                "longitude": 180
            },
            {
                "latitude": 2.051078600052428,
                "longitude": 180
            },
            {
                "latitude": 0.6464661843599931,
                "longitude": 180
            },
            {
                "latitude": -0.7596210743399123,
                "longitude": 180
            },
            {
                "latitude": -2.1656463794737753,
                "longitude": 180
            },
            {
                "latitude": -3.5700708332125983,
                "longitude": 180
            },
            {
                "latitude": -4.971363865008552,
                "longitude": 180
            },
            {
                "latitude": -6.368013548331728,
                "longitude": 180
            },
            {
                "latitude": -7.7585366323646765,
                "longitude": 180
            },
            {
                "latitude": -9.14148812365425,
                "longitude": 180
            },
            {
                "latitude": -10.515470265987595,
                "longitude": 180
            },
            {
                "latitude": -11.87914078442232,
                "longitude": 180
            },
            {
                "latitude": -13.231220280632062,
                "longitude": 180
            },
            {
                "latitude": -14.57049869055246,
                "longitude": 180
            },
            {
                "latitude": -15.89584074068001,
                "longitude": 180
            },
            {
                "latitude": -17.2061903652194,
                "longitude": 180
            },
            {
                "latitude": -18.500574071581664,
                "longitude": 180
            },
            {
                "latitude": -19.778103265594403,
                "longitude": 180
            },
            {
                "latitude": -21.03797556943246,
                "longitude": 180
            },
            {
                "latitude": -22.279475184124994,
                "longitude": 180
            },
            {
                "latitude": -23.50197236414075,
                "longitude": 180
            },
            {
                "latitude": -24.704922083784904,
                "longitude": 180
            },
            {
                "latitude": -25.8878619839191,
                "longitude": 180
            },
            {
                "latitude": -27.05040969295606,
                "longitude": 180
            },
            {
                "latitude": -28.192259618422273,
                "longitude": 180
            },
            {
                "latitude": -29.313179304958997,
                "longitude": 180
            },
            {
                "latitude": -30.413005451842185,
                "longitude": 180
            },
            {
                "latitude": -31.49163967837368,
                "longitude": 180
            },
            {
                "latitude": -32.549044119266284,
                "longitude": 180
            },
            {
                "latitude": -33.5852369248357,
                "longitude": 180
            },
            {
                "latitude": -34.60028773281166,
                "longitude": 180
            },
            {
                "latitude": -35.59431317023683,
                "longitude": 180
            },
            {
                "latitude": -36.56747243553039,
                "longitude": 180
            },
            {
                "latitude": -37.51996300259944,
                "longitude": 180
            },
            {
                "latitude": -38.4520164810744,
                "longitude": 180
            },
            {
                "latitude": -39.36389465946872,
                "longitude": 180
            },
            {
                "latitude": -40.2558857514124,
                "longitude": 180
            },
            {
                "latitude": -41.128300859143984,
                "longitude": 180
            },
            {
                "latitude": -41.981470663188624,
                "longitude": 180
            },
            {
                "latitude": -42.81574234260099,
                "longitude": 180
            },
            {
                "latitude": -43.631476726285015,
                "longitude": 180
            },
            {
                "latitude": -44.42904567268543,
                "longitude": 180
            },
            {
                "latitude": -45.208829672522114,
                "longitude": 180
            },
            {
                "latitude": -45.97121566716076,
                "longitude": 180
            },
            {
                "latitude": -46.71659507361627,
                "longitude": 180
            },
            {
                "latitude": -47.445362006015145,
                "longitude": 180
            },
            {
                "latitude": -48.15791168253931,
                "longitude": 180
            },
            {
                "latitude": -48.85463900638282,
                "longitude": 180
            },
            {
                "latitude": -49.53593730902352,
                "longitude": 180
            },
            {
                "latitude": -50.20219724409761,
                "longitude": 180
            },
            {
                "latitude": -50.85380582032584,
                "longitude": 180
            },
            {
                "latitude": -51.49114556223569,
                "longitude": 180
            },
            {
                "latitude": -52.11459378782824,
                "longitude": 180
            },
            {
                "latitude": -52.724521992816975,
                "longitude": 180
            },
            {
                "latitude": -53.3212953316014,
                "longitude": 180
            },
            {
                "latitude": -53.905272185707055,
                "longitude": 180
            },
            {
                "latitude": -54.47680381101361,
                "longitude": 180
            },
            {
                "latitude": -55.036234055685256,
                "longitude": 180
            },
            {
                "latitude": -55.58389914130909,
                "longitude": 180
            },
            {
                "latitude": -56.12012750032394,
                "longitude": 180
            },
            {
                "latitude": -56.64523966338031,
                "longitude": 180
            },
            {
                "latitude": -57.15954819080773,
                "longitude": 180
            },
            {
                "latitude": -57.663357642874274,
                "longitude": 180
            },
            {
                "latitude": -58.15696458400238,
                "longitude": 180
            },
            {
                "latitude": -58.64065761655617,
                "longitude": 180
            },
            {
                "latitude": -59.11471744023488,
                "longitude": 180
            },
            {
                "latitude": -59.57941693349715,
                "longitude": 180
            },
            {
                "latitude": -60.035021253801176,
                "longitude": 180
            },
            {
                "latitude": -60.48178795377829,
                "longitude": 180
            },
            {
                "latitude": -60.91996711076236,
                "longitude": 180
            },
            {
                "latitude": -61.349801467375045,
                "longitude": 180
            },
            {
                "latitude": -61.77152658112307,
                "longitude": 180
            },
            {
                "latitude": -62.185370981193344,
                "longitude": 180
            },
            {
                "latitude": -62.59155633084296,
                "longitude": 180
            },
            {
                "latitude": -62.99029759397027,
                "longitude": 180
            },
            {
                "latitude": -63.381803204625164,
                "longitude": 180
            },
            {
                "latitude": -63.766275238371406,
                "longitude": 180
            },
            {
                "latitude": -64.14390958455292,
                "longitude": 180
            },
            {
                "latitude": -64.5148961186403,
                "longitude": 180
            },
            {
                "latitude": -64.87941887394655,
                "longitude": 180
            },
            {
                "latitude": -65.23765621209967,
                "longitude": 180
            },
            {
                "latitude": -65.58978099175029,
                "longitude": 180
            },
            {
                "latitude": -65.93596073507045,
                "longitude": 180
            },
            {
                "latitude": -66.27635779167169,
                "longitude": 180
            },
            {
                "latitude": -66.61112949963147,
                "longitude": 180
            },
            {
                "latitude": -66.94042834337401,
                "longitude": 180
            },
            {
                "latitude": -67.26440210819872,
                "longitude": 180
            },
            {
                "latitude": -67.58319403129401,
                "longitude": 180
            },
            {
                "latitude": -67.89694294911065,
                "longitude": 180
            },
            {
                "latitude": -68.20578344100313,
                "longitude": 180
            },
            {
                "latitude": -68.5098459690753,
                "longitude": 180
            },
            {
                "latitude": -68.80925701419237,
                "longitude": 180
            },
            {
                "latitude": -69.10413920814317,
                "longitude": 180
            },
            {
                "latitude": -69.3946114619548,
                "longitude": 180
            },
            {
                "latitude": -69.6807890903785,
                "longitude": 180
            },
            {
                "latitude": -69.9627839325791,
                "longitude": 180
            },
            {
                "latitude": -70.24070446907243,
                "longitude": 180
            },
            {
                "latitude": -70.51465593496454,
                "longitude": 180
            },
            {
                "latitude": -70.78474042955486,
                "longitude": 180
            },
            {
                "latitude": -71.05105702237297,
                "longitude": 180
            },
            {
                "latitude": -71.31370185572268,
                "longitude": 180
            },
            {
                "latitude": -71.57276824381339,
                "longitude": 180
            },
            {
                "latitude": -71.8283467685603,
                "longitude": 180
            },
            {
                "latitude": -72.08052537213939,
                "longitude": 180
            },
            {
                "latitude": -72.32938944638308,
                "longitude": 180
            },
            {
                "latitude": -72.57502191910537,
                "longitude": 180
            },
            {
                "latitude": -72.81750333744516,
                "longitude": 180
            },
            {
                "latitude": -73.05691194831597,
                "longitude": 180
            },
            {
                "latitude": -73.29332377605107,
                "longitude": 180
            },
            {
                "latitude": -73.52681269733226,
                "longitude": 180
            },
            {
                "latitude": -73.75745051348873,
                "longitude": 180
            },
            {
                "latitude": -73.98530702025224,
                "longitude": 180
            },
            {
                "latitude": -74.21045007505296,
                "longitude": 180
            },
            {
                "latitude": -74.43294566193907,
                "longitude": 180
            },
            {
                "latitude": -74.65285795420101,
                "longitude": 180
            },
            {
                "latitude": -74.87024937478007,
                "longitude": 180
            },
            {
                "latitude": -75.08518065453862,
                "longitude": 180
            },
            {
                "latitude": -75.29771088846738,
                "longitude": 180
            },
            {
                "latitude": -75.50789758990365,
                "longitude": 180
            },
            {
                "latitude": -75.71579674283119,
                "longitude": 180
            },
            {
                "latitude": -75.92146285233183,
                "longitude": 180
            },
            {
                "latitude": -76.12494899325532,
                "longitude": 180
            },
            {
                "latitude": -76.32630685717328,
                "longitude": 180
            },
            {
                "latitude": -76.52558679767965,
                "longitude": 180
            },
            {
                "latitude": -76.72283787409926,
                "longitude": 180
            },
            {
                "latitude": -76.91810789366299,
                "longitude": 180
            },
            {
                "latitude": -77.11144345220704,
                "longitude": 180
            },
            {
                "latitude": -77.30288997345092,
                "longitude": 180
            },
            {
                "latitude": -77.4924917469077,
                "longitude": 180
            },
            {
                "latitude": -77.68029196447736,
                "longitude": 180
            },
            {
                "latitude": -77.86633275577304,
                "longitude": 180
            },
            {
                "latitude": -78.05065522222792,
                "longitude": 180
            },
            {
                "latitude": -78.23329947002797,
                "longitude": 180
            },
            {
                "latitude": -78.41430464191596,
                "longitude": 180
            },
            {
                "latitude": -78.5937089479081,
                "longitude": 180
            },
            {
                "latitude": -78.7715496949657,
                "longitude": 180
            },
            {
                "latitude": -78.94786331565982,
                "longitude": 180
            },
            {
                "latitude": -79.12268539586846,
                "longitude": 180
            },
            {
                "latitude": -79.29605070154199,
                "longitude": 180
            },
            {
                "latitude": -79.46799320457191,
                "longitude": 180
            },
            {
                "latitude": -79.63854610779778,
                "longitude": 180
            },
            {
                "latitude": -79.80774186918384,
                "longitude": 180
            },
            {
                "latitude": -79.97561222519742,
                "longitude": 180
            },
            {
                "latitude": -80.14218821341883,
                "longitude": 180
            },
            {
                "latitude": -80.30750019441224,
                "longitude": 180
            },
            {
                "latitude": -80.47157787288474,
                "longitude": 180
            },
            {
                "latitude": -80.63445031816144,
                "longitude": 180
            },
            {
                "latitude": -80.79614598400116,
                "longitude": 180
            },
            {
                "latitude": -80.95669272777872,
                "longitude": 180
            },
            {
                "latitude": -81.11611782905709,
                "longitude": 180
            },
            {
                "latitude": -81.27444800757212,
                "longitude": 180
            },
            {
                "latitude": -81.43170944065294,
                "longitude": 180
            },
            {
                "latitude": -81.58792778009781,
                "longitude": 180
            },
            {
                "latitude": -81.74312816852755,
                "longitude": 180
            },
            {
                "latitude": -81.89733525523452,
                "longitude": 180
            },
            {
                "latitude": -82.05057321154763,
                "longitude": 180
            },
            {
                "latitude": -82.20286574573018,
                "longitude": 180
            },
            {
                "latitude": -82.35423611742937,
                "longitude": 180
            },
            {
                "latitude": -82.50470715169295,
                "longitude": 180
            },
            {
                "latitude": -82.65430125257073,
                "longitude": 180
            },
            {
                "latitude": -82.80304041631533,
                "longitude": 180
            },
            {
                "latitude": -82.95094624419777,
                "longitude": 180
            },
            {
                "latitude": -83.09803995495255,
                "longitude": 180
            },
            {
                "latitude": -83.24434239686572,
                "longitude": 180
            },
            {
                "latitude": -83.38987405951963,
                "longitude": 180
            },
            {
                "latitude": -83.53465508520738,
                "longitude": 180
            },
            {
                "latitude": -83.67870528002938,
                "longitude": 180
            },
            {
                "latitude": -83.82204412468369,
                "longitude": 180
            },
            {
                "latitude": -83.96469078496271,
                "longitude": 180
            },
            {
                "latitude": -84.10666412196608,
                "longitude": 180
            },
            {
                "latitude": -84.24798270204165,
                "longitude": 180
            },
            {
                "latitude": -84.38866480646448,
                "longitude": 180
            },
            {
                "latitude": -84.52872844086392,
                "longitude": 180
            },
            {
                "latitude": -84.6681913444087,
                "longitude": 180
            },
            {
                "latitude": -84.80707099875865,
                "longitude": 180
            },
            {
                "latitude": -84.94538463679359,
                "longitude": 180
            },
            {
                "latitude": -85.08314925112602,
                "longitude": 180
            },
            {
                "latitude": -85.22038160240845,
                "longitude": 180
            },
            {
                "latitude": -85.35709822744141,
                "longitude": 180
            },
            {
                "latitude": -85.49331544709136,
                "longitude": 180
            },
            {
                "latitude": -85.62904937402531,
                "longitude": 180
            },
            {
                "latitude": -85.76431592027079,
                "longitude": 180
            },
            {
                "latitude": -85.89913080460634,
                "longitude": 180
            },
            {
                "latitude": -86.0335095597919,
                "longitude": 180
            },
            {
                "latitude": -86.1674675396432,
                "longitude": 180
            },
            {
                "latitude": -86.30101992595951,
                "longitude": 180
            },
            {
                "latitude": -86.43418173530802,
                "longitude": 180
            },
            {
                "latitude": -86.56696782567414,
                "longitude": 180
            },
            {
                "latitude": -86.69939290298068,
                "longitude": 180
            },
            {
                "latitude": -86.8314715274841,
                "longitude": 180
            },
            {
                "latitude": -86.9632181200527,
                "longitude": 180
            },
            {
                "latitude": -87.09464696833092,
                "longitude": 180
            },
            {
                "latitude": -87.22577223279698,
                "longitude": 180
            },
            {
                "latitude": -87.35660795271913,
                "longitude": 180
            },
            {
                "latitude": -87.48716805201276,
                "longitude": 180
            },
            {
                "latitude": -87.61746634500768,
                "longitude": 180
            },
            {
                "latitude": -87.74751654212585,
                "longitude": 180
            },
            {
                "latitude": -87.87733225547836,
                "longitude": 180
            },
            {
                "latitude": -88.0069270043834,
                "longitude": 180
            },
            {
                "latitude": -88.13631422081062,
                "longitude": 180
            },
            {
                "latitude": -88.26550725475767,
                "longitude": 180
            },
            {
                "latitude": -88.39451937956039,
                "longitude": 180
            },
            {
                "latitude": -88.5233637971444,
                "longitude": 180
            },
            {
                "latitude": -88.65205364321861,
                "longitude": 180
            },
            {
                "latitude": -88.7806019924176,
                "longitude": 180
            },
            {
                "latitude": -88.90902186339696,
                "longitude": 180
            },
            {
                "latitude": -89.03732622388175,
                "longitude": 180
            },
            {
                "latitude": -89.16552799567825,
                "longitude": 180
            },
            {
                "latitude": -89.293640059646,
                "longitude": 180
            },
            {
                "latitude": -89.42167526064162,
                "longitude": 180
            },
            {
                "latitude": -89.54964641242834,
                "longitude": 180
            },
            {
                "latitude": -89.67756630256787,
                "longitude": 180
            },
            {
                "latitude": -89.805447697283,
                "longitude": 180
            },
            {
                "latitude": -89.93330334631214,
                "longitude": 180
            },
            {
                "latitude": -90,
                "longitude": 180
            },
            {
                "latitude": -90,
                "longitude": -180
            }
        ]
    ];
    var fullSphereSectorInput = transformInputData(fullSphereSectorRawInput);
    var fullSphereSectorRawOutput = [
        {
            "polygons": [
                [
                    {
                        "latitude": -90,
                        "longitude": -180
                    },
                    {
                        "latitude": -89.87215909090881,
                        "longitude": -180
                    },
                    {
                        "latitude": -89.74431181732949,
                        "longitude": -180
                    },
                    {
                        "latitude": -89.6164454491398,
                        "longitude": -180
                    },
                    {
                        "latitude": -89.48854725089888,
                        "longitude": -180
                    },
                    {
                        "latitude": -89.36060447702006,
                        "longitude": -180
                    },
                    {
                        "latitude": -89.2326043669483,
                        "longitude": -180
                    },
                    {
                        "latitude": -89.10453414032345,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.97638099212966,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.84813208783008,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.71977455847643,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.59129549579664,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.46268194725344,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.33392091106938,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.2049993312171,
                        "longitude": -180
                    },
                    {
                        "latitude": -88.07590409236822,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.94662201479971,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.81713984925088,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.68744427172963,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.5575218782625,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.42735917958343,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.29694259575992,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.1662584507491,
                        "longitude": -180
                    },
                    {
                        "latitude": -87.03529296688193,
                        "longitude": -180
                    },
                    {
                        "latitude": -86.90403225926869,
                        "longitude": -180
                    },
                    {
                        "latitude": -86.77246233012377,
                        "longitude": -180
                    },
                    {
                        "latitude": -86.64056906300249,
                        "longitude": -180
                    },
                    {
                        "latitude": -86.50833821694759,
                        "longitude": -180
                    },
                    {
                        "latitude": -86.37575542053854,
                        "longitude": -180
                    },
                    {
                        "latitude": -86.24280616584049,
                        "longitude": -180
                    },
                    {
                        "latitude": -86.10947580224548,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.97574953020343,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.84161239483505,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.7070492794228,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.57204489877324,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.4365837924456,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.30065031784005,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.16422864313981,
                        "longitude": -180
                    },
                    {
                        "latitude": -85.02730274010058,
                        "longitude": -180
                    },
                    {
                        "latitude": -84.88985637668107,
                        "longitude": -180
                    },
                    {
                        "latitude": -84.7518731095069,
                        "longitude": -180
                    },
                    {
                        "latitude": -84.61333627616263,
                        "longitude": -180
                    },
                    {
                        "latitude": -84.47422898730257,
                        "longitude": -180
                    },
                    {
                        "latitude": -84.33453411857462,
                        "longitude": -180
                    },
                    {
                        "latitude": -84.19423430234929,
                        "longitude": -180
                    },
                    {
                        "latitude": -84.05331191924462,
                        "longitude": -180
                    },
                    {
                        "latitude": -83.91174908944046,
                        "longitude": -180
                    },
                    {
                        "latitude": -83.76952766377306,
                        "longitude": -180
                    },
                    {
                        "latitude": -83.62662921460064,
                        "longitude": -180
                    },
                    {
                        "latitude": -83.48303502643166,
                        "longitude": -180
                    },
                    {
                        "latitude": -83.33872608630637,
                        "longitude": -180
                    },
                    {
                        "latitude": -83.19368307392106,
                        "longitude": -180
                    },
                    {
                        "latitude": -83.0478863514866,
                        "longitude": -180
                    },
                    {
                        "latitude": -82.90131595330878,
                        "longitude": -180
                    },
                    {
                        "latitude": -82.75395157508196,
                        "longitude": -180
                    },
                    {
                        "latitude": -82.60577256288295,
                        "longitude": -180
                    },
                    {
                        "latitude": -82.45675790185462,
                        "longitude": -180
                    },
                    {
                        "latitude": -82.306886204567,
                        "longitude": -180
                    },
                    {
                        "latitude": -82.1561356990436,
                        "longitude": -180
                    },
                    {
                        "latitude": -82.00448421643958,
                        "longitude": -180
                    },
                    {
                        "latitude": -81.85190917835924,
                        "longitude": -180
                    },
                    {
                        "latitude": -81.69838758379788,
                        "longitude": -180
                    },
                    {
                        "latitude": -81.54389599569521,
                        "longitude": -180
                    },
                    {
                        "latitude": -81.38841052708345,
                        "longitude": -180
                    },
                    {
                        "latitude": -81.23190682681651,
                        "longitude": -180
                    },
                    {
                        "latitude": -81.0743600648631,
                        "longitude": -180
                    },
                    {
                        "latitude": -80.91574491714731,
                        "longitude": -180
                    },
                    {
                        "latitude": -80.7560355499196,
                        "longitude": -180
                    },
                    {
                        "latitude": -80.59520560364027,
                        "longitude": -180
                    },
                    {
                        "latitude": -80.43322817635615,
                        "longitude": -180
                    },
                    {
                        "latitude": -80.27007580655234,
                        "longitude": -180
                    },
                    {
                        "latitude": -80.10572045545752,
                        "longitude": -180
                    },
                    {
                        "latitude": -79.94013348878327,
                        "longitude": -180
                    },
                    {
                        "latitude": -79.7732856578747,
                        "longitude": -180
                    },
                    {
                        "latitude": -79.60514708025077,
                        "longitude": -180
                    },
                    {
                        "latitude": -79.43568721951023,
                        "longitude": -180
                    },
                    {
                        "latitude": -79.26487486457944,
                        "longitude": -180
                    },
                    {
                        "latitude": -79.09267810827666,
                        "longitude": -180
                    },
                    {
                        "latitude": -78.91906432516674,
                        "longitude": -180
                    },
                    {
                        "latitude": -78.74400014867915,
                        "longitude": -180
                    },
                    {
                        "latitude": -78.56745144746101,
                        "longitude": -180
                    },
                    {
                        "latitude": -78.3893833009359,
                        "longitude": -180
                    },
                    {
                        "latitude": -78.20975997403845,
                        "longitude": -180
                    },
                    {
                        "latitude": -78.0285448910927,
                        "longitude": -180
                    },
                    {
                        "latitude": -77.84570060880169,
                        "longitude": -180
                    },
                    {
                        "latitude": -77.66118878831477,
                        "longitude": -180
                    },
                    {
                        "latitude": -77.47497016633683,
                        "longitude": -180
                    },
                    {
                        "latitude": -77.2870045252433,
                        "longitude": -180
                    },
                    {
                        "latitude": -77.09725066216313,
                        "longitude": -180
                    },
                    {
                        "latitude": -76.9056663569904,
                        "longitude": -180
                    },
                    {
                        "latitude": -76.71220833928372,
                        "longitude": -180
                    },
                    {
                        "latitude": -76.51683225401193,
                        "longitude": -180
                    },
                    {
                        "latitude": -76.31949262610165,
                        "longitude": -180
                    },
                    {
                        "latitude": -76.12014282374227,
                        "longitude": -180
                    },
                    {
                        "latitude": -75.91873502040113,
                        "longitude": -180
                    },
                    {
                        "latitude": -75.71522015550102,
                        "longitude": -180
                    },
                    {
                        "latitude": -75.50954789370948,
                        "longitude": -180
                    },
                    {
                        "latitude": -75.30166658278891,
                        "longitude": -180
                    },
                    {
                        "latitude": -75.09152320995382,
                        "longitude": -180
                    },
                    {
                        "latitude": -74.87906335668025,
                        "longitude": -180
                    },
                    {
                        "latitude": -74.66423115191073,
                        "longitude": -180
                    },
                    {
                        "latitude": -74.44696922359661,
                        "longitude": -180
                    },
                    {
                        "latitude": -74.22721864851722,
                        "longitude": -180
                    },
                    {
                        "latitude": -74.00491890031441,
                        "longitude": -180
                    },
                    {
                        "latitude": -73.78000779567883,
                        "longitude": -180
                    },
                    {
                        "latitude": -73.55242143862314,
                        "longitude": -180
                    },
                    {
                        "latitude": -73.32209416277513,
                        "longitude": -180
                    },
                    {
                        "latitude": -73.0889584716226,
                        "longitude": -180
                    },
                    {
                        "latitude": -72.85294497664098,
                        "longitude": -180
                    },
                    {
                        "latitude": -72.61398233323177,
                        "longitude": -180
                    },
                    {
                        "latitude": -72.37199717440069,
                        "longitude": -180
                    },
                    {
                        "latitude": -72.12691404210162,
                        "longitude": -180
                    },
                    {
                        "latitude": -71.8786553161727,
                        "longitude": -180
                    },
                    {
                        "latitude": -71.62714114079004,
                        "longitude": -180
                    },
                    {
                        "latitude": -71.3722893483636,
                        "longitude": -180
                    },
                    {
                        "latitude": -71.11401538080054,
                        "longitude": -180
                    },
                    {
                        "latitude": -70.85223220806122,
                        "longitude": -180
                    },
                    {
                        "latitude": -70.58685024393353,
                        "longitude": -180
                    },
                    {
                        "latitude": -70.3177772589527,
                        "longitude": -180
                    },
                    {
                        "latitude": -70.04491829039551,
                        "longitude": -180
                    },
                    {
                        "latitude": -69.76817554927966,
                        "longitude": -180
                    },
                    {
                        "latitude": -69.4874483243026,
                        "longitude": -180
                    },
                    {
                        "latitude": -69.2026328826575,
                        "longitude": -180
                    },
                    {
                        "latitude": -68.91362236766926,
                        "longitude": -180
                    },
                    {
                        "latitude": -68.62030669319853,
                        "longitude": -180
                    },
                    {
                        "latitude": -68.3225724347693,
                        "longitude": -180
                    },
                    {
                        "latitude": -68.02030271738332,
                        "longitude": -180
                    },
                    {
                        "latitude": -67.7133770999946,
                        "longitude": -180
                    },
                    {
                        "latitude": -67.40167145662869,
                        "longitude": -180
                    },
                    {
                        "latitude": -67.08505785414408,
                        "longitude": -180
                    },
                    {
                        "latitude": -66.76340442664929,
                        "longitude": -180
                    },
                    {
                        "latitude": -66.436575246606,
                        "longitude": -180
                    },
                    {
                        "latitude": -66.10443019266958,
                        "longitude": -180
                    },
                    {
                        "latitude": -65.76682481434122,
                        "longitude": -180
                    },
                    {
                        "latitude": -65.42361019353231,
                        "longitude": -180
                    },
                    {
                        "latitude": -65.0746328031723,
                        "longitude": -180
                    },
                    {
                        "latitude": -64.71973436302501,
                        "longitude": -180
                    },
                    {
                        "latitude": -64.35875169291738,
                        "longitude": -180
                    },
                    {
                        "latitude": -63.991516563628146,
                        "longitude": -180
                    },
                    {
                        "latitude": -63.61785554573361,
                        "longitude": -180
                    },
                    {
                        "latitude": -63.23758985676242,
                        "longitude": -180
                    },
                    {
                        "latitude": -62.85053520707411,
                        "longitude": -180
                    },
                    {
                        "latitude": -62.4565016449452,
                        "longitude": -180
                    },
                    {
                        "latitude": -62.05529340142515,
                        "longitude": -180
                    },
                    {
                        "latitude": -61.646708735610844,
                        "longitude": -180
                    },
                    {
                        "latitude": -61.23053978108492,
                        "longitude": -180
                    },
                    {
                        "latitude": -60.806572394372054,
                        "longitude": -180
                    },
                    {
                        "latitude": -60.37458600638518,
                        "longitude": -180
                    },
                    {
                        "latitude": -59.93435347796726,
                        "longitude": -180
                    },
                    {
                        "latitude": -59.48564096077986,
                        "longitude": -180
                    },
                    {
                        "latitude": -59.02820776495211,
                        "longitude": -180
                    },
                    {
                        "latitude": -58.56180623508028,
                        "longitude": -180
                    },
                    {
                        "latitude": -58.08618163636514,
                        "longitude": -180
                    },
                    {
                        "latitude": -57.6010720528872,
                        "longitude": -180
                    },
                    {
                        "latitude": -57.106208300255375,
                        "longitude": -180
                    },
                    {
                        "latitude": -56.60131385511945,
                        "longitude": -180
                    },
                    {
                        "latitude": -56.08610480431482,
                        "longitude": -180
                    },
                    {
                        "latitude": -55.56028981670961,
                        "longitude": -180
                    },
                    {
                        "latitude": -55.023570141149015,
                        "longitude": -180
                    },
                    {
                        "latitude": -54.47563963424275,
                        "longitude": -180
                    },
                    {
                        "latitude": -53.91618482211629,
                        "longitude": -180
                    },
                    {
                        "latitude": -53.34488500064701,
                        "longitude": -180
                    },
                    {
                        "latitude": -52.761412379131166,
                        "longitude": -180
                    },
                    {
                        "latitude": -52.16543227277518,
                        "longitude": -180
                    },
                    {
                        "latitude": -51.55660334987387,
                        "longitude": -180
                    },
                    {
                        "latitude": -50.934577940024546,
                        "longitude": -180
                    },
                    {
                        "latitude": -50.29900241022749,
                        "longitude": -180
                    },
                    {
                        "latitude": -49.64951761623158,
                        "longitude": -180
                    },
                    {
                        "latitude": -48.985759436994975,
                        "longitude": -180
                    },
                    {
                        "latitude": -48.307359400632734,
                        "longitude": -180
                    },
                    {
                        "latitude": -47.613945410707295,
                        "longitude": -180
                    },
                    {
                        "latitude": -46.90514258216808,
                        "longitude": -180
                    },
                    {
                        "latitude": -46.18057419664902,
                        "longitude": -180
                    },
                    {
                        "latitude": -45.43986278716491,
                        "longitude": -180
                    },
                    {
                        "latitude": -44.68263136248975,
                        "longitude": -180
                    },
                    {
                        "latitude": -43.9085047816228,
                        "longitude": -180
                    },
                    {
                        "latitude": -43.11711128872245,
                        "longitude": -180
                    },
                    {
                        "latitude": -42.30808421867935,
                        "longitude": -180
                    },
                    {
                        "latitude": -41.48106388306878,
                        "longitude": -180
                    },
                    {
                        "latitude": -40.635699645528234,
                        "longitude": -180
                    },
                    {
                        "latitude": -39.77165219460128,
                        "longitude": -180
                    },
                    {
                        "latitude": -38.88859602072611,
                        "longitude": -180
                    },
                    {
                        "latitude": -37.98622210227706,
                        "longitude": -180
                    },
                    {
                        "latitude": -37.064240803337746,
                        "longitude": -180
                    },
                    {
                        "latitude": -36.12238498314884,
                        "longitude": -180
                    },
                    {
                        "latitude": -35.160413313885364,
                        "longitude": -180
                    },
                    {
                        "latitude": -34.17811379954215,
                        "longitude": -180
                    },
                    {
                        "latitude": -33.17530748421364,
                        "longitude": -180
                    },
                    {
                        "latitude": -32.1518523329345,
                        "longitude": -180
                    },
                    {
                        "latitude": -31.107647262509595,
                        "longitude": -180
                    },
                    {
                        "latitude": -30.04263629343538,
                        "longitude": -180
                    },
                    {
                        "latitude": -28.956812787167916,
                        "longitude": -180
                    },
                    {
                        "latitude": -27.850223725718017,
                        "longitude": -180
                    },
                    {
                        "latitude": -26.72297398299459,
                        "longitude": -180
                    },
                    {
                        "latitude": -25.575230529653833,
                        "longitude": -180
                    },
                    {
                        "latitude": -24.407226505672618,
                        "longitude": -180
                    },
                    {
                        "latitude": -23.219265087726086,
                        "longitude": -180
                    },
                    {
                        "latitude": -22.01172307203021,
                        "longitude": -180
                    },
                    {
                        "latitude": -20.785054087965914,
                        "longitude": -180
                    },
                    {
                        "latitude": -19.539791353917234,
                        "longitude": -180
                    },
                    {
                        "latitude": -18.276549884728052,
                        "longitude": -180
                    },
                    {
                        "latitude": -16.99602806039949,
                        "longitude": -180
                    },
                    {
                        "latitude": -15.699008468476391,
                        "longitude": -180
                    },
                    {
                        "latitude": -14.3863579383088,
                        "longitude": -180
                    },
                    {
                        "latitude": -13.059026694246432,
                        "longitude": -180
                    },
                    {
                        "latitude": -11.71804656693688,
                        "longitude": -180
                    },
                    {
                        "latitude": -10.36452821722244,
                        "longitude": -180
                    },
                    {
                        "latitude": -8.999657345473533,
                        "longitude": -180
                    },
                    {
                        "latitude": -7.624689880194082,
                        "longitude": -180
                    },
                    {
                        "latitude": -6.240946162843566,
                        "longitude": -180
                    },
                    {
                        "latitude": -4.84980417032998,
                        "longitude": -180
                    },
                    {
                        "latitude": -3.452691841683219,
                        "longitude": -180
                    },
                    {
                        "latitude": -2.051078600052428,
                        "longitude": -180
                    },
                    {
                        "latitude": -0.6464661843599931,
                        "longitude": -180
                    },
                    {
                        "latitude": 0.7596210743399123,
                        "longitude": -180
                    },
                    {
                        "latitude": 2.1656463794737753,
                        "longitude": -180
                    },
                    {
                        "latitude": 3.5700708332125983,
                        "longitude": -180
                    },
                    {
                        "latitude": 4.971363865008552,
                        "longitude": -180
                    },
                    {
                        "latitude": 6.368013548331728,
                        "longitude": -180
                    },
                    {
                        "latitude": 7.7585366323646765,
                        "longitude": -180
                    },
                    {
                        "latitude": 9.14148812365425,
                        "longitude": -180
                    },
                    {
                        "latitude": 10.515470265987595,
                        "longitude": -180
                    },
                    {
                        "latitude": 11.87914078442232,
                        "longitude": -180
                    },
                    {
                        "latitude": 13.231220280632062,
                        "longitude": -180
                    },
                    {
                        "latitude": 14.57049869055246,
                        "longitude": -180
                    },
                    {
                        "latitude": 15.89584074068001,
                        "longitude": -180
                    },
                    {
                        "latitude": 17.2061903652194,
                        "longitude": -180
                    },
                    {
                        "latitude": 18.500574071581664,
                        "longitude": -180
                    },
                    {
                        "latitude": 19.778103265594403,
                        "longitude": -180
                    },
                    {
                        "latitude": 21.03797556943246,
                        "longitude": -180
                    },
                    {
                        "latitude": 22.279475184124994,
                        "longitude": -180
                    },
                    {
                        "latitude": 23.50197236414075,
                        "longitude": -180
                    },
                    {
                        "latitude": 24.704922083784904,
                        "longitude": -180
                    },
                    {
                        "latitude": 25.8878619839191,
                        "longitude": -180
                    },
                    {
                        "latitude": 27.05040969295606,
                        "longitude": -180
                    },
                    {
                        "latitude": 28.192259618422273,
                        "longitude": -180
                    },
                    {
                        "latitude": 29.313179304958997,
                        "longitude": -180
                    },
                    {
                        "latitude": 30.413005451842185,
                        "longitude": -180
                    },
                    {
                        "latitude": 31.49163967837368,
                        "longitude": -180
                    },
                    {
                        "latitude": 32.549044119266284,
                        "longitude": -180
                    },
                    {
                        "latitude": 33.5852369248357,
                        "longitude": -180
                    },
                    {
                        "latitude": 34.60028773281166,
                        "longitude": -180
                    },
                    {
                        "latitude": 35.59431317023683,
                        "longitude": -180
                    },
                    {
                        "latitude": 36.56747243553039,
                        "longitude": -180
                    },
                    {
                        "latitude": 37.51996300259944,
                        "longitude": -180
                    },
                    {
                        "latitude": 38.4520164810744,
                        "longitude": -180
                    },
                    {
                        "latitude": 39.36389465946872,
                        "longitude": -180
                    },
                    {
                        "latitude": 40.2558857514124,
                        "longitude": -180
                    },
                    {
                        "latitude": 41.128300859143984,
                        "longitude": -180
                    },
                    {
                        "latitude": 41.981470663188624,
                        "longitude": -180
                    },
                    {
                        "latitude": 42.81574234260099,
                        "longitude": -180
                    },
                    {
                        "latitude": 43.631476726285015,
                        "longitude": -180
                    },
                    {
                        "latitude": 44.42904567268543,
                        "longitude": -180
                    },
                    {
                        "latitude": 45.208829672522114,
                        "longitude": -180
                    },
                    {
                        "latitude": 45.97121566716076,
                        "longitude": -180
                    },
                    {
                        "latitude": 46.71659507361627,
                        "longitude": -180
                    },
                    {
                        "latitude": 47.445362006015145,
                        "longitude": -180
                    },
                    {
                        "latitude": 48.15791168253931,
                        "longitude": -180
                    },
                    {
                        "latitude": 48.85463900638282,
                        "longitude": -180
                    },
                    {
                        "latitude": 49.53593730902352,
                        "longitude": -180
                    },
                    {
                        "latitude": 50.20219724409761,
                        "longitude": -180
                    },
                    {
                        "latitude": 50.85380582032584,
                        "longitude": -180
                    },
                    {
                        "latitude": 51.49114556223569,
                        "longitude": -180
                    },
                    {
                        "latitude": 52.11459378782824,
                        "longitude": -180
                    },
                    {
                        "latitude": 52.724521992816975,
                        "longitude": -180
                    },
                    {
                        "latitude": 53.3212953316014,
                        "longitude": -180
                    },
                    {
                        "latitude": 53.905272185707055,
                        "longitude": -180
                    },
                    {
                        "latitude": 54.47680381101361,
                        "longitude": -180
                    },
                    {
                        "latitude": 55.036234055685256,
                        "longitude": -180
                    },
                    {
                        "latitude": 55.58389914130909,
                        "longitude": -180
                    },
                    {
                        "latitude": 56.12012750032394,
                        "longitude": -180
                    },
                    {
                        "latitude": 56.64523966338031,
                        "longitude": -180
                    },
                    {
                        "latitude": 57.15954819080773,
                        "longitude": -180
                    },
                    {
                        "latitude": 57.663357642874274,
                        "longitude": -180
                    },
                    {
                        "latitude": 58.15696458400238,
                        "longitude": -180
                    },
                    {
                        "latitude": 58.64065761655617,
                        "longitude": -180
                    },
                    {
                        "latitude": 59.11471744023488,
                        "longitude": -180
                    },
                    {
                        "latitude": 59.57941693349715,
                        "longitude": -180
                    },
                    {
                        "latitude": 60.035021253801176,
                        "longitude": -180
                    },
                    {
                        "latitude": 60.48178795377829,
                        "longitude": -180
                    },
                    {
                        "latitude": 60.91996711076236,
                        "longitude": -180
                    },
                    {
                        "latitude": 61.349801467375045,
                        "longitude": -180
                    },
                    {
                        "latitude": 61.77152658112307,
                        "longitude": -180
                    },
                    {
                        "latitude": 62.185370981193344,
                        "longitude": -180
                    },
                    {
                        "latitude": 62.59155633084296,
                        "longitude": -180
                    },
                    {
                        "latitude": 62.99029759397027,
                        "longitude": -180
                    },
                    {
                        "latitude": 63.381803204625164,
                        "longitude": -180
                    },
                    {
                        "latitude": 63.766275238371406,
                        "longitude": -180
                    },
                    {
                        "latitude": 64.14390958455292,
                        "longitude": -180
                    },
                    {
                        "latitude": 64.5148961186403,
                        "longitude": -180
                    },
                    {
                        "latitude": 64.87941887394655,
                        "longitude": -180
                    },
                    {
                        "latitude": 65.23765621209967,
                        "longitude": -180
                    },
                    {
                        "latitude": 65.58978099175029,
                        "longitude": -180
                    },
                    {
                        "latitude": 65.93596073507045,
                        "longitude": -180
                    },
                    {
                        "latitude": 66.27635779167169,
                        "longitude": -180
                    },
                    {
                        "latitude": 66.61112949963147,
                        "longitude": -180
                    },
                    {
                        "latitude": 66.94042834337401,
                        "longitude": -180
                    },
                    {
                        "latitude": 67.26440210819872,
                        "longitude": -180
                    },
                    {
                        "latitude": 67.58319403129401,
                        "longitude": -180
                    },
                    {
                        "latitude": 67.89694294911065,
                        "longitude": -180
                    },
                    {
                        "latitude": 68.20578344100313,
                        "longitude": -180
                    },
                    {
                        "latitude": 68.5098459690753,
                        "longitude": -180
                    },
                    {
                        "latitude": 68.80925701419237,
                        "longitude": -180
                    },
                    {
                        "latitude": 69.10413920814317,
                        "longitude": -180
                    },
                    {
                        "latitude": 69.3946114619548,
                        "longitude": -180
                    },
                    {
                        "latitude": 69.6807890903785,
                        "longitude": -180
                    },
                    {
                        "latitude": 69.9627839325791,
                        "longitude": -180
                    },
                    {
                        "latitude": 70.24070446907243,
                        "longitude": -180
                    },
                    {
                        "latitude": 70.51465593496454,
                        "longitude": -180
                    },
                    {
                        "latitude": 70.78474042955486,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.05105702237297,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.31370185572268,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.57276824381339,
                        "longitude": -180
                    },
                    {
                        "latitude": 71.8283467685603,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.08052537213939,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.32938944638308,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.57502191910537,
                        "longitude": -180
                    },
                    {
                        "latitude": 72.81750333744516,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.05691194831597,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.29332377605107,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.52681269733226,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.75745051348873,
                        "longitude": -180
                    },
                    {
                        "latitude": 73.98530702025224,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.21045007505296,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.43294566193907,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.65285795420101,
                        "longitude": -180
                    },
                    {
                        "latitude": 74.87024937478007,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.08518065453862,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.29771088846738,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.50789758990365,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.71579674283119,
                        "longitude": -180
                    },
                    {
                        "latitude": 75.92146285233183,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.12494899325532,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.32630685717328,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.52558679767965,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.72283787409926,
                        "longitude": -180
                    },
                    {
                        "latitude": 76.91810789366299,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.11144345220704,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.30288997345092,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.4924917469077,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.68029196447736,
                        "longitude": -180
                    },
                    {
                        "latitude": 77.86633275577304,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.05065522222792,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.23329947002797,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.41430464191596,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.5937089479081,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.7715496949657,
                        "longitude": -180
                    },
                    {
                        "latitude": 78.94786331565982,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.12268539586846,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.29605070154199,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.46799320457191,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.63854610779778,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.80774186918384,
                        "longitude": -180
                    },
                    {
                        "latitude": 79.97561222519742,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.14218821341883,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.30750019441224,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.47157787288474,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.63445031816144,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.79614598400116,
                        "longitude": -180
                    },
                    {
                        "latitude": 80.95669272777872,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.11611782905709,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.27444800757212,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.43170944065294,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.58792778009781,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.74312816852755,
                        "longitude": -180
                    },
                    {
                        "latitude": 81.89733525523452,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.05057321154763,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.20286574573018,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.35423611742937,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.50470715169295,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.65430125257073,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.80304041631533,
                        "longitude": -180
                    },
                    {
                        "latitude": 82.95094624419777,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.09803995495255,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.24434239686572,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.38987405951963,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.53465508520738,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.67870528002938,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.82204412468369,
                        "longitude": -180
                    },
                    {
                        "latitude": 83.96469078496271,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.10666412196608,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.24798270204165,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.38866480646448,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.52872844086392,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.6681913444087,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.80707099875865,
                        "longitude": -180
                    },
                    {
                        "latitude": 84.94538463679359,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.08314925112602,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.22038160240845,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.35709822744141,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.49331544709136,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.62904937402531,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.76431592027079,
                        "longitude": -180
                    },
                    {
                        "latitude": 85.89913080460634,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.0335095597919,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.1674675396432,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.30101992595951,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.43418173530802,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.56696782567414,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.69939290298068,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.8314715274841,
                        "longitude": -180
                    },
                    {
                        "latitude": 86.9632181200527,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.09464696833092,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.22577223279698,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.35660795271913,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.48716805201276,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.61746634500768,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.74751654212585,
                        "longitude": -180
                    },
                    {
                        "latitude": 87.87733225547836,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.0069270043834,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.13631422081062,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.26550725475767,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.39451937956039,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.5233637971444,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.65205364321861,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.7806019924176,
                        "longitude": -180
                    },
                    {
                        "latitude": 88.90902186339696,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.03732622388175,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.16552799567825,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.293640059646,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.42167526064162,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.54964641242834,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.67756630256787,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.805447697283,
                        "longitude": -180
                    },
                    {
                        "latitude": 89.93330334631214,
                        "longitude": -180
                    },
                    {
                        "latitude": 90,
                        "longitude": -180
                    },
                    {
                        "latitude": 90,
                        "longitude": 180
                    },
                    {
                        "latitude": 89.87215909090881,
                        "longitude": 180
                    },
                    {
                        "latitude": 89.74431181732949,
                        "longitude": 180
                    },
                    {
                        "latitude": 89.6164454491398,
                        "longitude": 180
                    },
                    {
                        "latitude": 89.48854725089888,
                        "longitude": 180
                    },
                    {
                        "latitude": 89.36060447702006,
                        "longitude": 180
                    },
                    {
                        "latitude": 89.2326043669483,
                        "longitude": 180
                    },
                    {
                        "latitude": 89.10453414032345,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.97638099212966,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.84813208783008,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.71977455847643,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.59129549579664,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.46268194725344,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.33392091106938,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.2049993312171,
                        "longitude": 180
                    },
                    {
                        "latitude": 88.07590409236822,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.94662201479971,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.81713984925088,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.68744427172963,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.5575218782625,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.42735917958343,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.29694259575992,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.1662584507491,
                        "longitude": 180
                    },
                    {
                        "latitude": 87.03529296688193,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.90403225926869,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.77246233012377,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.64056906300249,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.50833821694759,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.37575542053854,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.24280616584049,
                        "longitude": 180
                    },
                    {
                        "latitude": 86.10947580224548,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.97574953020343,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.84161239483505,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.7070492794228,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.57204489877324,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.4365837924456,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.30065031784005,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.16422864313981,
                        "longitude": 180
                    },
                    {
                        "latitude": 85.02730274010058,
                        "longitude": 180
                    },
                    {
                        "latitude": 84.88985637668107,
                        "longitude": 180
                    },
                    {
                        "latitude": 84.7518731095069,
                        "longitude": 180
                    },
                    {
                        "latitude": 84.61333627616263,
                        "longitude": 180
                    },
                    {
                        "latitude": 84.47422898730257,
                        "longitude": 180
                    },
                    {
                        "latitude": 84.33453411857462,
                        "longitude": 180
                    },
                    {
                        "latitude": 84.19423430234929,
                        "longitude": 180
                    },
                    {
                        "latitude": 84.05331191924462,
                        "longitude": 180
                    },
                    {
                        "latitude": 83.91174908944046,
                        "longitude": 180
                    },
                    {
                        "latitude": 83.76952766377306,
                        "longitude": 180
                    },
                    {
                        "latitude": 83.62662921460064,
                        "longitude": 180
                    },
                    {
                        "latitude": 83.48303502643166,
                        "longitude": 180
                    },
                    {
                        "latitude": 83.33872608630637,
                        "longitude": 180
                    },
                    {
                        "latitude": 83.19368307392106,
                        "longitude": 180
                    },
                    {
                        "latitude": 83.0478863514866,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.90131595330878,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.75395157508196,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.60577256288295,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.45675790185462,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.306886204567,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.1561356990436,
                        "longitude": 180
                    },
                    {
                        "latitude": 82.00448421643958,
                        "longitude": 180
                    },
                    {
                        "latitude": 81.85190917835924,
                        "longitude": 180
                    },
                    {
                        "latitude": 81.69838758379788,
                        "longitude": 180
                    },
                    {
                        "latitude": 81.54389599569521,
                        "longitude": 180
                    },
                    {
                        "latitude": 81.38841052708345,
                        "longitude": 180
                    },
                    {
                        "latitude": 81.23190682681651,
                        "longitude": 180
                    },
                    {
                        "latitude": 81.0743600648631,
                        "longitude": 180
                    },
                    {
                        "latitude": 80.91574491714731,
                        "longitude": 180
                    },
                    {
                        "latitude": 80.7560355499196,
                        "longitude": 180
                    },
                    {
                        "latitude": 80.59520560364027,
                        "longitude": 180
                    },
                    {
                        "latitude": 80.43322817635615,
                        "longitude": 180
                    },
                    {
                        "latitude": 80.27007580655234,
                        "longitude": 180
                    },
                    {
                        "latitude": 80.10572045545752,
                        "longitude": 180
                    },
                    {
                        "latitude": 79.94013348878327,
                        "longitude": 180
                    },
                    {
                        "latitude": 79.7732856578747,
                        "longitude": 180
                    },
                    {
                        "latitude": 79.60514708025077,
                        "longitude": 180
                    },
                    {
                        "latitude": 79.43568721951023,
                        "longitude": 180
                    },
                    {
                        "latitude": 79.26487486457944,
                        "longitude": 180
                    },
                    {
                        "latitude": 79.09267810827666,
                        "longitude": 180
                    },
                    {
                        "latitude": 78.91906432516674,
                        "longitude": 180
                    },
                    {
                        "latitude": 78.74400014867915,
                        "longitude": 180
                    },
                    {
                        "latitude": 78.56745144746101,
                        "longitude": 180
                    },
                    {
                        "latitude": 78.3893833009359,
                        "longitude": 180
                    },
                    {
                        "latitude": 78.20975997403845,
                        "longitude": 180
                    },
                    {
                        "latitude": 78.0285448910927,
                        "longitude": 180
                    },
                    {
                        "latitude": 77.84570060880169,
                        "longitude": 180
                    },
                    {
                        "latitude": 77.66118878831477,
                        "longitude": 180
                    },
                    {
                        "latitude": 77.47497016633683,
                        "longitude": 180
                    },
                    {
                        "latitude": 77.2870045252433,
                        "longitude": 180
                    },
                    {
                        "latitude": 77.09725066216313,
                        "longitude": 180
                    },
                    {
                        "latitude": 76.9056663569904,
                        "longitude": 180
                    },
                    {
                        "latitude": 76.71220833928372,
                        "longitude": 180
                    },
                    {
                        "latitude": 76.51683225401193,
                        "longitude": 180
                    },
                    {
                        "latitude": 76.31949262610165,
                        "longitude": 180
                    },
                    {
                        "latitude": 76.12014282374227,
                        "longitude": 180
                    },
                    {
                        "latitude": 75.91873502040113,
                        "longitude": 180
                    },
                    {
                        "latitude": 75.71522015550102,
                        "longitude": 180
                    },
                    {
                        "latitude": 75.50954789370948,
                        "longitude": 180
                    },
                    {
                        "latitude": 75.30166658278891,
                        "longitude": 180
                    },
                    {
                        "latitude": 75.09152320995382,
                        "longitude": 180
                    },
                    {
                        "latitude": 74.87906335668025,
                        "longitude": 180
                    },
                    {
                        "latitude": 74.66423115191073,
                        "longitude": 180
                    },
                    {
                        "latitude": 74.44696922359661,
                        "longitude": 180
                    },
                    {
                        "latitude": 74.22721864851722,
                        "longitude": 180
                    },
                    {
                        "latitude": 74.00491890031441,
                        "longitude": 180
                    },
                    {
                        "latitude": 73.78000779567883,
                        "longitude": 180
                    },
                    {
                        "latitude": 73.55242143862314,
                        "longitude": 180
                    },
                    {
                        "latitude": 73.32209416277513,
                        "longitude": 180
                    },
                    {
                        "latitude": 73.0889584716226,
                        "longitude": 180
                    },
                    {
                        "latitude": 72.85294497664098,
                        "longitude": 180
                    },
                    {
                        "latitude": 72.61398233323177,
                        "longitude": 180
                    },
                    {
                        "latitude": 72.37199717440069,
                        "longitude": 180
                    },
                    {
                        "latitude": 72.12691404210162,
                        "longitude": 180
                    },
                    {
                        "latitude": 71.8786553161727,
                        "longitude": 180
                    },
                    {
                        "latitude": 71.62714114079004,
                        "longitude": 180
                    },
                    {
                        "latitude": 71.3722893483636,
                        "longitude": 180
                    },
                    {
                        "latitude": 71.11401538080054,
                        "longitude": 180
                    },
                    {
                        "latitude": 70.85223220806122,
                        "longitude": 180
                    },
                    {
                        "latitude": 70.58685024393353,
                        "longitude": 180
                    },
                    {
                        "latitude": 70.3177772589527,
                        "longitude": 180
                    },
                    {
                        "latitude": 70.04491829039551,
                        "longitude": 180
                    },
                    {
                        "latitude": 69.76817554927966,
                        "longitude": 180
                    },
                    {
                        "latitude": 69.4874483243026,
                        "longitude": 180
                    },
                    {
                        "latitude": 69.2026328826575,
                        "longitude": 180
                    },
                    {
                        "latitude": 68.91362236766926,
                        "longitude": 180
                    },
                    {
                        "latitude": 68.62030669319853,
                        "longitude": 180
                    },
                    {
                        "latitude": 68.3225724347693,
                        "longitude": 180
                    },
                    {
                        "latitude": 68.02030271738332,
                        "longitude": 180
                    },
                    {
                        "latitude": 67.7133770999946,
                        "longitude": 180
                    },
                    {
                        "latitude": 67.40167145662869,
                        "longitude": 180
                    },
                    {
                        "latitude": 67.08505785414408,
                        "longitude": 180
                    },
                    {
                        "latitude": 66.76340442664929,
                        "longitude": 180
                    },
                    {
                        "latitude": 66.436575246606,
                        "longitude": 180
                    },
                    {
                        "latitude": 66.10443019266958,
                        "longitude": 180
                    },
                    {
                        "latitude": 65.76682481434122,
                        "longitude": 180
                    },
                    {
                        "latitude": 65.42361019353231,
                        "longitude": 180
                    },
                    {
                        "latitude": 65.0746328031723,
                        "longitude": 180
                    },
                    {
                        "latitude": 64.71973436302501,
                        "longitude": 180
                    },
                    {
                        "latitude": 64.35875169291738,
                        "longitude": 180
                    },
                    {
                        "latitude": 63.991516563628146,
                        "longitude": 180
                    },
                    {
                        "latitude": 63.61785554573361,
                        "longitude": 180
                    },
                    {
                        "latitude": 63.23758985676242,
                        "longitude": 180
                    },
                    {
                        "latitude": 62.85053520707411,
                        "longitude": 180
                    },
                    {
                        "latitude": 62.4565016449452,
                        "longitude": 180
                    },
                    {
                        "latitude": 62.05529340142515,
                        "longitude": 180
                    },
                    {
                        "latitude": 61.646708735610844,
                        "longitude": 180
                    },
                    {
                        "latitude": 61.23053978108492,
                        "longitude": 180
                    },
                    {
                        "latitude": 60.806572394372054,
                        "longitude": 180
                    },
                    {
                        "latitude": 60.37458600638518,
                        "longitude": 180
                    },
                    {
                        "latitude": 59.93435347796726,
                        "longitude": 180
                    },
                    {
                        "latitude": 59.48564096077986,
                        "longitude": 180
                    },
                    {
                        "latitude": 59.02820776495211,
                        "longitude": 180
                    },
                    {
                        "latitude": 58.56180623508028,
                        "longitude": 180
                    },
                    {
                        "latitude": 58.08618163636514,
                        "longitude": 180
                    },
                    {
                        "latitude": 57.6010720528872,
                        "longitude": 180
                    },
                    {
                        "latitude": 57.106208300255375,
                        "longitude": 180
                    },
                    {
                        "latitude": 56.60131385511945,
                        "longitude": 180
                    },
                    {
                        "latitude": 56.08610480431482,
                        "longitude": 180
                    },
                    {
                        "latitude": 55.56028981670961,
                        "longitude": 180
                    },
                    {
                        "latitude": 55.023570141149015,
                        "longitude": 180
                    },
                    {
                        "latitude": 54.47563963424275,
                        "longitude": 180
                    },
                    {
                        "latitude": 53.91618482211629,
                        "longitude": 180
                    },
                    {
                        "latitude": 53.34488500064701,
                        "longitude": 180
                    },
                    {
                        "latitude": 52.761412379131166,
                        "longitude": 180
                    },
                    {
                        "latitude": 52.16543227277518,
                        "longitude": 180
                    },
                    {
                        "latitude": 51.55660334987387,
                        "longitude": 180
                    },
                    {
                        "latitude": 50.934577940024546,
                        "longitude": 180
                    },
                    {
                        "latitude": 50.29900241022749,
                        "longitude": 180
                    },
                    {
                        "latitude": 49.64951761623158,
                        "longitude": 180
                    },
                    {
                        "latitude": 48.985759436994975,
                        "longitude": 180
                    },
                    {
                        "latitude": 48.307359400632734,
                        "longitude": 180
                    },
                    {
                        "latitude": 47.613945410707295,
                        "longitude": 180
                    },
                    {
                        "latitude": 46.90514258216808,
                        "longitude": 180
                    },
                    {
                        "latitude": 46.18057419664902,
                        "longitude": 180
                    },
                    {
                        "latitude": 45.43986278716491,
                        "longitude": 180
                    },
                    {
                        "latitude": 44.68263136248975,
                        "longitude": 180
                    },
                    {
                        "latitude": 43.9085047816228,
                        "longitude": 180
                    },
                    {
                        "latitude": 43.11711128872245,
                        "longitude": 180
                    },
                    {
                        "latitude": 42.30808421867935,
                        "longitude": 180
                    },
                    {
                        "latitude": 41.48106388306878,
                        "longitude": 180
                    },
                    {
                        "latitude": 40.635699645528234,
                        "longitude": 180
                    },
                    {
                        "latitude": 39.77165219460128,
                        "longitude": 180
                    },
                    {
                        "latitude": 38.88859602072611,
                        "longitude": 180
                    },
                    {
                        "latitude": 37.98622210227706,
                        "longitude": 180
                    },
                    {
                        "latitude": 37.064240803337746,
                        "longitude": 180
                    },
                    {
                        "latitude": 36.12238498314884,
                        "longitude": 180
                    },
                    {
                        "latitude": 35.160413313885364,
                        "longitude": 180
                    },
                    {
                        "latitude": 34.17811379954215,
                        "longitude": 180
                    },
                    {
                        "latitude": 33.17530748421364,
                        "longitude": 180
                    },
                    {
                        "latitude": 32.1518523329345,
                        "longitude": 180
                    },
                    {
                        "latitude": 31.107647262509595,
                        "longitude": 180
                    },
                    {
                        "latitude": 30.04263629343538,
                        "longitude": 180
                    },
                    {
                        "latitude": 28.956812787167916,
                        "longitude": 180
                    },
                    {
                        "latitude": 27.850223725718017,
                        "longitude": 180
                    },
                    {
                        "latitude": 26.72297398299459,
                        "longitude": 180
                    },
                    {
                        "latitude": 25.575230529653833,
                        "longitude": 180
                    },
                    {
                        "latitude": 24.407226505672618,
                        "longitude": 180
                    },
                    {
                        "latitude": 23.219265087726086,
                        "longitude": 180
                    },
                    {
                        "latitude": 22.01172307203021,
                        "longitude": 180
                    },
                    {
                        "latitude": 20.785054087965914,
                        "longitude": 180
                    },
                    {
                        "latitude": 19.539791353917234,
                        "longitude": 180
                    },
                    {
                        "latitude": 18.276549884728052,
                        "longitude": 180
                    },
                    {
                        "latitude": 16.99602806039949,
                        "longitude": 180
                    },
                    {
                        "latitude": 15.699008468476391,
                        "longitude": 180
                    },
                    {
                        "latitude": 14.3863579383088,
                        "longitude": 180
                    },
                    {
                        "latitude": 13.059026694246432,
                        "longitude": 180
                    },
                    {
                        "latitude": 11.71804656693688,
                        "longitude": 180
                    },
                    {
                        "latitude": 10.36452821722244,
                        "longitude": 180
                    },
                    {
                        "latitude": 8.999657345473533,
                        "longitude": 180
                    },
                    {
                        "latitude": 7.624689880194082,
                        "longitude": 180
                    },
                    {
                        "latitude": 6.240946162843566,
                        "longitude": 180
                    },
                    {
                        "latitude": 4.84980417032998,
                        "longitude": 180
                    },
                    {
                        "latitude": 3.452691841683219,
                        "longitude": 180
                    },
                    {
                        "latitude": 2.051078600052428,
                        "longitude": 180
                    },
                    {
                        "latitude": 0.6464661843599931,
                        "longitude": 180
                    },
                    {
                        "latitude": -0.7596210743399123,
                        "longitude": 180
                    },
                    {
                        "latitude": -2.1656463794737753,
                        "longitude": 180
                    },
                    {
                        "latitude": -3.5700708332125983,
                        "longitude": 180
                    },
                    {
                        "latitude": -4.971363865008552,
                        "longitude": 180
                    },
                    {
                        "latitude": -6.368013548331728,
                        "longitude": 180
                    },
                    {
                        "latitude": -7.7585366323646765,
                        "longitude": 180
                    },
                    {
                        "latitude": -9.14148812365425,
                        "longitude": 180
                    },
                    {
                        "latitude": -10.515470265987595,
                        "longitude": 180
                    },
                    {
                        "latitude": -11.87914078442232,
                        "longitude": 180
                    },
                    {
                        "latitude": -13.231220280632062,
                        "longitude": 180
                    },
                    {
                        "latitude": -14.57049869055246,
                        "longitude": 180
                    },
                    {
                        "latitude": -15.89584074068001,
                        "longitude": 180
                    },
                    {
                        "latitude": -17.2061903652194,
                        "longitude": 180
                    },
                    {
                        "latitude": -18.500574071581664,
                        "longitude": 180
                    },
                    {
                        "latitude": -19.778103265594403,
                        "longitude": 180
                    },
                    {
                        "latitude": -21.03797556943246,
                        "longitude": 180
                    },
                    {
                        "latitude": -22.279475184124994,
                        "longitude": 180
                    },
                    {
                        "latitude": -23.50197236414075,
                        "longitude": 180
                    },
                    {
                        "latitude": -24.704922083784904,
                        "longitude": 180
                    },
                    {
                        "latitude": -25.8878619839191,
                        "longitude": 180
                    },
                    {
                        "latitude": -27.05040969295606,
                        "longitude": 180
                    },
                    {
                        "latitude": -28.192259618422273,
                        "longitude": 180
                    },
                    {
                        "latitude": -29.313179304958997,
                        "longitude": 180
                    },
                    {
                        "latitude": -30.413005451842185,
                        "longitude": 180
                    },
                    {
                        "latitude": -31.49163967837368,
                        "longitude": 180
                    },
                    {
                        "latitude": -32.549044119266284,
                        "longitude": 180
                    },
                    {
                        "latitude": -33.5852369248357,
                        "longitude": 180
                    },
                    {
                        "latitude": -34.60028773281166,
                        "longitude": 180
                    },
                    {
                        "latitude": -35.59431317023683,
                        "longitude": 180
                    },
                    {
                        "latitude": -36.56747243553039,
                        "longitude": 180
                    },
                    {
                        "latitude": -37.51996300259944,
                        "longitude": 180
                    },
                    {
                        "latitude": -38.4520164810744,
                        "longitude": 180
                    },
                    {
                        "latitude": -39.36389465946872,
                        "longitude": 180
                    },
                    {
                        "latitude": -40.2558857514124,
                        "longitude": 180
                    },
                    {
                        "latitude": -41.128300859143984,
                        "longitude": 180
                    },
                    {
                        "latitude": -41.981470663188624,
                        "longitude": 180
                    },
                    {
                        "latitude": -42.81574234260099,
                        "longitude": 180
                    },
                    {
                        "latitude": -43.631476726285015,
                        "longitude": 180
                    },
                    {
                        "latitude": -44.42904567268543,
                        "longitude": 180
                    },
                    {
                        "latitude": -45.208829672522114,
                        "longitude": 180
                    },
                    {
                        "latitude": -45.97121566716076,
                        "longitude": 180
                    },
                    {
                        "latitude": -46.71659507361627,
                        "longitude": 180
                    },
                    {
                        "latitude": -47.445362006015145,
                        "longitude": 180
                    },
                    {
                        "latitude": -48.15791168253931,
                        "longitude": 180
                    },
                    {
                        "latitude": -48.85463900638282,
                        "longitude": 180
                    },
                    {
                        "latitude": -49.53593730902352,
                        "longitude": 180
                    },
                    {
                        "latitude": -50.20219724409761,
                        "longitude": 180
                    },
                    {
                        "latitude": -50.85380582032584,
                        "longitude": 180
                    },
                    {
                        "latitude": -51.49114556223569,
                        "longitude": 180
                    },
                    {
                        "latitude": -52.11459378782824,
                        "longitude": 180
                    },
                    {
                        "latitude": -52.724521992816975,
                        "longitude": 180
                    },
                    {
                        "latitude": -53.3212953316014,
                        "longitude": 180
                    },
                    {
                        "latitude": -53.905272185707055,
                        "longitude": 180
                    },
                    {
                        "latitude": -54.47680381101361,
                        "longitude": 180
                    },
                    {
                        "latitude": -55.036234055685256,
                        "longitude": 180
                    },
                    {
                        "latitude": -55.58389914130909,
                        "longitude": 180
                    },
                    {
                        "latitude": -56.12012750032394,
                        "longitude": 180
                    },
                    {
                        "latitude": -56.64523966338031,
                        "longitude": 180
                    },
                    {
                        "latitude": -57.15954819080773,
                        "longitude": 180
                    },
                    {
                        "latitude": -57.663357642874274,
                        "longitude": 180
                    },
                    {
                        "latitude": -58.15696458400238,
                        "longitude": 180
                    },
                    {
                        "latitude": -58.64065761655617,
                        "longitude": 180
                    },
                    {
                        "latitude": -59.11471744023488,
                        "longitude": 180
                    },
                    {
                        "latitude": -59.57941693349715,
                        "longitude": 180
                    },
                    {
                        "latitude": -60.035021253801176,
                        "longitude": 180
                    },
                    {
                        "latitude": -60.48178795377829,
                        "longitude": 180
                    },
                    {
                        "latitude": -60.91996711076236,
                        "longitude": 180
                    },
                    {
                        "latitude": -61.349801467375045,
                        "longitude": 180
                    },
                    {
                        "latitude": -61.77152658112307,
                        "longitude": 180
                    },
                    {
                        "latitude": -62.185370981193344,
                        "longitude": 180
                    },
                    {
                        "latitude": -62.59155633084296,
                        "longitude": 180
                    },
                    {
                        "latitude": -62.99029759397027,
                        "longitude": 180
                    },
                    {
                        "latitude": -63.381803204625164,
                        "longitude": 180
                    },
                    {
                        "latitude": -63.766275238371406,
                        "longitude": 180
                    },
                    {
                        "latitude": -64.14390958455292,
                        "longitude": 180
                    },
                    {
                        "latitude": -64.5148961186403,
                        "longitude": 180
                    },
                    {
                        "latitude": -64.87941887394655,
                        "longitude": 180
                    },
                    {
                        "latitude": -65.23765621209967,
                        "longitude": 180
                    },
                    {
                        "latitude": -65.58978099175029,
                        "longitude": 180
                    },
                    {
                        "latitude": -65.93596073507045,
                        "longitude": 180
                    },
                    {
                        "latitude": -66.27635779167169,
                        "longitude": 180
                    },
                    {
                        "latitude": -66.61112949963147,
                        "longitude": 180
                    },
                    {
                        "latitude": -66.94042834337401,
                        "longitude": 180
                    },
                    {
                        "latitude": -67.26440210819872,
                        "longitude": 180
                    },
                    {
                        "latitude": -67.58319403129401,
                        "longitude": 180
                    },
                    {
                        "latitude": -67.89694294911065,
                        "longitude": 180
                    },
                    {
                        "latitude": -68.20578344100313,
                        "longitude": 180
                    },
                    {
                        "latitude": -68.5098459690753,
                        "longitude": 180
                    },
                    {
                        "latitude": -68.80925701419237,
                        "longitude": 180
                    },
                    {
                        "latitude": -69.10413920814317,
                        "longitude": 180
                    },
                    {
                        "latitude": -69.3946114619548,
                        "longitude": 180
                    },
                    {
                        "latitude": -69.6807890903785,
                        "longitude": 180
                    },
                    {
                        "latitude": -69.9627839325791,
                        "longitude": 180
                    },
                    {
                        "latitude": -70.24070446907243,
                        "longitude": 180
                    },
                    {
                        "latitude": -70.51465593496454,
                        "longitude": 180
                    },
                    {
                        "latitude": -70.78474042955486,
                        "longitude": 180
                    },
                    {
                        "latitude": -71.05105702237297,
                        "longitude": 180
                    },
                    {
                        "latitude": -71.31370185572268,
                        "longitude": 180
                    },
                    {
                        "latitude": -71.57276824381339,
                        "longitude": 180
                    },
                    {
                        "latitude": -71.8283467685603,
                        "longitude": 180
                    },
                    {
                        "latitude": -72.08052537213939,
                        "longitude": 180
                    },
                    {
                        "latitude": -72.32938944638308,
                        "longitude": 180
                    },
                    {
                        "latitude": -72.57502191910537,
                        "longitude": 180
                    },
                    {
                        "latitude": -72.81750333744516,
                        "longitude": 180
                    },
                    {
                        "latitude": -73.05691194831597,
                        "longitude": 180
                    },
                    {
                        "latitude": -73.29332377605107,
                        "longitude": 180
                    },
                    {
                        "latitude": -73.52681269733226,
                        "longitude": 180
                    },
                    {
                        "latitude": -73.75745051348873,
                        "longitude": 180
                    },
                    {
                        "latitude": -73.98530702025224,
                        "longitude": 180
                    },
                    {
                        "latitude": -74.21045007505296,
                        "longitude": 180
                    },
                    {
                        "latitude": -74.43294566193907,
                        "longitude": 180
                    },
                    {
                        "latitude": -74.65285795420101,
                        "longitude": 180
                    },
                    {
                        "latitude": -74.87024937478007,
                        "longitude": 180
                    },
                    {
                        "latitude": -75.08518065453862,
                        "longitude": 180
                    },
                    {
                        "latitude": -75.29771088846738,
                        "longitude": 180
                    },
                    {
                        "latitude": -75.50789758990365,
                        "longitude": 180
                    },
                    {
                        "latitude": -75.71579674283119,
                        "longitude": 180
                    },
                    {
                        "latitude": -75.92146285233183,
                        "longitude": 180
                    },
                    {
                        "latitude": -76.12494899325532,
                        "longitude": 180
                    },
                    {
                        "latitude": -76.32630685717328,
                        "longitude": 180
                    },
                    {
                        "latitude": -76.52558679767965,
                        "longitude": 180
                    },
                    {
                        "latitude": -76.72283787409926,
                        "longitude": 180
                    },
                    {
                        "latitude": -76.91810789366299,
                        "longitude": 180
                    },
                    {
                        "latitude": -77.11144345220704,
                        "longitude": 180
                    },
                    {
                        "latitude": -77.30288997345092,
                        "longitude": 180
                    },
                    {
                        "latitude": -77.4924917469077,
                        "longitude": 180
                    },
                    {
                        "latitude": -77.68029196447736,
                        "longitude": 180
                    },
                    {
                        "latitude": -77.86633275577304,
                        "longitude": 180
                    },
                    {
                        "latitude": -78.05065522222792,
                        "longitude": 180
                    },
                    {
                        "latitude": -78.23329947002797,
                        "longitude": 180
                    },
                    {
                        "latitude": -78.41430464191596,
                        "longitude": 180
                    },
                    {
                        "latitude": -78.5937089479081,
                        "longitude": 180
                    },
                    {
                        "latitude": -78.7715496949657,
                        "longitude": 180
                    },
                    {
                        "latitude": -78.94786331565982,
                        "longitude": 180
                    },
                    {
                        "latitude": -79.12268539586846,
                        "longitude": 180
                    },
                    {
                        "latitude": -79.29605070154199,
                        "longitude": 180
                    },
                    {
                        "latitude": -79.46799320457191,
                        "longitude": 180
                    },
                    {
                        "latitude": -79.63854610779778,
                        "longitude": 180
                    },
                    {
                        "latitude": -79.80774186918384,
                        "longitude": 180
                    },
                    {
                        "latitude": -79.97561222519742,
                        "longitude": 180
                    },
                    {
                        "latitude": -80.14218821341883,
                        "longitude": 180
                    },
                    {
                        "latitude": -80.30750019441224,
                        "longitude": 180
                    },
                    {
                        "latitude": -80.47157787288474,
                        "longitude": 180
                    },
                    {
                        "latitude": -80.63445031816144,
                        "longitude": 180
                    },
                    {
                        "latitude": -80.79614598400116,
                        "longitude": 180
                    },
                    {
                        "latitude": -80.95669272777872,
                        "longitude": 180
                    },
                    {
                        "latitude": -81.11611782905709,
                        "longitude": 180
                    },
                    {
                        "latitude": -81.27444800757212,
                        "longitude": 180
                    },
                    {
                        "latitude": -81.43170944065294,
                        "longitude": 180
                    },
                    {
                        "latitude": -81.58792778009781,
                        "longitude": 180
                    },
                    {
                        "latitude": -81.74312816852755,
                        "longitude": 180
                    },
                    {
                        "latitude": -81.89733525523452,
                        "longitude": 180
                    },
                    {
                        "latitude": -82.05057321154763,
                        "longitude": 180
                    },
                    {
                        "latitude": -82.20286574573018,
                        "longitude": 180
                    },
                    {
                        "latitude": -82.35423611742937,
                        "longitude": 180
                    },
                    {
                        "latitude": -82.50470715169295,
                        "longitude": 180
                    },
                    {
                        "latitude": -82.65430125257073,
                        "longitude": 180
                    },
                    {
                        "latitude": -82.80304041631533,
                        "longitude": 180
                    },
                    {
                        "latitude": -82.95094624419777,
                        "longitude": 180
                    },
                    {
                        "latitude": -83.09803995495255,
                        "longitude": 180
                    },
                    {
                        "latitude": -83.24434239686572,
                        "longitude": 180
                    },
                    {
                        "latitude": -83.38987405951963,
                        "longitude": 180
                    },
                    {
                        "latitude": -83.53465508520738,
                        "longitude": 180
                    },
                    {
                        "latitude": -83.67870528002938,
                        "longitude": 180
                    },
                    {
                        "latitude": -83.82204412468369,
                        "longitude": 180
                    },
                    {
                        "latitude": -83.96469078496271,
                        "longitude": 180
                    },
                    {
                        "latitude": -84.10666412196608,
                        "longitude": 180
                    },
                    {
                        "latitude": -84.24798270204165,
                        "longitude": 180
                    },
                    {
                        "latitude": -84.38866480646448,
                        "longitude": 180
                    },
                    {
                        "latitude": -84.52872844086392,
                        "longitude": 180
                    },
                    {
                        "latitude": -84.6681913444087,
                        "longitude": 180
                    },
                    {
                        "latitude": -84.80707099875865,
                        "longitude": 180
                    },
                    {
                        "latitude": -84.94538463679359,
                        "longitude": 180
                    },
                    {
                        "latitude": -85.08314925112602,
                        "longitude": 180
                    },
                    {
                        "latitude": -85.22038160240845,
                        "longitude": 180
                    },
                    {
                        "latitude": -85.35709822744141,
                        "longitude": 180
                    },
                    {
                        "latitude": -85.49331544709136,
                        "longitude": 180
                    },
                    {
                        "latitude": -85.62904937402531,
                        "longitude": 180
                    },
                    {
                        "latitude": -85.76431592027079,
                        "longitude": 180
                    },
                    {
                        "latitude": -85.89913080460634,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.0335095597919,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.1674675396432,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.30101992595951,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.43418173530802,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.56696782567414,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.69939290298068,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.8314715274841,
                        "longitude": 180
                    },
                    {
                        "latitude": -86.9632181200527,
                        "longitude": 180
                    },
                    {
                        "latitude": -87.09464696833092,
                        "longitude": 180
                    },
                    {
                        "latitude": -87.22577223279698,
                        "longitude": 180
                    },
                    {
                        "latitude": -87.35660795271913,
                        "longitude": 180
                    },
                    {
                        "latitude": -87.48716805201276,
                        "longitude": 180
                    },
                    {
                        "latitude": -87.61746634500768,
                        "longitude": 180
                    },
                    {
                        "latitude": -87.74751654212585,
                        "longitude": 180
                    },
                    {
                        "latitude": -87.87733225547836,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.0069270043834,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.13631422081062,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.26550725475767,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.39451937956039,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.5233637971444,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.65205364321861,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.7806019924176,
                        "longitude": 180
                    },
                    {
                        "latitude": -88.90902186339696,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.03732622388175,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.16552799567825,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.293640059646,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.42167526064162,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.54964641242834,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.67756630256787,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.805447697283,
                        "longitude": 180
                    },
                    {
                        "latitude": -89.93330334631214,
                        "longitude": 180
                    },
                    {
                        "latitude": -90,
                        "longitude": 180
                    },
                    {
                        "latitude": -90,
                        "longitude": -180
                    }
                ]
            ],
            "pole": 0,
            "poleIndex": -1,
            "iMap": [
                {
                    "_entries": {}
                }
            ],
            "sectors": [
                {
                    "minLatitude": -90,
                    "maxLatitude": 90,
                    "minLongitude": -180,
                    "maxLongitude": 180
                }
            ]
        }
    ];
    var fullSphereSectorOutput = transformOutputData(fullSphereSectorRawOutput);

    return {
        simpleSquareInput: simpleSquareInput,
        simpleSquareOutput: simpleSquareOutput,
        spiralPolyInput: spiralPolyInput,
        spiralPolyOutput: spiralPolyOutput,
        polyLineInput: polyLineInput,
        polyLineOutput: polyLineOutput,
        polygonOverTheGlobeInput: polygonOverTheGlobeInput,
        polygonOverTheGlobeOutput: polygonOverTheGlobeOutput,
        polygonSouthPoleAndIntersectionInput: polygonSouthPoleAndIntersectionInput,
        polygonSouthPoleAndIntersectionOutput: polygonSouthPoleAndIntersectionOutput,
        polygonNorthPoleAndIntersectionInput: polygonNorthPoleAndIntersectionInput,
        polygonNorthPoleAndIntersectionOutput: polygonNorthPoleAndIntersectionOutput,
        polygonHoleInput: polygonHoleInput,
        polygonHoleOutput: polygonHoleOutput,
        polygonHole2Input: polygonHole2Input,
        polygonHole2Output: polygonHole2Output,
        fullSphereSectorInput: fullSphereSectorInput,
        fullSphereSectorOutput: fullSphereSectorOutput
    };

});