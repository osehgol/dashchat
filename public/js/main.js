// CUSTOM JS FILE //

/*
problems:
- ajax success: function not being called
- consequently addCard() not adding
- have written file upload code, but not able to test it
- calling sentiment in main

*/

// set up socket.io
var socket = io();

function init() {
  document.getElementById('theInput').addEventListener('change', getTask);
  getLocation();
  //addArt();
}

var findTask, buyTask, transcribeTask, callTask;
var id; // the current id of the task
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

	// SLOVER -- > save to database here, and then on SUCCESS run the logic to post on the page
	// added by Osama
	// For making POST request to /live via JQUERY

		jQuery("#addForm").submit(function(e){
			// first, let's pull out all the values
			// the name form field value
			var task = jQuery("#theInput").val();
			var location = userLocation;
			var file = files;
			var timeNow = timeStamp();

			// console.log(e.body.name);
			console.log(task);
			console.log(location);
			taskParse(task);

			 // send cardHTML to server via socket
			if(transcribeCounter > 0 || callCounter > 0 || findCounter > 0 || buyCounter > 0){
				socket.emit('new valid task', task);
			}
    
			var data = {
		  		task : task,
		  		location: userLocation,
		 		time: timeNow
		  	};
			// POST the data from above to our API create route
		  jQuery.ajax({
		  	url : '/live',
		  	dataType : 'json',
		  	type : 'POST',
		  	data : data,
		  	success: function(response){
		  		addCard(task, timeNow, location);
		  		console.log("sucess ran");
		  		addArt();
		  		
			  // 		// in success, let our sockets know we have new data
			  // 		socket.emit('new transcribe task', response);
			  // 		id = response._id;
			  // 		console.log(id);
			  // 		// now, clear the input fields
			  // 		jQuery("#addForm input").val('');
		  	// 	}
		  	// 	else {
		  	// 		alert("something went wrong");
		  	// 	}
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


	// SLOVER -- > USE the values that have been saved to the database 

	// console.log("the value is " + val);	
	// else, need to geocode it 
	// taskParse(val);
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
		  '<div class="idOfData" style="display:none">thisIsJustAnExampleId12345</div>'
	      '</div>'+
      '</div>'+
    '</div>'
 

    taskCounter++;
    console.log("taskCounter "+taskCounter);

	return $('#card-holder').prepend(htmlToAppend);

}

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

// function handleFileSelect(evt) {
// 	evt.stopPropagation();
// 	evt.preventDefault();

// 	files = evt.dataTransfer.files; // FileList object.

// 	console.log(files);
// 	console.log(evt.dataTransfer);

// 	// SLOVER PULL OUT THE ID
// 	var idToUpdate = $(evt.target).find('.idOfData').text();
// 	if(!idToUpdate || idToUpdate == null || idToUpdate == ''); idToUpdate = $(evt.target).closest('.idOfData').text();
// 	console.log(evt.target);
// 	console.log('the id is --> ' + idToUpdate);
// 	console.log(typeof idToUpdate);

// 	// files is a FileList of File objects. List some properties.
// 	for (var i = 0; f = files[i]; i++) {
// 	  fileOutput.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
// 	              f.size, ' bytes, last modified: ',
// 	              f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
// 	              '</li>');
// 	}


// 	$('.card').append('<font color="blue">' + fileOutput.join('') + '</font>');


// 	// SLOVER COMMENTS

// 	// 1. NEED TO ACTUALLY READ THE FILE CONTENTS USING SOMETHING LIKE THIS https://www.sitepoint.com/html5-file-drag-drop-read-analyze-upload-progress-bars/
// 	// 2. NEED TO POST THE FILE TO THE SERVER WITH AN /API/UPDATE/id METHOD
// 	// 3. PULL THE ID OUT OF THE HTML FOR THAT GIVEN RECORD
// 	// var id = $(element).find('.idOfData').text();

// 	// // ANOTHER WAY OF HANDLING FILE UPLOAD
// 	// var fd = new FormData();    

// 	// console.log(fd);
// 	// // pull out the file form the 'image' field of the form;
// 	// // in the second argument, actually grab the file itself

// 	// fd.append('image', $('input[type=file]')[0].files[0]);



// 	// // now post it
// 	// $.ajax({
// 	//   url: '/api/update/'+idToUpdate,
// 	//   data: fd,
// 	//   processData: false, // you need this 
// 	//   contentType: false, // you need this
// 	//   type: 'POST', // you need this
// 	//   success: function(data){
// 	//     alert(data);
// 	//   }
// 	// });	
// }

// function handleDragOver(evt) {
// 	evt.stopPropagation();
// 	evt.preventDefault();
// 	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
// 	// console.log("dragover success");
// }

// Setup the dnd listeners.
// var dropZone = document.getElementById('card-holder');
// dropZone.addEventListener('dragover', handleDragOver, false);
// dropZone.addEventListener('drop', handleFileSelect, false);
// dropZone.addEventListener('drop', customPOST, false);

//FILE DRAG DROP EVENT HANDLIGN FROM https://www.sitepoint.com/html5-file-drag-drop-read-analyze-upload-progress-bars/

if (window.File && window.FileList && window.FileReader) { 

		document.getElementById("card-holder").addEventListener("change", FileSelectHandler, false);
		document.getElementById("card-holder").addEventListener("drop", FileSelectHandler, false);

		function FileSelectHandler(e) {

		// cancel event default
		e.preventDefault();

		// cancel event and hover styling
		FileDragHover(e);



		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

			// process all File objects
			for (var i = 0, file; file = files[i]; i++) {
				  fileOutput.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ',
				              file.size, ' bytes, last modified: ',
				              file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
				              '</li>');

					  if (file.type.indexOf("text") == 0) {
					    var reader = new FileReader();
					    reader.onload = function(e) {
							// get file content
							var text = e.target.result;
							//do something with it
					    }
					    reader.readAsText(file);
					  } else if (file.type.indexOf("image") == 0) {
					    var reader = new FileReader();
					    reader.onload = function(e) {

					    	//display image in place of card
							document.getElementById("card-holder").src = e.target.result;
					    }
					    reader.readAsDataURL(file);
					}
					//progress bar
					function ProgressHandler(e) {
						var complete = Math.round(e.loaded / e.total * 100);
						console.log(complete + "% complete");
					}

					function UploadFile(file) {

						var xhr = new XMLHttpRequest();
						
						if (xhr.upload && file.type == "image/jpeg" && file.size <= 10,000) {

							var o = document.getElementById("progress");
							var progress = o.appendChild(document.createElement("p"));
							progress.appendChild(document.createTextNode("upload " + file.name));

							// progress bar
							xhr.upload.addEventListener("progress", function(e) {
								var pc = parseInt(100 - (e.loaded / e.total * 100));
								progress.style.backgroundPosition = pc + "% 0";
							}, false);

						//SEND FILE TO SERVER

						}

					}

			}

		} //function FileSelectHandler ends
} //Window FielList, FileReader if-statement ends

// when a new task comes in, have the live transcribe receive it 
socket.on('new valid task received', function(task){
  // make a call to the database and re-render the tasks
  console.log('new transcribe task --> ', task);
});




//Art for you
function addArt(){
	//RUNE.JS portion
var r = new Rune({
  container: ".container",
  width: 200,
  height: 200
});

// Create colors
// -------------------------------------

var colors = [
  [ new Rune.Color('hsv', 0, 85, 22), new Rune.Color('hsv', 0, 80, 77, 0.8) ],  // reds
  [ new Rune.Color('hsv', 85, 84, 20), new Rune.Color('hsv', 85, 79, 38, 0.8) ], // greens
  [ new Rune.Color('hsv', 205, 28, 48), new Rune.Color('hsv', 205, 18, 59, 0.8) ], // blues
  [ new Rune.Color('hsv', 43, 94, 59), new Rune.Color('hsv', 43, 91, 89, 0.8) ], // yellows
];

// Find random points for the gray line
// -------------------------------------

var noise = new Rune.Noise();
var linePoints = [];

var x = -300;
var y = 0;


while (x < 1000) {
  // increment x with a random amount
  x += Rune.random(1, r.width-50);
  // use noise to find a y value from 500 to 600.
  y = noise.get(x / 100) * (r.height-50);
  // push this point into the array
  linePoints.push(new Rune.Vector(x, y));
}


var cur = 0;
var curLine = 0;

r.on('update', function(){
  

  for(var i=0; i<linePoints.length-1; i++) 
  {
      var bottomLeft = linePoints[i];
      var bottomRight = linePoints[i+1];

      var ranHeightY = Rune.random(1,150);
      var ranHeightX = Rune.random(1,150);

      var shape = [{fromVec: new Rune.Vector(bottomLeft.x, bottomLeft.y), toVec: new Rune.Vector(ranHeightX, ranHeightY)}];

      // console.log(shape)

      var pos = shape[curLine].fromVec.lerp(shape[curLine].toVec, cur)

      // console.log(pos);

      var colorset = colors[Math.floor(Rune.random(colors.length))];
      // console.log(colorset);

      r.rect(pos.x, pos.y, 5, 5)
       .fill(colorset[1])
       .stroke(false);
       
       // .closePath(); r.path(pos.x, pos.y)
       // .curveTo(pos.x+5,pos.y+5,pos.x, pos.y)
       // .fill("5a72a0")
     

      // r.path(pos.x, pos.y)
      //   .lineTo(0,pos.x)
      //   .curveTo(pos.x,pos.x+100,pos.y+100,pos.x+300,pos.y)
      //   .stroke("5a72a0")
      //   .fill("5a72a0")
      //   .closePath();

      cur += 0.001;

      if(cur > 1) {
      curLine++;
      cur = 0;
    }

   if(!shape[curLine]) r.pause()
  } 
  

});

	// background color
	// http://stackoverflow.com/questions/27766343/change-background-color-every-30s-fade-transition
	// document.body.style.backgroundColor = "white";

	//Here's some Art for you
	var bg = r.rect(0, 0, r.width, r.height);
	var hue = 0;

	r.on('update', function() {
	  bg.fill('hsv', hue, 100, 100).stroke(false);
	  hue++;
	});


r.play();

}

window.addEventListener('load', init());










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






