import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'img',
  attributeBindings:['src'],
  src: null,

  didInsertElement: function(){
    var _this = this;
    var default_image = "/assets/images/default_user_image.jpg";
    var state = _this.get("controller.model.state");

    this.$().on('error', function(){
      if(state === "under_review"){
        _this.get('controller').send('handleBrokenImage');
      }
      if(!state){ this.src = default_image; }
    });
  },
});
