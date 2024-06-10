const expresso = require('express');
const cours = require('cors');
const monge = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socket = require('socket.io');

const app = expresso();
require('dotenv').config();

app.use(cours());
app.use(expresso.json());
app.use('/api/auth', userRoutes);
app.use('/api/message', messageRoutes);

monge.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database');
}).catch((err) => { console.log(err) });

const serv = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

const io = socket(serv, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('join', (username) => {
        global.onlineUsers.set(username, socket.id);
        console.log(global.onlineUsers);
    });

    socket.on('disconnect', () => {
        for (let [key, value] of global.onlineUsers) {
            if (value === socket.id) {
                global.onlineUsers.delete(key);
                console.log(global.onlineUsers);
                break;
            }
        }
    });

    socket.on('message', (data) => {
        console.log(data);
        if (global.onlineUsers.get(data.to)) {
            socket.to(global.onlineUsers.get(data.to)).emit('receive-message', data);
        }
    });
});