import Ember from 'ember';
export default Ember.View.extend({
  didInsertElement: function() {
    Ember.$(document).foundation({
      offcanvas: { close_on_click: true }
    });
  }
});
