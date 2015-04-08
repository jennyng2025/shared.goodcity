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
      var error = reason instanceof Error || typeof reason != "object" ?
          reason : JSON.stringify(reason);

      Airbrake.push({
        error: error,
        context: { userId: userId, userName: userName }
      });
    }
  }
});
