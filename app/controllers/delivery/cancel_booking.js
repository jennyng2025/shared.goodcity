import Ember from 'ember';
import config from './../../config/environment';

export default Ember.ObjectController.extend({

  needs: ['offer/transport_details'],

  canCancel: Ember.computed.alias('model.gogovanOrder.isCancelled'),
  driverContact: Ember.computed.alias('model.gogovanOrder.driverMobile'),
  gogovanContact: config.APP.GOGOVAN_CONTACT,

  actions: {
    cancelBooking: function() {
      if(this.get('canCancel')){
        this.get('controllers.offer/transport_details').send('removeDelivery', this.get('model'));
      }
    }
  }
});
