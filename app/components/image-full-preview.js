import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function(){
    Ember.$().ready(function(){
      Ember.$("#imageGallery").lightGallery({
        thumbnail: false,
        hideControlOnEnd: true,
        closable: false,
        counter: true,
        swipeThreshold : 50,
        enableTouch : true,
        selector: '.preview_image'
      });
    });
  }

});
