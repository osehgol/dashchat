// CUSTOM JS FILE //

function init() {
  renderPeeps();
}

var findTask, buyTask, transcribeTask, callTask;
var timeNow;
var userLocation; // Slover: I've added a variable to hold the location 
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
console.log(task);

var taskType = task.match(/^#find|#buy|#transcribe|#call^/);

	if(taskType){
		findTask = task.match(/#find/g);		
		buyTask = task.match(/#buy/g);
		transcribeTask = task.match(/#transcribe/g);
		callTask = task.match(/#call/g);
		// console.log(findTask);
		// console.log(buyTask);
		console.log(callTask);

		if (findTask){
			findCounter++;
			console.log("findCounter is "+findCounter);
		} else if (buyTask){
			buyCounter++;
			console.log("buyCounter is "+buyCounter);
		} else if (transcribeTask){
			transcribeCounter++;
			console.log("transcribeCounter is "+transcribeCounter);
		} else if (callTask){
			callCounter++;
			console.log("callCounter is "+callCounter);
		}


	} else {

		var warningDiv = document.getElementById('warning');
		    	warningDiv.style.display = 'block';
		    	return setTimeout(function(){ 
		    		$("#warning").fadeOut(); }, 
		    	6000);	 
	}


	timeNow = timeStamp();
	getLocation();
	console.log("timeNow: "+timeNow);

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
         		// console.log(location);
         		// Slover: store the location in the userLocation variable
         		userLocation = location.city + " " + location.country_code;
         		// console.log('the user location is --> '+ userLocation); 
         		// now you can do what you want with the userLocation valuable 
         });
}

function addCard(task, timeNow, userLocation){

	var htmlToAppend = 
	'<form method="post" action="/dashboard">'+
    '<div class="card-container col-sm-offset-4 col-md-offset-4">'+
      '<div class="card">'+
        // '<img src="img/'+userLocation+'.png">'+
          '<h2>'+task+'<br /></h2>'+
          '<h4>@ '+timeNow+'</h4>'+
          '<h4>'+userLocation+'</h4>'+
      '</div>'+
    '</div>'+
    '</form>'
    taskCounter++;
    console.log("taskCounter "+taskCounter);
    
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

	var files = evt.dataTransfer.files; // FileList object.

	// files is a FileList of File objects. List some properties.
	for (var i = 0, f; f = files[i]; i++) {
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

// module.exports = router;


/*
error: text overflows card
error: repeat file image prints 

0. create data storage var task = {"buy" : 1, "call" : 0, "find" : 0}
1. create Task ID
1. Sentiment analysis
2. webRTC push to talk
3. tweet task to dashboard
4. VA dashboard, parses task category
5. Counter for task category to record VA preferences
6. @taday to call task type progress bar
7. Chart.js visuals 

*/



function renderPeeps(){
	jQuery.ajax({
		url : '/api/get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			var people = response.people;

			for(var i=0;i<people.length;i++){
				var htmlToAdd = '<div class="col-md-4">'+
					'<img src='+people[i].imageUrl+' width="100">'+
					'<h1>'+people[i].name+'</h1>'+
					'<ul>'+
						'<li>Year: '+people[i].itpYear+'</li>'+
						'<li>Interests: '+people[i].interests+'</li>'+
					'</ul>'+
					'<a href="/edit/'+people[i]._id+'">Edit Person</a>'+
				'</div>';
			
				jQuery("#people-holder").append(htmlToAdd);
			}



		}
	})	
}

window.addEventListener('load', init())