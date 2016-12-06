// CUSTOM JS FILE //

/*
problems:
- WORKINGcalling sentiment in main - working!

*/

// set up socket.io
var socket = io();

function init() {
  document.getElementById('theInput').placeholder = "How're you feeling?"
  document.getElementById('theInput').addEventListener('change', getMood);
  getLocation();
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

function getMood(event){

	var val = document.getElementById('theInput').value;
	// if there is no value, or it is an empty string, prompt the user
	if(!val || val=="") return alert("Enter Mood Please");

	if(event && event.keyCode == 13) return document.getElementById('theInput').placeholder = "";

	// SLOVER -- > save to database here, and then on SUCCESS run the logic to post on the page
	// added by Osama
	// For making POST request to /live via JQUERY

			// first, let's pull out all the values
			// the name form field value
			var task = jQuery("#theInput").val();
			var location = userLocation;
			var file = files;
			var timeNow = timeStamp();

			//socket
			
			 // send cardHTML to server via socket
			// if(transcribeCounter > 0 || callCounter > 0 || findCounter > 0 || buyCounter > 0){
			// 	//emit new task received
			// 	socket.emit('new task',{
			// 	task: task
			// 	});
			// }   

			// console.log(e.body.name);
			console.log(task);
			console.log(location);
			
			//moodParse!!
			moodParse(task, function(err, status){

				console.log(err);
				console.log(status);

				if(status=='failure') return false;


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

			  		// background color
					// http://stackoverflow.com/questions/27766343/change-background-color-every-30s-fade-transition
			  		console.log("GOT A NEW CARD");
			  		
			  		addCard(task, timeNow, location);

			  		
			  		var negativeWordList = response.sentiment.negative;
			  		var words = response.sentiment.words;
			  		console.log(response.sentiment.score);
			  		if(response.sentiment.score > 0){
			  			// addRecursionArt();
			  			// purple
						document.body.style.backgroundColor = "#da50c8";

						for(var i=0; i < words.length; i++){
							if (words[i] == "interesting"){
								
								setTimeout(function(){
									addImage();									
								}, 1500);

								setTimeout(function(){
									whatsFunny(timeNow, location);
								}, 3000);
							} else if( words[i] == "LOL" || words[i] == "lol"){
								setTimeout(function(){
									// lol function();						
								}, 1500);
							}
						}	
						// c0feb0

			  		} else if (response.sentiment.score < 0){
			  			// red
			  			document.body.style.backgroundColor = "#db0000";

			  			setTimeout(function(){ 
				    		addResponse(negativeWordList, timeNow, location);
				    		document.getElementById('theInput').placeholder = "";			    		
				    	}, 1000);

				    	setTimeout(function(){
				    		addArt(); 
				    	}, 2000);

				    	setTimeout(function(){
				    		fanciesArtist(timeNow, location); 
				    	}, 3000);

			  			// f1706e
				  		// addArt();
			  		} else {
			  			document.body.style.backgroundColor = "#51aef4";
			  		}
					// in success, let our sockets know we have new data
					// console.log 'task' data received from server
					socket.emit('new task', {task: response.task, sentiment: response.sentiment.score});

			  	},
			  	error : function(err){
			  		// do error checking
			  		alert("something went wrong");
			  		console.error(err);
			  	}


			});				
			});
		
}

