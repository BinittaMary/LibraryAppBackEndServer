const express = require('express');
const path = require('path');
const Bookdata = require('./src/modal/BookData');
const Userdata = require('./src/modal/UserData');
const Authordata = require('./src/modal/AuthorData');
const cors = require('cors');
const bodyparser = require('body-parser');
const multer = require('multer');
const jwt= require('jsonwebtoken')

const app = new express();
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(bodyparser.json())

const port = process.env.PORT || 5000;


function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }


app.get('/books',function(req,res){
    Bookdata.find().sort({ _id: -1 })
    .then(function(books){
        res.send(books);
        });
});

app.get('/authors',function(req,res){
  Authordata.find().sort({ _id: -1 })
  .then(function(authors){
      res.send(authors);
      });
});

app.get('/author/:id',  (req, res) => {
  
  const id = req.params.id;
  console.log(` inside author ${id}`);
  Authordata.findOne({"_id":id})
    .then((author)=>{
      console.log(` retrieved author ${author.authorname}`);
        res.send(author);
    });
})

app.get('/:id',  (req, res) => {
  
    const id = req.params.id;
    console.log(` inside read more ${id}`)
    Bookdata.findOne({"_id":id})
      .then((book)=>{
          res.send(book);
      });
  })

  app.post('/upload',function(req,res){
    const destn = path.join(__dirname, '../',  'Client', 'src', 'assets', 'images');
    console.log(destn);
    var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, destn);
        },
        filename: function(req, file, cb) {
          cb(null, file.originalname);
      }
      });
    var upload = multer({ storage : storage}).single('file');
    upload(req,res,function(err) {
        if(err) {
            console.log("Error uploading file.");
        }
        console.log("File is uploaded");
        console.log(`the title is ${req.body.title}`);
        var book = {       
          title         :  req.body.title,
          author        :  req.body.author,
          genre         :  req.body.genre,
          description   :  req.body.description,
          image         :  req.body.image,
          newbook       : 'Y'
     }       
     var bookItem = new Bookdata(book);
     bookItem.save();
    });
});

  app.post('/login', function(req,res)
  {
      sess=req.session;
      var user=req.body.emailaddress;
      var pwd =req.body.password;
      var validFlag = false;
      console.log(`login attempt with user : ${user} and password : ${pwd}`);

      Userdata.findOne({"emailaddress" : user})
      .then(function(users){
       console.log(`user login : ${users.emailaddress} and password : ${users.password}`);
       if ((user===users.emailaddress) && (pwd===users.password)) 
        {
            validFlag= true;       
        }
    
      if (!user) {
        res.status(401).send('Invalid Username')
      } else 
      if ( ! validFlag) {
        res.status(401).send('Invalid Email Address or Password')
      } else {
        let payload = {subject: user+pwd}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token, users})
      }
      });       
  });


app.post('/author/insert',verifyToken,function(req,res){
   res.header("Access-Control-Allow-Origin","*")
   res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE,OPTIONS');  
   console.log(` inside insert ${req.body}`)
    
   const destn = path.join(__dirname, '../',  'Client', 'src', 'assets', 'images');
   console.log(destn);
   var storage =   multer.diskStorage({
       destination: function (req, file, callback) {
         callback(null, destn);
       },
       filename: function(req, file, cb) {
         cb(null, file.originalname);
     }
     });
   var upload = multer({ storage : storage}).single('file');
   upload(req,res,function(err) {
       if(err) {
           console.log("Error uploading file.");
       }
       console.log("File is uploaded");
       console.log(`the title is ${req.body.title}`);
       var author = {       
        authorname    :  req.body.authorname,
        nationality   :  req.body.nationality,
        works         :  req.body.works,
        career        :  req.body.career,
        image         :  req.body.image
   }       
   var authorItem = new Authordata(author);
   authorItem.save();
  });
});

app.post('/author/remove',verifyToken,(req,res)=>{  

    console.log(` inside remove ${req.body}`);
    id         = req.body._id,
    BookTitle  = req.body.title,
    BookAuthor = req.body.author,
    BookGenre  = req.body.genre,
    BookDesc   = req.body.description,
    BookImage  = req.body.image
    console.log(` inside remove ${id}`);
    Authordata.deleteOne({'_id' : id})
    .then(function(author){
        console.log('success')
        res.send();
    });

  });

  app.put('/author/update',verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE,OPTIONS');  
    console.log(` inside update ${req.body.id}`);
    id          = req.body._id,
    authorname  = req.body.authorname,
    nationality = req.body.nationality,
    works       = req.body.works,
    career      = req.body.career,
    image       = req.body.image
    Authordata.findByIdAndUpdate({"_id":id},
                                {$set:{"authorname":authorname,
                                "nationality":nationality,
                                "works":works,
                                "career":career,
                                "image":image}})
   .then(function(){
       res.send();
   })

  });

