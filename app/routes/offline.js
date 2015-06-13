import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    try_again: function() {
      var currentUrl = this.container.lookup("router:main").get("url");
      if (currentUrl == "/offline") {
        this.transitionTo("/");
      } else {
        window.location.reload();
      }
    }
  }
});
