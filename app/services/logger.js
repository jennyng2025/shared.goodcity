import Ember from "ember";
import config from "../config/environment";

export default Ember.Service.extend({
  session: Ember.inject.service(),

  error: function(reason) {
    if (reason.status === 0) {
      return;
    }
    console.info(reason);
    if (config.environment === "production") {
      var userName = this.get("session.currentUser.fullName");
      var userId = this.get("session.currentUser.id");
      Airbrake.push({
        error: reason,
        context: { userId: userId, userName: userName }
      });
    }
  }
});
