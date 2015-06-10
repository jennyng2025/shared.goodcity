import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
  name: attr('string'),

  isDisabled: function() {
    return this.get('name') === Ember.I18n.t("offer.disable");
  }.property('name'),

  specialId: function() {
    return this.get("id") + "_ggv";
  }.property('id'),
});
