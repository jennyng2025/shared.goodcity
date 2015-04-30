import Ember from 'ember';
import config from '../config/environment';

var storageSupported = false;
try { localStorage.test = 2; delete localStorage.test; storageSupported = true; }
catch(err) {}

var cookiesSupported = false;
try { $.cookie('test', 2); $removeCookie('test'); cookiesSupported = true; }
catch(err) {}

export default Ember.computed.localStorage = function() {
  function useStorage(key, value) {
    //get
    if (arguments.length === 1) {
      return JSON.parse(localStorage[key] || null);
    }

    //set
    if (Ember.isNone(value)) {
      delete localStorage[key];
    } else {
      localStorage[key] = JSON.stringify(value);
    }
    return value;
  }

  function useCookie(key, value) {
    //get
    if (arguments.length === 1) {
      return $.cookie(key);
    }

    //set
    $.cookie.json = true;
    if (Ember.isNone(value)) {
      $.removeCookie(key);
    } else {
      $.cookie(key, value, {expires:365, path:'/', secure:config.environment==='production'});
    }
    return value;
  }

  function useMemory(key, value) {
    if (!window.goodcityStorage) {
      window.goodcityStorage = {};
    }

    //get
    if (arguments.length === 1) {
      return window.goodcityStorage[key];
    }

    //set
    if (Ember.isNone(value)) {
      delete window.goodcityStorage[key];
    } else {
      window.goodcityStorage[key] = value;
    }
    return value;
  }

  return Ember.computed(function(key, value) {
    if (storageSupported) {
      return useStorage.apply(this, arguments);
    }

    if (cookiesSupported) {
      return useCookie.apply(this, arguments);
    }

    return useMemory.apply(this, arguments);
  });
};
