import Ember from 'ember';
export default Ember.View.extend({
  didInsertElement: function() {
    Ember.$(document).foundation({
      offcanvas: { close_on_click: true }
    });

    Ember.$("#lightGallery, .lightGallery").lightGallery({
      thumbnail: false,
      hideControlOnEnd: true,
      closable: false,
      counter: true,
      swipeThreshold : 50,
      enableTouch : true,
    });
  }
});
