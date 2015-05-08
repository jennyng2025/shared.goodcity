import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    try_again: function() {
      window.location.reload();
    }
  }
});
