const express = require('express')
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const port = 4500;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('working');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.af2ol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");

  app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
      res.send(items);
      console.log('from database', items);
    })
  })
  
  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('added event', newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0);
    })
  })

});

app.listen(process.env.PORT || port);