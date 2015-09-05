import Ember from "ember";

export default Ember.Helper.helper(function(value) {
  var message_time = Date.parse(value);
  if(!message_time) {
    return "";
  } else {
    return moment(message_time).format('HH:mm');
  }
});
