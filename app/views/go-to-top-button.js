import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'go-to-top-button',

  didInsertElement: function () {
    Ember.$().ready(function(){
      backToTopLink();
    });

    // Back-to-top Link
    function backToTopLink(){
      var offset = 300;
      var duration = 300;

      Ember.$(window).scroll(function() {
        if (Ember.$(this).scrollTop() > offset) {
          Ember.$('.back-to-top').fadeIn(duration);
        } else {
          Ember.$('.back-to-top').fadeOut(duration);
        }
      });

      Ember.$('.back-to-top').click(function() {
        Ember.$('html, body').animate({scrollTop: 0}, duration);
        return false;
      });
    }
  },
});
