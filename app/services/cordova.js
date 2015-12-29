import Ember from "ember";
import config from '../config/environment';
import AjaxPromise from '../utils/ajax-promise';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  logger: Ember.inject.service(),
  store: Ember.inject.service(),
  messagesUtil: Ember.inject.service("messages"),

  isAndroid: function () {
    return ["android", "Android", "amazon-fireos"].indexOf(window.device.platform) >= 0;
  },

  appLoad: function () {
    if (!config.cordova.enabled) { return; }

    var pushNotification, _this = this;

    function onDeviceReady() {
      if (config.staging && typeof TestFairy != 'undefined') {
        TestFairy.begin('a362fd4ae199930a7a1a1b6daa6f729ac923b506');
      }

      var push = PushNotification.init({
        android: {
          senderID: config.cordova.GcmSenderId,
          badge: false,
          icon: "ic_notify"
        },
        ios: {
          alert: true,
          sound: true
        },
        windows: {}
      });

      push.on('registration', function(data) {
        sendToken(data.registrationId, platformCode());
      });

      push.on('notification', function(data) {
        if(!data.additionalData.foreground) {
          if (window.device.platform === "iOS") {
            processTappedNotification(data.additionalData.payload)
          } else {
            processTappedNotification(data.additionalData);
          }

        }
      });
    }

    function sendToken(handle, platform) {
      return new AjaxPromise("/auth/register_device", "POST", _this.get("session.authToken"), {handle: handle, platform: platform});
    }

    function platformCode(){
      var platform;
      if (_this.isAndroid()) { platform = "gcm"; }
      else if (window.device.platform === "iOS") { platform = "aps"; }
      else if (window.device.platform === "windows") { platform = "wns"; }
      return platform;
    }

    function processTappedNotification(payload) {
      var notifications = _this.container.lookup("controller:notifications");
      if (payload.category === "incoming_call") {
        notifications.acceptCall(payload);
      }

      notifications.setRoute(payload);

      if(payload.category === "message") {
        var hasMessage = _this.get("store").peekRecord("message", payload.message_id);
        if(hasMessage) {
          notifications.transitionToRoute.apply(notifications, payload.route);
        } else {
          var loadingView = _this.container.lookup('component:loading').append();
          var messageUrl = payload.item_id ? `/messages?item_id=${payload.item_id}` : `/messages?offer_id=${payload.offer_id}`
          new AjaxPromise(messageUrl, "GET", _this.get("session.authToken"), {})
            .then(function(data) {
              _this.get("store").pushPayload(data);
              notifications.transitionToRoute.apply(notifications, payload.route);
            })
            .finally(() => loadingView.destroy());
        }
      } else {
        notifications.transitionToRoute.apply(notifications, payload.route);
      }
    }

    document.addEventListener('deviceready', onDeviceReady, true);
  },

  initiateSplunkMint: function() {

    var _this = this;

    function initSplunkMint() {
      if (!config.cordova.enabled) { return; }

      // Use it when available for iOS
      // var key = _this.isAndroid() ? config.cordova.SplunkMintApiKeyAndroid : config.cordova.SplunkMintApiKeyIos;

      var key;
      if(_this.isAndroid()) { key = config.cordova.SplunkMintApiKey }
      if(key) { Splunkmint.initiate(key); }
    }

    document.addEventListener('deviceready', initSplunkMint, true);
  }
});
