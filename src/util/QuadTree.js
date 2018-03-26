/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([], function () {
    /**
     * QuadTree Constructor. It is basically a binary tree branching into the 4 areas at every level instead of into
     * the two level. It is common structure used in the game programming and computer graphics area. You can read
     * more for example here: https://en.wikipedia.org/wiki/Quadtree
     * @param options {Object} If no object is provided then empty is used.
     * @param options.bounds {Object} Bounds representing the area of the tree
     * @param options.bounds.x (Number) X coordinate for the beginning of the area
     * @param options.bounds.y (Number) Y coordinate for the beginning of the area
     * @param options.bounds.width {Number} Width of the area used by the tree
     * @param options.bounds.height {Number} Height of the area used by the tree
     * @param options.maxObjects {Number} Maximum objects that will be kept in the QuadTree node before it will branch.
     * @param options.maxLevels {Number} Maximum amount of levels in the QuadTree. This in combination with maxObjects
     *  defines how many elements will be the tree able to handle.
     * @param options.level {Number} Used when the tree branches as it allows you to understand what level of the tree
     *  the current subtree is on.
     * @alias QuadTree
     * @constructor
     */
    var QuadTree = function (options) {
        options = options || {};

        this.maxObjects = options.maxObjects || 10;
        this.maxLevels = options.maxLevels || 4;

        this.level = options.level || 0;
        this.bounds = options.bounds;

        this.objects = [];
        this.nodes = [];
    };

    /**
     * It splits the node into the 4 subnodes.
     * @private
     */
    QuadTree.prototype.split = function () {
        var nextLevel = this.level + 1,
            subWidth = Math.round(this.bounds.width / 2),
            subHeight = Math.round(this.bounds.height / 2),
            x = Math.round(this.bounds.x),
            y = Math.round(this.bounds.y);

        //top right node
        this.nodes[0] = new QuadTree({
            bounds: {
                x: x + subWidth,
                y: y,
                width: subWidth,
                height: subHeight
            },
            maxObjects: this.maxObjects,
            maxLevels: this.maxLevels,
            level: nextLevel
        });

        //top left node
        this.nodes[1] = new QuadTree({
            bounds: {
                x: x,
                y: y,
                width: subWidth,
                height: subHeight
            },
            maxObjects: this.maxObjects,
            maxLevels: this.maxLevels,
            level: nextLevel
        });

        //bottom left node
        this.nodes[2] = new QuadTree({
            bounds: {
                x: x,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            },
            maxObjects: this.maxObjects,
            maxLevels: this.maxLevels,
            level: nextLevel
        });

        //bottom right node
        this.nodes[3] = new QuadTree({
            bounds: {
                x: x + subWidth,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            },
            maxObjects: this.maxObjects,
            maxLevels: this.maxLevels,
            level: nextLevel
        });
    };


    /**
     * It determines to which of the 4 nodes the given object belongs.
     * @private
     * @param bounds {Object}
     * @param bounds.x {Number} Left position of the bounds
     * @param bounds.y {Number} Top position of the bounds
     * @param bounds.width {Number} Width of the bounds
     * @param bounds.height {Number} Height of the bounds
     * @returns {Number} Value between 0 and 3
     */
    QuadTree.prototype.getIndex = function (bounds) {
        var index = -1,
            verticalMidpoint = this.bounds.x + (this.bounds.width / 2),
            horizontalMidpoint = this.bounds.y + (this.bounds.height / 2),

            topQuadrant = (bounds.y < horizontalMidpoint && bounds.y + bounds.height < horizontalMidpoint),
            bottomQuadrant = (bounds.y > horizontalMidpoint);

        if (bounds.x < verticalMidpoint && bounds.x + bounds.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        } else if (bounds.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    };


    /**
     * It inserts the new object into the node. If the node exceeds the capacity, it will split and add all objects to
     * their corresponding subnodes.
     * @param options {Object}
     * @param options.data {Object} Any data associated with the object.
     * @param options.x {Number} X position of the object to insert into the QuadTree
     * @param options.y {Number} Y position of the object to insert into the QuadTree
     * @param options.width {Number} Width of the Object. It is in pixels.
     * @param options.height {Number} Height of the Object. It is in pixels.
     */
    QuadTree.prototype.insert = function (options) {
        var i = 0,
            index;

        if (this.nodes[0]) {
            index = this.getIndex(options);

            if (index !== -1) {
                this.nodes[index].insert(options);
                return;
            }
        }

        this.objects.push(options);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (typeof this.nodes[0] === 'undefined') {
                this.split();
            }

            while (i < this.objects.length) {
                index = this.getIndex(this.objects[i]);

                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i = i + 1;
                }
            }
        }
    };

    /**
     * It returns all objects within given bounds.
     * @param bounds {Object}
     * @param bounds.x {Number} Left position of the bounds
     * @param bounds.y {Number} Top position of the bounds
     * @param bounds.width {Number} Width of the bounds
     * @param bounds.height {Number} Height of the bounds
     * @returns {Array} Array of object within given bounds.
     */
    QuadTree.prototype.retrieve = function (bounds) {
        var index = this.getIndex(bounds),
            returnObjects = this.objects;

        if (typeof this.nodes[0] !== 'undefined') {
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(bounds));
            } else {
                for (var i = 0; i < this.nodes.length; i = i + 1) {
                    returnObjects = returnObjects.concat(this.nodes[i].retrieve(bounds));
                }
            }
        }

        return returnObjects.filter(function(candidate){
            return candidate.x >= bounds.x &&
                candidate.x <= (bounds.x + bounds.width) &&
                candidate.y >= bounds.y &&
                candidate.y <= (bounds.y + bounds.height);
        });
    };


    /**
     * Clear all elements from the QuadTree.
     */
    QuadTree.prototype.clear = function () {
        this.objects = [];

        for (var i = 0; i < this.nodes.length; i = i + 1) {
            if (typeof this.nodes[i] !== 'undefined') {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    };

    return QuadTree;
});