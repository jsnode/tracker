$(function() {
  
	var socket = new io.Socket("localhost"); 
	var uid = null;
    socket.connect();
    socket.on('connect', function(){
      socket.send({connect: "hi"});
    }) 
    socket.on('message', function(message){      
      console.log("MESSAGE: " + message);
       if ('uid' in message ) {
        uid = message.uid; 
        console.log("uid: " + uid);
       }
       if ('mousemove' in message ) {
        $('#cursor').css( { 
                 position: 'absolute',
                 zIndex: 5000,
                 left: message.mousemove.px, 
                 top: message.mousemove.py 
        } );                 
                 
        console.log("px: " + message.mousemove.px);
        console.log("py: " + message.mousemove.py);
       }
       
    }) 
    
	$("*").mousemove(function(e) {
	    socket.send({mousemove: { loc: window.location.href,
	                 uid: uid,
    							 at: new Date(),
    							 px: e.pageX, 
    							 py: e.pageY,
    							 tgn: e.target.nodeName,
    							 tgid: e.target.id,
							     }});
	});
	$("*").click(function(e) {
		  socket.send({click: { loc: window.location.href,
		    	         uid: uid,
            			 at: new Date(),
            			 px: e.pageX, 
            			 py: e.pageY,
            			 tgn: e.target.nodeName,
            			 tgid: e.target.id,
  							   }});
    });	
});
