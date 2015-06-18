import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value) {
  var parseDate = Date.parse(value);
  return moment(parseDate).format('HH:mm');
});
