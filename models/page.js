var mongoose = require('mongoose');

module.exports = mongoose.model('Page', {
	authors: Array,
	sideImages: Array,
	mainImages: Array,
	title: String,
	coverPhoto: String,
	subheading: String,
	captions: Array,
	quotes: Array,
	paragraphs: String
});