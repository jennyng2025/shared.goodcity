import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  quantity:        attr('number'),
  length:          attr('number'),
  width:           attr('number'),
  height:          attr('number'),
  notes:           attr('string'),
  state:           attr('string', {defaultValue:'expecting'}),
  state_event:     attr('string'),
  receivedAt:      attr('date'),
  rejectedAt:      attr('date'),
  createdAt:       attr('date'),
  updatedAt:       attr('date'),
  item:            belongsTo('item', { async: true }),
  packageType:     belongsTo('item_type', { async: true }),
  imageId:         attr('number'),
  offerId:         attr('number'),

  packageName: function() {
    return this.get('packageType.name');
  }.property('packageType'),

  packageTypeObject: function() {
    var obj = this.get('packageType').getProperties('id', 'name', 'isItemTypeNode', 'parentId');
    obj.id = obj.itemTypeId = parseInt(obj.id);
    return obj;
  }.property('packageType'),

  dimensions: function() {
    var res = '';
    var append = val => {
      if (val) { res += !res ? val : ' x ' + val; }
    }
    append(this.get('width'));
    append(this.get('height'));
    append(this.get('length'));
    return !res ? '' : res + 'cm';
  }.property('width', 'height', 'length'),

  image: function() {
    return this.store.getById("image", this.get("imageId"));
  }.property("imageId"),

  displayImageUrl: function() {
    return this.get("image") ? this.get("image.thumbImageUrl") : this.get("item.displayImageUrl");
  }.property("image", "item.displayImageUrl")
});
