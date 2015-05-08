import Ember from 'ember';
export default Ember.Controller.extend({
  actions: {
    addItem: function() {
      var draftItemId = this.get("model.items").filterBy("state", "draft").get("firstObject.id") || "new";
      this.transitionToRoute('item.edit_images', draftItemId);
    }
  }
});
