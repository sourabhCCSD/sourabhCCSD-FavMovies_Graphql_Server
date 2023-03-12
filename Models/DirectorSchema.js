const mongoose = require('mongoose');

const directorSchema = mongoose.Schema({
    name : String,
    age : String,
    directorImage: String,
    nationality: String
});

module.exports = mongoose.model('Director', directorSchema)