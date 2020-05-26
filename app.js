const express = require('express');
const ehb = require ('express-handlebars');
const { Client } = require ('pg');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const os = require('os');

const client = new Client( {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
});

// Connect and initialize the database with the todos table if not done already
client.connect()
client.on('connect', function () {
    console.log("Connected to PostgreSQL server "+client.host+":" + client.port)
    client.query('CREATE TABLE IF NOT EXISTS TODOS ( \
        id serial NOT NULL, \
        description varchar(256), \
        complete boolean, \
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
        PRIMARY KEY(ID));');
});

// REST endpoints
list_all_tasks = function (req, res) {
    const query = 'SELECT id, description, complete FROM TODOS ORDER BY created ASC;'
    client
        .query(query)
        .then(res => res.send(res))
        .catch(e => console.error(e.stack));
}

create_task = function (req, res) {
    const query = 'INSERT INTO TODOS(description,complete) VALUES ($1,$2) RETURNING id,description,complete;'
    const { description } = req.body;
    const values = [ description, false ];
    client
        .query(query,values)
        .then( r => res.json(r.rows[0]) )
        .catch(e => res.send(err));
}

delete_task = function (req, res) {
    const query = 'DELETE FROM TODOS where id=$1;'
    const values = [ req.params.taskid ];
    client
        .query(query,values)
        .then( r => res.json(req.params.taskid) )
        .catch(e => res.send(err));
}

toggle_task = function (req, res) {
    const query = 'UPDATE TODOS SET complete = NOT complete where id=$1 RETURNING *;'
    const values = [ req.params.taskid ];
    client
        .query(query,values)
        .then( r => res.json(r.rows[0]) )
        .catch(e => res.send(err));
}

// Initialize Express HTTP server and middleware
const PORT = 8080;
const app = express()
app.engine('handlebars', ehb({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('static'))
app.use(morgan('common'))
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup HTTP routes
app.get('/', function(request, result, next) {
    const query = 'SELECT id, description, complete FROM TODOS ORDER BY created ASC;'
    const hostname = os.hostname;
    client
        .query(query)
        .then(res => {
            result.render('todos', {tasks: res.rows, host: hostname});
            }
        )
        .catch(e => console.error(e.stack));
});

app.route('/api/v1/tasks')
    .get(list_all_tasks)
    .post(create_task)

app.route('/api/v1/tasks/:taskid')
    .delete(delete_task)

app.route('/api/v1/tasks/:taskid/toggle')
    .post(toggle_task)

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