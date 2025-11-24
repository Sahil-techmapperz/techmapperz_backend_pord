const mongoose = require('mongoose');
require('dotenv').config();

// Suppress Mongoose deprecation warning
mongoose.set('strictQuery', false);

const connect = async()=>{
    return mongoose.connect(process.env.MONGO_URL)
}

module.exports = {connect}