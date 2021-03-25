const express = require('express');

const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}))

const MongoClient = require('mongodb').MongoClient;

const ObjectId = require('mongodb').ObjectId

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})



const uri = "mongodb+srv://firstdb:v4yG175Jo6jvqFrn@cluster0.6i5ol.mongodb.net/Mrorganic?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("Mrorganic").collection("products");

  app.get('/products', (req, res)=>{
      productCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents)
      })
  })

  app.post('/addProducts', (req, res)=>{
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      
      res.redirect('/')
    })
  })

  app.patch('/update/:id', (req, res)=>{
    
    productCollection.updateMany({_id: ObjectId(req.params.id)}, 
    {
      $set:{price: req.body.price, quantity: req.body.quantity},
      $currentDate: { lastModified: true } 
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
    
  })

  app.delete('/delete/:id', (req, res)=>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result=>{
      res.send(result.deletedCount > 0)
    })
  })

  app.get('/product/:id', (req, res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })
});




app.listen(3000)


// password
// v4yG175Jo6jvqFrn
