/* jshint node: true */
'use strict';

module.exports = {
  name: 'shared.goodcity',
  isDevelopingAddon: function() {
    return true;
  },

  included: function(app) {
    this._super.included(app);

    app.import("bower_components/font-awesome/css/font-awesome.css");
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff2", { destDir: "fonts" });
    app.import("bower_components/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });
  },

  contentFor: function(type, config) {
    // add content security policy meta tag wanted by cordova-plugin-whitelist
    // add winstore-jscompat.js for windows phone (not needed for Windows 10) https://github.com/MSOpenTech/winstore-jscompat
    if (type === 'head-footer' && config.cordova.enabled) {
      // gap: required by ios
      config.contentSecurityPolicy["frame-src"] = (config.contentSecurityPolicy["frame-src"] || "") + " gap:";
      // unsafe-self required by cordova.js
      config.contentSecurityPolicy["script-src"] = (config.contentSecurityPolicy["script-src"] || "") + " 'unsafe-eval'";
      var policy = Object.keys(config.contentSecurityPolicy)
        .map(function(key) { return key + " " + config.contentSecurityPolicy[key]; })
        .join("; ");
      return '<meta http-equiv="Content-Security-Policy" content="' + policy + '">' +
        '\n<script src="shared.goodcity/winstore-jscompat.js"></script>';
    }
  }
};
