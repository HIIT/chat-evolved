var httpServer = require('http').createServer(function(req, response){})
httpServer.listen(8888);

var sanitize = require('validator').sanitize;

var nowjs = require("now");

var everyone = nowjs.initialize(httpServer);

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
  console.log( msg );
  everyone.log.push( msg );
  console.log( everyone.log );
  everyone.now.receiveMessage( msg );

  if( message == '/clearall' ) {
       everyone.log = []
       everyone.votes = []
  }

};

everyone.userId = 0;

nowjs.on( 'connect' , function() {
   var id = ++ everyone.userId;
   this.now.user = { id : id, variant : id % 4 };
   // push log
   for( var e in everyone.log ) {
      e = everyone.log[ e ];
      this.now.receiveMessage( e );
   }
   for( var e in everyone.votes ) {
        e = everyone.votes[ e ];
        this.now.countVote( e );
        console.log( 'send ' + e );
   }
} );
