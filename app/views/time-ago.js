import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'time-ago',
  timeValue: new Date(),

  didInsertElement: function() {

    Ember.$().ready(function (){
      Ember.$('time.timeago').timeago();

      // update every minute
      setInterval((function() {
        return Ember.$("time.timeago").timeago();
      }), 60000);

    });
  },

  timeString: function() {
    var timeValue = this.timeValue || new Date();
    return new Date(timeValue).toISOString();
  }.property()
});
