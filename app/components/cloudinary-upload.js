import Ember from "ember";
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: "input",
  type:    "file",
  accept:  "image/*",
  name:    "file",
  classNames: ["cloudinary-fileupload", "hidden"],
  "data-cloudinary-field": "image_upload",
  "data-url": config.APP.CLOUD_URL,
  disabled: true,
  attributeBindings: [ "name", "type", "value", "data-cloudinary-field",
    "data-url", "data-form-data", "disabled", "style", "accept", "offerId"],
  alert: Ember.inject.service(),
  offerId: null,
  i18n: Ember.inject.service(),

  didInsertElement: function() {
    var _this = this;

    // https://github.com/blueimp/jQuery-File-Upload/wiki/Options
    var options = {
      dataType: 'json',
      timeout: 60000,// 1 minute
      imageMaxHeight: 800,
      imageMaxWidth: 800,
      disableImageResize: false,

      fail: function() {
        if(this.type !== "file") {
          this.get("alert").show(this.get("i18n").t('upload-image.upload_error'));
        }
      }
    };

    // forward cloudinary events
    ["submit","progress","always","fail","done"].forEach(ev => {
      if (this[ev]) {
        options[ev] = (e, data) => Ember.run(() => this.sendAction(ev, e, data));
      }
    });

    var reqData = this.get("offerId") ? { tags: "offer_" + this.get("offerId") } : {};
    new AjaxPromise("/images/generate_signature", "GET", this.get('session.authToken'), reqData)
      .then(function(data) {
        Ember.$(_this.element)
          .attr("data-form-data", JSON.stringify(data))
          .cloudinary_fileupload(options);
        _this.set("disabled", false);
        _this.sendAction("ready");
      });
  }
});
