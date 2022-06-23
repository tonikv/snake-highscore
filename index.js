require('dotenv').config()
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const port = process.env.PORT;
const URI = process.env.URI;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

async function connectToDataBase() {
    try {
        await mongoose.connect(URI);
    } catch (err) {
        console.log(err);
    }
}

connectToDataBase();

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const scoreSchema = new Schema({
    author: ObjectId,
    name: String,
    date: Date,
    score: Number
});

const MyScore = mongoose.model('scores', scoreSchema);

app.get('/', (req, res) => {
    res.json({message:  "SNAKE HIGHSCORES /API/ALL get data /API/STORE store one score"});
})

app.get('/api/all', async (req, res) => {
    try {
        const scores = await MyScore.find({}).sort([['score', -1]]);
        res.status(200).json(scores);
    } catch (err) {
        console.log("Highscores error!")
        res.status(404).json({ error: err });
    }
})

app.delete('/api/delete', async (req, res) => {
    try {
        const deleteOne = await MyScore.findOneAndDelete({ score: { $gte: -1 } });
        res.status(200).json({message: `deleted ${deleteOne}`});
    } catch (err) {
        console.log("error on delete");
        res.status(402).json({ error: err });
    }
})

app.post('/api/store', async (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length <= 1) {
        res.status(400).json({ error: "need name and score data" });
    }

    const scoreToStore = new MyScore({
        name: req.body.name,
        date: Date.now(),
        score: req.body.score
    });

    try {
        const response = await scoreToStore.save();
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({ error: err });
    }
});
    

app.listen(port, () => {
  console.log(`Snake highscore database is listening in ${port}`)
})