/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../util/ItemIcon',
    './KmlSubStyle',
    '../KmlElements'
], function (
    ItemIcon,
    KmlSubStyle,
    KmlElements
) {
    "use strict";
    var KmlListStyle = function(balloonStyleNode){
        KmlSubStyle.call(this, balloonStyleNode);
    };

    KmlListStyle.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlListStyle.prototype, {
        tagName: {
            get: function() {
                return ['ListStyle']
            }
        },

        bgColor: {
            get: function(){
                return this.retrieve({name: 'bgColor'});
            }
        },

        listItemType: {
            get: function(){
                return this.retrieve({name: 'listItemType'});
            }
        },

        ItemIcon: {
            get: function() {
                return this.createChildElement({
                    name: ItemIcon.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(KmlListStyle.prototype.tagName[0], KmlListStyle);

    return KmlListStyle;
});