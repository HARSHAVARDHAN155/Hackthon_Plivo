const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "Traffic_challan_system"

// routes
var adminUserRouter = require("./routes/adminUserModel");
var challanRouter = require("./routes/challanModel") ;
var smsLogRouter = require("./routes/smsLogModel") ;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb+srv://Harshavardhan:rgukt@123@cluster0.vbkh3c9.mongodb.net/' + DB_NAME, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})


app.use('/challans', challanRouter);
app.use('/smslogs', smsLogRouter);
app.use('/adminusers', adminUserRouter);


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
