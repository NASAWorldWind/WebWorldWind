define(['./ColoredTile'], function(ColoredTile){
    var ColoredSquareTile = function(data, options) {
        ColoredTile.call(this, data, options);
    };

    ColoredSquareTile.prototype = Object.create(ColoredTile.prototype);

    ColoredSquareTile.prototype.shape = function(){
        var shape = this.createCanvas(this._width, this._height),
            ctx = shape.getContext('2d'),
            r2 = this._radius + this._radius;

        ctx.shadowBlur = this._blur;
        ctx.shadowColor = 'black';

        shape.width = shape.height = r2;

        ctx.fillRect(0, 0, r2, r2);

        return shape;
    };

    return ColoredSquareTile;
});