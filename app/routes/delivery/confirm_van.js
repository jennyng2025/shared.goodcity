import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.all('gogovan_order').get('lastObject');
  },

  afterModel: function(order) {
    if(!order) {
      this.transitionTo('delivery.book_van');
    }
  },
});
