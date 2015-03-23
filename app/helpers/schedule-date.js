import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value) {
  var parseDate = Date.parse(value);
  return moment(value).format('dddd, Do MMMM');
});
