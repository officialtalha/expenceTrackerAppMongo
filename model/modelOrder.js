const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String,
        required: true
    },
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
});

module.exports = mongoose.model('orders', orderSchema);