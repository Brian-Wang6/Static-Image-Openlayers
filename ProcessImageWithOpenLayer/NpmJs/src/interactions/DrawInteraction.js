import { Draw, Modify, Snap, Translate } from 'ol/interaction.js';
import { Style, Fill, RegularShape, Stroke, Circle } from 'ol/style.js';
import { default as Keyboard } from './Keyboard.js';
import MultiPoint from 'ol/geom/MultiPoint.js';


let keyboard, snap;

// Currently drawn feature
let sketch;

export function addDrawInteraction(map, source) {

    const draw = new Draw({
        source: source,
        type: 'Polygon',
        style: new Style({
            image: new RegularShape({
                fill: new Fill({
                    color: 'red'
                }),
                points: 4,
                radius1: 12,
                radius2: 1
            }),
            stroke: new Stroke({
                color: 'blue',
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(255, 99, 71, 0.2)'
            })
        })
    });
    map.addInteraction(draw);

    snap = new Snap({ source: source });
    map.addInteraction(snap);

    // Draw event
    draw.on('drawstart', function (evt) {
        console.log('event: ', evt);
        sketch = evt.feature;
        keyboard = new Keyboard({
            source: draw
        });
        map.addInteraction(keyboard);
    });
    draw.on('drawend', function (e) {
        // get coordinates
        const vertex_coordinate = sketch.getGeometry().getCoordinates();
        sketch.setStyle([
            new Style({
                fill: new Fill({
                    color: color()
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
                    const coordinates = feature.getGeometry().getCoordinates()[0];
                    return new MultiPoint(coordinates);
                },
            })
        ]);

        sketch.set('color', color());
        sketch.set('zIndex', Number(document.querySelector('#zIndex input').value));

        console.log(vertex_coordinate[0]);
        console.log(vertex_coordinate[0][0]);

        // unset sketch
        sketch = null;
        vertex_coordinate.length = 0;
        map.removeInteraction(keyboard);
    });

    return draw;

}

export function removeDrawInteraction(map, draw) {
    if (draw !== null) {
        map.removeInteraction(draw);
    }
}

function color() {
    var rgba = new Array(4);
    rgba[0] = Number(document.querySelector('#R input').value);
    rgba[1] = Number(document.querySelector('#G input').value);
    rgba[2] = Number(document.querySelector('#B input').value);
    rgba[3] = Number(document.querySelector('#A input').value);
    console.log('rgba: ', rgba);
    return rgba;
}
