import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: "a",
  href: "#",
  cordova: Ember.inject.service(),

  click() {
    if (config.cordova.enabled) {
      cordova.InAppBrowser.open(this.attrs.linkUrl, "_system");
    } else {
      window.open(this.attrs.linkUrl, "_system");
    }
    return false;
  }
});
