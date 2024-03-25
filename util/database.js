const mongoose = require('mongoose');

const dbConn = async () => {
    try {
        // return await mongoose.connect('mongodb://127.0.0.1:27017/expense-tracker');
        return await mongoose.connect(process.env.MONGO_ATLAS_CONN);
    } catch (e) {
        console.log(e);
    }
};

module.exports = dbConn;