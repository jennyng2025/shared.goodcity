import Ember from 'ember';
import config from './../config/environment';

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
            var paddingSize = textarea.scrollHeight - 50;
            Ember.$("." + parent)
              .css({'padding-bottom': (paddingSize > 0 ? paddingSize : 0) });

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

  didInsertElement() {
    var _this = this;
    var parent = _this.get('parentDiv');
    var grandParentDiv = Ember.$("." + parent).closest(".review_item ");

    // Apply only in Donor Cordova App.
    if(grandParentDiv.length === 0 && config.cordova.enabled) {
      var messagesHeader = Ember.$(".contain-to-grid.message_nav_bar");

      Ember.$().ready(function(){
        Ember.$(_this.element).focus(function(){
          Ember.$(this.closest(".message-textbar")).css({'position':'absolute'});
          messagesHeader.removeClass("fixed");
        });

        Ember.$(_this.element).blur(function(){
          Ember.$(this.closest(".message-textbar")).css({'position':'fixed'});
          messagesHeader.addClass("fixed");
        });
      });

    }
  }

});
