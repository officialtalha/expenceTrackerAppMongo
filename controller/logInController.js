const logger = require('../middleware/logger');
const User = require('../model/modelUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const objectId = require('mongodb').ObjectId;

exports.logInPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await User.find({ email });
        if (result.length > 0) {
            const isMatched = await bcrypt.compare(password, result[0].password);
            if (isMatched) {
                const userId = result[0]._id;
                const token = jwt.sign({ userId }, process.env.JWT_SecretKey);
                res.status(200).json({ 'message': 'Login Successful', 'flag': true, 'token': token, 'name': result[0].name });
            } else {
                res.json({ message: "incorrect password", flag: false });
            }
        } else {
            res.json({ message: "user does not exist!", flag: false });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err, flag: false })
    }
};
