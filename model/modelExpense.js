const mongoose = require('mongoose');

const expense = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    catogary: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
});

module.exports = mongoose.model('Expense', expense);