function moodParse(task, callback){
// runs from eventlistener from input, which runs getMood() 
// console.log(task);
var status;
var taskType = task.match(/^#interesting|interesting|Interesting|lol|LOL|#lol|#Funny|#funny|funny|#confused|#Confused|confused$/);
	console.log(taskType)
	if(taskType){

		// split task by spaces and input in array
		var taskArray = task.split(" ");
		// search through array find #matches
		for(var i=0; i < taskArray.length; i++){
			
			if(taskArray[i] == "#confused" || taskArray[i] == "#Confused"){
				findCounter++; console.log("findCounter is "+findCounter);
			} else if (taskArray[i] == "#call" || taskArray[i] == "#Call"){
				callCounter++; console.log("callCounter is "+callCounter);
			} else if (taskArray[i] == "#buy" || taskArray[i] == "#Buy"){
				buyCounter++; console.log("buyCounter is "+buyCounter);
			} else if (taskArray[i] == "#transcribe" || taskArray[i] == "#Transcribe"){
				transcribeCounter++; console.log("transcribeCounter is "+transcribeCounter);
			}
		
		}

		status="success";

	} else {

		status="failure";
	var warningDiv = document.getElementById('warning');
	    	warningDiv.style.display = 'block';
	    	return setTimeout(function(){ 
	    		$("#warning").fadeOut(); }, 
	    	3000);	 
	}


	timeNow = timeStamp();
	// console.log("timeNow: "+timeNow);

	return callback(null,status);

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

	// 1. you need to get a reference to the below by putting an id within the HTML
	// 2. 

	var htmlToAppend = 
    // '<div class="card-container col-sm-6">'+
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
 

    taskCounter++;
    console.log("taskCounter "+taskCounter);

	return $('#card-holder').prepend(htmlToAppend);

}

function addResponse(negativeWordList, timeNow, userLocation){

changePlaceholder();


  var htmlToAppend = 
    '<div class="card-container col-sm-6">'+
      '<div class="response" "form-group">'+
        // '<img src="img/'+userLocation+'.png">'+
          '<h2>'+negativeWordList+'? Hmm... reminds me of:<br /></h2>'+
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
 

  return $('#card-holder').prepend(htmlToAppend);

}	

function changePlaceholder(){
	console.log("change placeholder ran");
	// document.getElementById('theInput').addEventListener('')
	document.getElementById('theInput').placeholder = "";
}

function fanciesArtist(timeNow, userLocation){

  var htmlToAppend = 
    // '<div class="card-container col-sm-6">'+
      '<div class="response" "form-group">'+
        // '<img src="img/'+userLocation+'.png">'+
          '<h2> It\'s randomization through code, by <a href="www.osamasehgol.com">Osama Sehgol</a><br /></h2>'+
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
 

  return $('#card-holder').prepend(htmlToAppend);

}	

function whatsFunny(timeNow, userLocation){

  var htmlToAppend = 
    // '<div class="card-container col-sm-6">'+
      '<div class="response" "form-group">'+
        // '<img src="img/'+userLocation+'.png">'+
          '<h2> What\'s interesting is, I can\'t see the bird in this image<br /></h2>'+
          '<h4>@ '+timeNow+'</h4>'+
          '<h4>'+userLocation+'</h4>'+
      '<div class="idOfData" style="display:none">thisIsJustAnExampleId12345</div>'+
        '</div>'+
      '</div>'+
    '</div>'
 

  return $('#card-holder').prepend(htmlToAppend);

}	

function addImage(){


  var htmlToAppend = 
    // '<div class="card-container col-sm-6">'+
      '<div class="response" "form-group">'+
        // '<img src="img/'+userLocation+'.png">'+
          '<img src="/img/bird.jpg"></img>'+
          // '<h2> Description tag says it\'s there...<br /></h2>'+
        '<input type="file" id="image" style="display: none;">'+
     	'<div class="idOfData" style="display:none">thisIsJustAnExampleId12345</div>'+
      '</div>'

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




//Art for you
function addArt(){
	//RUNE.JS portion
var r = new Rune({
  container: ".card-container",
  width: 200,
  height: 200
});

// Create colors
// -------------------------------------
// 
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


	//Here's some Art for you
	var bg = r.rect(0, 0, r.width, r.height);
	var hue = 0;

	r.on('update', function() {
	  bg.fill('hsv', hue, 150, 100).stroke(false);
	  // hue++;
	});


r.play();


}



function addRecursionArt(){

	var r = new Rune({
	  container: ".card-container",
	  width: 200,
	  height: 200
	});

	var maxLevel = 5;

	var color1 = new Rune.Color(60, 100, 150);
	var color2 = new Rune.Color(140, 180, 220);
	var color3 = new Rune.Color(40, 40, 40);
	var color4 = new Rune.Color(50, 60, 70);

	var pattern = drawL(0, 0, 0, 600, 0, color1);

	function drawL(x, y, rot, len, level, color, parent) {

	  var layer = r.group(x, y, parent).rotate(rot, x, y);

	  var l = r.polygon(0, 0, layer)
	    .fill(color)
	    .stroke(false)
	    .lineTo(0, 0)
	    .lineTo(0, len)
	    .lineTo(len, len)
	    .lineTo(len, len/2)
	    .lineTo(len/2, len/2)
	    .lineTo(len/2, 0);

	  if(level < maxLevel)
	  {
	    level++;

	    drawL(len/4, len/4, 0, len/2, level, color1, layer);
	    drawL(len/2, 0, 90, len/2, level, color2, layer);
	    drawL(0, len/2, 0, len/2, level, color3, layer);
	    drawL(len/2, len, -90, len/2, level, color4, layer);
	  }

	  return l;
	}

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






