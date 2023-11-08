import Select from 'ol/interaction/Select.js';
import { Draw, Modify, Snap, Translate } from 'ol/interaction.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import { default as Keyboard } from './Keyboard.js';


//let select;

const selectedStyle = new Style({
	fill: new Fill({
		color: '#eeeeee',
	}),
	stroke: new Stroke({
		color: 'rgba(255,255,255,0.7)',
		width: 2,
	}),
	zIndex: 0
});

function selectStyle(feature) {
	
	const color = feature.get('color') || '#eeeeee';
	selectedStyle.getFill().setColor(color);
	const zIndex = feature.get('zIndex') || 0;
	selectedStyle.setZIndex(zIndex);
	return selectedStyle;
}

//export let selectSingleClick;
//export const selectSingleClick = new Select({ style: null });

//export const selectSingleClick = new Select();

let selectFeature;
let keyboard;
let translate;

export function addSelectInteraction(map, source) {
	//selectSingleClick = new Select({ style: selectStyle });
	const selectSingleClick = new Select({ style: null });
	if (selectSingleClick !== null) {
		map.addInteraction(selectSingleClick);
		addKeyboardInteraction(map, source, selectSingleClick);
		addTranslateInteraction(map, selectSingleClick);
		selectSingleClick.on('select', function (e) {
			selectFeature = e.selected[0];
			if (selectFeature !== undefined) {
				console.log('selected feature: ', selectFeature);
                if (selectFeature.getStyle() !== null) {
					selectFeature.getStyle()[0].setStroke(
						new Stroke({
							color: 'rgba(255,255,255,0.7)',
							width: 2,
						})
					);
					selectFeature.changed();
                }				
			}
			
			var deselected = e.deselected[0];
			if (deselected !== undefined) {
                if (deselected.getStyle() !== null) {
					deselected.getStyle()[0].setStroke();
					deselected.changed();
                }				
			}			
		});
	}
	return selectSingleClick;
}

export function removeSelectInteraction(map, selectSingleClick) {
	
	if (selectSingleClick !== undefined) {
		selectSingleClick.getFeatures().forEach((item) => {
            if (item.getStyle() !== null) {
				item.getStyle()[0].setStroke();
				item.changed();
            }			
		});
		map.removeInteraction(selectSingleClick);
	}
	removeKeyboardInteraction(map);
	removeTranslateInteraction(map);
}

function addKeyboardInteraction(map, source, target) {
	keyboard = new Keyboard({
		source: source,
		target: target
	});
	map.addInteraction(keyboard);
	return keyboard;
}

function removeKeyboardInteraction(map) {
    if (keyboard !== null) {
		map.removeInteraction(keyboard);
    }
}

function addTranslateInteraction(map, select) {
	translate = new Translate({
		features: select.getFeatures(),
	});
	map.addInteraction(translate);
	return translate;
}

function removeTranslateInteraction(map) {
    if (translate !== null) {
		map.removeInteraction(translate);
    }
}
