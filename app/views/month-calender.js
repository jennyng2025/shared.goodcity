import Ember from 'ember';

export default Ember.TextField.extend({
  tagName: 'input',
  classNames: 'pickadate',
  attributeBindings: [ "name", "type", "value", "id", 'required', 'pattern', 'available', 'placeholder' ],

  didInsertElement: function(){
    var _this = this;
    var list = this.get('available');
    var available_count = 0, available_array = [true];

    if(list) {
      available_count = list.length;
      for (var i = available_count - 1; i >= 0; i--) {
        var date = new Date(list[i]);
        var date_array = [];
        date_array.push(date.getFullYear());
        date_array.push(date.getMonth());
        date_array.push(date.getDate());
        available_array.push(date_array);
      }
    }

    Ember.$().ready(function(){
      Ember.$('.pickadate').pickadate({
        format: 'ddd mmm d',
        disable: available_array,
        min: new Date(),
        clear: false,
        today: false,
        close: false,

        onSet: function() {
          var date = this.get('select') && this.get('select').obj;
          _this.set("selection", date);
        },
        onStart: function(){
          var date = _this.get('selection');
          if(date) {
            this.set('select', new Date(date), { format: 'ddd mmm d' });
          }
        },
      });

      validateForm();
      validateInputs();

    });

    function validateForm(){
      Ember.$('.button.drop_off').click(function(){
        return checkInput(Ember.$('#selectedDate'));
      });
    }

    function validateInputs(){
      Ember.$('#selectedDate').focusout(function(){
        return checkInput(this);
      });
      Ember.$('#selectedDate').focus(function(){
        return removeHighlight(this);
      });
    }

    function checkInput(element){
      var parent = Ember.$(element).parent();
      var value = Ember.$(element).val();

      if(value === undefined || value.length === 0) {
        parent.addClass('has-error');
        return false;
      } else {
        parent.removeClass('has-error');
        return true;
      }
    }

    function removeHighlight(element){
      var parent = Ember.$(element).parent();
      parent.removeClass('has-error');
    }

  }
});
