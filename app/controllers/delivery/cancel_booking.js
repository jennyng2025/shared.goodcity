import Ember from 'ember';
export default Ember.ObjectController.extend({

  canCancel: Ember.computed.alias('model.gogovanOrder.isCancelled'),

  driverContact: Ember.computed.alias('model.gogovanOrder.driverMobile'),

  actions: {
    cancelBooking: function() {

    }
  }
});
