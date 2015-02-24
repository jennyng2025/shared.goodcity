import Ember from 'ember';

export default Ember.computed.localStorage = function() {
  return Ember.computed(function(key, value) {
    //get
    if (arguments.length === 1) {
      return JSON.parse(localStorage[key] || null);
    }

    //set
    if(Ember.isNone(value)) {
      delete localStorage[key];
    } else {
      localStorage[key] = JSON.stringify(value);
    }
    return value;
  });
};
