function init() {
  document.getElementById('theInput').addEventListener('change', getReply);
}

      // set up socket.io
      var socket = io();

      console.log(socket);

      socket.on('new task received', function(task){
        console.log(task.task.sentiment);
        console.log(task.task.task.location);

        if(task.task.sentiment > 0){
              // addRecursionArt();
            document.body.style.backgroundColor = "#da50c8";
            // c0feb0
            } else if (task.task.sentiment < 0){
              document.body.style.backgroundColor = "#db0000";
              // f1706e
              // addArt();
            } else {
               document.body.style.backgroundColor = "#51aef4";
            }

        addTaskCard(task.task.task.task, task.task.task.time, task.task.task.location);

      });




function getReply(event){

			var val = document.getElementById('theInput').value;
			// if there is no value, or it is an empty string, prompt the user
			if(!val || val=="") return alert("Enter Response	 Please");

			var reply = jQuery("#theInput").val();	
			var data = {
				reply: reply
			};

				// POST the data from above to our API create route
			  jQuery.ajax({
			  	url : '/live_transcribe',
			  	dataType : 'json',
			  	type : 'POST',
			  	data : data,
			  	success: function(response){

			  		console.log(response);
			  		// background color
					// http://stackoverflow.com/questions/27766343/change-background-color-every-30s-fade-transition
			  		console.log("GOT A NEW CARD");
			  		
			  	 	// addReplyCard(reply);
			  		
			  	// 	console.log(response.sentiment.score);
			  	// 	if(response.sentiment.score > 0){
			  	// 		// addRecursionArt();
						// document.body.style.backgroundColor = "#4cfe82";
						// // c0feb0

			  	// 	} else if (response.sentiment.score < 0){
			  	// 		document.body.style.backgroundColor = "#8a0c1a";
			  	// 		// f1706e
				  // 		// addArt();
			  	// 	} else {
			  	// 		document.body.style.backgroundColor = "#51aef4";
			  	// 	}
					// in success, let our sockets know we have new data
					// console.log 'task' data received from server
					// socket.emit('new task', {task: response.task, sentiment: response.sentiment.score});

			  	},
			  	error : function(err){
			  		// do error checking
			  		alert("something went wrong");
			  		console.error(err);
			  	}


			});

}

function addReplyCard(reply){
	var htmlToAppend = 
        '<div class="card-container col-sm-4 col-md-4">'+
          '<div class="card" "form-group">'+
            // '<img src="img/'+userLocation+'.png">'+
              '<h2>'+reply+'<br /></h2>'+
              // '<h4>@ '+timeNow+'</h4>'+
              // '<h4>'+userLocation+'</h4>'+
            '<label class="btn btn-default btn-file">'+
            '<span class="glyphicon glyphicon-upload"></span>'+
            '<input type="file" id="image" style="display: none;">'+
          '</label>'+
          '<div class="idOfData" style="display:none">thisIsJustAnExampleId12345</div>'
            '</div>'+
          '</div>'+
        '</div>'

      return $('#card-holder').append(htmlToAppend);
}

function addTaskCard(task, timeNow, userLocation){

      // 1. you need to get a reference to the below by putting an id within the HTML

      var htmlToAppend = 
        '<div class="card-container col-sm-offset-4 col-md-offset-4">'+
          '<div class="card" "form-group">'+
            // '<img src="img/'+userLocation+'.png">'+
              '<h2>'+task+'<br /></h2>'+
              '<h4>@ '+timeNow+'</h4>'+
              '<h4>'+userLocation+'</h4>'+
            '<label class="btn btn-default btn-file">'+
            '<span class="glyphicon glyphicon-upload"></span>'+
            '<input type="file" id="image" style="display: none;">'+
          '</label>'+
          '<div class="idOfData" style="display:none">thisIsJustAnExampleId12345</div>'
            '</div>'+
          '</div>'+
        '</div>'

      return $('#card-holder').append(htmlToAppend);

}


window.addEventListener('load', init());
