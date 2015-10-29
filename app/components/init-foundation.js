import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {

    Ember.run.debounce(this, function(){
      var clientHeight = $( window ).height();
      $('.inner-wrap').css('min-height', clientHeight);
    }, 1000);

    Ember.$().ready(function(){
      Ember.$(document).foundation({
        offcanvas: { close_on_click: true }
      });
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
