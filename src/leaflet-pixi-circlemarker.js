/*
 * L.PixiCircleMarker is a circle overlay with a permanent pixel radius.
 */

L.PixiCircleMarker = L.Path.extend({

	options: {
		fill: true,
		fillOpacity: 1,
		radius: 10,
		renderer: new L.pixi(),
		uuid: new String().genUUID(),
		padding: 0.1,
	},

	initialize: function (latlng, options) {		
		L.setOptions(this, options);		
		this._latlng = L.latLng(latlng);
		this._radius = this.options.radius;
	},

	getEvents: function () {
		var events = {
			zoom: this._renderer._updateTransformPixiCircleMarker
		};

		return events;
	},


	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		this.redraw();
		return this.fire('move', {latlng: this._latlng});
	},

	getLatLng: function () {
		return this._latlng;
	},

	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._radius;
	},

	setStyle : function (options) {
		var radius = options && options.radius || this._radius;
		L.Path.prototype.setStyle.call(this, options);
		this.setRadius(radius);
		return this;
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._updateBounds();
	},

	_updateBounds: function () {
		var r = this._radius,
		    r2 = this._radiusY || r,
		    w = this._clickTolerance(),
		    p = [r + w, r2 + w];
		this._pxBounds = new L.Bounds(this._point.subtract(p), this._point.add(p));
	},

	_update: function () {
		if (this._map) {
			this._updatePath();
		}
	},

	_updatePath: function () {
		this._renderer._updateCircle(this);
	},

	_empty: function () {
		return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
	}
});

L.pixiCircleMarker = function (latlng, options) {
	return new L.PixiCircleMarker(latlng, options);
};