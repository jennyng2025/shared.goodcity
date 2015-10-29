import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "input",
  type: "radio",
  attributeBindings: [ "name", "type", "value", "checked", "labelText", "disabled" ],
  disabled: false,

  click() {
    this.set("selection", this.$().val());
  },

  checked: Ember.computed('selection', function(){

    // This block added for setting selection of reject item options.
    if(Ember.$.trim(this.labelText).length > '0' && this.get('selection.isController')){
      this.set("selection", '-1');
    }

    return this.get("value") === this.get("selection");
  }),

  onInit: Ember.on('init', function() {
    if (this.get("value") == this.get("selection")) {
      this.set("checked", true);
    }
  })
});
