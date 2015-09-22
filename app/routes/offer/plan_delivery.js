import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  queryParams: {
    modify: false
  },

  beforeModel: function(params) {
    var offerId = this.modelFor('offer').get('id');
    var offer = this.store.peekRecord('offer', offerId);

    if (offer.get('isScheduled') && !params.queryParams.modify) {
      if(this.get('session.isAdminApp')) {
        this.transitionTo('review_offer.logistics', offer);
      } else {
        this.transitionTo('offer.transport_details', offer);
      }
    }
  }
});
