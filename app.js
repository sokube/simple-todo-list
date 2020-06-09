const express = require('express');
const ehb = require ('express-handlebars');
const { Client } = require ('pg');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const os = require('os');

// UNCOMMENT for V3.0 and comment inmemdb
//const db = require('./pdgb.js');
const db = require('./inmemdb.js');

var Organization = "Sokube";
    Planet = "Tatooine";
    Climate = "Arid";
    Terrain = "Desert";
    Population = "200000";
    Resident = "Beru Whitesun lars";

if (process.env.ORG) {                                                        
    Organization = process.env.ORG;                                           
}

if (process.env.SW_PLANET) {
    Planet = process.env.SW_PLANET;
}

if (process.env.SW_CLIMATE) {
    Climate = process.env.SW_CLIMATE;
}

if (process.env.SW_TERRAIN) {
    Terrain = process.env.SW_TERRAIN;
}

if (process.env.SW_POPULATION) {
    Population = process.env.SW_POPULATION;
}

if (process.env.SW_RESIDENT) {
    Resident = process.env.SW_RESIDENT;
}


// REST endpoints
list_all_tasks = function (req, res) {
    res.send(db.list_all_tasks());
}

create_task = function (req, res) {
    db.create_task(req.body.description);
    res.json(req.body.description)
}

delete_task = function (req, res) {
    db.delete_task(req.params.taskid)
    res.json(req.params.taskid);
}

toggle_task = function (req, res) {
    db.toggle_task(req.params.taskid);
    res.json(req.params.taskid);
}

// Initialize Express HTTP server and middleware
var slow = 0; // our global slowness variable, delaying of slow ms each request
const PORT = 8080;
const app = express()
app.engine('handlebars', ehb({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('static'))
app.use(morgan('common'))
app.use(function(req,res,next){
    setTimeout(next, slow)
});
app.use(bodyParser.json());

// setup HTTP routes
app.get('/', function(request, result, next) {
    const hostname = os.hostname;
    result.render('todos', {tasks: db.list_all_tasks(), host: hostname, org: Organization, planet: Planet});
});

app.get('/planet', function(request, result, next) {
    const hostname = os.hostname;
    result.render('planet', {host: hostname, planet: Planet, climate: Climate, terrain: Terrain, population: Population, resident: Resident});
});

app.route('/api/v1/tasks')
    .get(list_all_tasks)
    .post(create_task)

app.route('/api/v1/tasks/:taskid')
    .delete(delete_task)

// UNCOMMENT for V2.0
app.route('/api/v1/tasks/:taskid/toggle')
     .post(toggle_task)

app.get('/api/v1/crash', function() {
    process.nextTick(function () {
        throw new Error;
    });
})

app.get('/api/v1/slowdown', function(request, result) {
    slow=10000;
    result.json(slow)
})

// UNCOMMENT for V1.1
app.get('/health', function(request, result) {
    result.json("OK")
})

// Server start
const server = app.listen(PORT, function() {
    console.log('Server started on port ' + PORT)
});

// The signals we want to handle
// NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
var signals = {
    'SIGHUP': 1,
    'SIGINT': 2,
    'SIGTERM': 15
};

// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
    server.close(() => {
        console.log(`server stopped by ${signal} with value ${value}`);
        process.exit(128 + value);
    });
};

// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
        shutdown(signal, signals[signal]);
    });
});
