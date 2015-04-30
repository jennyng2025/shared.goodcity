import Ember from 'ember';

export default Ember.View.extend({
  tagName: "input",
  type: "radio",
  attributeBindings: [ "name", "type", "value", "checked", "labelText", "disabled" ],
  disabled: false,

  click: function() {
    this.set("selection", this.$().val());
  },

  checked: function() {

    // This block added for setting selection of reject item options.
    if(Ember.$.trim(this.labelText).length > '0' && this.get('selection.isController')){
      this.set("selection", '-1');
    }

    return this.get("value") === this.get("selection");
  }.property('selection'),

  onInit: function() {
    if (this.get("value") == this.get("selection")) {
      this.set("checked", true);
    }
  }.on("init")
});
