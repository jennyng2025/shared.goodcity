import Ember from 'ember';

export default Ember.Component.extend({

  isEnglish: function() {
    return this.get('session.language') === 'en';
  }.property('session.language'),

  isChinese: function() {
    return this.get('session.language') === 'zh-tw';
  }.property('session.language'),

  actions: {
    setLanguage: function(language) {
      this.set('session.language', language);
    }
  }

});
