export function setfeaturezindex(feature, zindex) {
    var style = feature.getStyle();
    if (style != null) {
        style.setZIndex(zindex);
    }
}