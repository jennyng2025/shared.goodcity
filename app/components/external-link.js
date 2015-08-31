import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "a",
  href: "#",

  click: function() {
    window.open(this.decodeLink(), "_system");
    return false;
  },

  decodeLink: function(){
    return this.attrs.linkUrl.replace(/&amp;/g, '&');
  },
});
