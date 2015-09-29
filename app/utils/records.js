import Ember from "ember";
import config from "../config/environment";

export default {
  // this function navigates the relationship tree unloading records unless
  // related record is a taxonomy type or user
  unloadRecordTree: function(record) {
    var taxonomyTypes = config.APP.PRELOAD_TYPES
      .concat(config.APP.PRELOAD_AUTHORIZED_TYPES)
      .concat("user")
      .map(t => t.replace(/_(.)/, (m,g) => g.toUpperCase())); //to camelcase

    if (!record || record.unloading || taxonomyTypes.indexOf(record.constructor.typeKey) !== -1) {
      return;
    }

    record.unloading = true;
    record.eachRelationship((name, descriptor) => {
      if (descriptor.options.async && !this.isAsyncRelationshipLoaded(record, name)) {
        return;
      }

      var unload = r => {
        if (descriptor.kind === "belongsTo") {
          this.unloadRecordTree(r);
        } else if (descriptor.kind === "hasMany") {
          r.forEach(r2 => this.unloadRecordTree(r2));
        }
      };

      if (descriptor.options.async) {
        Ember.run.next(() => record.get(name).then(r => unload(r)));
      } else {
        unload(record.get(name));
      }
    });

    Ember.run.next(() => record.unloadRecord());
  },

  isAsyncRelationshipLoaded: function(record, relationshipName) {
    // todo replace use of private api "record._relationships" https://github.com/emberjs/data/issues/2431
    var relatedRecord = record._relationships[relationshipName].inverseRecord;

    // this is the workaround I read in github issue
    if (!relatedRecord) {
      return false;
    }

    // this is the workaround I seem to need from unit test
    var relationshipKind = Ember.get(record.constructor, "relationshipsByName").get(relationshipName).kind;
    if (relationshipKind === "belongsTo") {
      return record.store.hasRecordForId(relatedRecord.constructor.typeKey, relatedRecord.id);
    } else {
      throw "NotYetImplemented";
    }
  }
};
