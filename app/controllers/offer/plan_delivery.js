import Ember from 'ember';
import AjaxPromise from '../../utils/ajax-promise';

export default Ember.Controller.extend({
  needs: ["offer"],
  logger: Ember.inject.service(),

  offerId: Ember.computed.alias('controllers.offer.model.id'),

  offer: function(){
    return this.store.getById('offer', this.get('offerId'));
  }.property('offerId'),

  gogovanPrice: function(key, value) {
    if (arguments.length > 1) {
      return value;
    } else {
      var params = {
        districtId: this.session.get('currentUser.address.district.id'),
        offerId: this.get("offerId")
      };

      new AjaxPromise("/gogovan_orders/calculate_price", "POST", this.session.get('authToken'), params)
        .then(data => this.set("gogovanPrice", data.base))
        .catch(error => this.get("logger").error(error));

      return "";
    }
  }.property('offerId'),

  gogovanPriceCalculated: Ember.computed.notEmpty("gogovanPrice"),

  actions: {
    startDelivery: function(delivery_type) {
      var offerId = this.get('controllers.offer').get('model.id');
      var offer = this.store.getById('offer', offerId);
      var delivery = offer.get("delivery");
      if(!delivery) {
        delivery = this.store.createRecord('delivery', {
          offer: offer,
          deliveryType: delivery_type
        });
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
        });
    }
  }
});
