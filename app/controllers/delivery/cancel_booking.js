import Ember from 'ember';
import config from './../../config/environment';

export default Ember.Controller.extend({

  transportController: Ember.inject.controller('offer/transport_details'),

  canCancel: Ember.computed.alias('model.gogovanOrder.isCancelled'),
  driverContact: Ember.computed.alias('model.gogovanOrder.driverMobile'),
  gogovanContact: config.APP.GOGOVAN_CONTACT,
  isCancel: true,

  actions: {
    cancelBooking() {
      if(this.get('canCancel')){
        this.get('transportController').send('removeDelivery', this.get('model'));
      }
    }
  }
});
