import Ember from 'ember';

export default Ember.TextField.extend({
  tagName: "input",
  type: "tel",
  attributeBindings: [ "name", "type", "value", "maxlength", "id", "autoFocus" ],

  becomeFocused: function() {
    if(this.attrs.autoFocus) { this.$().focus(); }
  }.on('didInsertElement'),

  currentKey: function(key, value){
    return (arguments.length > 1) ? value : 0;
  }.property(),

  isAllowed: function(){
    var key = this.get('currentKey');
    var allowed = (key === 13 ||
      key === 8 ||
      key === 9 ||
      key === 46 ||
      key === 39 ||
      (key >= 35 && key <= 37));
    return allowed;
  }.property('currentKey'),

  keyUp: function(){
    var value = this.value;
    if(value && value.search(/^\d{8}$/) !== 0){
      this.set('value', value.replace(/\D/g,''));
    }
  },

  keyDown: function(e) {
    var key = e.charCode || e.keyCode || 0;
    this.set('currentKey', key);

    // allow ctrl+v, enter, backspace, tab, delete, numbers, keypad numbers
    // home, end only.
    return (
        (e.ctrlKey && key === 86) ||
        key === 13 ||
        key === 8 ||
        key === 9 ||
        key === 46 ||
        key === 39 ||
        (key >= 35 && key <= 37) ||
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105));
  },

  keyPress: function() {
    var inputValue = this.value || "";
    return this.get('isAllowed') ? true : (inputValue.length < this.maxlength);
  }
});
