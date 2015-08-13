import Ember from 'ember';

export function jsX(params) {
  var paramNames = params.slice(1).map(function(val, idx) { return "p" + idx; });
  var func = Function.apply(this, paramNames.concat("return " + params[0] + ";"))
  return func.apply(params[1] === undefined ? this : params[1], params.slice(1));
}

export default Ember.Helper.helper(jsX);
