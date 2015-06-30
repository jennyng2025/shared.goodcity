import Ember from 'ember';

export default Ember.View.reopen({
  didInsertElement: function() {
    this._super();

    Ember.run.scheduleOnce("afterRender", function() {
    // Scroll to first unread message in thread or scroll to bottom
      var messageBox, id, scrollOffset;
      var offset = 0;
      var hadUnread = Ember.$(".hidden.unread_id") && Ember.$(".hidden.unread_id").attr("data-name");

      if(Ember.$(".unread.received_message:first").length > 0) {
        id = Ember.$(".unread.received_message:first").attr("id");
        messageBox = Ember.$("#" + id);
        scrollOffset = messageBox.offset().top + offset;
      } else {
        messageBox = Ember.$(".message-textbar");
        if(messageBox.length > 0) {
          scrollOffset = Ember.$(document).height() + 100;
        }
      }

      if(scrollOffset && !hadUnread) {
        Ember.$('html, body').stop(true, false).animate({
          scrollTop: scrollOffset
        }, 'fast');
      }

      Ember.$(".hidden.unread_id").attr("data-name", (id || 0));
      return true;
    });
  },
});
