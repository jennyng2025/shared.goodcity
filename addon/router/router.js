import Ember from 'ember';

var Router = Ember.Router.extend();

Router.map(function() {
  this.resource('i18n', { path: '/i18n' });
  this.resource('logout', { path: '/logout' });
  this.route('login');
  this.route('post_login');
  this.route('resend');
  this.route('offline');
  this.route('authenticate');
  this.route('territories');
  this.route('districts');

  this.route('not-found', { path: '/*path' });
});

export default Router;
