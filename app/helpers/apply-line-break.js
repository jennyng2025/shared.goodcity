import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value) {
  var text;
  if(/<[a-z][\s\S]*>/i.test(value)) {
    text = value;
  } else {
    var text = Ember.Handlebars.Utils.escapeExpression(value);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  }
  return new Ember.Handlebars.SafeString(text);
});
