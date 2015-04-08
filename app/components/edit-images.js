import Ember from "ember";

export default Ember.Component.extend({
  store: Ember.inject.service(),
  alert: Ember.inject.service(),
  offerId: null,
  itemId: null,
  packageId: null,

  offer: function() {
    return this.get("store").getById("offer", this.get("offerId"));
  }.property("offerId"),

  item: function() {
    return this.get("store").getById("item", this.get("itemId"));
  }.property("itemId"),

  package: function() {
    return this.get("store").getById("package", this.get("packageId"));
  }.property("packageId"),

  noImage: Ember.computed.empty("item.images"),
  previewImage: null,
  addPhotoLabel: Ember.I18n.t("edit_images.add_photo"),
  isReady: false,
  isExpanded: false,
  backBtnVisible: true,

  previewMatchesFavourite: function() {
    return this.get("previewImage") === this.get("favouriteImage");
  }.property("previewImage", "favouriteImage"),

  images: function() {
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
  }.property("item.images.[]"),

  favouriteImage: function() {
    return this.get("package") ?
      this.get("package.image") :
      this.get("images").filterBy("favourite").get("firstObject");
  }.property("item.images.@each.favourite", "package.image"),

  initPreviewImage: function() {
    var image = this.get("package.image") || this.get("item.displayImage");
    if (image) {
      this.send("setPreview", image);
    }
  }.observes("package", "item").on("init"),

  //css related
  previewImageBgCss: function() {
    var css = this.get("instructionBoxCss");
    if (!this.get("previewImage")) {
      return css;
    }
    return css + "background-image:url(" + this.get("previewImage.imageUrl") + ");" +
      "background-size: " + (this.get("isExpanded") ? "contain" : "cover") + ";";
  }.property("previewImage", "isExpanded"),

  instructionBoxCss: function() {
    var height = Ember.$(window).height() * 0.6;
    return "min-height:" + height + "px;";
  }.property("previewImage", "isExpanded"),

  thumbImageCss: function() {
    var imgWidth = Math.min(120, Ember.$(window).width() / 4 - 14);
    return "width:" + imgWidth + "px; height:" + imgWidth + "px;";
  }.property(),

  actions: {
    next: function() {
      this.sendAction("next");
    },

    back: function() {
      this.sendAction("back");
    },

    setPreview: function(image) {
      this.get("item.images").setEach("selected", false);
      image.set("selected", true);
      this.set("previewImage", image);
    },

    setFavourite: function() {
      if (this.get("package")) {
        var pkg = this.get("package");
        pkg.set("imageId", this.get("previewImage.id"));
        pkg.save()
          .catch(error => { pkg.rollback(); throw error; });
      } else {
        this.get("item.images").setEach("favourite", false);
        this.get("previewImage").set("favourite", true).save()
          .catch(error => {
            this.get("item.images").forEach(img => img.rollback());
            throw error;
          });
      }
    },

    deleteImage: function() {
      if (this.get("item.images.length") === 1) {
        this.get("alert").show(Ember.I18n.t("edit_images.cant_delete_last_image"));
        return;
      }
      if (window.confirm(Ember.I18n.t("edit_images.delete_confirm"))) {
        var loadingView = this.container.lookup('view:loading').append();
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
          .catch(error => { this.get("previewImage").rollback(); throw error; })
          .finally(() => loadingView.destroy());
      }
    },

    expandImage: function() {
      var value = this.get("isExpanded");
      this.set("isExpanded", !value);
    },

    //file upload
    triggerUpload: function() {
      if(navigator.userAgent.match(/iemobile/i))
      {
        //don't know why but on windows phone need to click twice in quick succession
        //for dialog to appear
        Ember.$("#photo-list input[type='file']").click().click();
      }
      else
      {
        Ember.$("#photo-list input[type='file']").click();
      }
    },

    uploadReady: function() {
      this.set("isReady", true);
    },

    uploadProgress: function(e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10) || 0;
      this.set("addPhotoLabel", progress + "%");
    },

    uploadComplete: function() {
      this.set("addPhotoLabel", Ember.I18n.t("edit_images.add_photo"));
    },

    uploadSuccess: function(e, data) {
      var identifier = data.result.version + "/" + data.result.public_id + "." + data.result.format;
      if (!this.get("item")) {
        var offer = this.get("offer");
        var defaultDonorCondition = this.get("store").all("donorCondition").sortBy("id").get("firstObject");
        var item = this.get("store").createRecord("item", {offer:offer,donorCondition:defaultDonorCondition,state:"draft"});
        item.save()
          .then(() => {
            this.get("store").createRecord('image', {cloudinaryId: identifier, item: item, favourite: true}).save()
              .then(() => this.sendAction("newItem", item));
          })
          .catch(error => {
            item.unloadRecord();
            throw error;
          });
      } else {
        var img = this.get("store").createRecord('image', {cloudinaryId: identifier, item: this.get("item")});
        img.save().catch(error => { img.unloadRecord(); throw error; });
      }
    }
  }
});
