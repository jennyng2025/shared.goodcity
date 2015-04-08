import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ["delivery", "offer"],

  availableSlots: Ember.computed.filterBy('model', 'deliveries.length', 0),

  isSelected: 1,
  actions: {
    assignSchedule: function() {
      var selectedSlot = this.get('isSelected');
      var getSelectedSchedule = this.store.getById('schedule', selectedSlot);
      var scheduleProperties = getSelectedSchedule.getProperties('zone',
          'resource','scheduledAt', 'slot', 'slotName');
      var deliveryId = this.get('controllers.delivery').get('id');
      var offerId = this.get('controllers.offer').get('id');

      var bookedSchedule = this.store.createRecord('schedule', scheduleProperties);

      var loadingView = this.container.lookup('view:loading').append();

      bookedSchedule.save()
        .then(schedule => {
          var delivery = this.store.push('delivery', {
              id: deliveryId,
              schedule: schedule,
              offer: offerId
          });
          delivery.save()
            .then(() => this.transitionToRoute('delivery.contact_details'))
            .finally(() => loadingView.destroy());
        })
        .catch(error => {
          bookedSchedule.unloadRecord();
          loadingView.destroy();
          throw error;
        });
    }
  }
});
