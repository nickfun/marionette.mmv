// Marionette.MultiModelView v0.9.0
// Copyright (c)2013 Nicholas Funnell <nick@nick.gs>
// Distributed under MIT license
// http://github.com/nickfun/marionette.mmv

/*! Marionette.MultiModelView by Nicholas Funnell <http://nick.gs/> */
Backbone.Marionette.MultiModelView = Backbone.Marionette.ItemView.extend({
	constructor: function(){
		var args = Array.prototype.slice.apply(arguments);
		Marionette.ItemView.prototype.constructor.apply(this, args);
	},

	serializeData: function() {
		// the data variable will be returned by serializeData
		var data = {};	
		// baseModel is the model that an ItemView would normally use
		var baseModel = Marionette.getOption(this, 'model'); 
		// models is the added option that MMV cares about
		var models = Marionette.getOption(this, 'models');
		// each element in the 'models' option is either a Backbone.Model
		// or a function that should return a Backbone.Model
		// index will be the prefix/namespace for the data in the model
		_.each(models, function(element, index) {
			if( element instanceof Backbone.Model ) {
				// use it as-is
				data[index] = element.attributes;
			} else if( typeof element === 'function') {
				// assume it is a fetch function
				var fetchedModel = element(baseModel);
				// ensure we get a Backbone.Model as expected
				if( fetchedModel instanceof Backbone.Model ) {
					// use the fetched model
					data[index] = fetchedModel.toJSON();
				} else {
					// function returned something else, bailing out :(
					throw new Error("result of fetch function wasn't a Backbone Model")
				}
			} else {
				// error
				throw new Error("Must be a Backbone Model or a function that returns one")
			}
		});
		// if a normal model is used, its attributes get 
		// the root namespace without any prefix
		// Note that the base model will overwrite anything that is already there
		// so be careful of collisions with the names being passed in on the 'models' option
		if( baseModel instanceof Backbone.Model ) {
			data = _.extend(data, baseModel.toJSON());
		}
		console.log('serializeData:', data);
		return data;
	}
});