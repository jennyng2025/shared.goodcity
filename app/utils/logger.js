import config from "../config/environment";

export default {
  error: function(reason, userName, userId) {
    if (reason.status === 0) {
      return;
    }
    console.info(reason);
    if (config.environment === "production") {
      Airbrake.push({
        error: reason,
        context: { userId: userId, userName: userName }
      });
    }
  }
};
