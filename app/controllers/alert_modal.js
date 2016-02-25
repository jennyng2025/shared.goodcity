import Ember from 'ember';

export default Ember.Controller.extend({
  alertMessage: null,
  callback: null,

  actions: {
    closeOverlay() {
      this.send('closeModal');
      var callback = this.get("callback");
      if(callback) { callback.call(); }
    },
  }
});
