export default {
  name: 'session',
  initialize: function(container, application) {
    application.inject('controller', 'session', 'service:session');
    application.inject('route', 'session', 'service:session');
    application.inject('component', 'session', 'service:session');
  }
};
