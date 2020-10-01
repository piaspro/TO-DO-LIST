const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://piasUser:iYAc53z2JNA7WWG@cluster0.rnrug.mongodb.net/toDoList?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

client.connect(err => {
    const routineCollection = client.db("toDoList").collection("dailyRoutine");

    app.get('/activities', (req, res) => {
        routineCollection.find({})
        .toArray(( err, documents) => {
            res.send(documents)
        })
    })
    
    app.get('/update/:id', (req, res) => {
        routineCollection.find({_id: ObjectId(req.params.id)})
        .toArray(( err, documents) => {
            res.send(documents[0])
        })
    })

    app.patch('/updateConfirm/:id', (req, res) => {
        routineCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {name: req.body.name, time: req.body.time}
        }
        )
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

    app.post('/addActivity', (req, res) => {
        const activity = req.body;
        routineCollection.insertOne(activity)
        .then(result => {
            res.redirect('/')
        })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log({_id: ObjectId(req.params.id)})
        routineCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result) => {
            res.send(result.deletedCount > 0)
        })
    })


  });

app.listen(3000);