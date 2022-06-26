const { default: mongoose } = require('mongoose');
const Mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LibraryApp');


//mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const Schema = mongoose.Schema;
const Book = new Schema({
    bookId      : Number,
    bookName    : String,
    author      : String,
    availability: String,
    synopsis    : String,
    imageUrl    : String,
    userReview  : String,
    price       : String

})
const bookslist = mongoose.model('book',Book);
module.exports = bookslist;