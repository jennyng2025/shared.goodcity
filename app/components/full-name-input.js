import Ember from "ember";

export default Ember.TextField.extend({
  tagName: "input",
  type:    "text",
  name:    "userName",
  attributeBindings: [ "name", "type", "id", "value", 'required', 'pattern'],

  i18n: Ember.inject.service(),

  didInsertElement(){
    var user = this.attrs.user.value;
    var translatedName = this.get("i18n").t("full_name", { firstName: user.get('firstName'), lastName: user.get('lastName') });
    this.set('value', translatedName);
  }
});

