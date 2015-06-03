import Ember from "ember";
import config from '../config/environment';
import AjaxPromise from '../utils/ajax-promise';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  logger: Ember.inject.service(),

  appLoad: function () {
    if (!config.cordova.enabled) {
      return;
    }

    // Based off https://github.com/Telerik-Verified-Plugins/PushNotification/blob/master/Example/www/index.html

    var pushNotification, _this = this;

    function onDeviceReady() {
      pushNotification = window.plugins.pushNotification;
      if (device.platform == "android" || device.platform == "Android" || device.platform == "amazon-fireos") {
        var opts = {"senderID":config.cordova.GcmSenderId, "ecb":"onNotificationGCM"};
        pushNotification.register(successHandler, errorHandler, opts);
      } else if (device.platform === "iOS") {
        var opts = {"badge": "true", "sound": "true", "alert": "true", "ecb": "onNotificationAPN"};
        pushNotification.register(res => sendToken(res, "aps"), errorHandler, opts);
      } else if (device.platform === "Win32NT") {
        var opts = {"channelName":channelName, "ecb":"onNotificationWP8", "uccb":"channelHandler", "errcb": "jsonErrorHandler"};
        pushNotification.register(channelHandler, errorHandler, opts);
      }
    }

    // handle APNS notifications for iOS
    function onNotificationAPN(e) {
      window.alert(JSON.stringify(e));

      if (e.alert) {
        // showing an alert also requires the org.apache.cordova.dialogs plugin
        window.alert(e.alert);
      }

      if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        // var snd = new Media(e.sound);
        // snd.play();
      }

      if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
      }
    }

    // handle GCM notifications for Android
    window.onNotificationGCM = function(e) {
      switch (e.event) {
        case 'registered':
          if (e.regid.length > 0) {
            sendToken(e.regid, "gcm");
          }
          break;

        case 'message':
          if (e.foreground) {
            // handled by socket.io notification sent at same time (e.payload.message)
          }
          else {
            // otherwise we were launched because the user touched a notification in the notification tray
          }
          break;

        case 'error':
          this.get("logger").error("notification error " + JSON.stringify(e));
          break;

        default:
          this.get("logger").error("unknown notification event " + JSON.stringify(e));
          break;
      }
    }

    function sendToken(handle, platform) {
      return new AjaxPromise("/auth/register_device", "POST", _this.get("session.authToken"), {handle: handle, platform: platform});
    }

    function successHandler(result) {
    }

    function errorHandler(error) {
      this.get("logger").error(error);
    }

    document.addEventListener('deviceready', onDeviceReady, true);
  }
});
