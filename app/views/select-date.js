import Ember from 'ember';

export default Ember.TextField.extend({
  tagName: 'input',
  classNames: 'pickadate',
  attributeBindings: [ "name", "type", "value", "id", 'required', 'pattern', 'placeholder'],

  didInsertElement: function(){
    var _this = this;
    var date = new Date();
    Ember.$().ready(function(){
      Ember.$('.pickadate').pickadate({
        format: 'ddd mmm d',

        disable: [ 1, 2 ],
        min: [date.getUTCFullYear(), date.getMonth(), date.getDate()],
        clear: false,
        today: false,
        close: false,
        // editable: true,
        onSet: function() {
          var date = this.get('select') && this.get('select').obj;
          _this.set("selection", date);
          Ember.$('#selectedTime').val('');

          if(date) {
            var selectedDate = date;
            var currentDate = new Date();
            currentDate.setHours(0,0,0,0);
            selectedDate.setHours(0,0,0,0);

            if(selectedDate.getTime() === currentDate.getTime()) {
              var currentTime = new Date();
              var hours = currentTime.getHours();
              var minutes = currentTime.getMinutes();
              minutes = minutes > 30 ? 30 : 0;
              var total_mins = hours*60 + minutes;
              total_mins = total_mins > 960 ? 960 : total_mins;

              // disabled all previous options
              Ember.$("#selectedTime option[value="+total_mins+"]").prevAll().each(function() {
                  Ember.$( this ).prop('disabled', true);

                });
              // disable current option
              Ember.$("#selectedTime option[value="+total_mins+"]").prop('disabled', true);

            } else {
              Ember.$("#selectedTime option").each(function() {
                  Ember.$( this ).removeAttr( "disabled" );
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
    });

  }
});
