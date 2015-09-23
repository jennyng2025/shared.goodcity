import Ember from 'ember';

export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  isTextArea: function(){
    return this.get('type') === 'textarea';
  }.property('type'),

  /* dataType: {String} ['textarea']
   * type  -> (description: Type of Input Field, by default - its a text input
   *           To use it with a textara, specify type as 'textarea')
   * value -> (description: Current value of the input field)
   * label -> (description: Label associated with 'INPUT' field), (method: required)
   * placeholder -> (description: Placeholder string of 'Input' field), (method: optional)
   * maxlength -> (description: HTML5 MaxLength attribute of 'Input' field), (method: required)
   * rows -> (description: Rows needed for the Textarea and optional for the textbox), (method: optional)
   * message -> (description: character count message e.g. (130/190)), (method: private)
   */
  type: null,
  // dataType: {String|Number}
  value: null,
  // dataType: {String}
  label: null,
  // dataType: {String}
  placeholder: null,
  // dataType: {String}
  maxlength: null,
  // dataType: {number}
  rows: null,
  // dataType:{String}
  message: null,
  // dataType:{String}
  name: null,

  required: false,

  currentCountBinding: 'inputControl.value.length',

  charactersKeyedIn: function () {
    var control_val = this.get('inputControl.value') || "";
    var total_count = 0, special_chars, special_chars_length;

    special_chars = control_val ? control_val.match(/(\r\n|\n|\r)/g) : "";
    special_chars_length = (special_chars && special_chars.length) || 0;

    var currentLength = this.get('currentCount') || control_val.length;
    total_count = special_chars_length + currentLength;

    var maxlength = this.get("maxlength");
    if(total_count > maxlength) {
      var text = this.get('inputControl.value');
      this.set('inputControl.value', text.substring(0, maxlength-special_chars_length));
    }

    return total_count;
  }.property('currentCount').volatile(),

  isMaxCharLengthReached: Ember.computed.equal('charactersKeyedIn', 'maxlength'),

  keyUp: function () {
    this.send("displayCharCount");
  },

  didInsertElement() {
    this.send("displayCharCount");

    if (!this.get('maxlength')) {
      Ember.assert(this.get("i18n").t("input_length_error_message"));
    }

    if(this.get('placeholder') === 'item_description') {
      var placeholderText = this.get("i18n").t("items.add_item.description_placeholder");
      this.set('placeholder', placeholderText);
    }
  },

  actions: {
    displayCharCount: function(){
      var char_counter_message = this.get('charactersKeyedIn') + '/' + this.get('maxlength');
      this.set('message', char_counter_message );
    }
  }
});
