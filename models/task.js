var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var taskSchema = new Schema({
	title: String,
	taskBody: String,
	taskTag: String,	
	location: String,
	dateAdded: {type: Date, default: Date.now}
	// ????????can i do time.join????????
});

module.exports = mongoose.model('Task', taskSchema);