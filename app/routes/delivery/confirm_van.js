import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  model: function(){
    return this.store.all('gogovan_order').get('lastObject');
  },

  afterModel: function(order) {
    if(!order) {
      this.transitionTo('delivery.book_van');
    }
  },
});
