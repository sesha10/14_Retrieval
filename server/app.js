const express = require('express');
// const web = require('./routes/web');
const connectDB = require('./db/connectDB');
const dotenv = require('dotenv');
const app = express();
const studentRoutes = require('./routes/web');
const authRoutes = require('./routes/auth');
const PORT = process.env.PORT || 8080;
const cors = require('cors');

//Load config
dotenv.config({ path:'./config/config.env' });

//Db connection
connectDB();

//JSON
app.use(express.json());
app.use(cors());

//Load routes
app.use("/api/users", studentRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));