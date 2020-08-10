var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongodb');

const port = 3000;
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017';

MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);
        // collection = db.collection('users');
        var db = client.db('qlsv');

        collection = db.collection('users');
        collection_student = db.collection('students');
        collection_class = db.collection('Lop');
        collection_nganh = db.collection('Nganh');
    }
});

// app.get('/', function(req, res) {
// 	res.sendfile('qlsv.html');
// });

// io.on('connection', function(socket) {
// 	// socket.on('join', function(data) {
// 	//     console.log("EventJoin: " + data);
// 	// });

// 	socket.on('login', function(email, password) {
// 		console.log('Eventlogin: ' + email + ' va pass: ' + password);

// 		var cursor = collection.find({ email: email });
// 		// console.log(cursor);

// 		cursor.each(function(err, doc) {
// 			if (err) {
// 				console.log(err);
// 				socket.emit('login', false);
// 			} else {
// 				if (doc != null) {
// 					if (doc.password == password) {
// 						console.log(doc.password);
// 						socket.emit('login', true);
// 					} else {
// 						socket.emit('login', false);
// 					}
// 				}
// 			}
// 		});
// 	});

// 	socket.on('register', function(name, password, email) {
// 		console.log(name + 'register');

// 		var user = { name: name, password: password, email: email };

// 		collection.insert(user, function(err, result) {
// 			if (err) {
// 				console.log(err);
// 				socket.emit('register', false);
// 			} else {
// 				console.log('Inserted new user ok');
// 				socket.emit('register', true);
// 			}
// 		});
// 	});

// 	//chen sinhvien
// 	socket.on('insertStudent', function(id, name, email) {
// 		console.log(name + 'insert sinhvien');

// 		var student = { id: id, name: name, email: email };

// 		collection_student.insert(student, function(err, result) {
// 			if (err) {
// 				console.log(err);
// 				socket.emit('insertStudent', false);
// 			} else {
// 				console.log('Inserted new user ok');
// 				socket.emit('insertStudent', true);
// 			}
// 		});
// 	});

// 	socket.on('getStudent', async function(msg) {
// 		console.log('Nhan lenh getStudent: ' + msg);

// 		var cursor = collection_student.find();

// 		var list = [];
// 		await cursor.each(function(err, doc) {
// 			if (err) {
// 				console.log(err);
// 				socket.emit('getStudent', []);
// 			} else {
// 				if (doc != null) {
// 					var strings = JSON.parse(JSON.stringify(doc));
// 					list.push(strings);
// 				} else if (doc == null) {
// 					console.log(list);
// 					socket.emit('getStudent', list);
// 					console.log('Ket thuc getStudent');
// 				}
// 			}
// 		});
// 	});
// 	socket.on('deleteStudent', function(id) {
// 		console.log(id + ' deleteStudent');
// 		var student = { _id: new mongodb.ObjectID(id) };
// 		collection_student.remove(student, function(err, result) {
// 			if (err) {
// 				console.log(err);
// 				socket.emit('deleteStudent', false);
// 			} else {
// 				console.log('Delete student ok');
// 				socket.emit('deleteStudent', true);
// 			}
// 		});
// 	});

// 	socket.on('updateStudent', function(_id, id, name, email) {
// 		console.log(name + ' updateStudent');
// 		collection_student.update(
// 			{ _id: new mongodb.ObjectID(_id) },
// 			{ $set: { id: id, name: name, email: email } },
// 			function(err, result) {
// 				if (err) {
// 					console.log(err);
// 					socket.emit('updateStudent', false);
// 				} else {
// 					console.log('Update student ok');
// 					socket.emit('updateStudent', true);
// 				}
// 			}
// 		);
// 	});
// });

http.listen(port, function () {
    console.log('listening on *:' + port);
});