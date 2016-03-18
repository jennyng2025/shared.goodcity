import Ember from 'ember';

var Router = Ember.Router.extend();

Router.map(function() {
  this.route('i18n', { path: '/i18n' });
  this.route('logout', { path: '/logout' });
  this.route('login');
  this.route('post_login');
  this.route('resend');
  this.route('offline');
  this.route('authenticate');
  this.route('territories');
  this.route('districts');
  this.route('ggv_orders', { path: '/ggv_orders/:ggv_id' });
  this.route('pics');
  this.route('terms_and_conditions');

  this.route('not-found', { path: '/*path' });
});

export default Router;
