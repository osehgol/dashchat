// CUSTOM JS FILE //

// set up socket.io
var socket = io.connect('http://localhost.dev:3005');


function init() {
  // renderPeeps();
  getLocation();
}

var findTask, buyTask, transcribeTask, callTask;
var timeNow;
var userLocation; 
var files, f; 
var fileOutput = [];
var findCounter = 0;
var buyCounter = 0;
var transcribeCounter = 0;
var callCounter = 0;
var taskCounter = 0;

function getTask(event){

	var val = document.getElementById('theInput').value;
	// if there is no value, or it is an empty string, prompt the user
	if(!val || val=="") return alert("Enter Task Please");
	// console.log("the value is " + val);	
	// else, need to geocode it 
	taskParse(val);
}

function taskParse(task){
// runs from eventlistener from input, which runs getTask() 
// console.log(task);

var taskType = task.match(/^#find|#buy|#transcribe|#call|#Find|#Buy|#Transcribe|#Call$/);
	console.log(taskType)
	if(taskType){

		// split task by spaces and input in array
		var taskArray = task.split(" ");
		// search through array find #matches
		for(var i=0; i < taskArray.length; i++){
			
			if(taskArray[i] == "#find" || taskArray[i] == "#Find"){
				findCounter++; console.log("findCounter is "+findCounter);
			} else if (taskArray[i] == "#call" || taskArray[i] == "#Call"){
				callCounter++; console.log("callCounter is "+callCounter);
			} else if (taskArray[i] == "#buy" || taskArray[i] == "#Buy"){
				buyCounter++; console.log("buyCounter is "+buyCounter);
			} else if (taskArray[i] == "#transcribe" || taskArray[i] == "#Transcribe"){
				transcribeCounter++; console.log("transcribeCounter is "+transcribeCounter);
			}
		
		}

	} else {

	var warningDiv = document.getElementById('warning');
	    	warningDiv.style.display = 'block';
	    	return setTimeout(function(){ 
	    		$("#warning").fadeOut(); }, 
	    	3000);	 
	}


	timeNow = timeStamp();
	// console.log("timeNow: "+timeNow);

	// parameters to pass to card: (i) task (ii) time stamp (iii) location 
	addCard(task, timeNow, userLocation);



}

// Slover: this now runs on the page load, 
// and stores the location in the location variable set up top
function getLocation(){
  	// Slover: this is just another way to do AJAX
    $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?') 
         .done (function(location)
         {
         		userLocation = location.city + " , " + location.country_code;
         });
}

function addCard(task, timeNow, userLocation){

	var htmlToAppend = 
    '<div class="card-container col-sm-offset-4 col-md-offset-4">'+
      '<div class="card" "form-group">'+
        // '<img src="img/'+userLocation+'.png">'+
          '<h2>'+task+'<br /></h2>'+
          '<h4>@ '+timeNow+'</h4>'+
          '<h4>'+userLocation+'</h4>'+
	      '<label class="btn btn-default btn-file">'+
	      ' <span class="glyphicon glyphicon-upload"></span>'+
   		  '<input type="file" id="image" style="display: none;">'+
		  '</label>'+
	      '</div>'+
      '</div>'+
    '</div>'
 

    taskCounter++;
    console.log("taskCounter "+taskCounter);

    // send cardHTML to server via socket
	if(transcribeCounter > 0){
		socket.emit('new transcribe task', htmlToAppend);
	}
    
	return $('#card-holder').prepend(htmlToAppend);

}
document.getElementById('theInput').addEventListener('change', getTask);
// document.getElementById('sendButton').addEventListener('click', getTask);


/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 * From https://gist.githubusercontent.com/hurjas/2660489/raw/b86379b3d590422647e3d62e0b83e5090ec8f4e4/timestamp.js
 */

function timeStamp() {
// Create a date object with the current time
  var now = new Date();

// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "am" : "pm";

// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
  time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  return time.join(":") + suffix + " " + date.join("/");

}

/*
File drag drop feature is from https://www.html5rocks.com/en/tutorials/file/dndfiles/
*/

function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	files = evt.dataTransfer.files; // FileList object.

	// files is a FileList of File objects. List some properties.
	for (var i = 0; f = files[i]; i++) {
	  fileOutput.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
	              f.size, ' bytes, last modified: ',
	              f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
	              '</li>');
	}


	return $('.card').append('<font color="blue">' + fileOutput.join('') + '</font>');
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	// console.log("dragover success");
}

