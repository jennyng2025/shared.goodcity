import Ember from "ember";

/* {{#"online-button" classNames="btn" action="submit" actionArgs=true}}
 *   {{t "btn_label"}}
 * {{/online-button}}
 *
 * You can pass multiple arguments for actionArgs like this: actionArgs="[\"test\",true]"
 * Note actionArgs="['test']" causes json parse error, but this works actionArgs='["test"]'
 */

export default Ember.Component.extend(Ember.ViewTargetActionSupport, {
  tagName: "button",
  attributeBindings: ["disabled"],
  disabled: false,

  updateDisabled: null,
  disabledOverride: false,

  didInsertElement: function() {
    this.updateDisabled = Ember.run.bind(this, () => {
      var online = navigator.connection ? navigator.connection.type !== "none" : navigator.onLine;
      this.set("disabled", !online || this.get("disabledOverride"));
    });
    this.updateDisabled();
    window.addEventListener("online", this.updateDisabled);
    window.addEventListener("offline", this.updateDisabled);
  },

  willDestroyElement: function() {
    if (this.updateDisabled) {
      window.removeEventListener("online", this.updateDisabled);
      window.removeEventListener("offline", this.updateDisabled);
    }
  },

  click: function() {
    var args = this.get("actionArgs");
    if (typeof args == "string" && args.indexOf("[") === 0) {
      args = JSON.parse(args);
    }
    this.triggerAction({actionContext: args});
  }
});
