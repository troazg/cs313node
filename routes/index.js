var express = require('express');
var router = express.Router();
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const config = {
	user: 'apiuser',
	database: 'project2',
	password: 'password'
};

var pool = new pg.Pool(config); 

var conString = 'postgres://@localhost/project2';

router.get('/users', (req, res, next) => {
	pool.connect((err, client, done) => {
		if (err) {
			return console.error('Error fetching client from pool', err);
		}

		console.log("Connected to DB");

		client.query('SELECT * FROM users', (err, result) => {
			done();
			if (err) {
				return console.error("Error running query ", err);
			}
			res.send(result);
		});
	});
});

router.post('/users/', (req, res, next) => {
	pool.connect((err, client, done) => {
		if (err) {
			console.error('Error fetching client from pool', err);
		}

		console.log("Connected to DB ");
    console.log("Req: ", req.body);
    console.log("Username: ", req.body.username);
    console.log("Passwd: ", req.body.password);

		client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id', [req.body.username, req.body.password], (err, result) => {
			done();
			if (err) {
				return console.error("Error returning query", err);
			}
			res.send(result);
		});
	});
});

router.get('/users/:id', (req, res, next) => {
  pool.connect((err, client, done) => {
    if (err) {
      return console.error('Error fetching client from pool', err);
    }
    console.log("Connected to DB");
    client.query('SELECT * FROM users WHERE user_id = $1', [req.params.id], (err, result) => {
      done();
      if (err) {
        return console.error('Error running query', err);
      }
      res.send(result);
    });
  });
});

router.put('/users/:id', (req, res, next) => {
  pool.connect((err, client, done) => {
    if (err) {
      return console.error('Error fetching client from pool', err);
    }
    console.log("connected to DB");
 
    client.query('UPDATE users SET username = $2, password = $3  WHERE user_id = $1', [req.params.id, req.body.username, req.body.password], (err, result) => {
      done();
      if (err) {
        return console.error('Error running query', err);
      }
      res.send(result);
    });
  });
});

router.delete('/users/:id', (req, res, next) => {
  pool.connect((err, client, done) => {
     console.log(conString)
    if (err) {
      return console.error('Error fetching client from pool', err);
    }
    console.log("Connected to DB");
    client.query('DELETE FROM users WHERE user_id = $1',[req.params.id], (err, result) => {
      done();
      if (err) {
        return console.error('Error running query', err);
      }
      res.send(result);
    });
  });
});

module.exports = router;
