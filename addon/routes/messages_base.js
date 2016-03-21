import AuthorizeRoute from 'goodcity/routes/authorize';

export default AuthorizeRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);
    controller.send("markRead");
  }
});
