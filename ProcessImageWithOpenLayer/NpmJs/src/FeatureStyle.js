import { Style, Fill, Text, Stroke } from 'ol/style.js';
class FeatureStyle {
    
    setfeaturezindex(feature, zindex) {
        if (feature === undefined)
            return;
        var style = feature.getStyle();
        if (style !== undefined) {
            style.setZIndex(zindex);
            feature.changed();
        }
    }

    setFeatureText(feature, text) {
        if (feature === undefined)
            return;
        var style = feature.getStyle();
        if (style !== undefined) {
            var label = new Text({
                font: '26px Calibri,sans-serif',
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
}


export default FeatureStyle;
