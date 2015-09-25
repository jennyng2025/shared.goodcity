import Ember from "ember";

export default Ember.Component.extend({
  tagName: "span",
  number: null,
  hidden: Ember.computed.empty("number"),

  displayNumber: Ember.computed('number', function(){
    if (this.get("hidden")) {return ""};
    var num = this.get("number").replace(/\+852/, "");
    return num.length > 4 ? num.substr(0, 4) + " " + num.substr(4) : num;
  }),

  linkNumber: Ember.computed('number', function(){
    if (this.get("hidden")) {return ""};
    var prefix = this.get("number").indexOf("+852") === -1 ? "+852" : "";
    return prefix + this.get("number").replace(/ /g, "");
  })
});
