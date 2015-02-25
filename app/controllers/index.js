import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  currentLanguage: Ember.computed.alias('controllers.application.currentLanguage'),
});
