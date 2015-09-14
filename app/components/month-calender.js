import Ember from 'ember';

// Handle time selection based on current time
// <select id="ember1325" required="">
//   <option value="">Time</option>
//   <option value="1">9AM-11AM</option> => (540mins - 660mins)
//   <option value="2">11AM-1PM</option> => (660mins - 840mins)
//   <option value="3">2PM-4PM</option>  => (840mins)
// </select>

export default Ember.TextField.extend({
  tagName: 'input',
  classNames: 'pickadate',
  attributeBindings: [ "name", "type", "value", "id", 'required', 'pattern', 'available', 'placeholder' ],

  currentMinutes: function(){
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes() > 30 ? 30 : 0;
    var total_mins = hours*60 + minutes;
    return (total_mins > 840) ? 840 : total_mins;
  },

  didInsertElement: function(){
    var _this = this;
    var list = this.get('available');
    var available_count = 0, available_array = [true];
    var setting = false;

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

      var currentMins = _this.currentMinutes();
      if(currentMins === 840) { available_array.pop(); }
    }

    Ember.$().ready(function(){
      Ember.$('.pickadate').pickadate({
        format: 'ddd mmm d',
        monthsFull: moment.months(),
        monthsShort: moment.monthsShort(),
        weekdaysShort: moment.weekdaysShort(),
        disable: available_array,
        clear: false,
        today: false,
        close: false,

        onClose: function() {
          Ember.$(document.activeElement).blur();

          if (setting) { return; }

          var date = this.get('select') && this.get('select').obj;
          _this.set("selection", date);

          setting = true;
          Ember.run.next(() => {
            this.set('select', new Date(date), { format: 'ddd mmm d' });
            setting = false;
          });

          if(date) {
            var selectedDate = date;
            var currentDate = new Date();
            currentDate.setHours(0,0,0,0);
            selectedDate.setHours(0,0,0,0);

            if(selectedDate.getTime() === currentDate.getTime()) {
              var total_mins = _this.currentMinutes();
              var option;

              if(total_mins >= 540 && total_mins < 660) {
                option = Ember.$(".time_selector select option:eq(1)");
              } else if(total_mins >= 660 && total_mins < 840) {
                option =  Ember.$(".time_selector select option:eq(2)");
              } else if(total_mins >= 840) {
                option = Ember.$(".time_selector select option:eq(3)");
              }

              if(option) {
                option.addClass("hidden");
                option[0].disabled = true;

                option.prevAll().each(function() {
                  Ember.$( this ).addClass("hidden");
                  this.disabled = true;
                });
              }

            } else {
              // Enable all select options
              Ember.$(".time_selector select option").each(function() {
                Ember.$( this ).removeClass("hidden");
                this.disabled = false;
              });
            }
          }

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
