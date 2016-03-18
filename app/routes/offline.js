import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Route.extend({
  actions: {
    try_again() {
      var currentUrl = getOwner(this).lookup("router:main").get("url");
      if (currentUrl == "/offline") {
        this.transitionTo("/");
      } else {
        window.location.reload();
      }
    }
  }
});
