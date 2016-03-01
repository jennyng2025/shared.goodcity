import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, function(){
      Ember.$('html, body').scrollTop(0);
    });
  },

});
