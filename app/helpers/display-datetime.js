import Ember from "ember";

// Date Format used in App:
// "2015-04-29" => 'YYYY-MM-DD'
// "1:59 PM, Mon 4th Jan" => 'h:mm A, ddd Do MMM'
// "1:59 pm, Mon 4th Jan" => 'h:mm a, ddd Do MMM'
// "January 4th (Monday), 2:00 pm" => 'MMMM Do (dddd), h:mm a'
// "Monday, January 4th" => 'dddd, MMMM Do'
// "Monday, 4th January" => 'dddd, Do MMMM'
// "Mon 4th Jan" => 'ddd Do MMM'

export default Ember.Helper.helper(function(value, params) {
  var parseDate = Date.parse(value);

  if(parseDate) {
    return moment(parseDate).format(params.format);
  } else {
    return "";
  }
});
