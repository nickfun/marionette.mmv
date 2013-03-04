window.app = new Backbone.Marionette.Application()

app = window.app

app.addRegions
	mainRegion: '#content'

console.log 'hello world'

PilotModel = Backbone.Model.extend
	defaults:
		name: 'Unassigned',
		rank: '--',
		team: '--',
		level: 0,
		shipId: 0

ShipModel = Backbone.Model.extend
	defaults:
		name: 'Unassigned'
		health: 0
		speed: 0
		storage: 0

# data
raw = {}
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

# data pools
app.data = {}
app.data.Pilots = new Backbone.Collection raw.Pilots
app.data.Ships 	= new Backbone.Collection raw.Ships

app.module "List", (List,app,Backbone,Marionette,$,_) ->
	# Views
	# -----

	# Show a pilot
	List.PilotItemView = Backbone.Marionette.ItemView.extend
		template: '#tpl-PilotItemView',
		tagName: 'tr',
		tagClass: 'pilot-row',

		models:
			ship: (baseModel) ->
				ship = app.data.Ships.get baseModel.id
				if typeof ship != 'undefined'
					ship
				else
					new ShipModel()

		serializeData: ->
			data = this.model.toJSON();
			baseModel = this.model
			_.each this.models, (getModel, index) ->
				data[index] = getModel(baseModel).toJSON()
			data

	# show a list of Pilots
	List.PilotListView = Backbone.Marionette.CompositeView.extend
		itemView: List.PilotItemView
		itemViewContainer: 'tbody'
		template: '#tpl-PilotListView'

	# initalizer
	List.addInitializer = ->
		console.log "hello world"
		listView = new List.PilotListView
			collection: app.data.Pilots
		listView.render()
		app.mainRegion.show listView
	null

console.log "bye bye from app.js"