import Ember from 'ember';
import config from './../../config/environment';

export default Ember.ObjectController.extend({

  needs: ['offer/transport_details'],

  canCancel: Ember.computed.alias('model.gogovanOrder.isCancelled'),

  driverContact: Ember.computed.alias('model.gogovanOrder.driverMobile'),

  isAdmin: function(){
    return config.APP.NAME === 'admin.goodcity';
  }.property(),

  actions: {
    cancelBooking: function() {
      if(this.get('canCancel')){
        this.get('controllers.offer/transport_details').send('removeDelivery', this.get('model'));
      }
    }
  }
});
