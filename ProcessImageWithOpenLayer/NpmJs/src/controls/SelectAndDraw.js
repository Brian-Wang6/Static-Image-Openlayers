import { Control } from 'ol/control.js';
import Select from 'ol/interaction/Select.js';
import { addSelectInteraction, removeSelectInteraction } from '../interactions/SelectInteraction.js';
import { addDrawInteraction, removeDrawInteraction } from '../interactions/DrawInteraction.js';
import { default as Cut } from '../interactions/Cut.js';
import { Draw, Modify, Snap, Translate } from 'ol/interaction.js';


export class SelectAndDraw extends Control {
    
    constructor(options) {
        console.log('options: ', options);
        options = options || {};

        const select = document.createElement('button');
        select.innerHTML = '<i class="fa-solid fa-arrow-pointer"></i>';
        select.className = 'select-draw-select';
        select.setAttribute('type', 'button');
        select.title = 'Select polygon';

        const draw = document.createElement('button');
        draw.innerHTML = '<i class="fa-solid fa-draw-polygon"></i>';
        draw.className = 'select-draw-draw';
        draw.setAttribute('type', 'button');
        draw.title = 'Draw polygon';

        const cut = document.createElement('button');
        cut.innerHTML = '<i class="fa-solid fa-scissors"></i>';
        cut.className = 'select-draw-cut';
        cut.setAttribute('type', 'button');
        cut.title = 'Cut polygon';

        const save = document.createElement('button');
        save.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        save.className = 'select-draw-save';
        save.setAttribute('type', 'button');
        save.title = 'Save polygon';

        const element = document.createElement('div');
        element.className = 'select-draw ol-unselectable ol-control';
        element.appendChild(select);
        element.appendChild(draw);
        element.appendChild(cut);
        element.appendChild(save);

        super({
            element: element,
            target: options.target,
        });

        select.addEventListener('click', this.handleSelectBtnClick.bind(this), false);
        draw.addEventListener('click', this.handleDrawBtnClick.bind(this), false);
        cut.addEventListener('click', this.handleCutBtnClick.bind(this), false);
        save.addEventListener('click', this.handleSaveBtnClick.bind(this), false);

        this.selectInteraction;
        this.drawInteraction;
        this.source_ = options.source !== undefined ? options.source : null;
    }

    getSelectInteraction() {
        return this.selectInteraction;
    }

    getDrawInteraction() {
        return this.drawInteraction;
    }

    handleSelectBtnClick() {
        const interactions = this.getMap().getInteractions().getArray();
        for (var i = interactions.length - 1; i >= 0; --i) {
            const interaction = interactions[i];
            if (interaction instanceof Select) {
                removeSelectInteraction(this.getMap(), interaction);
            }
            else if (interaction instanceof Draw) {
                removeDrawInteraction(this.getMap(), interaction);
            }
        }
        this.selectInteraction = addSelectInteraction(this.getMap(), this.source_);
    }

    handleDrawBtnClick() {
        const interactions = this.getMap().getInteractions().getArray();
        for (var i = interactions.length - 1; i >= 0; --i) {
            const interaction = interactions[i];
            if (interaction instanceof Draw) {
                removeDrawInteraction(this.getMap(), interaction);
            }
            else if (interaction instanceof Select) {
                removeSelectInteraction(this.getMap(), interaction);
            }
        }

        this.drawInteraction = addDrawInteraction(this.getMap(), this.source_);
    }

    handleCutBtnClick() {
        const interactions = this.getMap().getInteractions().getArray();
        for (var i = interactions.length - 1; i >= 0; --i) {
            const interaction = interactions[i];
            if (interaction instanceof Draw) {
                removeDrawInteraction(this.getMap(), interaction);
            }
            else if (interaction instanceof Select) {
                removeSelectInteraction(this.getMap(), interaction);
            }
        }

        const cut = new Cut({
            type: 'Polygon',
            map: this.getMap(),
            source: this.source_
        });

    }

    handleSaveBtnClick() {
        const data = [];
        //let polygons = [];
        //let points = [];
        //const point = {};
        //let geom = {};
        //let polygon = {};
        const features = this.source_.getFeatures();
        console.log(features.length);
        features.forEach((feature) => {
            var fStyle = feature.getStyle()[0];
            console.log('style: ', fStyle);
            var locationId;
            if (fStyle !== null) {
                locationId = fStyle.getText() != null ? (fStyle.getText().getText() != null ? fStyle.getText().getText() : 0) : 0;
                if (locationId === 0) {
                    alert("One area got no location set");
                    return;
                }
            }
            else {
                alert("There's a issue when saving one area.");
                return;
            }
            var polygons = [];
            const coordinates = feature.getGeometry().getCoordinates();
            coordinates.forEach((coordinate) => {
                var points = [];
                coordinate.forEach((p) => {
                    
                    var point = {};
                    point.X = p[0];
                    point.Y = p[1];
                    points.push(point);
                });
                //var polygon = {};
                //polygon.Vertices = points;
                polygons.push(points);
            });
            var geom = {};
            geom.LocationUID = Number(locationId);
            geom.Points = polygons;
            data.push(geom);
            console.log('data: ', data);
        });
        var jsonData = JSON.stringify(data);
        DotNet.invokeMethodAsync('ProcessImageWithOpenLayer', 'SavePolygonAsync', jsonData)
            .then(data => {
                console.log(data);
            });
    }
}

