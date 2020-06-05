const { Client } = require ('pg');

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

var db = {
    list_all_tasks: function () { 
        const query = 'SELECT id, description, complete FROM TODOS ORDER BY created ASC;'
        client
            .query(query)
            .then(res => { return res.rows;} )
            .catch(e => console.error(e.stack));
    },
    create_task:function (desc) { 
        const query = 'INSERT INTO TODOS(description,complete) VALUES ($1,$2) RETURNING id,description,complete;'
        const values = [ desc, false ];
        client
            .query(query,values)
            .then( r => { return;} )
            .catch(e => res.send(err));
    },
    delete_task:function (taskid)  {
        const query = 'DELETE FROM TODOS where id=$1;'
        const values = [ taskid ];
        client
            .query(query,values)
            .then( r => { return;} )
            .catch(e => res.send(err));
    },
    toggle_task:function (taskid) {
        const query = 'UPDATE TODOS SET complete = NOT complete where id=$1 RETURNING *;'
        const values = [ taskid ];
        client
            .query(query,values)
            .then( r => { return;} )
            .catch(e => res.send(err));
    }    
};

module.exports = db;


// REST endpoints
list_all_tasks = function () {
    const query = 'SELECT id, description, complete FROM TODOS ORDER BY created ASC;'
    client
        .query(query)
        .then(res => { return res.rows;} )
        .catch(e => console.error(e.stack));
}

create_task = function (desc) {
    const query = 'INSERT INTO TODOS(description,complete) VALUES ($1,$2) RETURNING id,description,complete;'
    const values = [ desc, false ];
    client
        .query(query,values)
        .then( r => { return;} )
        .catch(e => res.send(err));
}

delete_task = function (taskid) {
    const query = 'DELETE FROM TODOS where id=$1;'
    const values = [ taskid ];
    client
        .query(query,values)
        .then( r => { return;} )
        .catch(e => res.send(err));
}

toggle_task = function (taskid) {
    const query = 'UPDATE TODOS SET complete = NOT complete where id=$1 RETURNING *;'
    const values = [ taskid ];
    client
        .query(query,values)
        .then( r => { return;} )
        .catch(e => res.send(err));
}
