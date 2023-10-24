import { Pointer } from 'ol/interaction.js';
import { noModifierKeys, targetNotEditable } from 'ol/events/condition.js';
import Static from 'ol/source/ImageStatic.js';


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
                const feature = this.target_.getFeatures().item(0);

                if (key == 'Delete') {
                    this.source_.removeFeature(feature);
                }

                keyEvent.preventDefault();
                stopEvent = true;
            }
        }
        return !stopEvent;
    }
}

export default Keyboard;
       