import Ember from 'ember';
import AjaxPromise from './../../utils/ajax-promise';

export default Ember.ObjectController.extend({
  needs: ["delivery", "offer"],

  slots: function() {
    return this.store.all('timeslot').sortBy('id');
  }.property('timeslot.@each'),

  selectedId: function(){
    return this.get('slots.firstObject.id');
  }.property('slots'),

  selectedDate: null,

  available_dates: function(key, value){
    if (arguments.length > 1) {
      return value;
    } else {
      new AjaxPromise("/available_dates", "GET", this.get('session.authToken'), {schedule_days: 10})
        .then(data => this.set("available_dates", data));
      return value;
    }
  }.property('available_dates.[]'),

  actions: {
    bookSchedule: function() {
      var loadingView = this.container.lookup('view:loading').append();

      var selectedSlot = this.get('selectedId');
      var date = this.get('selectedDate');
      var slotName = this.get('slots').filterBy('id', selectedSlot.get('id')).get('firstObject.name');

      var scheduleProperties = { slot: selectedSlot, scheduledAt: date, slotName: slotName};

      var bookedSchedule = this.store.createRecord('schedule', scheduleProperties);
      var deliveryId = this.get('controllers.delivery.id');
      var offerId = this.get('controllers.offer.id');
      var offer = this.store.getById('offer', offerId);

      bookedSchedule.save()
        .then(schedule => {
          var delivery = this.store.push('delivery', {
              id: deliveryId,
              schedule: schedule,
              offer: offerId
          });
          delivery.save()
            .then(() => {
              offer.set('state', 'scheduled');
              if(this.get("session.isAdminApp")) {
                this.transitionToRoute('review_offer.logistics', offer);
              } else {
                this.transitionToRoute('offer.transport_details', offer);
              }
            })
            .finally(() => loadingView.destroy());
        })
        .catch(error => {
          loadingView.destroy();
          bookedSchedule.unloadRecord();
          throw error;
        });
    }
  }
});
