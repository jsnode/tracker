$(function() {
  
	var socket = new io.Socket("tracker.webbyapp.com"); 
	var uid = null;
    socket.connect();
    socket.on('connect', function(){
      socket.send({connect: "hi"});
    }) 
    socket.on('message', function(message){      
      console.log("MESSAGE: " + message);
       if ('session_id' in message ) {
        session_id = message.session_id; 
        console.log("session_id: " + session_id);
       }
       if ('mousemove' in message ) {
        $('#cursor').css( { 
                 position: 'absolute',
                 zIndex: 5000,
                 left: message.page_x, 
                 top: message.page_y 
        });                 
                 
        console.log("page_x: " + message.page_x);
        console.log("page_y: " + message.page_y);
       }
       
    });
             
	$("*").mousemove(function(e) {
    socket.send({ type:      "mousemove"
                , url:       window.location.href
  							, at:        new Date()
  							, page_x:    e.pageX 
  							, page_y:    e.pageY
  							, node_name: e.target.nodeName
  							, node_id:   e.target.id
    }});
  });
});
