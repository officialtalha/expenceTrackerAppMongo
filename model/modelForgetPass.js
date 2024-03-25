const mongoose = require('mongoose');

const forgotPassSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    expiredBy: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
});
module.exports = mongoose.model('forgotPass', forgotPassSchema);