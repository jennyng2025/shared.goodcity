import Ember from 'ember';
import initFoundation from './init-foundation';

export default initFoundation.extend({
  didInsertElement() {
    this._super();

    Ember.$().ready(function(){
      Ember.$('.sticky_title_bar').on('click', '.back', function(){
        window.scrollTo(0, 0);
      });
    });

    Ember.run.scheduleOnce("afterRender", function() {

      var messageBox, id, scrollOffset;
      var hadUnread = Ember.$(".hidden.unread_id") && Ember.$(".hidden.unread_id").attr("data-name");

      // Scroll to first unread message in thread
      if(Ember.$(".unread.received_message:first").length > 0) {
        id = Ember.$(".unread.received_message:first").attr("id");
        messageBox = Ember.$("#" + id);
        scrollOffset = messageBox.offset().top - 100;
      } else {

        // scroll to bottom
        if(Ember.$(".message-textbar").length > 0) {
          scrollOffset = Ember.$(document).height();
        }
      }

      var screenHeight = document.documentElement.clientHeight;
      var pageHeight = document.documentElement.scrollHeight;

      if(scrollOffset && !hadUnread && pageHeight > screenHeight) {
        window.scrollTo(0, scrollOffset);
      }

      Ember.$(".hidden.unread_id").attr("data-name", (id || 0));
      return true;
    });
  },
});
