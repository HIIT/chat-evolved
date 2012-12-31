// load confic
var conf = require('../client/conf.js').conf;

console.log( conf );

var httpServer = require('http').createServer(function(req, response){})
httpServer.listen( conf.port );

var sanitize = require('validator').sanitize;

var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);

// common data
var groups = []

everyone.msgId = 0;
everyone.userId = 0;

// get the number of groups
for( var i = 0; i < conf.groups; i++ ) {

  var group = {};
  group.server = nowjs.getGroup("group-" + i);
  group.logs = [];
  group.votes = [];
  group.people = [];

  groups.push( group );
}

/**
A method used by the public screen to access the content in all chat spaces
*/
everyone.now.master = function() {
  for( var i = 0; i < groups.length; i++ ) {
    groups[ i ].server.addUser( this.user.clientId );
  }
}

/**
Method for counting votes.

@param message the message voted
@param voter the user voted
*/
everyone.now.vote = function(message, voter) {
  var group = groups[ this.now.user.variant ];
  console.log( voter + ' voted ' + message );

  group.votes.push( msg )
  group.server.now.countVote( msg );
}

/**
Shares the content to all clients in this group.

@param message the new message to be distributed
@param response the message this message responses in the thread
*/
everyone.now.distributeMessage = function(message, response ){
  var variant = this.now.user.variant;

  var msgId = ++ everyone.msgId;

  // clear response's response
  response.response = null;

  // construct new message
  msg = {
    id : msgId,
    from : this.now.user,
    content : sanitize( message ).xss(),
    time : new Date(),
    response : response,
    depth: response.depth + 1,
  }

  // TODO: vary the messages based on variant
  if( variant == 0 ) {
      msg.anonym = true;
  }

  // logging
  console.log( JSON.stringify( msg ) );

  var group = groups[ this.now.user.variant ];

  group.logs.push( msg )
  group.server.now.receiveMessage( msg );

};

/**
A listener for connect events in the server.
*/
nowjs.on('connect', function () {
    this.now.connected();
} );

/**
Login the user and assign the user a random ID, if the user has no$
Also, pushes the logs and content to the user.

@param existing the user's experiemntal variant if needed
*/
everyone.now.login = function( data ) {
   data = JSON.parse( data );   

   var id, group, nick;

   if( data ) {
      var id = data.id;
      var group = data.variant;
      var nick = data.nick;
   } else {
	id = everyone.userId ++;
	console.log('new user ' + id);
        group = Math.abs( id ) % groups.length;
   }

   this.now.user = { id : id, variant : group, nick : nick };

   groups[ group ].addUser( this.user.clientId );
   // push log
   for( var e in logs[ group ] ) {
      e = logs[ group ][ e ];  
      this.now.receiveMessage( e );
   }
   for( var e in group.votes ) {
        e = group.votes[e];
        this.now.countVote( e );
   }

   for( var u in group.people ) {
	   this.now.names( group.people[ u ] );
   } 

   this.now.save() // store the data to a cookie
};

/**
The function used when user logs in with the name, the name is send to every participant
*/
everyone.now.join = function () {
  // get the group and push notification to everyone
  var group = groups[ this.now.user.variant ];
  group.people.push( this.now.user );
  group.server.now.names( this.now.user );

  this.now.save();
}
