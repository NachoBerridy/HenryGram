const mongoose = require('mongoose');

const MONGODB_URI = process.env.URI //|| 'mongodb://localhost/test-app';
// mongodb+srv://HenryGram:HeGr2022@henrygram.xbooldv.mongodb.net/test
// mongodb+srv://HenryGram:HeGr2022@henrygram.xbooldv.mongodb.net/?retryWrites=true&w=majority

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));