import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({
  beforeModel: function() {
    var offerId = this.modelFor('offer').get('id');
    var offer = this.store.getById('offer', offerId);

    if (offer.get('isScheduled')) {
      if(this.get('session.isAdmin')) {
        this.transitionTo('review_offer.logistics', offer);
      } else {
        this.transitionTo('offer.transport_details', offer);
      }
    }
  }
});
