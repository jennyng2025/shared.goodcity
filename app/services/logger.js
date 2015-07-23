import Ember from "ember";
import config from "../config/environment";

export default Ember.Service.extend({
  session: Ember.inject.service(),

  error: function(reason) {
    if (reason.status === 0) {
      return;
    }
    console.info(reason);
    if (config.environment === "production" || config.staging) {
      var userName = this.get("session.currentUser.fullName");
      var userId = this.get("session.currentUser.id");
      var error = reason instanceof Error || typeof reason != "object" ?
          reason : JSON.stringify(reason);

      var airbrake = new airbrakeJs.Client();
      airbrake.setHost(config.APP.AIRBRAKE_HOST);
      airbrake.setProject(config.APP.AIRBRAKE_PROJECT_ID, config.APP.AIRBRAKE_PROJECT_KEY);
      airbrake.setEnvironmentName(config.staging ? "staging" : config.environment);

      airbrake.push({
        error: error,
        context: { userId: userId, userName: userName }
      });
    }
  }
});
