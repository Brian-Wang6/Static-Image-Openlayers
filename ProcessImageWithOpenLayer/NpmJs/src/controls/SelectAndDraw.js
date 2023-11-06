import { Control } from 'ol/control.js';
import Select from 'ol/interaction/Select.js';
import { addSelectInteraction, removeSelectInteraction } from '../interactions/SelectInteraction.js';
import { addDrawInteraction, removeDrawInteraction } from '../interactions/DrawInteraction.js';
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

        const element = document.createElement('div');
        element.className = 'select-draw ol-unselectable ol-control';
        element.appendChild(select);
        element.appendChild(draw);

        super({
            element: element,
            target: options.target,
        });

        select.addEventListener('click', this.handleSelectBtnClick.bind(this), false);
        draw.addEventListener('click', this.handleDrawBtnClick.bind(this), false);

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
}

