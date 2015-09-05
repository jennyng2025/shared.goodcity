import Ember from 'ember';

export default Ember.Controller.extend({

  delivery: Ember.inject.controller(),
  offer: Ember.inject.controller(),

  contact: function(key, value) {
    if(arguments.length > 1) {
      return value;
    } else {
      var deliveryId = this.get('delivery.model.id');
      return this.store.getById('delivery', deliveryId).get("contact");
    }
  }.property('model'),

  actions:{
    done: function(){
      var offerId = this.get('offer.model.id');
      if(this.get("session.isAdminApp")) {
        this.transitionToRoute('review_offer.logistics', offerId);
      } else {
        this.transitionToRoute('offer.transport_details', offerId);
      }
    }
  }
});
