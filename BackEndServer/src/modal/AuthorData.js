const mongoose= require('mongoose');

/**LOCAL BB */
// mongoose.connect('mongodb://localhost:27017/library');

//ATLAS//
 mongoose.connect('mongodb+srv://userone:userone@ictakfiles.gxk2j.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    authorname       : String,
    nationality      : String,
    works            : String,
    image            : String,
    career           : String
});

var Authordata = mongoose.model('authordata',AuthorSchema);

module.exports = Authordata;