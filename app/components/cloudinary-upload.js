import Ember from "ember";
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: "input",
  type:    "file",
  accept:  "image/*",
  name:    "file",
  classNames: ["cloudinary-fileupload"],
  "data-cloudinary-field": "image_upload",
  "data-url": config.APP.CLOUD_URL,
  disabled: true,
  attributeBindings: [ "name", "type", "value", "data-cloudinary-field",
    "data-url", "data-form-data", "disabled", "style", "accept"],
  events: ["submit","progress","always","fail","done"],

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
        alert(Ember.I18n.t('upload-image.upload_error'));
      }
    };

    // forward cloudinary events
    this.get("events").forEach(function(event) {
      if (_this[event]) {
        options[event] = function(e, data) {
          Ember.run(function() {
            _this.sendAction(event, e, data);
          });
        };
      }
    });

    new AjaxPromise("/images/generate_signature", "GET", this.get('session.authToken'))
      .then(function(data) {
        _this.$()
          .attr("data-form-data", JSON.stringify(data))
          .cloudinary_fileupload(options);
        _this.set("disabled", false);
        _this.sendAction("ready");
      });
  }
});
