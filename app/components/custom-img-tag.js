import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'img',
  attributeBindings:['src'],
  src: null,

  didInsertElement(){
    var _this = this;
    var default_image = "assets/images/default_user_image.jpg";
    var state = _this.get("_controller.model.state");

    this.$().on('error', function(){
      if(state === "under_review"){
        _this.get('_controller').send('handleBrokenImage');
      }
      if(!state){ this.src = default_image; }
    });
  },
});
