import AuthorizeRoute from './authorize';
import messagesUtil from '../utils/messages';

export default AuthorizeRoute.extend({
  afterModel: function(messages) {
    var markRead = messagesUtil.markRead.bind(this, this.container);
    messages.filterBy('state', 'unread').forEach(markRead);
  }
});
