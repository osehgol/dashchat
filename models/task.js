var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var taskSchema = new Schema({
	task: String,	
	location: String,
	file: String,
	dateAdded: {type: Date, default: Date.now}
	// ????????can i do time.join????????
});

module.exports = mongoose.model('Task', taskSchema);