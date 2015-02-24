import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  quantity:        attr('number'),
  length:          attr('number'),
  width:           attr('number'),
  height:          attr('number'),
  notes:           attr('string'),
  state:           attr('string'),
  receivedAt:      attr('date'),
  rejectedAt:      attr('date'),
  createdAt:       attr('date'),
  updatedAt:       attr('date'),
  item:            belongsTo('item', { async: true }),
  packageType:     belongsTo('item_type', { async: true }),

  packageName: function() {
    return this.get('packageType.name');
  }.property('packageType'),

  packageTypeObject: function() {
     var packageTypeContent = this.get('packageType');
     var packageTypeObj = {};
     packageTypeObj.id = parseInt(packageTypeContent.get("id"));
     packageTypeObj.itemTypeId = parseInt(packageTypeContent.get("id"));
     packageTypeObj.name = packageTypeContent.get("name");
     packageTypeObj.isItemTypeNode = packageTypeContent.get("isItemTypeNode");
     packageTypeObj.parentId = packageTypeContent.get("parentId");
     return packageTypeObj;
  }.property('packageType')
});
