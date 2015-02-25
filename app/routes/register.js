import SessionRoute from './session';

export default SessionRoute.extend({
  model: function() {
    return this.store.all('territory');
  }
});
