import { ActiveModelSerializer } from 'active-model-adapter';

// Polymorphic associations are not supported in ember-data beta version:
// refer: https://github.com/emberjs/data/issues/1574

export default ActiveModelSerializer.extend({

  keyForAttribute: function(attr, method) {
    if (attr === "addressable") {
      return "addressable_id";
    }
    return this._super(attr, method);
  }
});
