import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  model: function(){
    return this.store.find("schedule");
  }
});
