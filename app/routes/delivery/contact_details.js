import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  beforeModel(params) {
    this._super(params);
    var offerId = params.params.offer.offer_id;
    var offer = this.store.peekRecord('offer', offerId);
    var delivery = offer.get("delivery");
    if(!(delivery.get('schedule'))){
      this.transitionTo('delivery.book_timeslot', delivery);
    }
  },

});
