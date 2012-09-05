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
     everyone.votes.push( message.id );
     everyone.now.countVote( message.id );
     console.log( "aaaa" );
     console.log( everyone.votes );
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
  groups[ variant ].now.receiveMessage( msg );
  if( message == '/clearall' ) {
       everyone.log = []
       everyone.votes = []
  }

};

everyone.userId = 0;

nowjs.on( 'connect' , function() {
   var id = ++ everyone.userId;
   var group = id % groups.length;
   this.now.user = { id : id, variant : group };
   groups[ group ].addUser( this.user.clientId );
   // push log
   for( var e in logs[ group ] ) {
      e = logs[ group ][ e ];
      this.now.receiveMessage( e );
   }
   for( var e in votes [ group ] ) {
        e = votes[ group ][ e ];
        this.now.countVote( e );
        console.log( 'send ' + e );
   }
} );
