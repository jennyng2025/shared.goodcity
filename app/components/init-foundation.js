import Ember from 'ember';

export default Ember.Component.extend({

  foundation: null,

  currentClassName: Ember.computed("className", function(){
    return this.get("className") ? ("." + this.get("className")) :document;
  }),

  didInsertElement() {
    var className = this.get("currentClassName");
    var _this = this;

    this._super();

    Ember.run.debounce(this, function(){
      var clientHeight = $( window ).height();
      $('.inner-wrap').css('min-height', clientHeight);
    }, 1000);

    Ember.run.scheduleOnce('afterRender', this, function(){
      var initFoundation = Ember.$(className).foundation({
        offcanvas: { close_on_click: true }
      });
      _this.set("foundation", initFoundation);
    });
  },

  // TODO: Breaks sometime on menu-bar
  // willDestroyElement() {
  //   this.get("foundation").foundation("destroy");
  // }

});
