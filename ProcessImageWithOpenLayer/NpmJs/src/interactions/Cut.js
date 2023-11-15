import { Draw } from 'ol/interaction.js';
import { LinearRing, Polygon } from 'ol/geom.js';

class Cut {
    constructor(options) {
        options = options || {};

        this.type_ = options.type !== undefined ? options.type : null;
        this.map_ = options.map !== undefined ? options.map : null;
        this.source_ = options.source !== undefined ? options.source : null;
        this.features_ = [];

        this.draw_ = new Draw({
            type: this.type_,
            stopClick: true,
            source: this.source_
        });

        this.draw_.on('drawstart', this.onDrawStart);
        this.draw_.on('drawend', this.onDrawEnd);

        this.map_.addInteraction(this.draw_);
    }

    onDrawStart = (e) => {
        this.source_.forEachFeatureIntersectingExtent(e.feature.getGeometry().getExtent(), (f) => {
            this.intersected_ = f;
        });
        if (!this.intersected_) {
            alert('No feature found to draw holes');
            e.target.abortDrawing();
            return;
        }
        this.coords_length_ = this.intersected_.getGeometry().getCoordinates().length;

        e.feature.getGeometry().on('change', this.onGeomChange);
    }

    onDrawEnd = (e) => {
        setTimeout(() => {
            this.source_.removeFeature(e.feature);
        }, 5);
        this.intersected_ = undefined;
    }

    onGeomChange = (e) => {
        let linear_ring = new LinearRing(e.target.getCoordinates()[0]);
        let coordinates = this.intersected_.getGeometry().getCoordinates();
        //let geom = this.intersected_.getGeometry().getCoordinates();
        let geom = new Polygon(coordinates.slice(0, this.coords_length_));
        geom.appendLinearRing(linear_ring);
        this.intersected_.setGeometry(geom);
    }
}

export default Cut;