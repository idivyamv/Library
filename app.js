const express = require('express');
const BooksList = require("./src/model/BooksModel");
const UserDetail = require("./src/model/UserModel");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

const path = require('path');
app.use(express.static(`./dist/library-frontend`));

app.use(cors());
const jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(express.json());

/* app.get('/', (req, res) => {
  res.send('i am divs dddd')
}) */

  app.post('/api/register', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

    
    console.log(req.body.user);
    var newuser = {
      firstname : req.body.user.firstname,
      lastname  : req.body.user.lastname,
      email     : req.body.user.email,
      phoneno   : req.body.user.phoneno,
      city      : req.body.user.city,
      dist      : req.body.user.dist,
      password  : req.body.user.password,
      terms     : req.body.user.terms

    }
   
    let users = new UserDetail(newuser);
    
    users.save()
    .then(newuser => {
        res.status(200).json({'user': 'user registration completed successfully'});
    })
    .catch(err => {
        res.status(400).send('user registration failed');
    });
    
   
  })

  //username= "admin";
  //password = "123456";

  function verifyToken(req,res,next){
    if(!req.headers.authorization){
      return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token=='null')
    {
      return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token,'secretKey');
    
    if(!payload){
      return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject
    next()

  }

  
  app.post('/api/login', (req, res) => {
      let userData = req.body;
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
     
      if(!userData.email){
          res.status(401).send("invalid username");
      }
      else if(!userData.password){
        res.status(401).send("invalid password");
      }
      else {        
        UserDetail.findOne ({"email":userData.email,"password":userData.password})
          .then(function (user) {
            if(user){
              let payload = {subject:userData.email+userData.password}
              let token = jwt.sign(payload,'secretKey');
              res.status(200).send({token});
            }
            else{
              res.status(400).send({msg:`Invalid Login credentials`});
            }
            
          })
          .catch(err => {   console.log('failed')            ;            
            res.status(400).send({msg:`Login failed`});
          });           
        
      }  
  })

  app.post('/api/addbook',verifyToken, (req, res) => {
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
  app.get('/api/readbook',verifyToken, function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    BooksList.find()
        .then(function (book) {
            res.send(book);
        })
  })
  app.delete('/api/remove/:id',verifyToken,(req, res) => {
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
  app.get('/api/getbook/:id',verifyToken,(req, res) => {
        id  = req.params.id;
        BooksList.findById({"_id":id})
        .then(function (book) {
          res.send(book);
      })
      .catch(err => {
          res.status(400).send('fetching book failed');
      });

  })
  app.put('/api/editbook',verifyToken, (req, res) => {
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
  const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server up in Port 5000 ");
});