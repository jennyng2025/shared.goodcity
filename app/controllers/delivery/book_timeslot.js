import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ["delivery", "offer"],

  availableSlots: Ember.computed.filterBy('model', 'deliveries.length', 0),

  isSelected: 1,
  actions: {
    assignSchedule: function() {
      var selectedSlot        = this.get('isSelected');
      var getSelectedSchedule = this.store.getById('schedule', selectedSlot);
      var scheduleProperties  = getSelectedSchedule.getProperties('zone',
          'resource','scheduledAt', 'slot', 'slotName');

      var schedule   = this.store.createRecord('schedule', scheduleProperties);
      var deliveryId = this.get('controllers.delivery').get('id');
      var delivery   = this.store.getById('delivery', deliveryId);
      delivery.set('schedule', schedule);
      this.transitionToRoute('delivery.contact_details', {queryParams: {placeOrder: true}});
    }
  }
});
