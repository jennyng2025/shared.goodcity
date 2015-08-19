import ValidatableForm from 'ember-cli-html5-validation/components/validatable-form';

// Can be removed once https://github.com/maestrooo/ember-cli-html5-validation/issues/21 is fixed
export default ValidatableForm.extend({
  submit(event) {
    if (event) { // fix for https://jira.crossroads.org.hk/browse/GCW-568 not something I can reproduce
      event.preventDefault();
    }
    return this._super();
  }
});
