const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    body: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required: true
    },
    body: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required: true
    },
    readed: {
        type: Boolean,
        required: true
    }
},
    {
        timesTamps: true
    })

module.exports = mongoose.model('message', MessageSchema)