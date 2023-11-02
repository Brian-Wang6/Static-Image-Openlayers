import Select from 'ol/interaction/Select.js';
import { Fill, Stroke, Style } from 'ol/style.js';


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

export function addSelectInteraction(map) {
	//selectSingleClick = new Select({ style: selectStyle });
	const selectSingleClick = new Select({ style: null });
	if (selectSingleClick !== null) {
		map.addInteraction(selectSingleClick);
		selectSingleClick.on('select', function (e) {
			selectFeature = e.selected[0];
			if (selectFeature !== undefined) {
				console.log('selected feature: ', selectFeature);
				selectFeature.getStyle().setStroke(
					new Stroke({
						color: 'rgba(255,255,255,0.7)',
						width: 2,
					})
				);
				selectFeature.changed();
			}
			
			var deselected = e.deselected[0];
			if (deselected !== undefined) {
				deselected.getStyle().setStroke();
				deselected.changed();
			}
			
		});
	}
	return selectSingleClick;
}

export function removeSelectInteraction(map, selectSingleClick) {
	
	if (selectSingleClick !== undefined) {
		selectSingleClick.getFeatures().forEach((item) => {
			item.getStyle().setStroke();
			item.changed();
		});
		map.removeInteraction(selectSingleClick);
	}
}