const connectToMongoose = require('./db');
connectToMongoose();
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 5000; 
app.use(express.json());
app.use(cors()); 

//if any request given by the user in path /api/auth or /api/note then it will handle by auth.js or note.js in routes folder
app.use('/api/auth',require('./routes/auth'));
app.use('/api/note',require('./routes/note'));

app.get('/',(req,res)=>{
    res.send("Welcome To iNotebook");
})

app.listen(port,()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
})