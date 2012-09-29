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
var names = []

everyone.msgId = 0;
everyone.userId = 0;

// get the number of groups
for( var i = 0; i < conf.groups; i++ ) {

  var group = {};
  group.server = nowjs.getGroup("group-" + i);
  group.logs = [];
  group.votes = [];

  groups.push( group );
  names.push( [] );
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

  group.votes[ variant ].push( msg )
  group.server.now.receiveMessage( msg );
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

  group.logs[ variant ].push( msg )
  group.server.now.receiveMessage( msg );

};

/**
A listener for connect events in the server.
*/
nowjs.on('connect', function () {
    this.now.ok();
} );

/**
Login the user and assign the user a random ID, if the user has not an ID before hand.
Also, pushes the logs and content to the user.

@param existing the user's experiemntal variant if needed
*/
everyone.now.l = function( existing ) {
  var variant = parseInt( existing );
  var id = -1;
  
  if( ! variant ) {
	   var id = everyone.userId ++;
	   console.log('new user ' + id);
     variant = Math.abs( id ) % groups.length;
   }

   this.now.user = { id : id, variant : variant };

   var group = groups[ variant ];

   group.server.addUser( this.user.clientId );
   
   // push logs
   for( var e in group.logs ) {
      e = grup.logs[e];
      this.now.receiveMessage( e );
   }
   for( var e in group.votes ) {
        e = group.votes[e];
        this.now.countVote( e );
   }

   for( var u in names[ group ] ) {
	   this.now.names( names[ group ][ u ] );
   } 

   this.now.save() // store the data to a cookie
};

/**
The function used when user logs in with the name, the name is send to every participant

*/
everyone.now.join = function () {
     names[ this.now.user.variant ].push( this.now.user );
     // get the group with these names
     groups[ this.now.user.variant ].now.names( this.now.user );
}
