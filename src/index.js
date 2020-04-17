import Geohash from 'latlon-geohash';
import last from 'lodash/last';

L.GridlineLayer = L.FeatureGroup.extend({
  initialize(options = {}) {
    // polyline options
    const defaultOptions = {
      color: '#979797',
      weight: '1',
      geohashLength: 7,
    };
    Object.assign(this.options, defaultOptions, options);
    this.mapHandles = [];
  },
  onAdd(map) {
    this._map = map;
    this.layer = L.featureGroup().addTo(this._map);
    this._draw();
    this._bindMapEvents();
    return this;
  },
  onRemove() {
    this._map.removeLayer(this.layer);
    this.mapHandles.forEach(({ type, handle }) => this._map.off(type, handle));
    this.mapHandles = [];
  },
  _draw() {
    this.layer.clearLayers();

    // get map bottom left latlng
    const bounds = this._map.getBounds();
    const mapSWPoint = bounds.getSouthWest();
    const mapNEPoint = bounds.getNorthEast();
    const SWGeohash = Geohash.encode(
      mapSWPoint.lat,
      mapSWPoint.lng,
      this.options.geohashLength
    );
    /**
     * const bounds = {
          sw: { lat: latMin, lon: lonMin },
          ne: { lat: latMax, lon: lonMax },
      };
     */
    const geohashSWBounds = Geohash.bounds(SWGeohash);
    const latStep = Math.abs(geohashSWBounds.sw.lat - geohashSWBounds.ne.lat);
    const lngStep = Math.abs(geohashSWBounds.sw.lon - geohashSWBounds.ne.lon);

    // 网格线刻度值
    const latSplit = [geohashSWBounds.sw.lat];
    while (last(latSplit) < mapNEPoint.lat) {
      latSplit.push(last(latSplit) + latStep);
    }
    const lngSplit = [geohashSWBounds.sw.lon];
    while (last(lngSplit) < mapNEPoint.lng) {
      lngSplit.push(last(lngSplit) + lngStep);
    }

    // draw lat splits
    latSplit.forEach((lat) => {
      const polylineLayer = L.polyline(
        [
          [lat, lngSplit[0]],
          [lat, last(lngSplit)],
        ],
        this.options
      );
      this.layer.addLayer(polylineLayer);
    });
    // draw lng splits
    lngSplit.forEach((lng) => {
      const polylineLayer = L.polyline(
        [
          [latSplit[0], lng],
          [last(latSplit), lng],
        ],
        this.options
      );
      this.layer.addLayer(polylineLayer);
    });
  },
  _bindMapEvents() {
    const redraw = () => this._draw();
    ['moveend', 'zoomend'].forEach((event) => {
      this._map.on(event, redraw);
      this.mapHandles.push({ type: event, handle: redraw });
    });
  },
});

L.gridlineLayer = function (options) {
  return new L.GridlineLayer(options);
};
