const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            required: true,
        },
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    },
    
    { timestamps: true },
);

module.exports = mongoose.model('msgs', messageSchema);