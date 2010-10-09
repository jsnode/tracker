var http = require('http'),
    sys  = require('sys'),
    static = require('node-static/lib/node-static'),
    io = require('socket.io');
    url = require('url');


function Tracker(options) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }
  var self = this;
  self.init();
};

Tracker.prototype.init = function() {
  var self = this;  
  self.http_server = self.create_http_server();
  self.socket = self.setup_socket(self.http_server);
  self.listen();
  self.http_server.listen(8000);
  sys.log('Server started on PORT 8000');
};

Tracker.prototype.create_http_server = function() {
  var self = this;
  
  var server = http.createServer(function(request, response) {
    var file = new static.Server('./public', {
      cache: false
    });

    request.addListener('end', function() {
      var location = url.parse(request.url, true),
          params = (location.query || request.headers);
      if (location.pathname == '/config.json' && request.method == "GET") {
        response.writeHead(200, {
          'Content-Type': 'application/x-javascript'
        });
        var jsonString = JSON.stringify({
          port: self.settings.port
        });
        response.end(jsonString);
      } else if (location.pathname == '/bid' && request.method == 'GET') {
        response.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        response.end("OK");
      } else {
        file.serve(request, response);
      }
    });
  });

  return server;
};


Tracker.prototype.setup_socket = function(http_server) {
  var self = this;
  var socket = io.listen(http_server); 
  return socket;
}
  
Tracker.prototype.listen  = function() {
  var self = this;
  var socket = self.socket;
  var buffer = [];
  socket.on('connection', function(client){ 
    client.send({ buffer: buffer });
    client.broadcast({ announcement: client.sessionId + ' connected' });
    client.on('message', function(message){
      console.log("MESSAGE: " + JSON.stringify(message));
       if ('connect' in message) {
         console.log("Received connect message");
         client.send({uid: "1234567890"});
       }
       if ('mousemove' in message ) {
         console.log("Received move message");
         console.log("client: " + client.sessionId);
         console.log("uid: " + message.mousemove.uid);
         console.log("loc: " + message.mousemove.loc);
         console.log("at: " +  message.mousemove.at);
         console.log("px: " + message.mousemove.px);
         console.log("py: " + message.mousemove.py);
         console.log("tgn: " + message.mousemove.tgn);
         console.log("tid: " + message.mousemove.tgid);
         console.log("wch: " + message.mousemove.wch);
         client.broadcast(message);
         
       }
       if ('click' in message ) {
         console.log("Received click message");
         console.log("loc: " + message.click.loc);
         console.log("at: " +  message.click.at);
         console.log("px: " + message.click.px);
         console.log("py: " + message.click.py);
         console.log("tg: " + message.click.tg);
       }      
    }) ;
    client.on('disconnect', function(){}) 
  });
  
}
module.exports = Tracker;
