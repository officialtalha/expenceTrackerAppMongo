const logger = require('../middleware/logger');
const aws = require('aws-sdk');
const Expense = require('../model/modelExpense');
const DL = require('../model/modelDownloadLink');
const db = require('mongoose');
exports.downloadGet = async (req, res) => {
    try {
        const userId = req.user[0]._id;
        const fileName = `file${userId}/${new Date()}.txt`;

        let count = 1;
        const name = `file${count}`;
        //fetching expenses for perticular user
        const pipeline = [
            { $match: { userId: userId } },
            { $project: { _id: 0, amount: 1, description: 1, catogary: 1 } }
        ];
        const expenses = await Expense.aggregate(pipeline);

        const data = JSON.stringify(expenses);

        //init aws 
        let s3Bucket = new aws.S3({
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        //setup s3 bucket
        let params = {
            Bucket: "newexpensetrackerproducts",
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }
        //uploading data to the s3 bucket
        s3Bucket.upload(params, async (err, response) => {
            if (err) {
                logger.error(err);
                res.json({ success: false, error: err });
            } else {
                const newList = new DL({
                    link: response.Location,
                    userId: userId
                });
                await newList.save();

                res.status(200).json({ success: true, link: response.Location });
            }
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ success: false, error: err });
    }
};