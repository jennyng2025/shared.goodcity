import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  beforeModel: function(transition){
    this._super();
    var offerId = transition.params.offer.offer_id;
    var offer = this.store.getById('offer', offerId);
    var delivery = offer.get("delivery");
    if(!(delivery.get('schedule'))){
      this.transitionTo('delivery.book_timeslot', delivery);
    }
  },

});
