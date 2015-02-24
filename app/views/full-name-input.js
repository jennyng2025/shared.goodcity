import Ember from "ember";

export default Ember.TextField.extend({
  tagName: "input",
  type:    "text",
  name:    "userName",
  attributeBindings: [ "name", "type", "id", "value", 'required', 'pattern'],

  didInsertElement: function(){
    var user = this.get('user');
    var translatedName = Ember.I18n.t("full_name", { firstName: user.get('firstName'), lastName: user.get('lastName') });
    this.set('value', translatedName);
  }
});

