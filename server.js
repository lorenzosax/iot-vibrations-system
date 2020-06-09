var express = require('express');
var bodyParser = require('body-parser');
var queryString = require('query-string');

var opts = {
    ssl: true,
    replicaSet: 'Cluster0-shard-0',
    authSource: 'admin',
    retryWrites: true,
};
const options = queryString.stringify(opts);

// create express app
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Configuring the database
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url+options, {
    useMongoClient: true
});

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
mongoose.connection.once('connected', function() {
    console.log("Successfully connected to the database");
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected');
});
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose connection is disconnected');
        process.exit(0);
    });
});

// define a simple route
app.get('/', function(req, res){
    res.json({"message": "We ora 4, we are gears... WE ARE 4GEARS ;-)"});
});

require('./app/routes/note.routes.js')(app);
require('./app/routes/location.routes.js')(app);

// listen for requests
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening on port " + (process.env.PORT || "3000"));
});
