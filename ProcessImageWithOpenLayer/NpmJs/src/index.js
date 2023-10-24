﻿import ImageLayer from 'ol/layer/Image.js';
import Map from 'ol/Map.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import View from 'ol/View.js';
import { getCenter } from 'ol/extent.js';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import MousePosition from 'ol/control/MousePosition.js';
import { defaults as defaultControls } from 'ol/control.js';
import { createStringXY } from 'ol/coordinate.js';
import { addSelectInteraction, removeSelectInteraction, selectSingleClick } from './select.feature.js';
import { default as Keyboard } from './Keyboard.js';
import { Style, Fill, RegularShape, Stroke } from 'ol/style.js';


//const extent = [0, 0, 1024, 968];
const extent = [0, 0, 1040, 720];

const projection = new Projection({
    code: 'xkcd-image',
    
    units: 'pixels',
    extent: extent,
});

const imageSource = new Static({
    attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
    
    url: 'https://imgs.xkcd.com/comics/online_communities.png',
    projection: projection,
    imageExtent: extent,
});

const source = new VectorSource();
const vector = new VectorLayer({
    source: source,
    style: {
        'fill-color': 'rgba(255, 99, 71, 0.2)',
        'stroke-color': '#0000ff',
        'stroke-width': 2,
        'circle-radius': 1,
        'circle-fill-color': '#0000ff',
    },
    extent: extent,
});

const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: projection,

});

const map = new Map({
    controls: defaultControls().extend([mousePositionControl]),
    layers: [
        new ImageLayer({
            source: imageSource,
        }),
        vector
    ],
    target: 'map',
    view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8,
    }),
});

const modify = new Modify({ source: source });
map.addInteraction(modify);

// Declare interaction
let draw, snap;
// Currently drawn feature
let sketch;
// Vertex coordinates
let vertex_coordinate; 

function addDrawInteraction() {
    draw = new Draw({
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

    // Draw event
    draw.on('drawstart', function (evt) {
        console.log('event: ', evt);
        sketch = evt.feature;
    });
    draw.on('drawend', function (e) {
        // get coordinates
        vertex_coordinate = sketch.getGeometry().getCoordinates();
        sketch.setStyle(new Style({
            fill: new Fill({
                color: color()
            })
        }));
        sketch.set('color', color());
        
        el('coordinates').innerText = vertex_coordinate;
        console.log(vertex_coordinate[0]);
        console.log(vertex_coordinate[0][0]);

        // unset sketch
        sketch = null;
        vertex_coordinate.length = 0;
    })

    snap = new Snap({ source: source });
    map.addInteraction(snap);
}

function removeDrawInteraction() {
    if (draw !== null) {
        map.removeInteraction(draw);
    }
}

//addInteractions();

let keyboard;

// selct interaction
function onSelectFeature() {
    console.log('going to select features');
    removeDrawInteraction();
    addSelectInteraction(map);
    keyboard = new Keyboard({
        source: source,
        target: selectSingleClick
    });
    map.addInteraction(keyboard);
}

function onDrawFeature() {
    console.log('going to draw features');
    removeSelectInteraction(map);
    addDrawInteraction();
}

function el(id) {
    return document.getElementById(id);
}

function color() {
    var rgba = new Array(4);   
    rgba[0] = Number(document.querySelector('#R input').value);
    rgba[1] = Number(document.querySelector('#G input').value);
    rgba[2] = Number(document.querySelector('#B input').value);
    rgba[3] = Number(document.querySelector('#A input').value);
    return rgba;
}

document.getElementById('selectbtn').onclick = function () {
    onSelectFeature();
}

document.getElementById('drawbtn').onclick = function () {
    onDrawFeature();
}
