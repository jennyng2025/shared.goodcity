import SessionRoute from './session';

export default SessionRoute.extend({
  beforeModel: function(messages) {
    if(this.get("session.isAdmin")) {
      this.transitionTo('login');
    }
  }
});
