const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const DB_OPTIONS = {
            dbName: 'college',
        }
        const conn = await mongoose.connect(process.env.MONGO_URI, DB_OPTIONS);
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false)
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;