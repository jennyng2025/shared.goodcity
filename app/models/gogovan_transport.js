import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
  name: attr('string'),
  i18n: Ember.inject.service(),

  isDisabled: function() {
    return this.get('name') === this.get("i18n").t("offer.disable").string;
  }.property('name'),

  specialId: function() {
    return this.get("id") + "_ggv";
  }.property('id')
});
