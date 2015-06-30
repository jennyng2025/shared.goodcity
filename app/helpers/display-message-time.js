import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value) {
  var message_time = Date.parse(value);
  if(!message_time) {
    return "";
  } else {
    return moment(message_time).format('HH:mm');
  }
});
