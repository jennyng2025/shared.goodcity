import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    Ember.$().ready(function(){
      validateInputs();
      validateForm();
    });

    function validateForm(){
      Ember.$('.book_van').click(function(){
        Ember.$.each(['.pickadate', '.timepicker'], function(i, input){
          checkInput(Ember.$(input));
        });
        if(Ember.$('.has-error').length > 0) { return false; }
      });
    }

    function validateInputs(){
      Ember.$('.pickadate, .timepicker').focusout(function(){
        return checkInput(this);
      });
      Ember.$('.pickadate, .timepicker').focus(function(){
        return removeHighlight(this);
      });
    }

    function checkInput(element){
      var parent = Ember.$(element).parent();
      var value = Ember.$(element).val();

      if(value === undefined || value.length === 0) {
        parent.addClass('has-error');
      } else {
        parent.removeClass('has-error');
      }
    }

    function removeHighlight(element){
      var parent = Ember.$(element).parent();
      parent.removeClass('has-error');
    }
  }
});
