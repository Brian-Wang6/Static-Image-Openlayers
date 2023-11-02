import { Style, Fill, Text, Stroke } from 'ol/style.js';
class FeatureStyle {
    label = new Text({
        font: '26px Calibri,sans-serif',
        fill: new Fill({
            color: '#000',
        }),
        stroke: new Stroke({
            color: '#fff',
            width: 4,
        }),
    });

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
            this.label.setText(text);
            style.setText(this.label);
            feature.changed();
        }
    }
}


export default FeatureStyle;
