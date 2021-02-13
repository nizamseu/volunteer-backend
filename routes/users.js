var express = require('express');
var router = express.Router();
const cors=require('cors')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:1WvneRdXgVtpjYLh@cluster0.r2lzi.mongodb.net/volenteer?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
const ObjectId=require('mongodb').ObjectID;
const { route } = require('.');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with Users ');
});







client.connect(err => {
  const collection = client.db("volenteer").collection("event");
  const regCollection = client.db("volenteer").collection("register");
  router.post('/addevent',cors(), function(req, res, next) {
    collection.insertOne(req.body)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
    .catch(err=>{
      console.log(err);
    })
});
 
router.get('/find',(req,res)=>{
  const search=req.query.search;
  console.log("Search",search);
  collection.find({"data.title":{$regex:search}})
  .toArray((err,documents)=>{
    res.send(documents)
  })
 
})


router.get('/loadData/:id',(req,res)=>{
  const loadData=req.params;
  collection.find({_id:ObjectId(req.params.id)})
  .toArray((err,documents)=>{
    res.send(documents[0])
  })

})


router.post('/reg',(req,res)=>{
  regCollection.insertOne(req.body)
  .then(result=>{
    res.send(result.insertedCount>0)
  })
})

router.get('/eventTask/:email',(req,res)=>{
  regCollection.find({"data.email":req.params.email})
  .toArray((err,documents)=>{
    console.log(documents);
    res.send(documents)
  })
})

router.delete('/delete/:id',(req,res) =>{
  console.log(req.params.id);
  regCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result=>{
    res.send(result.deletedCount>0);
  })
})

router.get('/list',(req,res)=>{
  regCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

router.delete('/deletereg/:id',(req,res)=>{
  console.log(req.param.id);
  regCollection.deleteOne({_id:ObjectId(req.param.id)})
  .then(result=>{
    res.send(result.deletedCount>0)
  })
})
  console.log("connected");
  // client.close();
});









module.exports = router;
