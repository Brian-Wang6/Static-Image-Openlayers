import { Pointer, Draw, Select } from 'ol/interaction.js';
import { noModifierKeys, targetNotEditable } from 'ol/events/condition.js';
import Static from 'ol/source/ImageStatic.js';
import { Vector as VectorSource } from 'ol/source.js';


class Keyboard extends Pointer {
    constructor(options) {
        super();

        options = options || {};

        this.source_ = options.source !== undefined ? options.source : null;

        this.target_ = options.target !== undefined ? options.target : null;

        this.defaultCondition_ = function (mapBrowserEvent) {
            console.log('options: ', options);
            return noModifierKeys(mapBrowserEvent) && targetNotEditable(mapBrowserEvent);
        }

        this.condition_ = options.condition !== undefined ? options.condition : this.defaultCondition_;
    }

    handleEvent(mapBrowserEvent) {
        let stopEvent = false;        
        if (mapBrowserEvent.type == 'keydown') {
            const keyEvent = mapBrowserEvent.originalEvent;
            const key = keyEvent.key;
            if (this.condition_(mapBrowserEvent) && (key == 'Delete')) {
                if (this.target_ !== null && this.target_ instanceof Select && this.source_ instanceof VectorSource) {
                    const feature = this.target_.getFeatures().item(0);
                    this.source_.removeFeature(feature);
                }
                
                keyEvent.preventDefault();
                stopEvent = true;
            }
            if (this.condition_(mapBrowserEvent) && (key == 'Escape')) {
                if (this.source_ instanceof Draw) {
                    this.source_.removeLastPoint();
                }
                
                keyEvent.preventDefault();
                stopEvent = true;
            }
        }
        return !stopEvent;
    }
}

export default Keyboard;
       