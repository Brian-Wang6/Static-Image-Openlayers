import { Style, Fill, Text, Stroke, Circle } from 'ol/style.js';
import MultiPoint from 'ol/geom/MultiPoint.js';
class FeatureStyle {

    constructor(options) {
        options = options || {};
        this.zindex = options.zindex !== undefined ? options.zindex : 0;
        this.text = options.text !== undefined ? options.text : null;
        this.color = options.color !== undefined ? options.color : null;
    }

    setfeaturezindex(feature, zindex) {
        if (feature === undefined)
            return;
        var style = feature.getStyle()[0];
        if (style !== null) {
            style.setZIndex(zindex);
            feature.changed();
        }
    }

    setFeatureText(feature, text) {
        if (feature === undefined)
            return;
        var style = feature.getStyle()[0];
        if (style !== null) {
            var label = new Text({
                font: '26px Calibri,sans-serif',
                overflow: true,
                fill: new Fill({
                    color: '#000',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 4,
                }),
            });
            label.setText(text);
            style.setText(label);
            feature.changed();
        }
    }

    setFeatureStyle(feature, zindex = this.zindex, text = this.text, color = this.color) {
        const styles = [
            new Style({
                fill: new Fill({
                    color: color
                })
            }),
            new Style({
                image: new Circle({
                    stroke: new Stroke({
                        color: 'blue',
                        width: 1
                    }),
                    radius: 2,
                    fill: null
                }),
                geometry: function (feature) {
                    // return the coordinates of the first ring of the polygon
                    var rings = feature.getGeometry().getCoordinates();
                    let coordinates = [];
                    for (let i = 0, ii = rings.length; i < ii; i++) {
                        coordinates = coordinates.concat(rings[i]);
                    }
                    //const coordinates = feature.getGeometry().getCoordinates()[0];
                    return new MultiPoint(coordinates);
                },
            })
        ];
        feature.setStyle(styles);
        this.setFeatureText(feature, text);
        this.setfeaturezindex(feature, zindex);
    }
}


export default FeatureStyle;
