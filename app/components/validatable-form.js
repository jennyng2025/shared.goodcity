import ValidatableForm from 'ember-cli-html5-validation/components/validatable-form';

// This component will resolve the issue with `checkValidity()` function in Android 4.4.2
// in Samsung devices, as it always returns true in this version and causes invalid form submission.

export default ValidatableForm.extend({
  submit: function() {
    var form = this.get('element');
    var allValidElements = true;

    if(form.checkValidity()) {
      $('form input, form select, form textarea').each(function(){
        allValidElements = this.validity.valid;
        if(!allValidElements) {
          Ember.$(this).trigger("invalid"); // to highlight invalid field
          return false;
        }
      });
    }

    if (form.checkValidity() && allValidElements) {
      this.sendAction('action', this.get('model'));
    } else {
      this.scrollToFirstError();
    }

    return false;
  },


  // Overriding it to highlight all invalid fields in form
  scrollToFirstError: function() {
    var form = this.get('element');

    for (var i = 0 ; i !== form.elements.length ; ++i) {
      if (!form.elements[i].validity.valid) {
        Ember.$(form.elements[i]).trigger("invalid");
      }
    }
    return false;
  }

});
