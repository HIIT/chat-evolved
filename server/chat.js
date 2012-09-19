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

// get deciderd number of groups
for( var i = 0; i < 2; i++ ) {
    var group = nowjs.getGroup("group-" + i);
    groups.push( group );
    logs.push( [] );
    votes.push( [] );
}

// common content
everyone.msgId = 0;
everyone.log = [];
everyone.votes = [];

everyone.now.master = function() {
   for( var i = 0; i < groups.length; i++ ) {
      groups[ group ].addUser( this.user.clientId );
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
  console.log( msg );
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

everyone.now.l = function( id ) {
   id = parseInt( id );
   var group = id; 
   if( ! id ) {
	id = everyone.userId ++;
	console.log('new user ' + id);
        group = Math.abs( id ) % groups.length;
   }
   this.now.user = { id : id, variant : group }
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

   this.now.save() // store the data to a cookie
};
