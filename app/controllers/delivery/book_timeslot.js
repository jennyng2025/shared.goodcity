import Ember from 'ember';

export default Ember.Controller.extend({

  delivery: Ember.inject.controller(),
  availableSlots: Ember.computed.filterBy('model', 'deliveries.length', 0),
  isSelected: 1,

  actions: {
    assignSchedule() {
      var selectedSlot        = this.get('isSelected');
      var getSelectedSchedule = this.store.peekRecord('schedule', selectedSlot);
      var scheduleProperties  = getSelectedSchedule.getProperties('zone',
          'resource','scheduledAt', 'slot', 'slotName');
      var schedule   = this.store.createRecord('schedule', scheduleProperties);
      var deliveryId = this.get('delivery').get('model.id');
      var delivery   = this.store.peekRecord('delivery', deliveryId);
      delivery.set('schedule', schedule);
      this.transitionToRoute('delivery.contact_details', {queryParams: {placeOrder: true}});
    }
  }
});
