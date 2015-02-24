import Session from '../session';

export default {
  name: 'session',
  initialize: function(container, application) {
    container.register('session:current', Session, {singleton: true});
    application.inject('controller', 'session', 'session:current');
    application.inject('route', 'session', 'session:current');
    application.inject('adapter', 'session', 'session:current');
    application.inject('component', 'session', 'session:current');
  }
};
