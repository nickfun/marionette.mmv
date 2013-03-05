
Backbone.Marionette.MultiModelView = Backbone.Marionette.ItemView.extend({
	constructor: function(){
		var args = Array.prototype.slice.apply(arguments);
		Marionette.ItemView.prototype.constructor.apply(this, args);
		console.warn(args);
	},

	serializeData: function() {
		var data = {};
		var baseModel = Marionette.getOption(this, 'model');
		var models = Marionette.getOption(this, 'models');
		if( baseModel instanceof Backbone.Model ) {
			data = baseModel.toJSON();
		}
		_.each(models, function(element, index) {
			if( element instanceof Backbone.Model ) {
				// use it as-is
				data[index] = element.attributes;
			} else if( typeof element === 'function') {
				// assume it is a fetch function
				var fetchedModel = element(baseModel);
				if( fetchedModel instanceof Backbone.Model ) {
					// use the fetchd model
					data[index] = fetchedModel.toJSON();
				} else {
					throw new Error("result of fetch function wasn't a Backbone Model")
				}
			} else {
				// error
				throw new Error("Must be a Backbone Model or a function that returns one")
			}
			
		});
		return data;
	}
});