const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const emails= require('./routes/api/emailSubcription');
const authors = require('./routes/api/author');
const publications = require('./routes/api/publication');
const news = require('./routes/api/news');

app.use(express.static(path.join(__dirname, '../frontend/build')));
const db = require('./config/keys').mongoURI;
require('dotenv').config();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


mongoose.connect(db).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));


//serving public file
app.use(express.static(__dirname));

app.use('/files', express.static(path.join(__dirname, 'files')));
app.use('/files/publications/thumbnails', express.static(path.join(__dirname, 'files','publications','thumbnails')));
app.use('/files/publications/PDF', express.static(path.join(__dirname, 'files','publications','PDF')));
app.use('/files/public', express.static(path.join(__dirname, 'files','public')));


/*
app.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
});
*/


//routes
app.use('/api/emailSubscription/', emails);
app.use('/api/author/', authors);
app.use('/api/publication/',publications);
app.use('/api/news/', news)


app.listen(process.env.PORT || 5000, () => {
    console.log("The server is running on port 5000")

});
