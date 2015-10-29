import Ember from 'ember';

export default Ember.Component.extend({

  donorConditions: Ember.computed(function(){
    var store = this.get('targetObject.store');
    return store.peekAll('donor_condition').sortBy('id');
  })

});
