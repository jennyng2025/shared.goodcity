import Ember from "ember";

/* {{#view "online-button" classNames="btn" action="submit" actionArgs=true}}
 *   {{t "btn_label"}}
 * {{/view}}
 *
 * You can pass multiple arguments for actionArgs like this: actionArgs="[\"test\",true]"
 * Note actionArgs="['test']" causes json parse error, but this works actionArgs='["test"]'
 */

export default Ember.View.extend(Ember.ViewTargetActionSupport, {
  tagName: "button",
  attributeBindings: ["disabled"],
  disabled: false,

  updateDisabled: null,
  disabledOverride: false,

  didInsertElement: function() {
    this.updateDisabled = Ember.run.bind(this,
      () => this.set("disabled", !navigator.onLine || this.get("disabledOverride"))
    );
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
