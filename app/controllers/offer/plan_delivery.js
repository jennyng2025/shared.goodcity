import Ember from 'ember';
import AjaxPromise from '../../utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Controller.extend({

  offerController: Ember.inject.controller('offer'),
  logger: Ember.inject.service(),
  offerId: Ember.computed.alias('offerController.model.id'),
  gogovanPriceCalculated: Ember.computed.notEmpty("gogovanPrice"),

  offer: Ember.computed('offerId', function(){
    return this.store.peekRecord('offer', this.get('offerId'));
  }),

  gogovanPrice: Ember.computed('offerId', {
    get: function() {
      var params = {
        districtId: this.get('offer.createdBy.address.district.id'),
        offerId: this.get("offerId")
      };

      new AjaxPromise("/gogovan_orders/calculate_price", "POST", this.session.get('authToken'), params)
        .then(data => this.set("gogovanPrice", data.base))
        .catch(error => this.get("logger").error(error));

      return "";
    },
    set: function(key, value) {
      return value;
    }
  }),

  actions: {
    startDelivery(delivery_type) {
      var loadingView = getOwner(this).lookup('component:loading').append();
      var offerId = this.get('offerController.model.id');
      var offer = this.store.peekRecord('offer', offerId);
      var delivery = offer.get("delivery");
      if(delivery) {
        delivery.setProperties({ offer: offer });
      } else {
        delivery = this.store.createRecord('delivery', { offer: offer });
      }

      delivery.save()
        .then(delivery => {
          var route;
          switch(delivery_type) {
            case 'Alternate': route = 'delivery.book_timeslot'; break;
            case 'Gogovan':   route = 'delivery.book_van'; break;
            case 'Drop Off':  route = 'delivery.drop_off_schedule'; break;
          }

          this.transitionToRoute(route, delivery, {queryParams: {placeOrder: true}});
        })
        .catch(error => {
          delivery.unloadRecord();
          throw error;
        })
        .finally(() => loadingView.destroy());
    }
  }
});
