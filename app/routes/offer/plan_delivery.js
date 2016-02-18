import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  queryParams: {
    modify: false
  },

  beforeModel(params) {
    var offerId = this.modelFor('offer').get('id');
    var offer = this.store.peekRecord('offer', offerId);

    if(offer) {
      if ((offer.get('isScheduled') && !params.queryParams.modify) || !(offer.get("isReviewed") || offer.get('isScheduled')) ) {
        if(this.get('session.isAdminApp')) {
          this.transitionTo('review_offer.logistics', offer);
        } else {
          this.transitionTo('offer.transport_details', offer);
        }
      }
    } else {
      this.transitionTo("offers");
    }
  }
});
