export default Ember.HTMLBars.makeBoundHelper(function (params) {
  var paramNames = params.slice(1).map(function(val, idx) { return "p" + idx; });
  var func = Function.apply(this, paramNames.concat("return " + params[0] + ";"))
  return func.apply(params[1] || this);
});
