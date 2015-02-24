import DS from 'ember-data';

// Polymorphic associations are not supported in ember-data beta version:
// refer: https://github.com/emberjs/data/issues/1574

export default DS.ActiveModelSerializer.extend({
  normalizeAddress: function(address) {
    address.addressable     = address.addressable_id;
    address.addressableType = address.addressable_type;
    delete address.addressable_id;
    delete address.addressable_type;
  },
  extractSingle: function(store, type, payload, id, requestType) {
    if (payload.address) {
      this.normalizeAddress(payload.address);
    }

    return this._super(store, type, payload, id, requestType);
  },
  extractArray: function(store, type, payload, id, requestType) {
    if (payload.addresses) {
      payload.addresses.forEach(this.normalizeAddress);
    }

    return this._super(store, type, payload, id, requestType);
  }
});
