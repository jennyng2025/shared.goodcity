import Ember from "ember";

// Date Format: "8:03 pm, Tue 28th"
export default Ember.Handlebars.makeBoundHelper(function(value) {
  var parseDate = Date.parse(value);
  return moment(parseDate).format('h:mm a, ddd Do');
});
