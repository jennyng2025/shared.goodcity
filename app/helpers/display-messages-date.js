import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value) {
  var _MS_PER_DAY = 1000 * 60 * 60 * 24;
  var message_date = Date.parse(value);
  var current_time = Date.now();

  var day_difference = Math.floor((current_time - message_date) / _MS_PER_DAY);

  if(!message_date) {
    return "";
  } else if(day_difference < 1) {
    var time = moment(message_date).format('HH:mm');
    return lookup('service:i18n').t("day.today");
  } else if(day_difference < 7) {
    return moment(message_date).format('dddd');
  } else {
    return moment(message_date).format('DD MMM, YYYY');
  }
});
