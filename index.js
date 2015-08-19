/* jshint node: true */
'use strict';

module.exports = {
  name: 'shared-goodcity',
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
    if (type === 'head-footer' && config.cordova.enabled) {
      // add content security policy meta tag wanted by cordova-plugin-whitelist
      // add winstore-jscompat.js for windows phone (not needed for Windows 10) https://github.com/MSOpenTech/winstore-jscompat
      return '<meta http-equiv="Content-Security-Policy" content="' + this.getContentPolicy(config) + '">' +
        '\n<script src="shared.goodcity/winstore-jscompat.js"></script>';
    }
  },

  getContentPolicy: function(config) {
    var cordovaPolicy = {
      "frame-src": "gap:", // required by ios
      "script-src": "'unsafe-eval'", // required by cordova.js
      "connect-src": "https://dc.services.visualstudio.com" // required by testfairy
    };

    Object.keys(cordovaPolicy).forEach(function(key) {
      config.contentSecurityPolicy[key] = (config.contentSecurityPolicy[key] || "") + " " + cordovaPolicy[key];
    });

    return Object.keys(config.contentSecurityPolicy)
      .map(function(key) { return key + " " + config.contentSecurityPolicy[key]; })
      .join("; ");
  }
};
