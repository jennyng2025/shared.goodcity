import Ember from 'ember';
export default Ember.Component.extend({

  updateHeaderPosition: function(){
    var messagesHeader = Ember.$(".contain-to-grid.message_nav_bar");

    if(document.body.scrollTop === 0 || (document.height === Ember.$(window).height()) || (Ember.$("textarea").is(":focus"))) {
      messagesHeader.removeClass("fixed");
    } else {
      messagesHeader.addClass("fixed");
    }
  },

  willDestroyElement() {
    var _this = this;
    var updateHeader = Ember.run.bind(this, _this.updateHeaderPosition);
    window.removeEventListener("touchmove", updateHeader);
    window.removeEventListener("scroll", updateHeader);
  },

  didInsertElement() {
    var _this = this;
    this._super();

    Ember.$().ready(function(){
      // Scroll back to page-top on back-click
      Ember.$('.message_nav_bar').on('click', '.back', function(){
        window.scrollTo(0, 0);
      });

      // Sticky Header when scrolled up
      var updateHeader = Ember.run.bind(this, _this.updateHeaderPosition);
      window.addEventListener("touchmove", updateHeader);
      window.addEventListener("scroll", updateHeader);
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
