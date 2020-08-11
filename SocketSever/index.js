var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
const User = require('./models/User.model');
const Shoe = require('./models/Shoe.model');


const port = 3000;

var url = 'mongodb://localhost:27017';

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Can not connect to mongodb, because', err);
    } else {
        console.log('Connect to mongodb successful');
    }
})

io.on('connection', function (socket) {
    console.log("a user connected :D");
    socket.on('register', async (data) => {
        const user = new User({
            name: data.name,
            phone: data.phone,
            password: data.password,
            urlAvatar: "https://chuoichin.com/wp-content/uploads/2019/01/avatar-den-13.jpg"
        })
        const findUser = await User.findOne({ phone: data.phone });
        if (findUser) {
            io.sockets.emit('resRegister', false);
        } else {
            user.save((err, res) => {
                if (!err) {
                    io.sockets.emit('resRegister', res);
                } else {
                    io.sockets.emit('resRegister', false);
                }
            });
        }
    });

    socket.on('login', async (data) => {
        const user = await User.findOne({ phone: data.phone });
        if (user) {
            if (user.password === data.password) {
                io.sockets.emit('resLogin', true);
            } else {
                io.sockets.emit('resLogin', false);
            }
        } else {
            io.sockets.emit('resLogin', false);
        }
    });

    socket.on('getShoes', async () => {
        Shoe.find((err, data) => {
            if (!err) {
                io.sockets.emit('resGetShoes', data);
            } else {
                io.sockets.emit('resGetShoes', false);
            }
        });
    });

    socket.on('addShoe', async (data) => {
        const shoe = new Shoe({
            name: data.name,
            price: data.price,
            images: data.images,
            price_promotion: data.price_promotion,
            description: data.description,
        })
        shoe.save((err, res) => {
            console.log(res)
            console.log(err)
            if (!err) {
                io.sockets.emit('resAddShoe', res);
            } else {
                io.sockets.emit('resAddShoe', false);
            }
        });
    });

    socket.on('updateShoe', async (data) => {
        console.log(data);
        Shoe.updateOne({ _id: data._id },
            {
                $set: {
                    name: data.name,
                    price: data.price,
                    images: data.images,
                    price_promotion: data.price_promotion,
                    description: data.description,
                }
            }, (err, req) => {
                if (!err) {
                    io.sockets.emit('resUpdateShoe', true);
                } else {
                    io.sockets.emit('resUpdateShoe', false);
                }
            });
    });

    socket.on('deleteShoe', async (data) => {
        Shoe.remove({ _id: data._id }, (err, data) => {
            if (!err) {
                io.sockets.emit('resDeleteShoe', true);
            } else {
                io.sockets.emit('resDeleteShoe', false);
            }
        });
    });

});

http.listen(port, function () {
    console.log('listening on *:' + port);
});