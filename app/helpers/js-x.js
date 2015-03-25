export default Ember.HTMLBars.makeBoundHelper(function (params) {
  var expression = params[0];
  var context = params[1] || this;
  return new Function("return " + expression + ";").call(context);
});
