window.app = new Backbone.Marionette.Application();

var app = window.app;

app.addRegions({
	mainRegion: '#content'
});

// My models

var PilotModel = Backbone.Model.extend({
	defaults: {
		name: 'Unassigned',
		rank: '--',
		level: 0,
		team: '--',
		shipId: 0
	}
});

var ShipModel = Backbone.Model.extend({
	defaults: {
		name: 'Unassigned',
		health: 0,
		speed: 0,
		storage: 0
	}
});

// Data

var raw = {};
raw.Pilots = [
	{id: 1, name: 'James T Kirk', rank: 'Captan', team: 'Federation', shipId: 1},
	{id: 2, name: 'Gene Starwind', rank: 'Capitan', team: 'Space Pirates', shipId: 2},
	{id: 3, name: 'Luke Skywalker', rank: 'Jedi Knight', team: 'Rebellion', shipId: 3},
	{id: 4, name: 'Jack Sparrow', rank: 'Admiral', team: 'Pirates', shipId: 0}
];
raw.Ships = [
	{id: 1, name: 'USS Enterprise', health: 100, speed: 5, storage: 19},
	{id: 2, name: 'Outlaw Star', health: 75, speed: 6, storage: 11},
	{id: 3, name: 'X-Wing Fighter', health: 100, speed: 5, storage: 2}
];

app.data = {};
app.data.Pilots = new Backbone.Collection( raw.Pilots );
app.data.Ships  = new Backbone.Collection( raw.Ships );

var MMV = Backbone.Marionette.ItemView.extend({
	constructor: function(){
		var args = Array.prototype.slice.apply(arguments);
		console.log(args);
		Marionette.ItemView.prototype.constructor.apply(this, args);
	}
});

// Module

app.module("List", function(List, app, Backbone, Marionette, $, _) {
	// List Module
	// ===========

	// Views
	// -----

	// show one pilot
	List.PilotItemView = Backbone.Marionette.ItemView.extend({
		template: '#tpl-PilotItemView',
		tagName: 'tr',
		tagClass: 'pilot-row',

		models: {
			ship: function(baseModel) {
				var ship = app.data.Ships.get( baseModel.get('shipId'));
				if( typeof ship === 'undefined' ) {
					return new ShipModel();
				}
				return ship;
			}
		},

		serializeData: function() {
			data = this.model.toJSON();
			var baseModel = this.model;
			var i = 0;
			_.each(this.models, function(element, index) {
				data[index] = element(baseModel).toJSON();
			});
			console.log(data);
			return data;
		}
	});

	// collection view to show a list of Pilots
	List.PilotListView = Backbone.Marionette.CompositeView.extend({
		itemView: List.PilotItemView,
		itemViewContainer: 'tbody',
		template: '#tpl-PilotListView'
	});

	// initalizer
	// ----------
	List.addInitializer(function() {
		var listView = new List.PilotListView({
			collection: app.data.Pilots
		});
		listView.render();
		app.mainRegion.show( listView );
	});
});