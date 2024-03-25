const mongoose = require('mongoose');

const downloadListSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},
    {
        timestamps: true
    }
);
module.exports = mongoose.model('downloadLists', downloadListSchema);