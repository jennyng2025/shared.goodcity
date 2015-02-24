import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value) {
  var _MS_PER_DAY = 1000 * 60 * 60 * 24;
  var message_time = Date.parse(value);
  var current_time = Date.now();

  var day_difference = Math.floor((current_time - message_time) / _MS_PER_DAY);

  if(!message_time) {
    return "";
  } else if(day_difference < 1) {
    return "Today, "+moment(message_time).format('HH:mm');
  } else if(day_difference < 7) {
    return moment(message_time).format('dddd, HH:mm');
  } else {
    return moment(message_time).format('DD.MM, HH:mm');
  }
});