app.put('/author/updateWithFile',verifyToken,(req,res)=>{


   res.header("Access-Control-Allow-Origin","*")
   res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE,OPTIONS');  
   console.log(` inside updateWithFile ${req.body}`)
   const destn = path.join(__dirname, '../',  'Client', 'src', 'assets', 'images');
   console.log(destn);
   var storage =   multer.diskStorage({
       destination: function (req, file, callback) {
         callback(null, destn);
       },
       filename: function(req, file, cb) {
         cb(null, file.originalname);
     }
     });
   var upload = multer({ storage : storage}).single('file');
   upload(req,res,function(err) {
 
       if(err) {
           console.log("Error uploading file.");
       }
       console.log("File is uploaded");
       console.log(`the title is ${req.body.title}`);
   console.log(` inside update with image ${req.body.title}`);
   id          = req.body._id,
   authorname  = req.body.authorname,
   nationality = req.body.nationality,
   works       = req.body.works,
   career      = req.body.career,
   image       = req.body.image
   Authordata.findByIdAndUpdate({"_id":id},
                               {$set:{"authorname":authorname,
                               "nationality":nationality,
                               "works":works,
                               "career":career,
                               "image":image}})
  .then(function(){
      res.send();
  })
 });
 });

 app.post('/insert',verifyToken,function(req,res){
  res.header("Access-Control-Allow-Origin","*")
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE,OPTIONS');  
  console.log(` inside insert ${req.body}`)
    
  const destn = path.join(__dirname, '../',  'Client', 'src', 'assets', 'images');
  console.log(destn);
  var storage =   multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, destn);
      },
      filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
    });
  var upload = multer({ storage : storage}).single('file');
  upload(req,res,function(err) {
      if(err) {
          console.log("Error uploading file.");
      }
      console.log("File is uploaded");
      console.log(`the title is ${req.body.title}`);
      var book = {       
        title         :  req.body.title,
        author        :  req.body.author,
        genre         :  req.body.genre,
        description   :  req.body.description,
        image         :  req.body.image,
        newbook       : 'Y'
   }       
   var bookItem = new Bookdata(book);
   bookItem.save();
  });
});

app.post('/remove',verifyToken,(req,res)=>{  

  console.log(` inside remove ${req.body}`);
  id         = req.body._id,
  BookTitle  = req.body.title,
  BookAuthor = req.body.author,
  BookGenre  = req.body.genre,
  BookDesc   = req.body.description,
  BookImage  = req.body.image
  console.log(` inside remove ${id}`);
  Bookdata.deleteOne({'_id' : id})
  .then(function(book){
      console.log('success')
      res.send();
  });

});

app.put('/update',verifyToken,(req,res)=>{
  id         = req.body._id,
  BookTitle  = req.body.title,
  BookAuthor = req.body.author,
  BookGenre  = req.body.genre,
  BookDesc   = req.body.description,
  BookImage  = req.body.image
  console.log(`inside the book edit ${BookTitle}`);
  Bookdata.findByIdAndUpdate({"_id":id},
                              {$set:{"title":BookTitle,
                              "author":BookAuthor,
                              "genre":BookGenre,
                              "description":BookDesc,
                              "image":BookImage}})
 .then(function(){
     res.send();
 });

});


app.put('/updateWithFile',verifyToken,(req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE,OPTIONS');  
  console.log(` inside update ${req.body}`)
  const destn = path.join(__dirname, '../',  'Client', 'src', 'assets', 'images');
  console.log(destn);
  var storage =   multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, destn);
      },
      filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
    });
  var upload = multer({ storage : storage}).single('file');
  upload(req,res,function(err) {

      if(err) {
          console.log("Error uploading file.");
      }
      console.log("File is uploaded");
      console.log(`the title is ${req.body.title}`);
  console.log(` inside update with image ${req.body.title}`);
  id         = req.body._id,
  BookTitle  = req.body.title,
  BookAuthor = req.body.author,
  BookGenre  = req.body.genre,
  BookDesc   = req.body.description,
  BookImage  = req.body.image
  Bookdata.findByIdAndUpdate({"_id":id},
                              {$set:{"title":BookTitle,
                              "author":BookAuthor,
                              "genre":BookGenre,
                              "description":BookDesc,
                              "image":BookImage}})
 .then(function(){
     res.send();
 })
});

});

app.post('/adduser',function(req,res){
  var userItem = {
      emailaddress  : req.body.emailaddress,
      password      : req.body.password,
      firstname     : req.body.firstname,
      lastname      : req.body.lastname,
      phoneno       : req.body.Phoneno,
      adminrole     : 'USER'
  }
  // users.push(userItem);
  Userdata.find({'emailaddress' :  userItem.emailaddress})
  .then (function(users){
          var bexist=false;
          console.log(`fetched from db Email ID - ${userItem.emailaddress}, Password - ${userItem.password}`)
          for(var i=0; i<users.length; i++){
          if (users[i].emailaddress==userItem.emailaddress){
              bexist=true;
          }};
          if (bexist){
              console.log(`Email Id already exist`);
              res.status(401).send('Email ID is already registered with us')
             }  
          else{
              var vUser= Userdata(userItem);
              vUser.save();
              console.log(`The registered user added is : Email ID - ${userItem.emailaddress}, Password - ${userItem.password}, firstname - ${userItem.firstname}, lastname - ${userItem.lastname},   Phone No - ${userItem.phoneno}`);
              res.status(200).send({ userItem})
          }
  });
});


 app.listen(5000, function(){
    console.log('listening to port 5000');
});