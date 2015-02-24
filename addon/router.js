import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('i18n', { path: '/i18n' });
  this.resource('logout', { path: '/logout' });

  this.route('register');
  this.route('login');
  this.route('resend');
  this.route('authenticate');
  this.route('territories');
  this.route('districts');
});

export default Router;
