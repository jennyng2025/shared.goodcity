import Ember from 'ember';

export default Ember.TextField.extend({
  tagName: 'input',
  classNames: 'pickadate',
  attributeBindings: [ "name", "type", "value", "id", 'required', 'pattern', 'placeholder'],

  currentMinutes: function(){
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes() > 30 ? 30 : 0;;
    var total_mins = hours*60 + minutes;
    return (total_mins > 960) ? 960 : total_mins;
  },

  didInsertElement() {
    var _this = this;
    var date = new Date();
    var setting = false;

    Ember.$().ready(function(){
      Ember.$('.pickadate').pickadate({
        format: 'ddd mmm d',
        monthsFull: moment.months(),
        monthsShort: moment.monthsShort(),
        weekdaysShort: moment.weekdaysShort(),
        disable: [ 1, 2 ],
        min: [date.getUTCFullYear(), date.getMonth(), date.getDate()],
        clear: false,
        today: false,
        close: false,
        // editable: true,

        onOpen: function() {
          var currentMins = _this.currentMinutes();
          if(currentMins === 960) { this.set("disable", [new Date])}
        },

        onClose: function() {
          Ember.$(document.activeElement).blur();

          if (setting) { return; }

          var date = this.get('select') && this.get('select').obj;
          _this.set("selection", date);
          Ember.$('.time_selector select').val('');
          removeHighlight(".date_selector input");

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

              // disabled all previous options
              Ember.$(".time_selector select option[value="+total_mins+"]").prevAll().each(function() {
                  Ember.$( this ).addClass("hidden");
                  this.disabled = true;
              });

              // disable current option
              Ember.$(".time_selector select option[value="+total_mins+"]").addClass("hidden");
              Ember.$(".time_selector select option[value="+total_mins+"]")[0].disabled = true;

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
        }
      });

      validateForm();
      validateInputs();
    });

    function validateForm(){
      Ember.$('.button.book_van').click(function(){
        var date = checkInput(Ember.$('.date_selector input'));
        var time = checkInput(Ember.$('.time_selector select'));
        return date && time;
      });
    }

    function validateInputs(){
      Ember.$('.date_selector input').focus(function(){
        return removeHighlight(this);
      });
      Ember.$('.time_selector select').focus(function(){
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
