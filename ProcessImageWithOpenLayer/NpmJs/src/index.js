import ImageLayer from 'ol/layer/Image.js';
import Map from 'ol/Map.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import View from 'ol/View.js';
import { getCenter } from 'ol/extent.js';
import { Draw, Modify, Snap, Translate } from 'ol/interaction.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import MousePosition from 'ol/control/MousePosition.js';
import { defaults as defaultControls } from 'ol/control.js';
import { createStringXY } from 'ol/coordinate.js';
//import { originalFeatureStyles } from 'ol/interaction/Select.js';
import { Style, Fill, RegularShape, Stroke } from 'ol/style.js';
import { addSelectInteraction, removeSelectInteraction } from './interactions/SelectInteraction.js';
import { default as Keyboard } from './interactions/Keyboard.js';
import { default as FeatureStyle } from './FeatureStyle.js';
import { SelectAndDraw } from './controls/SelectAndDraw.js';


const extent = [0, 0, 2960, 1040];
//const extent = [0, 0, 1040, 720];
const featureStyle = new FeatureStyle();

const projection = new Projection({
    //code: 'xkcd-image',
    code: 'floor-image',
    units: 'pixels',
    extent: extent,
});

const imageSource = new Static({
    attributions: '© <a href="https://cadi.com.sg/">cadi</a>',
    url: './images/1003.jpg',
    //url: 'https://imgs.xkcd.com/comics/online_communities.png',
    projection: projection,
    imageExtent: extent,
});

DotNet.invokeMethodAsync('ProcessImageWithOpenLayer', 'GetPolygonsAsync')
    .then(data => {
        console.log(data);
    });

const source = new VectorSource();
const vector = new VectorLayer({
    source: source,
    //style: {
    //    'fill-color': 'rgba(255, 99, 71, 0.2)',
    //    'stroke-color': '#0000ff',
    //    'stroke-width': 2,
    //    'circle-radius': 1,
    //    'circle-fill-color': '#0000ff',
    //},
    //extent: extent,
});

const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: projection,

});

const selectAndDraw = new SelectAndDraw({
    source: source
});

const map = new Map({
    controls: defaultControls().extend([mousePositionControl, selectAndDraw]),
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
let draw;

// Currently drawn feature
let sketch;
// Vertex coordinates
let vertex_coordinate; 
let featureId = 0;

let keyboard;   //keyboard interaction to handle keyboard event
let select;     //select interaction to handle select event
let translate;  //translate interaction to handle move feature event

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
        keyboard = new Keyboard({
            source: draw
        });
        map.addInteraction(keyboard);
    });
    draw.on('drawend', function (e) {
        // get coordinates
        vertex_coordinate = sketch.getGeometry().getCoordinates();
        sketch.setStyle(new Style({
            fill: new Fill({
                color: color()
            })
        }));
        sketch.setId(featureId++);
        sketch.set('color', color());
        sketch.set('zIndex', Number(document.querySelector('#zIndex input').value));

        el('coordinates').innerText = vertex_coordinate;
        console.log(vertex_coordinate[0]);
        console.log(vertex_coordinate[0][0]);

        // unset sketch
        sketch = null;
        vertex_coordinate.length = 0;

        map.removeInteraction(keyboard);
    });
    
}

function removeDrawInteraction() {
    if (draw !== null) {
        map.removeInteraction(draw);
    }
}


function addKeyboardInteraction() {    
    keyboard = new Keyboard({
        source: source,
        target: select
    });
    map.addInteraction(keyboard);
}

function removeKeyboardInteraction() {
    if (keyboard != null) {
        map.removeInteraction(keyboard);
    }
}

function addTranslateInteraction(map, select) {
    var translate = new Translate({
        features: select.getFeatures(),
    });
    map.addInteraction(translate);
    return translate;
}

function removeTranslateInteraction(map, translate) {
    if (translate !== null) {
        map.removeInteraction(translate);
    }
}

// selct interaction
function onSelectFeature() {
    console.log('going to select features');
    removeDrawInteraction();
    removeTranslateInteraction(map, translate);
    removeSelectInteraction(map, select);
    select = addSelectInteraction(map, source);
    translate = addTranslateInteraction(map, select);
    removeKeyboardInteraction();
    addKeyboardInteraction();
}

function onDrawFeature() {
    console.log('going to draw features');
    removeTranslateInteraction(map, translate);
    removeSelectInteraction(map, select);
    removeKeyboardInteraction();
    removeDrawInteraction();
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
    console.log('rgba: ', rgba);
    return rgba;
}


//document.getElementById('selectbtn').onclick = function () {    
//    onSelectFeature();
//}

//document.getElementById('drawbtn').onclick = function () {
//    onDrawFeature();
//}

document.getElementById('zIndexBtn').onclick = function () {
    var zIndex = Number(document.querySelector('#zIndex input').value);
    if (selectAndDraw.getSelectInteraction() !== undefined) {
        featureStyle.setfeaturezindex(selectAndDraw.getSelectInteraction().getFeatures().item(0), zIndex);
    }    
}

document.getElementById('locationBtn').onclick = function () {
    var location = document.querySelector('#location input').value;
    if (selectAndDraw.getSelectInteraction() !== undefined) {
        featureStyle.setFeatureText(selectAndDraw.getSelectInteraction().getFeatures().item(0), location);
    }    
}

//onSelectFeature();

//DotNet.invokeMethodAsync('ProcessImageWithOpenLayer', 'SavePolygonAsync')
//    .then(data => {
//        console.log(data);
//    });
