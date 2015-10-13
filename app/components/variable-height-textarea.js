import Ember from 'ember';

export default Ember.TextArea.extend({
  tagName: "textarea",
  attributeBindings: ["disabled"],
  disabled: false,

  valueChanged: Ember.observer('value', function () {
    var _this = this;
    var textarea = _this.element;

    if(textarea) {
      Ember.run.once(function(){
        // auto-resize height of textarea $('textarea')[0].
        if (textarea.scrollHeight < 120) {
          Ember.$(textarea)
            .css({'height':'auto','overflow-y':'hidden'})
            .height(textarea.scrollHeight - 15);

          var parent = _this.get('parentDiv');
          var grandParentDiv = Ember.$("." + parent).closest(".review_item ");
          if(grandParentDiv.length === 0) {
            // auto-move textarea by chaning margin of parentDiv
            Ember.$("." + parent)
              .css({'margin-bottom': textarea.scrollHeight - 50 });

            // scrolling down to bottom of page
            if(_this.get("value") !== ""){
              Ember.$('html, body').stop(true, false).animate({
                scrollTop: Ember.$(document).height()
              }, 'fast');
            }
          }

        } else {
          Ember.$(textarea)
            .css({'height':'auto','overflow-y':'auto'})
            .height(105);
        }
      });
    }
  }),

});
