import Select from 'ol/interaction/Select.js';
import { Fill, Stroke, Style } from 'ol/style.js';


let select;

const selectedStyle = new Style({
	fill: new Fill({
		color: '#eeeeee',
	}),
	stroke: new Stroke({
		color: 'rgba(255,255,255,0.7)',
		width: 2,
	}),
});

function selectStyle(feature) {
	
	const color = feature.get('color') || '#eeeeee';
	selectedStyle.getFill().setColor(color);
	return selectedStyle;
}

export const selectSingleClick = new Select({ style: selectStyle });
//export const selectSingleClick = new Select();

let selectFeature;

export function addSelectInteraction(map) {
	select = selectSingleClick;
	if (select !== null) {
		map.addInteraction(select);
		select.on('select', function (e) {
			selectFeature = e.selected[0];
		});
	}
	//return selectFeature;
}

export function removeSelectInteraction(map) {
	if (select !== null) {
		map.removeInteraction(select);
	}
}