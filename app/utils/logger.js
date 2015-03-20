import config from "../config/environment";

export default {
  error: function(reason) {
    if (reason.status === 0) {
      return;
    }
    console.info(reason);
    if (config.environment === "production") {
      Airbrake.push({error: reason});
    }
  }
};
