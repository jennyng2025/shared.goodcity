import Ember from 'ember';

// Scroll to bottom of start page to display language-switcher
export default Ember.Component.extend({
  didInsertElement() {
    Ember.$().ready(function(){
      if(window.location.pathname === '/'){
        Ember.run.later(this, function() {
          window.scrollTo(0, document.body.scrollHeight);
        });
      }
    });
  },

});
