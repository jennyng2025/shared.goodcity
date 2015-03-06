import config from "../config/environment";

export default {
  error: function(reason) {
    console.error(reason);
    if (config.environment === "production") {
      Airbrake.push({error: reason});
    }
  }
};
