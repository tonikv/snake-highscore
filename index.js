require('dotenv').config()
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit')
const app = express()
const port = process.env.PORT;
const URI = process.env.URI;

const apiLimiter = rateLimit({
	windowMs: 1000, // 1 seconds
	max: 1, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(cors());
app.use('/api/store', apiLimiter);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function connectToDataBase() {
    try {
        await mongoose.connect(URI, mongoOptions);
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
    score: Number,
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
        res.status(404).json({ error: err });
    }
})

app.delete('/api/delete', async (req, res) => {
    try {
    const smallestScoreEntry = await Score.findOne().sort('score').exec();

    if (!smallestScoreEntry) {
      // Return an error response if there are no score entries
      return res.status(404).send({ message: 'No score entries found' });
    }

    // Delete the smallest score entry
    await smallestScoreEntry.remove();

    // Return a success response
    res.status(200).send({ message: 'Smallest score entry deleted successfully' });
  } catch (err) {
    // Return an error response if there was an error
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
})

app.post('/api/store', async (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length <= 1) {
        res.status(400).json({ error: "need name and score data" });
    }

    const scoreToStore = new MyScore({
        name: req.body.name,
        date: Date.now(),
        score: req.body.score,
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
