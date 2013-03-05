window.app = new Backbone.Marionette.Application();

var app = window.app;

app.addRegions({
	mainRegion: '#content',
	kirkRegion: '#kirk'
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

var ScoreModel = Backbone.Model.extend({
	defaults: {
		currentScore: 1000,
		highScore: 2000
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

// Module

app.module("List", function(List, app, Backbone, Marionette, $, _) {
	// List Module
	// ===========

	// Views
	// -----

	// show one pilot
	List.PilotItemView = Backbone.Marionette.MultiModelView.extend({
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
		}
	});

	// collection view to show a list of Pilots
	List.PilotListView = Backbone.Marionette.CompositeView.extend({
		itemView: List.PilotItemView,
		itemViewContainer: 'tbody',
		template: '#tpl-PilotListView'
	});

	// initalizers
	// -----------

	// show the list view
	List.addInitializer(function() {
		var listView = new List.PilotListView({
			collection: app.data.Pilots
		});
		app.mainRegion.show( listView );
	});

	// show the one view
	List.addInitializer(function() {
		var kirk = app.data.Pilots.get(1);
		var myScore = new ScoreModel();
		var oneView = new Backbone.Marionette.MultiModelView({
			template: '#tpl-kirk',
			models: {
				pilot: kirk,
				score: myScore
			}
		});
		app.kirkRegion.show( oneView );
	});

});