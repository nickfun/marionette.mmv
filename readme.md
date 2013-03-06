# Multi-Model View for Marionette

This is a plugin for [Marionette](http://www.marionettejs.com). It is a specialized ItemView 
that you can use when you want to show more than one model in your view.

## Usage

Here is a simple example, but see our wiki on github for more details.

In normal usage of an ItemView, you pass in a model propery to the options when defining an ItemView or creating an instance using `new`. With the MultiModelView, you can pass in several models using the `models` propery of the options. 

### Example 1

Say we are making a game involving spaceships. You will have a player and the player has a score. You could have a model for the score and for the player. How would you show the data for both in one view? Lets make a score screen using MultiModelView.

	var playerModel = new PlayerModel({ id: 1, name: 'Player 1' });
	var scoreModel  = new ScoreModel({ current: 100, record: 1200, player_id: 1 });
	
	var myScoreScreenView = new Backbone.Marionette.MultiModelView({
	  models: {
	    player: playerModel,
	    score: scoreModel
	  },
	  template: '#tpl-scorescreen'
	});

	//define your template somewhere:
	<script type="text/template" id="tpl-scorescreen">
      <h3> <%= player.name %> </h3>
      <div class="currentScore"> <%= score.current %> </div>
      <div class="recordScore"> <%= score.record %> </div>
	</script>

The keys in the `models` object become the prefix/namespace for the data in the models.


### Example 2

In the first example we defined all the models and passed them in at once. This is fine if your are just going to show one ItemView, but often you want to use an ItemView inside a CollectionView or a CompositeView. The big issue here is that those views run on a Backbone.Collection and will automatically pass in a model the normal way and not use our `models` object. How can we add more modles in this situation?

Let's call the model that a CollectionView or CompositeView pass in a *base model*. As long as the other models you want to pass in are related to this base model, you can define a function to get the other models. Define your function instead of passing in the model.

	var myScoreScreenView = Backbone.Marionette.MultiModelView.extend({
	  models: {
	    score: function(baseModel) {
	      return getScoreByPlayerId( baseModel.id );
	    }
	  }
	});

	var myCollectionView = new Backbone.Marionette.CollectionView({
	  ItemView: myScoreScreenView,
	  collection: playerCollection
	});

When the CollectionView passes a model to the MutliModelView, my plugin will check the `models` object and see if you have a model there or a function that takes a model. If you have put a function there, then the function will be called and the model from the CollectionView will be passed as an argument. Your function should use that model to return the other model that you want.