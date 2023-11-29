class OLGeometry {
    constructor(options) {
        options = options || {};
        this.type = options.type !== undefined ? options.type : null;
        this.coordinates = options.coordinates !== undefined ? options.coordinates : new Array();
        
    }
}

class OLFeature {
    constructor(options) {
        options = options || {};

        this.type = 'Feature';
        this.geometry = new OLGeometry(options);
        this.id = options.id !== undefined ? options.id : null;
        this.properties = options.properties !== undefined ? options.properties : null;
    }
}

export default OLFeature;