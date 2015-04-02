import AuthorizeRoute from './authorize';

export default AuthorizeRoute.extend({
  messagesUtil: Ember.inject.service("messages"),

  afterModel: function(messages) {
    messages.filterBy('state', 'unread').forEach(m => this.get("messagesUtil").markRead(m));
  }
});
