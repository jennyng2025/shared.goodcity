import Ember from 'ember';

export default Ember.Component.extend({

  layoutName: 'components/message-box',
  message: "",
  btn1Text: "",
  btn1Callback: () => {},
  btn2Text: "",
  btn2Callback: () => {},
  messageComponent: null,
  messageModal: null,

  actions: {
    btn1Click: function() {
      if (this.btn1Callback) {
        this.btn1Callback(messageModal);
      }
      this.destroy();
    },

    btn2Click: function() {
      if (this.btn2Callback) {
        this.btn2Callback(messageModal);
      }
      this.destroy();
    }
  }
});
