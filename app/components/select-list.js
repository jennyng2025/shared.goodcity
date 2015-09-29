import Ember from "ember";

export default Ember.Component.extend({
  content: null,
  selectedValue: null,

  actions: {
    change() {
      const changeAction  = this.get('on-change');
      const selectedIndex = this.$('select').prop('selectedIndex');
      var content         = this.get('content').toArray();
      if (this.get("prompt")) { content = [{name:null}].concat(content); }
      const selectedValue = content[selectedIndex];

      this.set('selectedValue', selectedValue);
      changeAction(selectedValue);
    }
  }
});
