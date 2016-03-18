import Ember from "ember";
import { translationMacro as t } from "ember-i18n";
import config from '../../config/environment';
const { getOwner } = Ember;

export default Ember.Controller.extend({
  offerController: Ember.inject.controller('offer'),
  offer: Ember.computed.alias("offerController.model"),
  item: Ember.computed.alias("model"),

  session: Ember.inject.service(),
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  cordova: Ember.inject.service(),
  offerId: null,
  itemId: null,
  packageId: null,
  noImage: Ember.computed.empty("item.images"),
  previewImage: null,
  addPhotoLabel: t("edit_images.add_photo"),
  isReady: false,
  isExpanded: false,
  backBtnVisible: true,
  loadingPercentage: t("edit_images.image_uploading"),
  uploadedFileDate: null,

  initActionSheet: function(onSuccess) {
    var _this = this;
    return window.plugins.actionsheet.show({
      buttonLabels: [this.locale("edit_images.upload").string, this.locale("edit_images.camera").string, this.locale("edit_images.cancel").string]
    }, function(buttonIndex) {
      if (buttonIndex === 1) {
        navigator.camera.getPicture(onSuccess, null, {
          quality: 40,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
      }
      if (buttonIndex === 2) {
        navigator.camera.getPicture(onSuccess, null, {
          correctOrientation: true,
          quality: 40,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.CAMERA
        });
      }
      if (buttonIndex === 3) {
        window.plugins.actionsheet.hide();
      }
    });
  },

  package: Ember.computed('packageId', function(){
    return this.get("store").peekRecord("package", this.get("packageId"));
  }),

  previewMatchesFavourite: Ember.computed("previewImage", "favouriteImage", function(){
    return this.get("previewImage") === this.get("favouriteImage");
  }),

  images: Ember.computed("item.images.[]", function(){
    //The reason for sorting is because by default it's ordered by favourite
    //then id order. If another image is made favourite then deleted the first image
    //by id order is made favourite which can be second image in list which seems random.

    //Sort by id ascending except place new images id = 0 at end
    return (this.get("item.images") || Ember.A()).toArray().sort(function(a,b) {
      a = parseInt(a.get("id"));
      b = parseInt(b.get("id"));
      if (a === 0) { return 1; }
      if (b === 0) { return -1; }
      return a - b;
    });
  }),

  favouriteImage: Ember.computed("item.images.@each.favourite", "package.image", function(){
    return this.get("package") ?
      this.get("package.image") :
      this.get("images").filterBy("favourite").get("firstObject");
  }),

  initPreviewImage: Ember.on('init', Ember.observer("package", "item", "item.images.[]", function () {
    var image = this.get("package.image") || this.get("item.displayImage");
    if (image) {
      this.send("setPreview", image);
    }
  })),

  //css related
  previewImageBgCss: Ember.computed("previewImage", "isExpanded", function(){
    var css = this.get("instructionBoxCss");
    if (!this.get("previewImage")) {
      return css;
    }
    return new Ember.Handlebars.SafeString(
      css + "background-image:url(" + this.get("previewImage.imageUrl") + ");" +
      "background-size: " + (this.get("isExpanded") ? "contain" : "cover") + ";"
    );
  }),

  instructionBoxCss: Ember.computed("previewImage", "isExpanded", function(){
    var height = Ember.$(window).height() * 0.6;
    return new Ember.Handlebars.SafeString("min-height:" + height + "px;");
  }),

  thumbImageCss: Ember.computed(function(){
    var imgWidth = Math.min(120, Ember.$(window).width() / 4 - 14);
    return new Ember.Handlebars.SafeString("width:" + imgWidth + "px; height:" + imgWidth + "px;");
  }),

  noImageLink: Ember.computed("noImage", function(){
    return this.get("noImage") && this.get("session.isAdminApp");
  }),

  locale: function(str){
    return this.get("i18n").t(str);
  },

  createItem: function(donorCondition, withoutImage, identifier) {
    var _this = this;
    var loadingView = getOwner(this).lookup('component:loading').append();
    var offer = this.get("offer");
    var item = this.get("store").createRecord("item", {
      offer: offer,
      donorCondition: donorCondition,
      state: "draft"
    });
    item.save()
      .then(() => {
        if(withoutImage) {
          loadingView.destroy();
          _this.transitionToRoute("review_item.accept", _this.get('offer'), item);
        }
        else
        {
          this.get("store").createRecord('image', {cloudinaryId: identifier, item: item, favourite: true}).save()
            .then(function() {
              _this.send("newItem", item)
              loadingView.destroy();
            });
        }
      })
      .catch(error => {
        item.unloadRecord();
        loadingView.destroy();
        throw error;
      });
  },

  deleteOffer: function(loadingView) {
    var controller = this;
    var offer = this.get("offer");
    offer.destroyRecord().then(function(){
      controller.transitionToRoute('my_list.reviewing');
    })
    .finally(() => loadingView.destroy());
  },

  cancelItem: function(controller, item) {
    var offer = item.get('offer');
    var loadingView = getOwner(controller).lookup('component:loading').append();

    if(offer.get('itemCount') === 1){
      var delivery = offer.get("delivery");
      if(delivery)
        this.get("messageBox").confirm(this.locale("edit_images.cancelling_item_will_cancel_offer"),
          () =>{
            var gogovanOrder = offer.get("delivery.gogovanOrder");
            if(gogovanOrder && gogovanOrder.get("isActive")){
              loadingView.destroy();
              controller.transitionToRoute("offer.cancel_gogovan", offer)
            }
            else
              this.deleteOffer(loadingView);
          }
        );
      else
        this.deleteOffer(loadingView);
    }
    else{
      offer.get('items').removeObject(item);
      item.destroyRecord().then(function(){
        controller.transitionToRoute("review_offer.items");
      })
      .finally(() => loadingView.destroy());
    }
  },

  removeImage: function(controller, item) {
    var _this = this;
    var img = item.get("images.firstObject");
    var loadingView = getOwner(controller).lookup('component:loading').append();
    img.deleteRecord();
    img.save()
      .then(i => {
        i.unloadRecord();
        controller.transitionToRoute("item.edit_images", item);
      })
    .finally(() => loadingView.destroy());
  },

  confirmRemoveLastImage: function() {
    var item = this.get("item");
    this.get("messageBox").custom(
      this.locale("edit_images.last_image_with_item"),
      this.locale("edit_images.cancel_item"), () => this.cancelItem(this, item),
      this.locale("edit_images.remove_image"), () => this.removeImage(this, item)
    );
  },

  cannotRemoveImageAlert: function(){
    this.get("messageBox").alert(this.locale("edit_images.cant_delete_last_image"));
  },

  actions: {
    next() {
      if(this.get("session.isAdminApp")) {
        this.transitionToRoute("review_item.accept", this.get('offer'), this.get('model'));
      } else {
        this.transitionToRoute("item.edit");
      }
    },

    //only used for admin
    nextWithoutImage() {
      var item = this.get("item")
      if(item){
        this.transitionToRoute("review_item.accept", this.get('offer'), item);
      }
      else{
        var defaultDonorCondition = this.get("store").peekAll("donorCondition").sortBy("id").get("firstObject");
        this.createItem(defaultDonorCondition, true);
      }
    },

    back() {
      if(this.get("session.isAdminApp")) {
        this.transitionToRoute("review_offer.items");
      } else {
        if (this.get('offer.itemCount') === 0){
          this.transitionToRoute("offers");
        } else {
          this.transitionToRoute("offer.offer_details");
        }
      }
    },

    newItem(item) {
      if(this.get("session.isAdminApp")){
        this.transitionToRoute("item.edit_images", item.get("id"));
      } else {
        this.transitionToRoute("item.edit", item.get("id"));
      }
    },

    setPreview(image) {
      this.get("item.images").setEach("selected", false);
      image.set("selected", true);
      this.set("previewImage", image);
    },

    setFavourite() {
      if (this.get("package")) {
        var pkg = this.get("package");
        pkg.set("imageId", this.get("previewImage.id"));
        pkg.save()
          .catch(error => { pkg.rollback(); throw error; });
      } else {
        this.get("item.images").setEach("favourite", false);
        this.get("previewImage").set("favourite", true);
        this.get("previewImage").save()
          .catch(error => {
            this.get("item.images").forEach(img => img.rollback());
            throw error;
          });
      }
    },

    deleteImage() {
      if (this.get("item.images.length") === 1)
      {
        this.get("session.isAdminApp") ? this.confirmRemoveLastImage()
          : this.cannotRemoveImageAlert();
        return;
      }
      else {
        this.get("messageBox").confirm(this.get("i18n").t("edit_images.delete_confirm"), () => {
          var loadingView = getOwner(this).lookup('component:loading').append();
          var img = this.get("previewImage");
          img.deleteRecord();
          img.save()
            .then(i => {
              i.unloadRecord();
              this.initPreviewImage();
              if (!this.get("favouriteImage")) {
                this.send("setFavourite");
              }
            })
            .catch(error => { img.rollback(); throw error; })
            .finally(() => loadingView.destroy());
        });
      }
    },

    expandImage() {
      var value = this.get("isExpanded");
      this.set("isExpanded", !value);
    },

    //file upload
    triggerUpload() {

      // For Cordova application
      if (config.cordova.enabled) {
        var onSuccess = ((function(_this) {
          return function(path) {
            console.log(path);
            var dataURL = "data:image/jpg;base64," + path

            $("input[type='file']").fileupload('option', 'formData').file = dataURL;
            $("input[type='file']").fileupload('add', { files: [ dataURL ] });
          };
        })(this));

        this.initActionSheet(onSuccess);
      } else {

        // For web application
        if(navigator.userAgent.match(/iemobile/i))
        {
          //don't know why but on windows phone need to click twice in quick succession
          //for dialog to appear
          Ember.$("#photo-list input[type='file']").click().click();
        }
        else
        {
          Ember.$("#photo-list input[type='file']").trigger("click");
        }
      }
    },

    uploadReady() {
      this.set("isReady", true);
    },

    uploadStart(e, data) {
      this.set("uploadedFileDate", data);
      Ember.$(".loading-image-indicator").show();
    },

    cancelUpload() {
      if(this.get("uploadedFileDate")){ this.get("uploadedFileDate").abort(); }
    },

    uploadProgress(e, data) {
      e.target.disabled = true; // disable image-selection
      var progress = parseInt(data.loaded / data.total * 100, 10) || 0;
      this.set("addPhotoLabel", progress + "%");
      this.set("loadingPercentage", this.get("i18n").t("edit_images.image_uploading") + progress + "%");
    },

    uploadComplete(e) {
      e.target.disabled = false; // enable image-selection
      this.set("uploadedFileDate", null);
      Ember.$(".loading-image-indicator.hide_image_loading").hide();
      this.set("addPhotoLabel", this.get("i18n").t("edit_images.add_photo"));
      this.set("loadingPercentage", this.get("i18n").t("edit_images.image_uploading"));
    },

    uploadSuccess(e, data) {
      var identifier = data.result.version + "/" + data.result.public_id + "." + data.result.format;
      var item = this.get("item");
      if (!item || this.get("item.isOffer")) {
        var defaultDonorCondition = this.get("store").peekAll("donorCondition").sortBy("id").get("firstObject");
        this.createItem(defaultDonorCondition, false, identifier)
      } else {
        var favourite = item.get("images.length") === 0;
        var img = this.get("store").createRecord('image', {cloudinaryId: identifier, item: this.get("item"), favourite: favourite});
        img.save().catch(error => { img.unloadRecord(); throw error; });
      }
    },
  },

});
