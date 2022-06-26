const { default: mongoose } = require('mongoose');
const Mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LibraryApp');


//mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const Schema = mongoose.Schema;
const User = new Schema({
    firstname   : String,
    lastname    : String,
    email       : String,
    phoneno     : String,
    city        : String,
    dist        : String,
    password    : String,
    terms       : Boolean
})
const userdetail = mongoose.model('user',User);
module.exports = userdetail;