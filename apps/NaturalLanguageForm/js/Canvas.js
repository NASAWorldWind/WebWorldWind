/**
 * Created by Matthew on 7/31/2015.
 */
define(['jquery',
        'nlform',
        'nlbuilder',
        'HUDMaker',
        'OverlayButton',
        'OpenStreetMapApp',
        'LayerManager'],
    function($,
             NaturalLanguageCanvas,
             NLBuilder,
             HUDMaker,
             OverlayButton,
             OpenStreetMapApp,
             LayerManager){

        function Canvas () {
            var self = this;
            /*
             * Create the html, css, and js for the wind icon in the bottom left. This will act as a menu for the canvas.
             */
            var jQueryDoc = $(window.document);
            var menubutton = new OverlayButton(
                'windIconMenu',
                'img/windGear.svg',
                [70, jQueryDoc.height()-40-42],
                [64,42],
                '.content'
            );

            // Form for open street map.
            var nLForm2 = new NLBuilder('Form2');
            nLForm2.addBasicText('I\'m looking for ');
            nLForm2.addField('amenityField2', 'amenity', "For example: <em>cafe</em>");
            nLForm2.addBasicText(' near ');
            nLForm2.addField('addressField2', 'location', "For example: <em>Mountain View</em>");
            nLForm2.setApplication(OpenStreetMapApp);

            var naturalLanguageCanvas = new NaturalLanguageCanvas( window , [nLForm2]);
            naturalLanguageCanvas.addClosingAction(function (NLHandler) {
                var buttonY = jQueryDoc.height() * .02;
                var buttonX = jQueryDoc.width() * .02;
                var returnButton = new OverlayButton(
                    'returnToCanvas',
                    'img/globeSearch.png',
                    [buttonX, buttonY],
                    [75,75]
                );

                returnButton.addClickEvent(function(o){

                    var windIcon = $(o.target).parent();
                    var INDEX = 0;
                    $('#landingScreen').fadeIn(400);
                    // Hide the layer manager upon return the NLH
                    self.layerManager.anchor.DIV.fadeOut(10);
                    windIcon.fadeOut(400);
                    var loadTimeAnimator = window.setInterval(function () {
                        if (INDEX < 20){
                            INDEX += 1;
                        } else {
                            clearInterval(loadTimeAnimator);
                            windIcon.remove()
                        }
                        $(o.target).css('width', 75 + 2*INDEX);
                        $(o.target).css('height', 75 + 2*INDEX);
                    },20);

                    NLHandler.applicationManager.unFocusAll()
                });
                if (!self.layerManager){
                    self.layerManager = new LayerManager( window.worldWindow )
                } else {
                    // Fade the layer manager in if already created.
                    self.layerManager.anchor.DIV.fadeIn(10)
                    self.layerManager.layerMan.synchronizeLayerList();
                }
            });

            /*
             * Add the function that is called when the wind icon is clicked.
             */
            menubutton.addClickEvent(function(o){
                // Get the div in which the element is located
                var menuIcon = $(o.target).parent();

                var INDEX = 0;
                var clickedLoc =[o.x, o.y];
                // Animates the fadeOut
                var clickAwayAnimationTimer = window.setInterval(function () {
                    if (INDEX < 20){
                        INDEX += 1
                    }
                    menuIcon.css('left', 70 + (INDEX*6));
                }, 10);

                /*
                 * Creates a menu containing buttons to add new querys linked to apps.
                 */
                menuIcon.fadeOut(190, function () {
                    clearInterval(clickAwayAnimationTimer);

                    // Creates the menu
                    var menuDisplay = new HUDMaker('Application Menu', [0,0], '.content');

                    /*
                     * Creates the button that appends a new OSM query to the screen.
                     */
                    //menuDisplay.assembleDisplay('', 'Earthquake Viewer', function (e) {
                    //    naturalLanguageCanvas.addForm(nLForm1)
                    //});
                    menuDisplay.assembleDisplay('', 'New OSM Query', function (e) {
                        naturalLanguageCanvas.addForm(nLForm2)
                    });

                    // Creates the function that restores the original icon when the menu is closed.
                    menuDisplay.addCloseEvent(function(event){

                        var clickInAnimationTimer = window.setInterval(function () {
                            if (INDEX < 20){
                                INDEX += 1
                            }
                            menuIcon.css('left', 70)
                        }, 10);

                        menuIcon.fadeIn(190, function () {
                            clearInterval(clickInAnimationTimer)
                        })


                    })
                })
            });

        }

        return Canvas
    }

);