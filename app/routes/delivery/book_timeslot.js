import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  model() {
    return this.store.findAll("schedule");
  }
});
