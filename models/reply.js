var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var replySchema = new Schema({
	reply: String
	// location: String,
	// file: String,
	// time: String,
	// dateAdded: {type: Date, default: Date.now}
	// ????????can i do time.join????????
});

module.exports = mongoose.model('Reply', replySchema);