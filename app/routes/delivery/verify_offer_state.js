import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  backClick: false,

  queryParams: {
    placeOrder: false,
    backClick: false
  },

  beforeModel(params) {
    var offerId = this.modelFor('offer').get('id');
    var offer = this.store.peekRecord('offer', offerId);
    this.set("backClick", params.queryParams.backClick);

    if (offer.get('isScheduled') && !params.queryParams.placeOrder) {
      if(this.get('session.isAdminApp')) {
        this.transitionTo('review_offer.logistics', offer);
      } else {
        this.transitionTo('offer.transport_details', offer);
      }
    }
  },
});
