var http = require('http'),
    sys  = require('sys'),
    static = require('node-static/lib/node-static'),
    io = require('socket.io'),
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
    client.broadcast({ announcement: client.sessionId + ' connected' });
    client.on('message', function(message){
      console.log("MESSAGE: " + JSON.stringify(message));
        var event = new Event(message);

        event.save(function(err) {
          console.log("ERROR SAVING EVENT: " + JSON.stringify(err));
        });
        
       if ('connect' in message) {
         console.log("Received connect message");
         // Temporarily generate random numbers for session ids.
         client.send({session_id: Math.floor(Math.random()*99999)});
       }       
       if ('mousemove' in message ) {
         console.log("Received move message");         
         console.log("client_id: "  + client.sessionId);
         console.log("session_id: " + message.session_id);
         console.log("url: "        + message.url);
         console.log("at: "         + message.at);
         console.log("page_x: "     + message.page_x);
         console.log("page_y: "     + message.page_y);
         console.log("node_name: "  + message.node_name);
         console.log("node_id: "    + message.mousemove.node_id);
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
