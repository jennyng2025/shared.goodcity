import Ember from 'ember';

var Router = Ember.Router.extend();

Router.map(function() {
  this.resource('i18n', { path: '/i18n' });
  this.resource('logout', { path: '/logout' });

  this.route('register');
  this.route('login');
  this.route('resend');
  this.route('authenticate');
  this.route('territories');
  this.route('districts');

  this.resource('tour');
});

export default Router;