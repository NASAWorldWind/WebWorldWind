/**
 * Created by Matthew on 8/4/2015.
 */

define(
    function(){
        var Slider = function (id, anchor, slideFunction) {
            var self = this;
            self.sliderDiv = $('<div>');
            self.sliderDiv.attr('id',id);

            self.sliderIn = $('<input>');
            self.sliderIn.attr('id', id + 'Slider');
            self.sliderIn.attr('data-slider-id', id + 'Slider');
            self.sliderIn.attr('type', 'number');
            self.sliderIn.attr('data-slider-min', '2');
            self.sliderIn.attr('data-slider-max', '7');
            self.sliderIn.attr('data-slider-step', '1');
            self.sliderIn.attr('data-slider-value', '2');


            self.sliderDiv.append(self.sliderIn);

            $('#' + anchor).append(self.sliderDiv);

            self.initiateSlider(slideFunction);

            return self.sliderDiv
        };

        Slider.prototype.initiateSlider = function (slideFunction) {
            var self = this;
            self.Slider = self.sliderDiv.slider(
                {
                    formatter: function (value) {
                        return 'Current value: ' + value;
                    }
                }
            );

            self.Slider.on('slideStop', slideFunction);
        }

        return Slider
    }
);

