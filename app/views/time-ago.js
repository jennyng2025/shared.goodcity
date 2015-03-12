import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'time-ago',
  timeValue: new Date(),

  didInsertElement: function() {

    if(this.smallPrefix) {
      Ember.$.timeago.settings.strings.suffixAgo = "";
      Ember.$.timeago.settings.strings.suffixFromNow = "";
      Ember.$.timeago.settings.strings.seconds = "1m";
      Ember.$.timeago.settings.strings.minutes = "1m";
      Ember.$.timeago.settings.strings.minutes = "%dm";
      Ember.$.timeago.settings.strings.hour = "1h";
      Ember.$.timeago.settings.strings.hours = "%dh";
      Ember.$.timeago.settings.strings.day = "1d";
      Ember.$.timeago.settings.strings.days = "%dd";
      Ember.$.timeago.settings.strings.month = "1mths";
      Ember.$.timeago.settings.strings.months = "%dmths";
      Ember.$.timeago.settings.strings.year = "1y";
      Ember.$.timeago.settings.strings.years = "%dy";
    }

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
