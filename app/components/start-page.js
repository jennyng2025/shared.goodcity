import Ember from 'ember';

// Scroll to bottom of start page to display language-switcher
export default Ember.Component.extend({
  didInsertElement() {
    this._super();

    Ember.run.scheduleOnce('afterRender', this, function(){
      if(window.location.pathname === '/'){
        window.scrollTo(0, document.body.scrollHeight);
      }
    });
  },

});
