import Ember from 'ember';

export default Ember.View.reopen({
  didInsertElement: function() {
    Ember.$().ready(function(){
      if(window.location.pathname === '/'){
        Ember.run.later(this, function() {
          window.scrollTo(0, document.body.scrollHeight);
        });
      }
    });
  },

});
