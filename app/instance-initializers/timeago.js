import Ember from "ember";
import config from '../config/environment';

export default {
  name: 'timeago',

  initialize: function(app) {
    var i18n = app.lookup("service:i18n");
    var loc = str => i18n.t("time_ago." + str).string;

    moment.locale('en', {
      relativeTime : {
        future: "",
        past:   "",
        s:  loc("1m"),
        m:  loc("1m"),
        mm: "%d" + loc("m"),
        h:  "%d" + loc("1h"),
        hh: "%d" + loc("h"),
        d:  "%d" + loc("1d"),
        dd: "%d" + loc("d"),
        M:  "%d" + loc("1mths"),
        MM: "%d" + loc("mths"),
        y:  "%d" + loc("1y"),
        yy: "%d" + loc("y")
      }
    });

    if (config.environment != "test") {
      Ember.run.later(this, this.updateTime, 60000);
    }
  },

  updateTime: function() {
    Ember.$(".timeago").each((idx, elm) =>
      elm.innerText = moment(elm.getAttribute("datetime")).fromNow(true));
    Ember.run.later(this, this.updateTime, 60000);
  }
};
