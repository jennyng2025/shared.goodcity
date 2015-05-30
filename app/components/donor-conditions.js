import Ember from 'ember';

export default Ember.Component.extend({

  donorConditions: function() {
    var store = this.get('targetObject.store');
    return store.all('donor_condition').sortBy('id');
  }.property()

});
