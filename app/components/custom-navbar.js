import Ember from 'ember';

export default Ember.Component.extend({
  didScroll: null,
  lastScrollTop: 0,
  delta: 2,
  intervalId: null,

  didInsertElement(){
    var _this = this;

    Ember.$().ready(function(){

      Ember.$(window).scroll(function(event){
        _this.set("didScroll", true);
      });

      Ember.$(window).on('touchmove', function(event){
        _this.set("didScroll", true);
      });

      var intervalId = setInterval(function() {
        if (_this.get("didScroll")) {
          hasScrolled();
          _this.set("didScroll", false);
        }
      }, 150);

      _this.set("intervalId", intervalId);

    });

    function hasScrolled() {

      var hasCustomNavBar = Ember.$('.custom_nav').length;

      if(hasCustomNavBar) {

        var navbarHeight = Ember.$('.custom_nav').outerHeight();
        var st = Ember.$(document).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(_this.get("lastScrollTop") - st) <= _this.get("delta")) {
          return;
        }

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > _this.get("lastScrollTop") && st > navbarHeight){
          // Scroll Down
          Ember.$('.custom_nav').removeClass('nav-down').addClass('nav-up');
        } else {
          // Scroll Up
          if(st + Ember.$(window).height() < Ember.$(document).height()) {
            Ember.$('.custom_nav').removeClass('nav-up').addClass('nav-down');
          }
        }

        _this.set("lastScrollTop", st);

      }
    }

  },

  willDestroyElement() {
    var _this = this;

    Ember.$().ready(function(){
      $(window).unbind('scroll');
      $(window).unbind('touchmove');
      clearInterval(_this.get("intervalId"));
    });
  }
});