// Setup the dnd listeners.
var dropZone = document.getElementById('card-holder');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
// dropZone.addEventListener('drop', customPOST, false);

// module.exports = router;





// For making POST request to /live via JQUERY

jQuery("#addForm").submit(function(e){
	// first, let's pull out all the values
	// the name form field value
	var task = jQuery("#theInput").val();
	var location = userLocation;
	var file = files;

	// console.log(e.body.name);
	console.log(task);
	console.log(location);
	console.log(file);
	// console.log(file);
	// console.log(fileName);
			// console.log(filePath);
	// make sure we have a location
	if(!userLocation || userLocation=="") return alert('We need a location!');


	// ANOTHER WAY OF HANDLING FILE UPLOAD
var fd = new FormData();    

console.log(fd);
// pull out the file form the 'image' field of the form;
// in the second argument, actually grab the file itself

fd.append('image', $('input[type=file]')[0].files[0]);


// now post it
$.ajax({
  url: '/api/create'
  data: fd,
  processData: false, // you need this 
  contentType: false, // you need this
  type: 'POST', // you need this
  success: function(data){
    alert(data);
  }
});

	// POST the data from above to our API create route
  jQuery.ajax({
  	url : '/live',
  	dataType : 'json',
  	type : 'POST',

  	// we send the data in a data object (with key/value pairs)
  	data : {
  		task : task,
  		location: userLocation,
 		file: fileOutput
  	},
  	success : function(response){
  		if(response.status=="OK"){
	  		// success
	  		console.log(response);
	  		// re-render the map
	  		renderPlaces();
	  		// now, clear the input fields
	  		jQuery("#addForm input").val('');
  		}
  		else {
  			alert("something went wrong");
  		}
  	},
  	error : function(err){
  		// do error checking
  		alert("something went wrong");
  		console.error(err);
  	}
  });

	// prevents the form from submitting normally
  e.preventDefault();
  return false;

});


// <form method="post" action="/api/create/image" id="myForm" enctype="multipart/form-data">

/*
error: text overflows card
error: repeat file image prints 

0. file image storage
//set upload image option
// create router post to aws (in index.js here, https://github.com/sslover/class-example-itp-directory/blob/master/routes/index.js)
1. search
2. create data storage var task = {"buy" : 1, "call" : 0, "find" : 0}
3. create Task ID
4. Saving images to database
5. Sentiment analysis
6. webRTC push to talk
7. tweet task to dashboard
8. VA dashboard, parses task category
9. Counter for task category to record VA preferences
10. @taday to call task type progress bar
11. Chart.js visuals 

*/



// function renderPeeps(){
// 	jQuery.ajax({
// 		url : '/api/get',
// 		dataType : 'json',
// 		success : function(response) {
// 			console.log(response);

// 			var people = response.people;

// 			for(var i=0;i<people.length;i++){
// 				var htmlToAdd = '<div class="col-md-4">'+
// 					'<img src='+people[i].imageUrl+' width="100">'+
// 					'<h1>'+people[i].name+'</h1>'+
// 					'<ul>'+
// 						'<li>Year: '+people[i].itpYear+'</li>'+
// 						'<li>Interests: '+people[i].interests+'</li>'+
// 					'</ul>'+
// 					'<a href="/edit/'+people[i]._id+'">Edit Person</a>'+
// 				'</div>';
			
// 				jQuery("#people-holder").append(htmlToAdd);
// 			}



// 		}
// 	})	
// }

window.addEventListener('load', init())