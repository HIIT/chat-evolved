var httpServer = require('http').createServer(function(req, response){})
httpServer.listen(3310);

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

everyone.now.vote = function(message, voter) {
     var variant = this.now.user.variant;
     console.log( voter + ' voted + ' message );
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
      console.log( 'Should be anonym' );
      msg.anonym = true;
  }
  console.log( variant );
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
   console.log('logging in ' + id);
   id = parseInt( id );
//   if( ! id ) {
	everyone.userId ++;
        id = everyone.userId;
	console.log('   new user ' + id);
//   }
   var group = Math.abs( id ) % groups.length;
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

  console.log( this.user );

   this.now.user.identity = this.clientId;
   this.now.save() // store the data to a cookie
};
