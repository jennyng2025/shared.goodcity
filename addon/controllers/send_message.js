import Ember from 'ember';

var sendMessage = Ember.ArrayController.extend({

  sortProperties: ['createdAt'],
  sortAscending: true,
  userId: Ember.computed.alias('session.currentUser.id'),

  user: function() {
    return this.store.getById('user', this.get('userId'));
  }.property('userId'),

  allMessages: function() {
    var user = this.get('user');
    this.get('arrangedContent').forEach(function(message){
      message.set('myMessage', message.get('sender') === user);
    });
    return this.get('arrangedContent');
  }.property('arrangedContent'),

});

export default sendMessage;
