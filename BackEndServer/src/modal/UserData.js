const mongoose= require('mongoose');

/**LOCAL BB */
mongoose.connect('mongodb://localhost:27017/library');

//ATLAS//
// mongoose.connect('mongodb+srv://userone:userone@ictakfiles.gxk2j.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    emailaddress: String,
    password    : String,
    firstname   : String,
    lastname    : String,
    phoneno     : String,
    adminrole   : String
});

var Userdata = mongoose.model('userdata',UserSchema);

module.exports = Userdata;