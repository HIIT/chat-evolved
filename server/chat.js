// load confic
var conf = require('../client/conf.js').conf;

console.log( conf );

var httpServer = require('http').createServer(function(req, response){})
httpServer.listen( conf.port );

var sanitize = require('validator').sanitize;
var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);

var groups = []
var logs = []
var votes = []
var names = []

// get deciderd number of groups
for( var i = 0; i < conf.groups; i++ ) {
    var group = nowjs.getGroup("group-" + i);
    groups.push( group );
    logs.push( [] );
    votes.push( [] );
    names.push( [] )
}

// common content
everyone.msgId = 0;
everyone.log = [];
everyone.votes = [];

everyone.now.master = function() {
   for( var i = 0; i < groups.length; i++ ) {
      groups[ i ].addUser( this.user.clientId );
   }
}

everyone.now.vote = function(message, voter) {
     var variant = this.now.user.variant;
     console.log( voter + ' voted ' + message );
     votes[ variant ].push( msg )
     groups[ variant ].now.receiveMessage( msg );
}

everyone.now.distributeMessage = function(message, response ){
  var variant = this.now.user.variant;

  var msgId = ++ everyone.msgId;
  // clear response's response
  response.response = null;
  message = sanitize( message ).xss();

  msg = {
    id : msgId,
    from : this.now.user,
    content : message,
    time : new Date(),
    response : response,
    depth: response.depth + 1,
  }

  // TODO: vary the messages based on variant
  if( variant == 0 ) {
      msg.anonym = true;
  }
  console.log( JSON.stringify( msg ) );
  // everyone.log.push( msg );
  console.log( everyone.log );
  logs[ variant ].push( msg )
  groups[ variant ].now.receiveMessage( msg );
  if( message == '/clearall' ) {
       everyone.log = []
       everyone.votes = []
  }

};

everyone.userId = 0;

nowjs.on('connect', function () {
    this.now.ok();
} );

everyone.now.l = function( data ) {
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
   for( var e in votes [ group ] ) {
        e = votes[ group ][ e ];
        this.now.countVote( e );
   }
   for( var u in names[ group ] ) {
	this.now.names( names[ group ][ u ] );
   } 

   this.now.save() // store the data to a cookie
};

everyone.now.join = function () {
     names[ this.now.user.variant ].push( this.now.user );
     // get the group with these names
     groups[ this.now.user.variant ].now.names( this.now.user );

    this.now.save();
}
