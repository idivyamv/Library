const express = require('express');
const BooksList = require("./src/model/BooksModel");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

const path = require('path');
app.use(express.static(`./dist/library-frontend`));




app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


//username= "admin";
//password = "123456";

app.get('/readbook', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    BooksList.find()
        .then(function (book) {
            res.send(book);
        })
})

app.get('/', (req, res) => {
  res.send('i am divs dddd')
})
app.post('/addbook', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

    var book = {
      bookId    :   req.body.book.bookId,
      bookName  : req.body.book.bookName,
      author    : req.body.book.author,
      availability: req.body.book.availability,
      synopsis  : req.body.book.synopsis,
      imageUrl  : req.body.book.imageUrl,
      userReview: req.body.book.userReview,
      price     : req.body.book.price

    }
   
  //var book = new BooksList(book);
  //book.save;  
    let books = new BooksList(book);
    books.save()
        .then(book => {
            res.status(200).json({'book': 'book added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new book failed');
        });
  })

  app.post('/login', (req, res) => {
      let userData = req.body
      if(!username){
          res.status(401).send("invalid username");
      }
      else if(password!==userData.password)
      {
        res.status(401).send("invalid password");
      }
      else {
        res.status(200).send();
      }  
  })
  app.delete('/remove/:id',(req, res) => {
      id  = req.params.id;
      BooksList.findByIdAndDelete({"_id":id})
      .then(() => {
        res.status(200).json({'book': 'book deleted successfully'});
    })
    .catch(err => {
        res.status(400).send('deleting book failed');
    });

    }
  )
  app.get('/getbook/:id',(req, res) => {
        id  = req.params.id;
        BooksList.findById({"_id":id})
        .then(function (book) {
          res.send(book);
      })
      .catch(err => {
          res.status(400).send('deleting book failed');
      });

  })
  app.put('/editbook', (req, res) => {
    id  = req.body.book._id;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
      bookId    =   req.body.book.bookId,
      bookName  = req.body.book.bookName,
      author    = req.body.book.author,
      availability= req.body.book.availability,
      synopsis = req.body.book.synopsis,
      imageUrl  = req.body.book.imageUrl,
      userReview= req.body.book.userReview,
      price     = req.body.book.price    
   
  //var book = new BooksList(book);
  //book.save;  
   // let books = new BooksList(book);
   BooksList.findByIdAndUpdate({"_id":id},{$set:{
      "bookId"   :   bookId,
      "bookName" : bookName,
      "author"   : author,
      "availability": availability,
      "synopsis"  : synopsis,
      "imageUrl"  : imageUrl,
      "userReview": userReview,
      "price"     : price

    }})
        .then(book => {
            res.status(200).json({'book': 'book details updated successfully'});
        })
        .catch(err => {
            res.status(400).send('book updation failed');
        });
  })
  app.get('/*', function(req, res) {

    res.sendFile(path.join(__dirname + '/dist/library-frontend/index.html'));
  });
const port = 3000;
/* app.listen(3000, () => {
  console.log("Server up in Port 3000 ");
}); */
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});