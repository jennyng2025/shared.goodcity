'use strict';

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'goodcity',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
        I18N_TRANSLATE_HELPER_SPAN: false //switch to future version default to suppress warning
      },
      I18N_COMPILE_WITHOUT_HANDLEBARS: true //switch to future version default to suppress warning
    },

    APP: {
      // Cloudinary Keys
      CLOUD_NAME: 'ddoadcjjl',
      CLOUD_API_KEY: 926849638736153,
      CLOUD_URL: 'https://api.cloudinary.com/v1_1/ddoadcjjl/auto/upload',
      IMAGE_PATH: 'http://res.cloudinary.com/ddoadcjjl/image/upload/',
      HK_COUNTRY_CODE: '+852',
      // RESTAdapter Settings
      NAMESPACE: 'api/v1',

      PRELOAD_TYPES: ["territory"],
      PRELOAD_AUTHORIZED_TYPES: ["offer","item_type","donor_condition","rejection_reason","permission", "timeslot", "gogovan_transport", "crossroads_transport"]
    }
  };

  if (environment === 'development') {

    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    // RESTAdapter Settings
    ENV.APP.API_HOST_URL = 'http://localhost:3000';
    ENV.APP.SERVER_PATH  = ENV.APP.API_HOST_URL + '/' + ENV.APP.NAMESPACE;
    ENV.APP.SOCKETIO_WEBSERVICE_URL = 'http://localhost:1337/goodcity';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'auto';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    // RESTAdapter Settings
    ENV.APP.API_HOST_URL = 'http://localhost:4200';
    ENV.APP.SERVER_PATH  = ENV.APP.API_HOST_URL + '/' + ENV.APP.NAMESPACE;
  }

  if (environment === 'production') {
    // RESTAdapter Settings
    ENV.APP.API_HOST_URL = 'http://api.goodcity.hk';
    ENV.APP.SERVER_PATH  = ENV.APP.API_HOST_URL + '/' + ENV.APP.NAMESPACE;
    ENV.APP.SOCKETIO_WEBSERVICE_URL = 'http://socket.goodcity.hk/goodcity';
    //Airbrake Js keys
    ENV.APP.AIRBRAKE_HOST = "https://errbit.crossroads.org.hk";
    ENV.APP.AIRBRAKE_PROJECT_ID = 0;
    ENV.APP.AIRBRAKE_PROJECT_KEY = "010f0d73f56efb6150cb2744e814e46b";
  }

  return ENV;
};
