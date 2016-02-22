import Ember from 'ember';

export default Ember.Component.extend({

  foundation: null,

  currentClassName: Ember.computed("className", function(){
    return this.get("className") ? ("." + this.get("className")) :document;
  }),

  didInsertElement() {
    var className = this.get("currentClassName");
    var _this = this;

    Ember.run.debounce(this, function(){
      var clientHeight = $( window ).height();
      $('.inner-wrap').css('min-height', clientHeight);
    }, 1000);

    Ember.$().ready(function(){
      console.log(className);
      var initFoundation = Ember.$(className).foundation({
        offcanvas: { close_on_click: true }
      });
      _this.set("foundation", initFoundation);
    });
  },

  willDestroyElement() {
    this.get("foundation").foundation("destroy");
  }

});
