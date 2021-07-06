const mongoose= require('mongoose');

/**LOCAL BB */
//  mongoose.connect('mongodb://localhost:27017/library');

//ATLAS//
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.gxk2j.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title       : String,
    author      : String,
    genre       : String,
    description : String,
    image       : String,
    newbook     : String
});

var Bookdata = mongoose.model('bookdata',BookSchema);

module.exports = Bookdata;