import Ember from "ember";

export default Ember.Controller.extend({
  needs: ["offer"],
  offer: Ember.computed.alias("controllers.offer.model"),

  actions: {
    next: function() {
      if(this.get("session.isAdminApp")) {
        this.transitionToRoute("review_item.accept", this.get('model.offer'), this.get('model'));
      } else {
        this.transitionToRoute("item.edit");
      }
    },

    back: function() {
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

    newItem: function(item) {
      this.transitionToRoute("item.edit_images", item.get("id"));
    }
  }
});
