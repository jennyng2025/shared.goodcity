import Ember from 'ember';

export default Ember.Component.extend({

  isEnglish: function() {
    return this.get('currentLanguage') === 'en';
  }.property('currentLanguage'),

  isChinese: function() {
    return this.get('currentLanguage') === 'zh-tw';
  }.property('currentLanguage'),
  
  actions: {
    setLanguage: function(language) {
      this.sendAction('action', language);
    }
  }
  
});