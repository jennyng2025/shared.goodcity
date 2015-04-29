import Ember from "ember";

// Date Format: "2015-04-29"
export default Ember.Handlebars.makeBoundHelper(function(value) {
  var parseDate = Date.parse(value);
  return moment(parseDate).format('YYYY-MM-DD');
});
