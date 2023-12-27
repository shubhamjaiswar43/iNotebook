const mongoose = require('mongoose')
require('dotenv').config();
//local host for mongodb
const mongoURI = process.env.MONGOURI;
const connectToMongoose = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected To Server")
    } catch (err) { 
        console.error(`Error In Connection : ${err}`);
    }
} 
module.exports = connectToMongoose;
 