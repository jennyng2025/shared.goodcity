import AuthorizeRoute from './authorize';

export default AuthorizeRoute.extend({
  model: function(params) {
    if (params.item_id === "new") {
      return null;
    }

    return this.store.find('item', params.item_id);
  }
});
