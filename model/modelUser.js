const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isPremium: {
        type: Boolean,
        required: true,
        default: 0
    },
    totalExpenses: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Users', users);